import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ShieldCheck, Briefcase, Landmark, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestoreErrorHandler';
import { LEGAL_CATEGORIES } from '@/constants/legal';
import { ADMIN_EMAILS } from '@/constants/admins';
import { seedDatabase } from '@/lib/seed';
import { Link } from 'react-router-dom';

interface Advocate {
  id: string;
  fullName: string;
  experienceYears: number;
  courtOfPractice: string;
  specialization: string[];
  enrollmentNumber: string;
}

export default function Directory() {
  const [user] = useAuthState(auth);
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      const authorizedAdmins = ADMIN_EMAILS.map(e => e.toLowerCase().trim());
      if (authorizedAdmins.includes((user.email || '').toLowerCase().trim())) {
        setIsAdmin(true);
        return;
      }

      try {
        const adminDoc = await getDoc(doc(db, 'admins', (user.email || '').toLowerCase().trim()));
        if (adminDoc.exists()) {
          setIsAdmin(true);
        }
      } catch (e) {
        console.warn("Directory admin check skip", e);
      }
    };

    checkAdmin();
  }, [user]);

  useEffect(() => {
    setIsLoading(true);
    const path = 'public_advocates';
    const q = query(
      collection(db, path),
      orderBy('fullName') // Changed to fullName since updatedAt might not exist
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() } as Advocate;
      });
      setAdvocates(data);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleManualSeed = async () => {
    await seedDatabase();
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredAdvocates = advocates.filter(adv => {
    const matchesSearch = adv.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adv.specialization.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategories = selectedCategories.length === 0 ||
      selectedCategories.some(cat => adv.specialization.includes(cat));
      
    const matchesExperience = adv.experienceYears >= minExperience;
    
    return matchesSearch && matchesCategories && matchesExperience;
  });

  return (
    <div className="flex flex-col min-h-[100vh] bg-[#0d1b2a] text-white">
      {/* Header */}
      <section className="px-6 pt-10 pb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold italic tracking-tight leading-none text-white">
          Directory - Verified <br /> Advocates
        </h1>
      </section>

      {/* Filters */}
      <div className="px-5 space-y-5">
        <div className="flex gap-3">
          <div className="flex-1 relative bg-[#1f2c41] rounded-[1.5rem] border border-white/10 flex items-center px-4 h-14">
            <Search className="text-white/50 w-5 h-5 shrink-0" />
            <input 
              className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/50 px-3 text-[15px]" 
              placeholder="Search by practitioner name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={minExperience.toString()} onValueChange={(val) => setMinExperience(parseInt(val))}>
            <SelectTrigger className="w-[100px] h-14 bg-[#1f2c41] border border-white/10 rounded-[1.5rem] text-white px-4 text-center focus:ring-0 focus:ring-offset-0">
              <div className="flex items-center justify-center w-full font-medium">
                <Briefcase className="w-4 h-4 text-gold shrink-0 mr-1" />
                <span>{minExperience === 0 ? 'Exp' : `${minExperience}+Y`}</span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#1f2c41] border-white/10 text-white rounded-2xl p-2 min-w-[200px]">
              <SelectItem value="0" className="rounded-xl py-3 focus:bg-white/10">Any Experience</SelectItem>
              <SelectItem value="5" className="rounded-xl py-3 focus:bg-white/10 font-bold">5+ Years Practice</SelectItem>
              <SelectItem value="10" className="rounded-xl py-3 focus:bg-white/10 font-bold">10+ Years Practice</SelectItem>
              <SelectItem value="15" className="rounded-xl py-3 focus:bg-white/10 font-bold">15+ Years Practice</SelectItem>
              <SelectItem value="20" className="rounded-xl py-3 focus:bg-white/10 font-bold">Senior Counsel (20+)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex flex-nowrap w-full overflow-x-auto pb-4 gap-3 scrollbar-hide px-1">
          {LEGAL_CATEGORIES.map(cat => {
            const isSelected = selectedCategories.includes(cat);
            return (
              <button 
                key={cat} 
                onClick={() => toggleCategory(cat)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 border ${
                  isSelected 
                    ? 'bg-gold border-gold text-[#0d1b2a] shadow-[0_4px_15px_rgba(201,168,76,0.3)]' 
                    : 'bg-transparent border-white/20 text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Roster / Results */}
      <div className="flex-1 px-5 pb-32 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 animate-pulse bg-[#1f2c41] rounded-[1.5rem]" />
            ))}
          </div>
        ) : filteredAdvocates.length > 0 ? (
          filteredAdvocates.map((adv) => (
            <Card key={adv.id} className="bg-[#1f2c41] border-0 shadow-lg rounded-[1.5rem] overflow-hidden text-white mb-4">
              <CardContent className="p-6">
                {/* Header (Verified Badge) */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-gold" />
                  </div>
                  <div className="flex items-center">
                    <span className="text-[#c9a84c] text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-gold/40">
                      VERIFIED
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-2xl font-serif font-bold italic mb-5 leading-none">
                  {adv.fullName}
                </h3>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <div className="w-8 h-8 rounded-full bg-[#2e3e57] flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4 text-[#8b9bb4]" />
                    </div>
                    <span>{adv.experienceYears} Years Practice</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <div className="w-8 h-8 rounded-full bg-[#2e3e57] flex items-center justify-center shrink-0">
                      <Landmark className="w-4 h-4 text-[#8b9bb4]" />
                    </div>
                    <span className="truncate">{adv.courtOfPractice}</span>
                  </div>
                </div>

                {/* Specialization Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {adv.specialization.map((spec, i) => (
                    <Badge key={i} variant="secondary" className="bg-[#2e3e57] hover:bg-[#2e3e57] text-[#93a5c1] text-[9px] font-bold uppercase tracking-[0.1em] rounded-full px-3 py-1 border-none">
                      {spec}
                    </Badge>
                  ))}
                </div>

                {/* Action button */}
                <div className="flex justify-end pt-4 border-t border-white/10">
                  <button 
                    className="flex items-center gap-2 text-[10px] font-black text-gold tracking-[0.2em] uppercase active:scale-95 transition-transform"
                    onClick={() => {
                      setSelectedAdvocate(adv);
                      setIsModalOpen(true);
                    }}
                  >
                    VIEW PRACTITIONER <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-[#1f2c41] rounded-[2rem] border border-dashed border-white/10 shadow-xl mt-4">
            <h3 className="text-xl font-serif font-bold text-white/60 italic">No practitioners found.</h3>
            <div className="flex justify-center mt-6">
              {isAdmin && (
                <Button onClick={handleManualSeed} className="bg-gold text-[#0d1b2a] px-8 h-12 rounded-2xl font-black uppercase tracking-widest text-xs">
                  Admin: Seed Test Data
                </Button>
              )}
            </div>
          </div>
        )}
        
        {/* Recruitment CTA box (as in video, "Are you a practicing Advocate?") */}
        <div className="mt-8 p-8 bg-[#3b2b1a] text-[#f5ebd7] rounded-[2rem] shadow-2xl relative overflow-hidden text-center border border-gold/20">
          <div className="relative z-10 flex flex-col items-center justify-center gap-4">
            <h2 className="text-3xl font-serif font-bold text-gold">Are you a practicing <br /> Advocate?</h2>
            <p className="text-white/60 text-sm italic max-w-xs mx-auto">
              "Join our community of legal practitioners. Listing is free and subject to verification."
            </p>
            <Link to="/advocate-login" className="mt-4 w-full bg-[#1c180d] text-gold font-bold h-14 rounded-full flex items-center justify-center text-[11px] tracking-[0.2em] uppercase active:scale-95 transition-transform shadow-lg border border-gold/30">
              APPLY FOR FREE LISTING
            </Link>
          </div>
        </div>
      </div>

      {/* Modal Profile */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md w-[90%] mx-auto rounded-[2rem] p-0 overflow-hidden border-0 bg-[#0d1b2a] shadow-2xl">
          {selectedAdvocate && (
            <div className="relative">
              <div className="bg-[#1a273b] p-8 text-center text-white relative">
                <Badge className="bg-gold text-[#0d1b2a] border-none mb-4 px-3 py-1.5 rounded-full text-[9px] uppercase tracking-[0.3em] font-black inline-block">Verified Practitioner</Badge>
                <h2 className="text-3xl font-serif font-bold italic mb-1">{selectedAdvocate.fullName}</h2>
                <p className="text-gold/80 font-medium text-xs tracking-wide">Registered under BCI Regulations</p>
              </div>
              
              <div className="p-8 space-y-6 text-white bg-[#0d1b2a]">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-[9px] uppercase font-bold tracking-widest text-white/50">Bar Enrollment</Label>
                    <p className="font-sans text-sm font-semibold">{selectedAdvocate.enrollmentNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] uppercase font-bold tracking-widest text-white/50">Experience</Label>
                    <p className="font-serif font-bold text-lg text-gold">{selectedAdvocate.experienceYears} Years</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[9px] uppercase font-bold tracking-widest text-white/50">Principal Court</Label>
                  <p className="font-serif text-lg">{selectedAdvocate.courtOfPractice}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-[9px] uppercase font-bold tracking-widest text-white/50">Specialization</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedAdvocate.specialization.map((spec, i) => (
                      <Badge key={i} className="bg-white/10 text-white border-none py-1.5 px-3 rounded-full text-[10px] font-bold uppercase tracking-tight">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                   <p className="text-xs text-white/60 leading-relaxed font-serif italic text-center">
                     As per Bar Council of India regulations, direct contact details are not publicly disclosed to prevent solicitation.
                   </p>
                </div>
                
                <Button 
                   onClick={() => setIsModalOpen(false)}
                   className="w-full h-14 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-[0.2em] text-[11px]"
                >
                  Close Profile
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
