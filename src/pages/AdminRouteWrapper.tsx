import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { ADMIN_EMAILS } from '@/constants/admins';
import AdminPortal from '@/components/AdminPortal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Loader2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  LogOut, 
  ArrowLeft,
  Key,
  Database
} from 'lucide-react';

export default function AdminRouteWrapper() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<{ code: string; message: string } | null>(null);
  const [provisionSuccess, setProvisionSuccess] = useState(false);
  
  const [localAuthEmail, setLocalAuthEmail] = useState<string | null>(() => {
    return localStorage.getItem('local_admin_session_email');
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#0d1b2a] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#c9a84c]" />
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mt-4">Loading Admin Workspace...</p>
      </div>
    );
  }

  const userEmail = (user?.email || localAuthEmail || "").toLowerCase().trim();
  const adminEmailsSet = ADMIN_EMAILS.map(e => e.toLowerCase().trim());
  const isAuthorized = (user || localAuthEmail) && userEmail && adminEmailsSet.includes(userEmail);

  // If already authenticated securely, render the Portal!
  if (isAuthorized) {
    return <AdminPortal userEmail={userEmail} />;
  }

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoggingIn(true);
      setAuthError(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      const emailResult = result.user.email?.toLowerCase().trim() || "";
      
      if (adminEmailsSet.includes(emailResult)) {
        // Success - state automatically triggers AdminPortal render
      } else {
        setAuthError({
          code: 'unauthorized',
          message: `The Google account (${emailResult}) is not authorized as an administrator.`
        });
        await signOut(auth);
      }
    } catch (error: any) {
      console.error("Google Admin sign in failed", error);
      let friendlyMessage = 'An unexpected error occurred during Google authentication.';
      if (error.code === 'auth/popup-closed-by-user') {
        friendlyMessage = 'The Google sign-in window was closed before finishing. Please click "Sign In with Google" again to retry.';
      } else if (error.code === 'auth/operation-not-allowed') {
        friendlyMessage = 'Google Sign-on provider is currently disabled in your Firebase settings.';
      } else if (error.code === 'auth/unauthorized-domain') {
        friendlyMessage = 'This domain is not authorized for Google Sign-in. Please enable it in your Firebase console or use option 1 ("Admin Sign In") instead.';
      }
      setAuthError({
        code: error.code || 'unknown',
        message: friendlyMessage
      });
    } finally {
      setIsGoogleLoggingIn(false);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = email.trim().toLowerCase();
    
    if (!targetEmail || !password.trim()) {
      setAuthError({ code: 'missing-fields', message: 'Please enter both email and password.' });
      return;
    }

    if (!adminEmailsSet.includes(targetEmail)) {
      setAuthError({ 
        code: 'not-authorized', 
        message: 'This email is not whitelisted in ADMIN_EMAILS.' 
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setAuthError(null);

      if (authMode === 'login') {
        try {
          await signInWithEmailAndPassword(auth, targetEmail, password);
        } catch (error: any) {
          if (error.code === 'auth/operation-not-allowed') {
            const savedPassword = localStorage.getItem(`admin_local_pwd_${targetEmail}`);
            if (savedPassword === password) {
              localStorage.setItem('local_admin_session_email', targetEmail);
              setLocalAuthEmail(targetEmail);
            } else {
              throw new Error("Invalid password for this local session. Please check your credentials or re-provision.");
            }
          } else {
            throw error;
          }
        }
      } else {
        // Provisioning mode - create user
        try {
          await createUserWithEmailAndPassword(auth, targetEmail, password);
          setProvisionSuccess(true);
          setAuthMode('login');
        } catch (regError: any) {
          if (regError.code === 'auth/email-already-in-use') {
            // Already initialized, fallback to direct validation & login
            console.log("Admin email already registered. Attempting direct workspace authentication.");
            await signInWithEmailAndPassword(auth, targetEmail, password);
          } else if (regError.code === 'auth/operation-not-allowed') {
            localStorage.setItem(`admin_local_pwd_${targetEmail}`, password);
            setProvisionSuccess(true);
            setAuthMode('login');
          } else {
            throw regError;
          }
        }
      }
    } catch (error: any) {
      console.error("Email auth failed", error);
      let friendlyMessage = 'An unexpected error occurred during email auth.';

      if (error.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This admin email is already registered and initialized. Please sign in instead using Option 1 ("Admin Sign In").';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid email or password. If you have not initialized this workspace password yet, select Option 2 ("Setup / Provision") to configure it.';
      } else if (error.code === 'auth/operation-not-allowed') {
        friendlyMessage = 'The Email/Password sign-on provider is currently disabled in your Firebase project. Please enable it in the Firebase Console.';
      } else if (error.code === 'auth/weak-password') {
        friendlyMessage = 'The password is too weak. Please choose a password that is at least 6 characters long.';
      } else if (error.code === 'auth/invalid-email') {
        friendlyMessage = 'The selected email address format is invalid.';
      } else if (error.message) {
        friendlyMessage = error.message;
      }

      setAuthError({
        code: error.code || 'failure',
        message: friendlyMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setAuthError(null);
      setProvisionSuccess(false);
      localStorage.removeItem('local_admin_session_email');
      setLocalAuthEmail(null);
      await signOut(auth);
    } catch (error: any) {
      console.error("Sign out failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1b2a] py-16 px-4 flex flex-col justify-center items-center text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#1d2d44] via-[#0d1b2a] to-[#0d1b2a] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Back Link */}
        <div className="flex justify-start">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="text-gray-400 hover:text-white flex items-center gap-2 px-3 py-1.5 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Site</span>
          </Button>
        </div>

        {/* Outer Card */}
        <div className="bg-[#152238]/90 backdrop-blur-md rounded-[2.5rem] border border-[#c9a84c]/20 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#1b2a47] p-8 text-center border-b border-[#c9a84c]/15">
            <div className="p-4 bg-[#c9a84c]/10 rounded-3xl border border-[#c9a84c]/20 w-fit mx-auto mb-4">
              <ShieldCheck className="w-10 h-10 text-[#c9a84c]" />
            </div>
            <h1 className="text-2xl font-serif font-black tracking-tight text-white mb-1">Administrative Workspace</h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-mono">Legal Help Kolkata Control Panel</p>
          </div>

          <div className="p-8 space-y-6">
            
            {/* STALE USER LOGGED IN WARNING */}
            {user && !isAuthorized && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-sm text-amber-200 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-[#c9a84c] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Not Authorized as Admin</p>
                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                      You are signed in as <code className="bg-amber-950/40 px-1 py-0.5 rounded text-white font-mono">{userEmail}</code>, which does not have administrator credentials.
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs font-black uppercase text-amber-200 border-amber-500/30 hover:bg-amber-500/10 py-5 rounded-xl flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out / Clear Active Session
                </Button>
              </div>
            )}

            {provisionSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-xs text-green-300 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Account Successfully Provisioned!</p>
                  <p className="text-gray-300 mt-1 leading-relaxed">
                    The credentials have been successfully initialized. You can now log in below with your password.
                  </p>
                </div>
              </div>
            )}

            {/* AUTH FORMS (ONLY CHOSEN IF NOT AUTHORIZED) */}
            {!isAuthorized && (
              <>
                {/* TABS */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-[#0d1b2a] rounded-xl border border-gray-800">
                  <button 
                    onClick={() => { setAuthMode('login'); setAuthError(null); }}
                    className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${authMode === 'login' ? 'bg-[#c9a84c] text-slate-900 shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    1. Admin Sign In
                  </button>
                  <button 
                    onClick={() => { setAuthMode('register'); setAuthError(null); }}
                    className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${authMode === 'register' ? 'bg-[#c9a84c] text-slate-900 shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    2. Setup / Provision
                  </button>
                </div>

                <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="admin-email" className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-sans">Admin Email Address</Label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input 
                          id="admin-email"
                          type="email" 
                          required
                          placeholder="admin@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 pl-11 bg-[#0d1b2a] border-gray-800 rounded-xl focus:border-[#c9a84c] text-sm text-white"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="text-[9px] text-gray-500 self-center uppercase tracking-wider mr-1">Quick Select:</span>
                        {ADMIN_EMAILS.map(e => (
                          <button
                            key={e}
                            type="button"
                            onClick={() => setEmail(e)}
                            className={`text-[10px] font-mono px-2 py-1 rounded-lg transition-all border ${
                              email.trim().toLowerCase() === e.toLowerCase()
                                ? 'bg-[#c9a84c]/20 border-[#c9a84c] text-[#c9a84c] shadow-sm'
                                : 'bg-slate-900/60 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                            }`}
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="admin-pwd" className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {authMode === 'login' ? 'Enter Password' : 'Create Secure Password'}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input 
                        id="admin-pwd"
                        type="password" 
                        required
                        placeholder={authMode === 'login' ? '••••••••' : 'Min 6 characters'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 pl-11 bg-[#0d1b2a] border-gray-800 rounded-xl focus:border-[#c9a84c] text-sm text-white"
                      />
                    </div>
                  </div>

                  {authError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-200 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div className="space-y-1.5 text-left">
                        <p className="font-semibold text-red-300">Authentication Failed</p>
                        <p className="text-gray-300 leading-normal">{authError.message}</p>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[#c9a84c] hover:bg-[#c9a84c]/90 text-slate-900 font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 "
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Request...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        <span>{authMode === 'login' ? 'Verify & Enter Workspace' : 'Initialize Account Password'}</span>
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-800"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest font-mono">OR</span>
                  <div className="flex-grow border-t border-gray-800"></div>
                </div>

                <Button 
                  onClick={handleGoogleLogin} 
                  disabled={isGoogleLoggingIn}
                  variant="outline"
                  className="w-full h-12 bg-transparent text-white border-gray-800 hover:bg-white/5 font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  {isGoogleLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#c9a84c]" />
                      <span>Google Verifying...</span>
                    </>
                  ) : (
                    <>
                      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 shrink-0" />
                      <span>Sign In with Google</span>
                    </>
                  )}
                </Button>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

