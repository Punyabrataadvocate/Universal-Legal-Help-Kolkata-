import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Search, Scale, AlertCircle, ExternalLink, ShieldCheck, Home as HomeIcon, Briefcase, FileText, ShoppingBag, Car, Users, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/SEO';

const QUICK_TOPICS = [
  "Property Dispute", "Matrimonial Cases", "Bail Application", 
  "Section 138 NI Act", "Consumer Forum", "Land Acquisition", 
  "Motor Accident Claim", "Domestic Violence", "Criminal Appeal", 
  "Service Matter", "Writ Petition", "Contempt of Court"
];

const OFFICIAL_RESOURCES = [
  {
    name: "Calcutta High Court",
    url: "https://calcuttahighcourt.gov.in",
    badge: "West Bengal"
  },
  {
    name: "Supreme Court of India",
    url: "https://sci.gov.in",
    badge: "National"
  },
  {
    name: "Indian Kanoon",
    url: "https://indiankanoon.org",
    badge: "All Courts"
  }
];

export default function LegalJudgments() {
  const [searchQuery, setSearchQuery] = useState('');

  const logSearch = async (query: string, type: 'general' | 'quick_topic' | 'court_specific', court: string, url: string) => {
    try {
      await addDoc(collection(db, 'judgment_searches'), {
        searchQuery: query,
        searchType: type,
        court,
        timestamp: serverTimestamp(),
        openedUrl: url,
      });
    } catch (e) {
      console.error("Failed to log search", e);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const url = `https://indiankanoon.org/search/?formInput=${encodeURIComponent(searchQuery)}`;
    logSearch(searchQuery, 'general', 'All', url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleQuickSearch = (topic: string) => {
    const url = `https://indiankanoon.org/search/?formInput=${encodeURIComponent(topic + " Calcutta High Court")}`;
    logSearch(topic, 'quick_topic', 'Calcutta High Court', url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleResourceOpen = (resource: any) => {
    logSearch('', 'court_specific', resource.name, resource.url);
    window.open(resource.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-white pb-24">
      <SEO 
        title="Legal Judgments — Calcutta High Court & Supreme Court Orders | Legal Help Kolkata"
        description="Search and access latest judgments from Calcutta High Court, Supreme Court of India, and West Bengal district courts. Free legal judgment database for Kolkata."
      />
      {/* Page Header */}
      <div className="bg-[#0b131e] pt-12 pb-8 px-6 border-b border-[#c9a84c]/20">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="bg-[#c9a84c]/10 p-4 rounded-2xl border border-[#c9a84c]/30 hidden md:block">
            <Scale className="w-10 h-10 text-[#c9a84c]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#c9a84c] mb-2 tracking-tight flex items-center gap-2">
              <Scale className="w-8 h-8 text-[#c9a84c] md:hidden" /> Legal Judgments
            </h1>
            <p className="text-white/70 italic font-serif text-sm md:text-base leading-relaxed">
              Search and access latest rulings from Calcutta High Court, Supreme Court of India, and courts across West Bengal
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        
        {/* Disclaimer Banner */}
        <div className="bg-amber-100/10 border border-amber-500/50 p-5 rounded-xl flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-amber-100 text-sm leading-relaxed font-serif italic">
            Judgments accessible through this page are sourced directly from official government court websites and Indian Kanoon. Legal Help Kolkata does not store, reproduce, or claim ownership of any judgment content. All judgment links open on their respective official platforms. Content on this page is for public legal awareness only and does not constitute legal advice.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="bg-[#1e293b] border-[#c9a84c]/20 rounded-2xl overflow-hidden shadow-2xl">
          <CardContent className="p-6 md:p-10 space-y-6">
            <form onSubmit={handleSearch} className="relative flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search judgments... e.g. property dispute, Section 138 NI Act, maintenance"
                  className="w-full h-14 pl-12 pr-4 bg-[#0a192f] border border-[#c9a84c]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c] transition-colors font-medium text-base md:text-lg"
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
              <Button type="submit" className="h-14 px-8 bg-[#c9a84c] hover:bg-[#b09038] text-[#1c180d] font-bold tracking-wider rounded-xl">
                Search
              </Button>
            </form>
            <p className="text-gray-400 text-xs flex items-center justify-center gap-2">
              <ExternalLink className="w-3 h-3" /> Your search will open on Indian Kanoon — India's largest free legal database
            </p>
          </CardContent>
        </Card>

        {/* Quick Search Topic Buttons */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white/90">Quick Search Topics</h2>
          <div className="flex flex-wrap gap-3">
            {QUICK_TOPICS.map(topic => (
              <button
                key={topic}
                onClick={() => handleQuickSearch(topic)}
                className="px-4 py-2 rounded-full border border-[#c9a84c]/40 text-[#c9a84c] text-sm font-medium hover:bg-[#c9a84c] hover:text-[#0a192f] transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Official Court Resources Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white/90">Official Court Websites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 justify-stretch md:grid-cols-3 gap-4">
            {OFFICIAL_RESOURCES.map(resource => (
              <div 
                key={resource.name}
                onClick={() => handleResourceOpen(resource)}
                className="bg-[#1e293b] border border-[#c9a84c]/20 hover:border-[#c9a84c] p-6 rounded-2xl cursor-pointer group transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-[#c9a84c]/10 p-2 rounded-lg">
                    <Scale className="w-5 h-5 text-[#c9a84c]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-1 rounded">
                    {resource.badge}
                  </span>
                </div>
                <h3 className="text-white font-bold mb-1 group-hover:text-[#c9a84c] transition-colors">{resource.name}</h3>
                <div className="flex items-center text-xs text-gray-400 group-hover:text-gray-300">
                   Visit official site <ExternalLink className="w-3 h-3 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Disclaimer (Mandatory) */}
        <div className="border border-[#c9a84c]/30 bg-[#c9a84c]/5 p-6 rounded-2xl mt-12 text-center text-xs text-gray-400 italic font-serif leading-relaxed">
          Legal Help Kolkata is an independent platform and is not affiliated with Indian Kanoon, the Supreme Court of India, the Calcutta High Court, the Government of West Bengal, or any government body or court. All judgment links redirect users to their respective official platforms. This section is provided solely for facilitating public access to legal information in accordance with the objective of legal awareness. This platform operates in compliance with Bar Council of India Rules, 1975. Nothing on this page constitutes legal advice.
        </div>

      </div>
    </div>
  );
}
