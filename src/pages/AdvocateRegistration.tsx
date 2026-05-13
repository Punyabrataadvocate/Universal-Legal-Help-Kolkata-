import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { LEGAL_CATEGORIES } from '@/constants/legal';
import { ADMIN_EMAILS } from '@/constants/admins';
import AdminPortal from '@/components/AdminPortal';
import { handleFirestoreError, OperationType } from '@/lib/firestoreErrorHandler';
import { motion } from 'motion/react';

export default function AdvocateRegistration() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  React.useEffect(() => {
    if (user && user.email) {
       const email = user.email.toLowerCase().trim();
       if (ADMIN_EMAILS.includes(email)) {
          setIsAdmin(true);
       } else {
          setIsAdmin(false);
       }
    } else {
       setIsAdmin(false);
    }
  }, [user]);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    enrollmentNumber: '',
    barCouncil: '',
    experienceYears: '',
    courtOfPractice: '',
    specialization: [] as string[],
    disclaimerAccepted: false
  });

  const [showError, setShowError] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/popup-blocked') {
        alert("Sign-in popup was blocked by your browser. Please allow popups for this site, or open it in a new tab to complete login.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup before finishing, no need to alert aggressively
        console.log("Sign-in popup closed by user.");
      } else {
        alert("Failed to sign in. Please try again. " + (error.message || ''));
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSpecializationChange = (category: string, checked: boolean) => {
    setFormData(prev => {
      const newSpecs = checked 
        ? [...prev.specialization, category]
        : prev.specialization.filter(c => c !== category);
      return { ...prev, specialization: newSpecs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.disclaimerAccepted) {
      setShowError(true);
      return;
    }
    if (formData.specialization.length === 0) {
      alert("Please select at least one area of specialization.");
      return;
    }
    
    setShowError(false);
    setIsSubmitting(true);
    
    const path = 'advocate_registrations';

    try {
      await addDoc(collection(db, path), {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        enrollmentNumber: formData.enrollmentNumber,
        barCouncil: formData.barCouncil,
        experienceYears: parseInt(formData.experienceYears) || 0,
        courtOfPractice: formData.courtOfPractice,
        specialization: formData.specialization,
        status: 'pending',
        uid: user?.uid,
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an error submitting your registration. Please try again.");
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 min-h-[80vh] flex flex-col justify-center">
        <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden">
          <div className="bg-primary p-10 text-center text-white">
            <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-gold" />
            <CardTitle className="text-3xl font-serif mb-2">Advocate Portal</CardTitle>
            <CardDescription className="text-primary-foreground/80 italic">Sign in to verify your credentials</CardDescription>
          </div>
          <CardContent className="p-8 space-y-6 text-center">
            <p className="text-sm text-gray-600 leading-relaxed">
              To list your practice in the Legal Help Kolkata directory and respond to civic legal queries, you must authenticate your identity.
            </p>
            <Button 
              onClick={handleGoogleLogin} 
              disabled={isLoggingIn}
              className="w-full h-14 rounded-2xl bg-white text-gray-800 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 font-bold tracking-wide shadow-sm"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Connecting to Google...
                </>
              ) : (
                <>
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-3" />
                  Sign in with Google
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100"
        >
          <div className="flex justify-center">
            <div className="bg-green-50 p-6 rounded-full">
              <CheckCircle2 className="w-20 h-20 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary">Registration Submitted</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Your registration has been submitted successfully! Your profile will appear in the directory after verification by Admin.
          </p>
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-sm text-blue-800">
            You will be notified once your credentials (Enrollment No. & Bar Council details) have been verified.
          </div>
          <Button onClick={() => navigate('/directory')} variant="outline" className="mt-8 h-14 px-8 rounded-2xl border-primary text-primary hover:bg-primary/5 uppercase tracking-widest font-black text-xs">
            Return to Directory
          </Button>
        </motion.div>
      </div>
    );
  }

  if (isAdmin && user && user.email) {
    return <AdminPortal userEmail={user.email} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/directory')} className="hover:bg-transparent text-gray-500 hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Button>
        <Button variant="outline" onClick={() => signOut(auth)} className="text-xs">
          Sign Out ({user.email})
        </Button>
      </div>

      <Card className="border-0 shadow-2xl rounded-[2rem] overflow-hidden bg-white">
        <CardHeader className="bg-primary text-white text-center py-10">
          <CardTitle className="text-3xl font-serif mb-2">Advocate Registration</CardTitle>
          <p className="text-gold italic max-w-lg mx-auto text-sm">
            "Join our directory of verified practitioners providing pro-bono informational guidance."
          </p>
        </CardHeader>
        <CardContent className="p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-bold text-primary border-b pb-2">1. Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name (As per Bar Council)</Label>
                  <Input
                    id="fullName"
                    required
                    placeholder="Adv. John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="h-12 bg-gray-50 border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="advocate@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="h-12 bg-gray-50 border-gray-200"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">Phone Number (10-digit)</Label>
                  <Input 
                    id="phone" 
                    required 
                    type="tel"
                    placeholder="9876543210" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                    className="h-12 bg-gray-50 border-gray-200"
                  />
                  <p className="text-xs text-gray-500 mt-1 italic">
                    Note: Direct contact details will NOT be shown publicly on the directory to comply with BCI anti-solicitation rules. They are for admin verification only.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-serif font-bold text-primary border-b pb-2">2. Professional Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="enrollmentNumber">Bar Enrollment Number</Label>
                  <Input 
                    id="enrollmentNumber" 
                    required
                    placeholder="e.g. WB/1234/2015" 
                    value={formData.enrollmentNumber}
                    onChange={(e) => setFormData({...formData, enrollmentNumber: e.target.value})}
                    className="h-12 bg-gray-50 border-gray-200 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barCouncil">Bar Council Affiliation</Label>
                  <Input 
                    id="barCouncil" 
                    required
                    placeholder="Bar Council of West Bengal" 
                    value={formData.barCouncil}
                    onChange={(e) => setFormData({...formData, barCouncil: e.target.value})}
                    className="h-12 bg-gray-50 border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Years of Practice</Label>
                  <Input 
                    id="experienceYears" 
                    type="number"
                    min="0"
                    required
                    placeholder="Total years" 
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
                    className="h-12 bg-gray-50 border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courtOfPractice">Principal Court of Practice</Label>
                  <Input 
                    id="courtOfPractice" 
                    required
                    placeholder="e.g. Calcutta High Court, Alipore District Court" 
                    value={formData.courtOfPractice}
                    onChange={(e) => setFormData({...formData, courtOfPractice: e.target.value})}
                    className="h-12 bg-gray-50 border-gray-200"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-serif font-bold text-primary border-b pb-2">3. Areas of Specialization</h3>
              <p className="text-sm text-gray-500 mb-3">Select all that apply to your practice:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                {LEGAL_CATEGORIES.map(cat => (
                  <div key={cat} className="flex items-center space-x-3">
                    <Checkbox 
                      id={`spec-${cat}`} 
                      checked={formData.specialization.includes(cat)}
                      onCheckedChange={(checked) => handleSpecializationChange(cat, !!checked)}
                    />
                    <label 
                      htmlFor={`spec-${cat}`} 
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {cat}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-6 rounded-2xl border-2 transition-all ${showError ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="disclaimer" 
                  checked={formData.disclaimerAccepted}
                  onCheckedChange={(checked) => {
                    setFormData({...formData, disclaimerAccepted: !!checked});
                    if (checked) setShowError(false);
                  }}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="disclaimer"
                    className="text-sm font-bold leading-tight text-primary cursor-pointer"
                  >
                    Declaration & BCI Compliance
                  </label>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1">
                    I declare that the information provided is true and correct. I understand that my profile will be subject to verification. 
                    I agree to abide by the Bar Council of India rules regarding non-solicitation. I acknowledge that this platform is for 
                    providing free legal awareness and informational guidance only.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 text-lg bg-[#D4AF37] hover:bg-primary text-white font-serif tracking-widest transition-all shadow-lg overflow-hidden group uppercase rounded-[2rem]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>SUBMITTING REGISTRATION...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>SUBMIT REGISTRATION</span>
                  <ShieldCheck className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
