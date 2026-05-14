import { Link } from 'react-router-dom';

export default function PrivacyFooter() {
  return (
    <footer className="w-full py-8 px-6 bg-[#0d1b2a] border-t border-white/5 text-center space-y-4 mb-24">
      <div className="flex justify-center space-x-6 text-[10px] font-bold tracking-widest uppercase text-white/40">
        <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-gold transition-colors">Terms of Use</Link>
        <Link to="/disclaimer" className="hover:text-gold transition-colors">Compliance Disclaimer</Link>
      </div>
      <p className="text-[10px] text-white/20 tracking-wider">
        © {new Date().getFullYear()} LEGAL HELP KOLKATA. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
}
