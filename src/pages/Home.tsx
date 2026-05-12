import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, BookOpen, Scale, MapPin, ArrowRight, UserCircle, Globe, Gavel, Mail, Phone, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LEGAL_ARTICLES } from '@/constants/articles';

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

  return (
    <div className="flex flex-col min-h-[100vh] bg-[#0d1b2a] text-white">
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
          onClick={() => navigate('/blog')}
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
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl justify-start">
               <Clock className="w-4 h-4 text-gold flex-shrink-0" />
               <span className="text-white/80">Available: 24 Hours</span>
            </div>
         </div>
         
         <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-gold mb-6 border-b border-white/10 pb-4 w-full text-left">QUICK NAVIGATION</h4>
         
         <div className="flex flex-col space-y-5 text-xs font-bold tracking-widest uppercase text-white/50 w-full mb-10 text-left">
           <Link to="/directory" className="hover:text-white transition-colors">Advocate Directory</Link>
           <Link to="/blog" className="hover:text-white transition-colors">Legal Resources</Link>
           <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
           <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
           <Link to="/disclaimer" className="hover:text-white transition-colors">BCI Disclaimer</Link>
           <button className="text-red-900/80 hover:text-red-500 transition-colors uppercase font-black tracking-widest text-left">Account Deletion</button>
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
