import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ShieldCheck, ArrowLeft, CheckCircle2, Shield } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LEGAL_CATEGORIES } from '@/constants/legal';
import { ADMIN_EMAILS } from '@/constants/admins';
import { handleFirestoreError, OperationType } from '@/lib/firestoreErrorHandler';
import { motion } from 'motion/react';

export default function AdvocateRegistration() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [registrationMethod, setRegistrationMethod] = useState<'google' | 'direct' | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isEmailLoggingIn, setIsEmailLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<{ code: string; message: string } | null>(null);
  const [showAdminEmailAuth, setShowAdminEmailAuth] = useState(false);

  useEffect(() => {
    if (user && user.email && !showRegistrationForm && registrationMethod !== 'direct') {
       const userEmail = user.email.toLowerCase().trim();
       const adminEmailsSet = ADMIN_EMAILS.map(e => e.toLowerCase().trim());
       if (adminEmailsSet.includes(userEmail)) {
         navigate('/admin-mlk-2024');
       } else {
         setGoogleUser(user);
         setRegistrationMethod('google');
         setFormData(prev => ({
           ...prev,
           email: user.email || '',
           fullName: prev.fullName || user.displayName || ''
         }));
         setShowRegistrationForm(true);
       }
    }
  }, [user, showRegistrationForm, registrationMethod, navigate]);

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
      setAuthError(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email?.toLowerCase().trim() || "";
      
      const adminEmailsSet = ADMIN_EMAILS.map(e => e.toLowerCase().trim());
      if (adminEmailsSet.includes(userEmail)) {
        navigate('/admin-mlk-2024');
      } else {
        setGoogleUser(result.user);
        setRegistrationMethod('google');
        setFormData(prev => ({
          ...prev,
          email: result.user.email || '',
          fullName: result.user.displayName || ''
        }));
        setShowRegistrationForm(true);
      }
    } catch (error: any) {
      console.error("Login failed", error);
      setAuthError({
        code: error.code || 'unknown',
        message: error.message || 'An unexpected error occurred during Google sign in.'
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setAuthError({ code: 'missing-fields', message: 'Please enter both email and password.' });
      return;
    }
    try {
      setIsEmailLoggingIn(true);
      setAuthError(null);
      const result = await signInWithEmailAndPassword(auth, adminEmail.trim(), adminPassword);
      const userEmail = result.user.email?.toLowerCase().trim() || "";
      
      const adminEmailsSet = ADMIN_EMAILS.map(e => e.toLowerCase().trim());
      if (adminEmailsSet.includes(userEmail)) {
        navigate('/admin-mlk-2024');
      } else {
        setAuthError({ 
          code: 'not-authorized', 
          message: 'This email is not registered as an administrator.' 
        });
        await signOut(auth);
      }
    } catch (error: any) {
      console.error("Email login failed", error);
      let friendlyMessage = error.message || 'Verification failed.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid email or password. Please verify your credentials or ensure the user is added to your Firebase project.';
      }
      setAuthError({
        code: error.code || 'sign-in-failed',
        message: friendlyMessage
      });
    } finally {
      setIsEmailLoggingIn(false);
    }
  };

  const handleDirectRegistration = () => {
    setRegistrationMethod('direct');
    setShowRegistrationForm(true);
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
        registrationMethod: registrationMethod || 'direct',
        googleUid: registrationMethod === 'google' ? googleUser?.uid || null : null,
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

  const handleCloseSuccess = () => {
    if (registrationMethod === 'google') {
      signOut(auth);
    }
    setIsSuccess(false);
    setShowRegistrationForm(false);
    setRegistrationMethod(null);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      enrollmentNumber: '',
      barCouncil: '',
      experienceYears: '',
      courtOfPractice: '',
      specialization: [],
      disclaimerAccepted: false
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100 max-w-lg w-full relative"
        >
          <div className="flex justify-center">
            <div className="bg-green-50 p-6 rounded-full">
              <CheckCircle2 className="w-20 h-20 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary">Registration Submitted Successfully!</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Thank you for registering with Legal Help Kolkata.<br/>
            Your application has been received and is currently under review.<br/>
            Your profile will appear in the Advocate Directory once verified.
          </p>
          <Button onClick={handleCloseSuccess} className="mt-8 w-full h-14 rounded-2xl text-lg bg-primary hover:bg-primary/90 text-white font-bold tracking-wide">
            Close
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!showRegistrationForm) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 min-h-[80vh] flex flex-col justify-center">
        <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden">
          <div className="bg-primary p-10 text-center text-white">
            <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-gold" />
            <CardTitle className="text-3xl font-serif mb-2">Advocate Portal</CardTitle>
            <CardDescription className="text-primary-foreground/80 italic">Select a registration method</CardDescription>
          </div>
          <CardContent className="p-8 space-y-6 text-center">
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              Join our directory of verified practitioners providing pro-bono informational guidance.
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
                  Register / Sign in with Google
                </>
              )}
            </Button>

            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-left space-y-2 mt-4">
                <p className="text-sm font-bold text-red-800">Authentication Error</p>
                <p className="text-xs text-red-700"><strong>Code:</strong> {authError.code}</p>
                <p className="text-xs text-red-600"><strong>Detail:</strong> {authError.message}</p>
                {authError.code === 'auth/unauthorized-domain' && (
                  <div className="mt-2 pt-2 border-t border-red-100 text-[11px] text-gray-700 space-y-1">
                    <p className="font-semibold text-red-800">Solution:</p>
                    <p className="leading-relaxed">
                      This domain (<code className="bg-red-100 px-1 rounded font-mono">{window.location.hostname}</code>) needs to be authorized in your Firebase project.
                    </p>
                    <ol className="list-decimal pl-4 space-y-1 mt-1 leading-normal">
                      <li>Go to the <strong>Firebase Console</strong> for your project</li>
                      <li>Navigate to <strong>Authentication</strong> &rarr; <strong>Settings</strong> &rarr; <strong>Authorized Domains</strong></li>
                      <li>Click <strong>Add Domain</strong> and enter <code className="bg-red-100 px-1 rounded font-mono">{window.location.hostname}</code></li>
                    </ol>
                    <p className="text-amber-700 mt-2 font-medium">
                      Note: If you have already added this in your personal Firebase project, make sure you have fully configured your Vercel deployment with your own Firebase environment variables so it doesn't default to the AI Studio preview environment.
                    </p>
                  </div>
                )}
                {authError.code === 'auth/popup-blocked' && (
                  <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                    <strong>Tip:</strong> Popups are blocked. Click the browser lock or popup icon in your URL bar, allow popups for this site, or open this application in a new tab/window directly.
                  </p>
                )}
              </div>
            )}

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <Button 
              onClick={handleDirectRegistration}
              variant="ghost"
              className="w-full h-auto py-4 rounded-2xl text-primary hover:bg-primary/5 underline hover:text-primary font-bold text-xl leading-tight"
            >
              Prefer not to sign in, fill the form directly
            </Button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300 border-dashed"></div>
            </div>

            {!showAdminEmailAuth ? (
              <Button 
                onClick={() => {
                  setShowAdminEmailAuth(true);
                  setAuthError(null);
                }}
                variant="ghost" 
                className="w-full text-xs text-gray-400 hover:text-primary flex items-center justify-center gap-2"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Private Sign In (Email/Password)
              </Button>
            ) : (
              <form onSubmit={handleEmailLogin} className="space-y-4 text-left border border-gray-100 p-4 rounded-2xl bg-gray-50 mt-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black tracking-wider text-gray-500 uppercase">Admin Sign In</h4>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => {
                      setShowAdminEmailAuth(false);
                      setAuthError(null);
                    }} 
                    className="h-6 px-2 text-[10px] text-gray-400 hover:text-gray-600"
                  >
                    Cancel
                  </Button>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="admin-email" className="text-[10px] text-gray-400 font-bold uppercase">Email</Label>
                  <Input 
                    id="admin-email"
                    type="email" 
                    required
                    placeholder="mukherjipb@gmail.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="h-10 text-xs bg-white border-gray-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="admin-pass" className="text-[10px] text-gray-400 font-bold uppercase">Password</Label>
                  <Input 
                    id="admin-pass"
                    type="password" 
                    required
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="h-10 text-xs bg-white border-gray-200 rounded-xl"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isEmailLoggingIn}
                  className="w-full h-10 rounded-xl text-xs font-bold tracking-wider uppercase bg-primary text-white"
                >
                  {isEmailLoggingIn ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Credentials'
                  )}
                </Button>
                
                <div className="text-[10px] text-gray-400 leading-normal bg-white border border-gray-100 p-3 rounded-xl mt-2 font-medium">
                  <p className="font-bold text-gray-600 mb-1 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-gold" /> Setting Up Private Login:
                  </p>
                  <ol className="list-decimal pl-3.5 space-y-1 mt-1 font-sans">
                    <li>Go to your <strong>Firebase Console &rarr; Authentication</strong></li>
                    <li>Ensure <strong>Email/Password</strong> provider is enabled in Sign-in methods</li>
                    <li>On the <strong>Users</strong> tab, click <strong>Add User</strong></li>
                    <li>Enter <code className="bg-gray-100/80 px-1 font-mono">mukherjipb@gmail.com</code> and a secure password</li>
                  </ol>
                  <p className="mt-2 text-blue-600 font-semibold">
                    This bypasses Google domain-naming restrictions on any host!
                  </p>
                </div>
              </form>
            )}

          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/directory')} className="hover:bg-transparent text-gray-500 hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Button>
        {registrationMethod === 'google' && googleUser && (
          <Button variant="outline" onClick={() => signOut(auth)} className="text-xs">
            Sign Out ({googleUser.email})
          </Button>
        )}
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
                    readOnly={registrationMethod === 'google'}
                    placeholder="advocate@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`h-12 border-gray-200 ${registrationMethod === 'google' ? 'bg-gray-100 text-gray-500' : 'bg-gray-50'}`}
                  />
                  {registrationMethod === 'direct' && (
                    <p className="text-xs text-blue-600 mt-1 italic">
                      Please provide your valid email address.
                    </p>
                  )}
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
