import { ArrowLeft, Trash2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function DeleteData() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#0d1b2a] text-white selection:bg-gold/30">
      <div className="sticky top-0 z-50 bg-[#0d1b2a]/90 backdrop-blur-md border-b border-white/5 py-4 px-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-8 w-8">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gold">Data Safety</span>
      </div>

      <div className="flex-1 max-w-xl mx-auto px-6 py-12 pb-32 w-full space-y-12 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="bg-red-500/10 p-6 rounded-[2.5rem] w-24 h-24 mx-auto border border-red-500/20 flex items-center justify-center">
            <Trash2 className="w-10 h-10 text-red-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-white leading-tight uppercase">Request Data Deletion</h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm mx-auto font-serif italic">
            In compliance with Google Play Store policies, we provide a clear path for users to request the deletion of their personal data.
          </p>
        </motion.div>

        <section className="bg-white/5 border border-white/10 p-8 rounded-[2rem] space-y-8 text-left">
          <div className="space-y-4">
            <h2 className="text-xs font-black tracking-[0.2em] uppercase text-gold">How to Delete Your Data</h2>
            <p className="text-xs text-white/60 leading-relaxed">
              If you wish to delete your account, advocate registration, or any submitted queries, please follow these steps:
            </p>
            <ol className="list-decimal pl-4 space-y-4 text-xs text-white/80">
              <li>
                <strong>Email Request:</strong> Send an email from your registered email address to <span className="text-gold">1legalhelpkolkata@gmail.com</span>.
              </li>
              <li>
                <strong>Subject Line:</strong> Use "DATA DELETION REQUEST" as the subject.
              </li>
              <li>
                <strong>Details:</strong> Mention your name and the type of data you wish to be removed (e.g., Advocate Profile, Legal Query).
              </li>
              <li>
                <strong>Verification:</strong> For security, we may ask for a confirmation via your registered mobile number.
              </li>
            </ol>
          </div>

          <div className="pt-6 border-t border-white/10">
            <p className="text-[10px] text-white/40 leading-relaxed italic">
              Upon receiving your request, we will permanently delete all your data from our servers within 7 working days. You will receive a confirmation email once the process is complete.
            </p>
          </div>

          <Button 
            asChild
            className="w-full bg-[#c9a84c] hover:bg-[#b09038] text-[#1c180d] font-bold text-[11px] tracking-[0.2em] h-14 rounded-2xl shadow-lg border-0 uppercase"
          >
            <a href="mailto:1legalhelpkolkata@gmail.com?subject=DATA DELETION REQUEST">
              <Mail className="w-4 h-4 mr-2" /> Send Deletion Email
            </a>
          </Button>
        </section>

        <p className="text-[10px] text-white/30 uppercase tracking-widest pt-8">
            Refer to our <a href="/privacy" className="text-gold hover:underline">Privacy Policy</a> for more details.
        </p>
      </div>
    </div>
  );
}
