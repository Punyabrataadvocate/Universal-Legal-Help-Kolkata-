import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2, Loader2, RotateCcw } from 'lucide-react';
import { handleFirestoreError, OperationType } from '@/lib/firestoreErrorHandler';
import { LEGAL_CATEGORIES } from '@/constants/legal';
import SEO from '@/components/SEO';

export default function QueryForm({ lang }: { lang?: 'en' | 'bn' }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    district: '',
    category: '',
    description: '',
    relevantDate: '',
    disclaimerAccepted: false
  });
  const [showError, setShowError] = useState(false);

  const handleReset = () => {
    if (confirm("Are you sure you want to clear all fields?")) {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        district: '',
        category: '',
        description: '',
        relevantDate: '',
        disclaimerAccepted: false
      });
      setShowError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.disclaimerAccepted) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setIsSubmitting(true);
    const path = 'user_queries';

    try {
      await addDoc(collection(db, path), {
        ...formData,
        status: 'Received',
        createdAt: serverTimestamp()
      });
      alert("Submit Query - Your legal query has been submitted successfully to the admin panel.");
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an error submitting your query. Please check your internet connection and try again.");
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary">Your query has been received</h2>
          <p className="text-gray-600 text-lg">
            Thank you for reaching out. If we are able to provide general informational guidance, we will respond within 48 hours. Please check your email for a confirmation.
          </p>
          <div className="bg-primary/5 p-6 rounded-lg border border-gold/20 text-sm italic text-primary/80">
            "Please note this does not constitute legal advice or an advocate-client relationship."
          </div>
          <Button onClick={() => navigate('/')} variant="outline" className="mt-8 border-primary text-primary hover:bg-primary/5">
            Return to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SEO 
        title="Submit Legal Query — Free Legal Help in Kolkata | Legal Help Kolkata"
        description="Submit your legal query to Legal Help Kolkata for free. Get connected with advocates in Kolkata and West Bengal for guidance on your legal matter."
      />
      <Card className="border-2 border-primary/10 shadow-xl overflow-hidden">
        <CardHeader className="bg-primary text-white text-center py-10">
          <CardTitle className="text-3xl font-serif mb-2">Submit a Legal Query</CardTitle>
          <CardDescription className="text-gold italic max-w-lg mx-auto">
            "We may provide general informational guidance. This does not create an advocate-client relationship."
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  required
                  placeholder="Enter your full name"
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="example@email.com"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (10-digit)</Label>
                <Input 
                  id="phone" 
                  required 
                  type="tel"
                  placeholder="9876543210" 
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District / Area (Optional)</Label>
                <Input 
                  id="district" 
                  placeholder="e.g. Salt Lake, Alipore" 
                  value={formData.district || ''}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category (Choose closest match)</Label>
                <Select 
                  value={formData.category || ''}
                  onValueChange={(val) => setFormData({...formData, category: val})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEGAL_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="relevantDate">Relevant Date (Optional)</Label>
                <Input 
                  id="relevantDate" 
                  type="date" 
                  value={formData.relevantDate || ''}
                  onChange={(e) => setFormData({...formData, relevantDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Brief Description of Legal Question (Max 500 chars)</Label>
              <Textarea 
                id="description" 
                required 
                maxLength={500}
                placeholder="Briefly describe your legal concern..." 
                className="min-h-[150px]"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <p className="text-xs text-right text-gray-400">{formData.description.length}/500</p>
            </div>

            <Separator className="my-8" />

            <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-all ${showError ? 'bg-red-50 border-red-300 ring-2 ring-red-200' : 'bg-gray-50 border-gray-200'}`}>
              <Checkbox 
                id="disclaimer" 
                checked={formData.disclaimerAccepted}
                onCheckedChange={(checked) => {
                  setFormData({...formData, disclaimerAccepted: !!checked});
                  if (checked) setShowError(false);
                }}
                className={showError ? 'border-red-500' : ''}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="disclaimer"
                  className={`text-sm font-semibold leading-none cursor-pointer ${showError ? 'text-red-700' : 'text-primary'}`}
                >
                  I acknowledge the Mandatory Legal Disclaimer
                </label>
                <p className={`text-xs flex items-center gap-1.5 ${showError ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                  {showError ? (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      <span>Please check this box to proceed with your submission.</span>
                    </>
                  ) : (
                    "By clicking this, I understand that this information is for awareness and not a substitute for professional legal advice."
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
                className="flex-1 h-14 border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all font-serif tracking-widest"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                CLEAR FORM
              </Button>
              
              <Button 
                type="submit" 
                className="flex-[2] h-14 text-lg bg-[#D4AF37] hover:bg-primary text-white font-serif tracking-widest transition-all shadow-lg overflow-hidden group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>SUBMITTING...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>SUBMIT LEGAL QUERY</span>
                    <CheckCircle2 className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

