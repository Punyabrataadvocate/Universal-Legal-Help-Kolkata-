import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ADMIN_EMAILS } from '@/constants/admins';
import AdminPortal from '@/components/AdminPortal';
import { Loader2 } from 'lucide-react';

export default function AdminRouteWrapper() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!user || !user.email) {
    // If not logged in, redirect to login page where they can use Google SignIn
    return <Navigate to="/advocate-login" replace />;
  }

  const userEmail = user.email.toLowerCase().trim();
  const adminEmailsSet = ADMIN_EMAILS.map(e => e.toLowerCase().trim());

  if (adminEmailsSet.includes(userEmail)) {
    return <AdminPortal userEmail={userEmail} />;
  } else {
    // Non-admin trying to access admin
    return <Navigate to="/advocate-login" replace />;
  }
}
