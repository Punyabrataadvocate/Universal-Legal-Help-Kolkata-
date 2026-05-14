/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Disclaimer from './pages/Disclaimer';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import QueryForm from './pages/QueryForm';
import Directory from './pages/Directory';

import Blog from './pages/Blog';
import LegalJudgments from './pages/LegalJudgments';

import AdminRouteWrapper from './pages/AdminRouteWrapper';
import AdvocateRegistration from './pages/AdvocateRegistration';
import BottomNav from './components/BottomNav';
import { Scale } from 'lucide-react';
import { motion } from 'motion/react';

function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#1a0b2e] flex flex-col items-center justify-center text-white px-6">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#7c3aed] via-[#1a0b2e] to-[#1a0b2e] pointer-events-none" />
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center space-y-6"
      >
        <div className="p-6 bg-[#c9a84c]/10 rounded-[2rem] border border-[#c9a84c]/20">
          <Scale className="w-16 h-16 text-[#c9a84c]" strokeWidth={1.5} />
        </div>
        <h1 className="text-5xl font-serif font-bold tracking-tight shadow-sm italic text-white flex flex-col gap-1">
          <span>Legal Help</span>
          <span>Kolkata</span>
        </h1>
        <p className="text-sm font-medium text-white/80 max-w-sm leading-relaxed tracking-wide italic px-4 mt-8">
          "Legal Help Kolkata is a legal awareness platform providing free legal information and educational resources to help people understand their rights and legal procedures."
        </p>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [agreed, setAgreed] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const isAgreed = localStorage.getItem('disclaimerAgreed');
    setAgreed(isAgreed === 'true');
    
    // Show splash for 5 seconds
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (agreed === null) return null; // loading state

  return (
    <div className="app-container relative flex flex-col h-[100dvh] overflow-hidden">
      {showSplash && <SplashScreen />}
      <div className={`flex-1 overflow-y-auto no-scrollbar pb-20 ${showSplash ? 'hidden' : 'block'}`}>
        <Routes>
          <Route path="/disclaimer" element={<Disclaimer setAgreed={setAgreed} />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* Protected Routes (Require Disclaimer) */}
          <Route path="/" element={agreed ? <Home /> : <Navigate to="/disclaimer" />} />
          <Route path="/query" element={agreed ? <QueryForm /> : <Navigate to="/disclaimer" />} />
          <Route path="/directory" element={agreed ? <Directory /> : <Navigate to="/disclaimer" />} />
          <Route path="/blog" element={agreed ? <Blog /> : <Navigate to="/disclaimer" />} />
          <Route path="/judgments" element={agreed ? <LegalJudgments /> : <Navigate to="/disclaimer" />} />
          <Route path="/advocate-login" element={agreed ? <AdvocateRegistration /> : <Navigate to="/disclaimer" />} />
          <Route path="/admin-mlk-2024" element={agreed ? <AdminRouteWrapper /> : <Navigate to="/disclaimer" />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {(agreed && !showSplash) && <BottomNav />}
    </div>
  );
}

