import { Landmark, Users, MessageSquareText, FileText, Info } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  if (location.pathname === '/disclaimer') return null;

  return (
    <nav className="fixed bottom-0 w-full max-w-[480px] bg-[#1a2332]/95 backdrop-blur-xl border-t border-white/5 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
      <div className="flex justify-between items-center h-[70px] relative px-6">
        
        {/* Left Side */}
        <Link to="/" className={`flex flex-col items-center justify-center space-y-1 w-12 transition-all ${location.pathname === '/' ? 'text-gold' : 'text-white/40 hover:text-white/80'}`}>
          <Landmark className="w-[22px] h-[22px] stroke-[1.5px]" />
        </Link>
        <Link to="/directory" className={`flex flex-col items-center justify-center space-y-1 w-12 transition-all ${location.pathname === '/directory' ? 'text-gold' : 'text-white/40 hover:text-white/80'}`}>
          <Users className="w-[22px] h-[22px] stroke-[1.5px]" />
        </Link>

        {/* Center Floating Button */}
        <div className="relative -top-5 flex justify-center w-16">
          <Link to="/query" className="bg-[#b38b3a] shadow-[0_4px_15px_rgba(179,139,58,0.4)] w-14 h-14 rounded-2xl flex items-center justify-center transform transition-transform active:scale-95 border-2 border-[#1a2332]">
            <MessageSquareText className="w-6 h-6 text-[#1a2332] stroke-[2px]" />
          </Link>
        </div>

        {/* Right Side */}
        <Link to="/blog" className={`flex flex-col items-center justify-center space-y-1 w-12 transition-all ${location.pathname === '/blog' ? 'text-gold' : 'text-white/40 hover:text-white/80'}`}>
          <FileText className="w-[22px] h-[22px] stroke-[1.5px]" />
        </Link>
        <Link to="/disclaimer" className={`flex flex-col items-center justify-center space-y-1 w-12 transition-all ${location.pathname === '/disclaimer' ? 'text-gold' : 'text-white/40 hover:text-white/80'}`}>
          <Info className="w-[22px] h-[22px] stroke-[1.5px]" />
        </Link>
        
      </div>
    </nav>
  );
}
