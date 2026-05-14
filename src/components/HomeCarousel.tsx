import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, BookOpen, Home as HomeIcon, Shield, Users, FileText, Car, ShoppingBag, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CARDS = [
  {
    title: "Calcutta High Court",
    description: "Search latest orders and judgments from the Calcutta High Court",
    badge: "West Bengal",
    buttonText: "Search Judgments →",
    icon: Scale,
    bgClass: "bg-gradient-to-br from-[#0f172a] to-[#1e293b]"
  },
  {
    title: "Supreme Court",
    description: "Access landmark rulings and recent orders from the Supreme Court of India",
    badge: "National",
    buttonText: "Explore Judgments →",
    icon: BookOpen,
    bgClass: "bg-gradient-to-br from-[#172033] to-[#24354f]"
  },
  {
    title: "Property Disputes",
    description: "Find judgments on property rights, land acquisition, and possession cases",
    badge: "Civil Law",
    buttonText: "Search Now →",
    icon: HomeIcon,
    bgClass: "bg-gradient-to-br from-[#1a1b32] to-[#292a4e]"
  },
  {
    title: "Criminal Cases & Bail",
    description: "Search bail applications, criminal appeals, and High Court criminal orders",
    badge: "Criminal Law",
    buttonText: "Search Now →",
    icon: Shield,
    bgClass: "bg-gradient-to-br from-[#20152a] to-[#362544]"
  },
  {
    title: "Family & Matrimonial",
    description: "Maintenance, divorce, custody, and domestic violence case judgments",
    badge: "Family Law",
    buttonText: "Search Now →",
    icon: Users,
    bgClass: "bg-gradient-to-br from-[#122222] to-[#1c3838]"
  },
  {
    title: "Cheque Bounce Cases",
    description: "Latest judgments on Section 138 Negotiable Instruments Act cheque dishonour cases",
    badge: "Banking Law",
    buttonText: "Search Now →",
    icon: FileText,
    bgClass: "bg-gradient-to-br from-[#251f16] to-[#3a3225]"
  },
  {
    title: "Motor Accident Claims",
    description: "MACT tribunal awards and High Court judgments on accident compensation",
    badge: "Compensation",
    buttonText: "Search Now →",
    icon: Car,
    bgClass: "bg-gradient-to-br from-[#2a1717] to-[#422626]"
  },
  {
    title: "Consumer Cases",
    description: "Consumer forum orders and High Court judgments on consumer rights",
    badge: "Consumer Law",
    buttonText: "Search Now →",
    icon: ShoppingBag,
    bgClass: "bg-gradient-to-br from-[#14231b] to-[#213a2c]"
  },
  {
    title: "All Legal Resources",
    description: "Browse all official court websites, legal databases, and judgment portals",
    badge: "All Courts",
    buttonText: "View All Resources →",
    icon: ExternalLink,
    isSpecial: true,
    bgClass: "bg-gradient-to-br from-[#1e293b] to-[#c9a84c]/40"
  }
];

const getCardsToShow = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth >= 1280) return 4;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1.5; // mobile peek
  }
  return 1.5;
};

export default function HomeCarousel() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(getCardsToShow());
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => setCardsToShow(getCardsToShow());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalStates = Math.ceil(CARDS.length - cardsToShow) + 1;

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalStates);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered, totalStates]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsHovered(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsHovered(false);
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) nextCard();
    if (diff < -50) prevCard();
    touchStartX.current = null;
  };

  const nextCard = () => {
    setActiveIndex((prev) => Math.min(prev + 1, totalStates - 1));
  };

  const prevCard = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToCard = (index: number) => {
    setActiveIndex(Math.min(index, totalStates - 1));
  };

  return (
    <section className="bg-[#0d1b2a] py-12 px-4 md:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#c9a84c]">Explore Legal Resources</h2>
          <p className="text-white/60 italic font-serif mt-2">Quick access to judgments, court websites, and legal databases</p>
        </div>
        <div className="hidden md:flex items-center gap-3 mt-4 md:mt-0">
          <button 
            onClick={prevCard} 
            disabled={activeIndex === 0}
            className="w-10 h-10 rounded-full bg-[#1e293b] border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0d1b2a] disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextCard} 
            disabled={activeIndex >= totalStates - 1}
            className="w-10 h-10 rounded-full bg-[#1e293b] border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0d1b2a] disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        className="max-w-7xl mx-auto relative cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="overflow-hidden no-scrollbar">
          <motion.div 
            className="flex"
            animate={{ 
              x: `calc(-${activeIndex * (100 / CARDS.length)}%)` 
            }}
            transition={{ ease: "easeInOut", duration: 1.2 }}
            style={{ width: `${(CARDS.length / cardsToShow) * 100}%` }}
          >
            {CARDS.map((card, idx) => {
               const Icon = card.icon;
               return (
                 <div key={idx} style={{ width: `${100 / CARDS.length}%` }} className="px-2 md:px-3">
                   <div 
                     onClick={() => navigate('/judgments')}
                     className={`h-full shrink-0 cursor-pointer group rounded-xl p-5 md:p-6 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border-l-4
                      ${card.isSpecial ? 'border-[#c9a84c]' : 'border-[#c9a84c] hover:border-[#f0d080]'}
                      ${card.bgClass}
                     `}
                   >
                     <div className="flex justify-between items-start mb-4">
                       <div className="bg-[#0d1b2a]/50 p-2 rounded-lg">
                         <Icon className="w-6 h-6 text-[#c9a84c]" />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-[#c9a84c]/20 px-2 py-1 rounded">
                         {card.badge}
                       </span>
                     </div>
                     <h3 className="text-white font-bold text-lg mb-2">{card.title}</h3>
                     <p className="text-gray-400 text-sm line-clamp-3 mb-6 h-[60px] leading-relaxed">
                       {card.description}
                     </p>
                     <div className="flex items-center text-[#c9a84c] text-sm font-bold opacity-80 group-hover:opacity-100">
                       {card.buttonText}
                     </div>
                   </div>
                 </div>
               );
            })}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex gap-2 justify-center w-full md:w-auto">
          {Array.from({ length: totalStates }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToCard(idx)}
              className={`rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? "w-6 h-2 bg-[#c9a84c]"
                  : "w-2 h-2 bg-gray-600 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
        
        <button 
          onClick={() => navigate('/judgments')}
          className="border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0d1b2a] font-bold text-sm tracking-wider uppercase px-6 py-3 rounded-xl transition-all w-full md:w-auto"
        >
          View All Legal Resources →
        </button>
      </div>
    </section>
  );
}
