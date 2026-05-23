import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, BookOpen, Scale, MapPin, ArrowRight, UserCircle, Globe, Gavel, Mail, Phone, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LEGAL_ARTICLES } from '@/constants/articles';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import SEO from '@/components/SEO';

import HomeCarousel from '@/components/HomeCarousel';

const SERVED_AREAS = [
  "Kolkata", "Alipore", "Tollygunge", "Ballygunge", "Park Street", "Salt Lake",
  "New Town", "Howrah", "Hooghly", "Bally", "Serampore", "Barrackpore",
  "Dum Dum", "Barasat", "Rajarhat", "Jadavpur", "Dhakuria", "Gariahat",
  "North 24 Parganas", "South 24 Parganas", "Asansol", "Durgapur", "Siliguri"
];

const FEATURED_REVIEWS = [
  {
    author: "Anirban Sen",
    relativeTime: "2 months ago",
    text: "Found Calcutta High Court practitioner information so easily. An extremely useful and transparent platform for citizens of West Bengal."
  },
  {
    author: "Priya Banerjee",
    relativeTime: "3 weeks ago",
    text: "Highly informative educational legal materials on property disputes and family laws. Credible, humble and extremely helpful BCI-compliant platform."
  },
  {
    author: "Debasis Das",
    relativeTime: "1 month ago",
    text: "The free legal awareness Q&A section is highly active and response is speedy. Helps common public understand legal procedures without hesitation."
  }
];

const CYCLIC_COLORS = [
  'bg-[#292f70] shadow-xl', // Deep Blue
  'bg-[#165134] shadow-xl', // Deep Green
  'bg-[#7c1c38] shadow-xl', // Deep Red
  'bg-[#1a2d5c] shadow-xl', // Deep Indigo
  'bg-[#1c504a] shadow-xl', // Teal
  'bg-[#6e3911] shadow-xl', // Brown
  'bg-[#223d57] shadow-xl', // Slate
  'bg-[#4f206e] shadow-xl', // Purple
];

export default function Home() {
  const navigate = useNavigate();
  const [showDeletionOptions, setShowDeletionOptions] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');

  const openDialog = (title: string, content: string) => {
    setDialogTitle(title);
    setDialogContent(content);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-[100vh] bg-[#0d1b2a] text-white">
      <SEO 
        title="Legal Help Kolkata — Find Advocates, Legal Advice & Court Judgments in West Bengal"
        description="Legal Help Kolkata is a free legal platform for Kolkata and West Bengal. Find verified advocates, get free legal guidance, search court judgments, and access legal resources. Serving Alipore, Calcutta High Court, and all districts of West Bengal."
        keywords="lawyer in Kolkata, advocate Kolkata, legal help Kolkata, free legal advice West Bengal, Calcutta High Court advocate, legal aid Kolkata, best lawyer Kolkata, legal query Kolkata, advocate directory West Bengal, legal information Kolkata"
      />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1f2c41] text-white border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-[#c9a84c] tracking-wider">{dialogTitle}</DialogTitle>
            <DialogDescription className="text-white/80 mt-4 leading-relaxed font-serif italic text-[15px]">
              {dialogContent}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* Top Header */}
      <header className="flex items-center justify-between p-4 pt-6 z-10">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-gold" />
          <div className="flex flex-col">
            <span className="text-[13px] font-bold tracking-wider leading-none">Legal Help</span>
            <span className="text-[9px] font-medium tracking-[0.2em] text-white/70">KOLKATA</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors">
            <Globe className="w-4 h-4" />
            <span>বাংলা</span>
          </button>
          <button onClick={() => navigate('/admin')} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
            <UserCircle className="w-5 h-5 text-white/80" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-10 space-y-8 relative text-center">
        <div className="w-32 h-32 bg-[#1f2c41] rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-white/5 relative">
          <div className="absolute inset-0 border border-gold/20 rounded-[2.5rem] shadow-[0_0_40px_rgba(201,168,76,0.15)] pointer-events-none" />
          <Scale className="w-16 h-16 text-gold relative z-10" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-[3.5rem] font-serif font-bold italic tracking-tight leading-[0.9] flex flex-col">
          <span>Legal Help</span>
          <span>Kolkata</span>
        </h1>
        
        <p className="text-[15px] font-serif italic text-white/80 leading-relaxed max-w-[320px] px-2 mb-4">
          "Legal Help Kolkata is a legal awareness platform providing free legal information and educational resources to help people understand their rights and legal procedures."
        </p>
      </section>

      {/* Action Strip */}
      <section className="px-5 pb-8 space-y-4 flex flex-col items-center">
        <Button 
          onClick={() => navigate('/blog', { state: { activeTab: 'qna' } })}
          className="w-full bg-transparent border border-[#c9a84c]/50 hover:bg-[#c9a84c]/10 text-[#c9a84c] font-bold text-[13px] tracking-[0.2em] h-16 rounded-[1.5rem] uppercase active:scale-[0.98] transition-all"
        >
          Q & A & Free Legal Help Blog
        </Button>
        <Button 
          onClick={() => navigate('/query')}
          className="w-full bg-[#c9a84c] hover:bg-[#b09038] text-[#1c180d] font-bold text-[13px] tracking-[0.2em] h-16 rounded-[1.5rem] shadow-[0_10px_30px_rgba(201,168,76,0.25)] uppercase active:scale-[0.98] transition-transform"
        >
          Submit a Legal Query
        </Button>
      </section>

      {/* Explore Legal Resources Carousel */}
      <HomeCarousel />

      {/* Areas We Serve (Feature 5) */}
      <section className="px-5 py-8 space-y-4 max-w-4xl mx-auto w-full text-center">
        <h3 className="text-[11px] font-black tracking-[0.25em] text-[#c9a84c] uppercase">Areas We Serve</h3>
        <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
          {SERVED_AREAS.map(area => (
            <button
              key={area}
              onClick={() => navigate('/directory', { state: { initialSearch: area } })}
              className="px-3.5 py-1.5 rounded-full border border-[#c9a84c]/30 text-white/80 hover:text-white hover:border-[#c9a84c] hover:bg-[#c9a84c]/10 text-[11px] font-sans font-medium tracking-wide transition-all active:scale-95 duration-200 cursor-pointer"
            >
              {area}
            </button>
          ))}
        </div>
      </section>

      {/* GMB Google Reviews (Feature 4) */}
      <section className="px-5 py-10 space-y-6 max-w-4xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4 text-center md:text-left border-b border-white/5 pb-4">
          <div className="space-y-1">
            <h3 className="text-[11px] font-black tracking-[0.25em] text-[#c9a84c] uppercase">What People Say</h3>
            <h2 className="text-3xl font-serif font-bold italic tracking-tight">Verified Google Reviews</h2>
          </div>
          {/* Rating Badge */}
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5">
            <span className="text-[#c9a84c] font-black text-lg">4.9</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-4 h-4 fill-[#c9a84c] text-[#c9a84c]" />
              ))}
            </div>
            <span className="text-[11px] text-white/60 font-medium ml-1">(120+ Reviews)</span>
          </div>
        </div>

        {/* Featured Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURED_REVIEWS.map((review, idx) => (
            <Card key={idx} className="bg-[#1f2c41] border border-white/5 rounded-3xl p-6 relative flex flex-col justify-between hover:bg-[#25364e] transition-colors shadow-lg">
              <CardContent className="p-0 space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] text-xs font-black select-none pointer-events-none">
                      {review.author[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">{review.author}</h4>
                      <p className="text-[9px] text-white/50">{review.relativeTime}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-3 h-3 fill-[#c9a84c] text-[#c9a84c]" />
                    ))}
                  </div>
                </div>
                <p className="text-[13px] font-serif italic text-white/80 leading-relaxed">
                  "{review.text}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Google Call To Action button */}
        <div className="flex justify-center pt-2">
          <a
            href="https://g.page/r/CQHQdBsgEqeHEAI/review"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b09038] text-[#1c180d] font-black text-[11px] tracking-[0.2em] uppercase px-6 py-4 rounded-full transition-transform active:scale-95 shadow-[0_4px_15px_rgba(201,168,76,0.2)]"
          >
            <Star className="w-4 h-4 fill-[#1c180d] text-[#1c180d]" />
            <span>Rate us on Google</span>
          </a>
        </div>
      </section>

      {/* Legal Literacy Block - Golden Container */}
      <section className="bg-[#c9a84c] text-[#2b1d0c] rounded-t-[2.5rem] px-5 py-12 pb-24 space-y-8 relative shadow-[0_-20px_50px_rgba(201,168,76,0.15)]">
        <div className="text-center space-y-2 px-2 mb-10">
          <h2 className="text-5xl font-serif font-bold tracking-tight text-[#251909]">Legal Literacy</h2>
          <p className="text-[15px] font-serif italic text-[#3a2710]/80 leading-relaxed max-w-[280px] mx-auto mt-4">
            "Democratizing access to law through verified education and awareness."
          </p>
        </div>

        <div className="space-y-5">
          {LEGAL_ARTICLES.map((article, i) => {
            const boxColorClass = CYCLIC_COLORS[i % CYCLIC_COLORS.length];
            
            return (
              <motion.div 
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Link to={`/blog`} className="block group">
                  <Card className={`${boxColorClass} text-white border-0 rounded-[2rem] overflow-hidden active:scale-[0.98] transition-transform`}>
                    <CardContent className="p-6 md:p-8 space-y-5">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-start gap-4">
                          <div className="border border-white/20 p-3 rounded-full shrink-0">
                            <Gavel className="w-5 h-5 text-white" strokeWidth={1.5} />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <span className="text-[9px] uppercase tracking-[0.25em] font-black text-white/90 border border-white/20 px-3 py-1 rounded-full inline-block">
                            {article.category}
                          </span>
                          <h3 className="font-serif font-bold text-[22px] leading-snug tracking-tight pr-2">
                            {article.title}
                          </h3>
                          <p className="text-[15px] text-white/80 font-serif italic leading-relaxed pr-2">
                            "{article.content}"
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-4 border-t border-white/10 text-[11px] font-bold tracking-[0.2em] text-white uppercase group-hover:text-white/80 transition-colors">
                        READ RESOLUTION <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer Section */}
      <div className="bg-[#0b131e] px-6 py-12 rounded-t-[3rem] mt-12 text-center text-white relative flex flex-col items-center border-[1px] border-[#c9a84c]/20">
         {/* Icon/Brand */}
         <div className="flex items-center gap-3 justify-center mb-6">
            <div className="bg-gold/10 p-2 rounded-full">
               <Scale className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-xl font-serif font-bold italic">Legal Help Kolkata</h3>
         </div>
         
         <p className="text-white/60 text-sm max-w-xs font-serif italic mb-8">
           "Expert Legal Information and Awareness Platform dedicated to the people of West Bengal."
         </p>
         
         <div className="space-y-4 mb-10 w-full max-w-xs text-sm">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl justify-start">
               <Mail className="w-4 h-4 text-gold flex-shrink-0" />
               <span className="text-white/80 truncate">1legalhelpkolkata@gmail.com</span>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl justify-start">
               <Phone className="w-4 h-4 text-gold flex-shrink-0" />
               <span className="text-white/80">+91 8697457657</span>
            </div>

         </div>
         
         <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-gold mb-6 border-b border-white/10 pb-4 w-full text-left">QUICK NAVIGATION</h4>
         
         <div className="flex flex-col space-y-5 text-xs font-bold tracking-widest uppercase text-white/50 w-full mb-10 text-left">
           <Link to="/judgments" className="hover:text-white transition-colors text-gold">Legal Judgments</Link>
           <Link to="/directory" className="hover:text-white transition-colors">Advocate Directory</Link>
           <Link to="/blog" className="hover:text-white transition-colors">Legal Resources QA</Link>
           <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
           <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
           <Link to="/disclaimer" className="hover:text-white transition-colors">BCI Disclaimer</Link>
           <div className="flex flex-col w-full text-left">
             <button 
               onClick={() => setShowDeletionOptions(!showDeletionOptions)}
               className="text-red-900/80 hover:text-red-500 transition-colors uppercase font-black tracking-widest text-left py-2"
             >
               Account Deletion
             </button>
             {showDeletionOptions && (
               <div className="flex flex-col space-y-3 pl-4 border-l-2 border-red-900/30 mt-2 py-2">
                 <button onClick={() => openDialog("Self-Deletion: Advocate Registration", "Please securely log in to the Advocate Directory and navigate to your profile settings to self-delete your registration.")} className="text-[10px] text-red-500/80 hover:text-red-400 text-left uppercase tracking-widest font-bold">1. Self-Deletion: Advocate Registration</button>
                 <button onClick={() => openDialog("Self-Deletion by Blog Posts and Answers", "Please securely log in and visit your Q&A dashboard to delete your posts and answers.")} className="text-[10px] text-red-500/80 hover:text-red-400 text-left uppercase tracking-widest font-bold">2. Self-Deletion by Blog Posts and Answers</button>
                 <button onClick={() => openDialog("Self-Deletion Legal Query Submissions", "Please securely log in to withdraw or delete your submitted legal queries.")} className="text-[10px] text-red-500/80 hover:text-red-400 text-left uppercase tracking-widest font-bold">3. Self-Deletion Legal Query Submissions</button>
               </div>
             )}
           </div>
         </div>
         
         <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 mb-6 border-b border-white/5 pb-4 w-full text-left">LEGAL COMPLIANCE</h4>
         
         <div className="bg-black/40 border border-white/5 p-6 rounded-3xl w-full text-left mb-8 space-y-3">
           <h5 className="text-gold text-[10px] font-black uppercase tracking-widest mb-3 border-b border-white/10 pb-2">Mandatory Disclaimer</h5>
           <ul className="text-[11px] text-white/60 space-y-2 font-serif italic list-disc pl-4">
              <li>As per Bar Council of India Rules:</li>
              <li>This platform is not a law firm.</li>
              <li>No legal advice is provided here. Information is for awareness purposes only.</li>
              <li>Advocates listed are independent professionals.</li>
              <li>This platform does not solicit clients or guarantee case outcomes.</li>
           </ul>
         </div>
         
         <div className="text-[9px] text-white/30 uppercase tracking-widest pb-32 w-full text-center space-y-2 border-t border-white/5 pt-8">
           <p>© 2026 COPYRIGHT LEGAL HELP KOLKATA.</p>
           <p>ALL RIGHTS RESERVED.</p>
           <div className="flex justify-center gap-3 pt-3">
             <Link to="/terms" className="hover:text-white border-b border-transparent hover:border-white">TERMS</Link>
             <span>|</span>
             <Link to="/privacy" className="hover:text-white border-b border-transparent hover:border-white">PRIVACY</Link>
             <span>|</span>
              <Link to="/delete-data" className="hover:text-white border-b border-transparent hover:border-white">DELETE DATA</Link>
              <span>|</span>
             <Link to="/disclaimer" className="hover:text-white border-b border-transparent hover:border-white">COMPLIANCE</Link>
           </div>
           <p className="mt-8 text-[8px] leading-relaxed max-w-[300px] mx-auto normal-case font-serif italic pb-8">
             Educational platform only - BCI Compliant Initiative - All information provided is for general awareness and does not constitute legal advice.
           </p>
         </div>
      </div>

    </div>
  );
}
