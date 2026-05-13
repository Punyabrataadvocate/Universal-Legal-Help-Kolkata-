import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, FileText, ChevronDown, Scale, HelpCircle, MessageSquare } from 'lucide-react';
import { LEGAL_ARTICLES } from '@/constants/articles';
import { DEFAULT_QNA } from '@/constants/qna';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ADMIN_EMAILS } from '@/constants/admins';

const STATUTES = [
  {
    id: 'bns-85',
    act: 'BHARATIYA NYAYA SANHITA',
    title: 'Section 85 BNS',
    subtitle: 'Husband or relative of husband of a woman subjecting her to cruelty.',
    content: '"Cruelty includes any willful conduct likely to drive the woman to commit suicide or to cause grave injury or danger to life, limb or health (whether mental or physical). Formerly Section 498A IPC."'
  },
  {
    id: 'bnss-144',
    act: 'BHARATIYA NAGARIK SURAKSHA SANHITA',
    title: 'Section 144 BNSS',
    subtitle: 'Order for maintenance of wives, children and parents.',
    content: '"If any person having sufficient means neglects or refuses to maintain his wife, children or parents, a Magistrate can order a monthly allowance for maintenance. Formerly Section 125 CrPC."'
  },
  {
    id: 'ni-138',
    act: 'NEGOTIABLE INSTRUMENTS ACT',
    title: 'Section 138 NI Act',
    subtitle: 'Dishonour of cheque for insufficiency of funds in the account.',
    content: '"It is a criminal offense punishable with imprisonment up to 2 years or fine which may extend to twice the amount of the cheque, or both."'
  },
  {
    id: 'bnss-482',
    act: 'BHARATIYA NAGARIK SURAKSHA SANHITA',
    title: 'Section 482 BNSS',
    subtitle: 'Direction for grant of bail to person apprehending arrest (Anticipatory Bail).',
    content: '"Allows a person to seek bail in anticipation of arrest for non-bailable offenses, often used to prevent harassment in false cases. Formerly Section 438 CrPC."'
  },
  {
    id: 'bnss-173',
    act: 'BHARATIYA NAGARIK SURAKSHA SANHITA',
    title: 'Section 173 BNSS',
    subtitle: 'Information in cognizable cases (First Information Report).',
    content: '"Every information relating to the commission of a cognizable offence must be recorded by the officer-in-charge of police station. Formerly Section 154 CrPC."'
  },
  {
    id: 'bnss-223',
    act: 'BHARATIYA NAGARIK SURAKSHA SANHITA',
    title: 'Section 223 BNSS',
    subtitle: 'Examination of complainant (Private Complaint).',
    content: '"A Magistrate taking cognizance of an offence on complaint shall examine upon oath the complainant and the witnesses present. Formerly Section 200 CrPC."'
  },
  {
    id: 'bns-103',
    act: 'BHARATIYA NYAYA SANHITA',
    title: 'Section 103 BNS',
    subtitle: 'Punishment for murder.',
    content: '"Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine. Formerly Section 302 IPC."'
  },
  {
    id: 'const-21',
    act: 'CONSTITUTION OF INDIA',
    title: 'Article 21 Constitution',
    subtitle: 'Protection of life and personal liberty.',
    content: '"No person shall be deprived of his life or personal liberty except according to procedure established by law."'
  }
];

export default function Blog() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'information' | 'statutes' | 'qna'>(
    location.state?.activeTab || 'information'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [askTitle, setAskTitle] = useState('');
  const [askContent, setAskContent] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  
  const [user] = useAuthState(auth);
  const [isResponder, setIsResponder] = useState(false);
  const [responderName, setResponderName] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const CARD_COLORS = [
    "from-[#1f2c41] to-[#1f2c41]",
    "from-indigo-900/30 to-[#1f2c41]",
    "from-emerald-900/20 to-[#1f2c41]",
    "from-rose-900/20 to-[#1f2c41]",
    "from-sky-900/20 to-[#1f2c41]",
    "from-amber-900/20 to-[#1f2c41]"
  ];

  useEffect(() => {
    const checkResponder = async () => {
      if (!user) {
        setIsResponder(false);
        return;
      }
      const email = (user.email || '').toLowerCase().trim();
      if (ADMIN_EMAILS.map(e => e.toLowerCase().trim()).includes(email)) {
        setIsResponder(true);
        setResponderName('Admin | Legal Help Kolkata');
        return;
      }
      try {
        const advSnap = await getDocs(collection(db, 'advocate_registrations'));
        const adv = advSnap.docs.map(d => d.data()).find(d => d.uid === user.uid && d.status === 'approved');
        if (adv) {
          setIsResponder(true);
          setResponderName(`Adv. ${adv.fullName}`);
        } else {
          setIsResponder(false);
        }
      } catch (e) {
        console.error("Responder check error", e);
      }
    };
    checkResponder();
  }, [user]);

  const handlePostAnswer = async (postId: string) => {
    const text = replyText[postId];
    if (!text?.trim()) return;
    try {
      await addDoc(collection(db, `blog_posts/${postId}/answers`), {
        text,
        author: responderName,
        createdAt: serverTimestamp()
      });
      setReplyText(prev => ({ ...prev, [postId]: '' }));
    } catch (e) {
      console.error(e);
      alert('Failed to post answer.');
    }
  };

  useEffect(() => {
    const qBlog = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(qBlog, async (snap) => {
      const posts = snap.docs.map(d => ({ id: d.id, ...d.data(), answers: [] as any[] }));
      // Filter only questions
      const userQuestions = posts.filter((p: any) => p.type === 'question');
      
      // Fetch answers for user questions
      for (const q of userQuestions) {
        const ansSnap = await getDocs(collection(db, `blog_posts/${q.id}/answers`));
        q.answers = ansSnap.docs.map(a => ({ id: a.id, ...a.data() }));
      }
      setQuestions([...userQuestions, ...DEFAULT_QNA.map(q => ({...q, isStatic: true}))]);
    });
    return () => unsub();
  }, []);

  const handleAskQuestion = async () => {
    if (!askTitle.trim() || !askContent.trim()) return;
    try {
      await addDoc(collection(db, 'blog_posts'), {
        type: 'question',
        title: askTitle,
        content: askContent,
        category: 'Q&A',
        authorName: 'Anonymous', // Or fetch from auth if needed
        createdAt: serverTimestamp()
      });
      setAskTitle('');
      setAskContent('');
      setIsAsking(false);
      alert('Question submitted successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to submit question.');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredInformation = LEGAL_ARTICLES.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStatutes = STATUTES.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.act.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQuestions = questions.filter(q => 
    q.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-[100vh] bg-[#0d1b2a] text-white">
      
      {/* Header Area */}
      <section className="px-6 pt-12 pb-8 text-center space-y-4">
        <h3 className="text-[11px] font-black tracking-[0.3em] text-zinc-400 uppercase">
          Public Archives
        </h3>
        <h1 className="text-5xl font-serif font-bold italic tracking-tight leading-none text-white">
          Legal <br /> Knowledge <br /> <span className="bg-gradient-to-r from-zinc-300 to-zinc-500 bg-clip-text text-transparent">Base</span>
        </h1>
        <p className="text-[15px] font-serif italic text-white/70 leading-relaxed max-w-[320px] mx-auto mt-6">
          "Factual legal information and awareness points to help citizens understand procedures in West Bengal. These are for educational purposes only."
        </p>
      </section>

      {/* Tabs & Search container */}
      <div className="px-5 sticky top-0 z-20 pb-4 bg-[#0d1b2a]">
        <div className="bg-[#1f2c41] p-1.5 rounded-[2rem] flex justify-between mb-5 border border-white/5">
          <button 
            onClick={() => setActiveTab('information')}
            className={`flex-1 py-3 rounded-[1.5rem] text-[10px] uppercase font-black tracking-[0.2em] transition-all ${
              activeTab === 'information' 
              ? 'bg-[#0d1b2a] text-white shadow-lg' 
              : 'text-white/50 hover:text-white'
            }`}
          >
            Information
          </button>
          <button 
            onClick={() => setActiveTab('statutes')}
            className={`flex-1 py-3 rounded-[1.5rem] text-[10px] uppercase font-black tracking-[0.2em] transition-all ${
              activeTab === 'statutes' 
              ? 'bg-[#0d1b2a] text-white shadow-lg' 
              : 'text-white/50 hover:text-white'
            }`}
          >
            Statutes
          </button>
          <button 
            onClick={() => setActiveTab('qna')}
            className={`flex-1 py-3 rounded-[1.5rem] text-[10px] uppercase font-black tracking-[0.2em] transition-all ${
              activeTab === 'qna' 
              ? 'bg-[#0d1b2a] text-white shadow-lg' 
              : 'text-white/50 hover:text-white'
            }`}
          >
            Q & A
          </button>
        </div>

        <div className="relative bg-[#1f2c41] rounded-[1.5rem] border border-white/10 flex items-center px-5 h-14">
          <Search className="text-white/50 w-5 h-5 shrink-0" />
          <input 
            className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/40 px-3 text-[15px]" 
            placeholder="Search legal topics..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-5 pb-32 space-y-4">
        
        {activeTab === 'information' && (
          <div className="bg-[#1f2c41] rounded-[2.5rem] p-6 border border-white/5 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-white/10 p-3 rounded-2xl shrink-0">
                <FileText className="w-6 h-6 text-[#7ca9f4]" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-white tracking-tight">Comprehensive Legal Archive</h2>
                <p className="text-xs text-white/60 italic font-serif mt-1">Explore verified legal precedents and procedural points.</p>
              </div>
            </div>

            <div className="space-y-4">
              {filteredInformation.map((item) => {
                const isExpanded = expandedItems.includes(item.id);
                return (
                  <div key={item.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div 
                      className="flex items-center justify-between gap-4 cursor-pointer active:scale-[0.98] transition-transform"
                      onClick={() => toggleExpand(item.id)}
                    >
                      <Badge className="bg-[#2e3e57] text-[#93a5c1] hover:bg-[#2e3e57] border-none px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.2em] font-black shrink-0">
                        {item.category}
                      </Badge>
                      <h4 className="flex-1 text-[15px] font-serif font-bold text-white leading-tight">
                        {item.title}
                      </h4>
                      <ChevronDown className={`w-5 h-5 text-white/50 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                    {isExpanded && (
                      <div className="mt-4 pl-4 border-l-2 border-slate-500/50 py-1">
                        <p className="text-[14px] text-white/80 font-serif italic leading-relaxed">
                          {item.content}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredInformation.length === 0 && (
                <div className="text-center py-10 text-white/50 text-sm italic">No matching procedures found.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'statutes' && (
          <div className="space-y-4 border-t border-transparent">
            {filteredStatutes.map((statute, index) => (
              <Card key={statute.id} className={`bg-gradient-to-br ${CARD_COLORS[(index + 3) % CARD_COLORS.length]} border border-white/5 shadow-xl rounded-[2rem] overflow-hidden`}>
                <CardContent className="p-6 md:p-8 relative">
                  <div className="absolute top-6 right-6">
                    <Scale className="w-8 h-8 text-white/5" strokeWidth={1} />
                  </div>
                  <Badge className="bg-[#0f172a]/60 text-zinc-300 border border-[#581c87]/30 px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.2em] font-black mb-4 inline-block shadow-sm">
                    {statute.act}
                  </Badge>
                  <h3 className="text-3xl font-serif font-bold italic text-white mb-2 leading-none">
                    {statute.title}
                  </h3>
                  <p className="text-white/70 text-[14px] font-serif italic mb-6 max-w-[90%]">
                    {statute.subtitle}
                  </p>
                  
                  <div className="bg-[#0f172a]/40 p-5 rounded-2xl border-l-4 border-zinc-500/50 shadow-inner">
                    <p className="text-[14px] text-white/90 font-serif italic leading-relaxed">
                      {statute.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredStatutes.length === 0 && (
              <div className="text-center py-10 text-white/50 text-sm italic">No matching statutes found.</div>
            )}
          </div>
        )}

        {activeTab === 'qna' && (
          <div className="space-y-6">
            <div className="bg-[#1f2c41] rounded-[2rem] p-6 border border-white/5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#0f172a]/80 p-2 rounded-xl border border-white/5 shadow-inner">
                     <HelpCircle className="w-5 h-5 text-zinc-300" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-white tracking-tight">Ask a Legal Question</h2>
                </div>
                <Button variant={isAsking ? 'secondary' : 'default'} onClick={() => setIsAsking(!isAsking)} className={`text-xs transition-all duration-300 ${isAsking ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-900 shadow-[0_0_15px_rgba(228,228,231,0.15)]'}`}>
                  {isAsking ? 'Cancel' : 'Ask Question'}
                </Button>
              </div>

              {isAsking && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                   <Input 
                     placeholder="Question Title (e.g. Property Registration Delay)"
                     value={askTitle}
                     onChange={(e) => setAskTitle(e.target.value)}
                     className="bg-[#0d1b2a] border-white/10 text-white"
                   />
                   <Textarea 
                     placeholder="Describe your legal query in detail..."
                     value={askContent}
                     onChange={(e) => setAskContent(e.target.value)}
                     className="bg-[#0d1b2a] border-white/10 text-white min-h-[120px]"
                   />
                   <Button onClick={handleAskQuestion} className="w-full bg-zinc-200 text-zinc-900 hover:bg-zinc-300 shadow-[0_0_15px_rgba(228,228,231,0.15)] transition-all">
                     Submit Question
                   </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
               {filteredQuestions.map((q, index) => (
                 <Card key={q.id} className={`bg-gradient-to-br ${CARD_COLORS[index % CARD_COLORS.length]} border border-white/5 shadow-xl rounded-[2rem] overflow-hidden`}>
                   <CardContent className="p-6 md:p-8 space-y-4">
                     <div>
                       <Badge className="bg-[#0f172a]/80 text-zinc-300 border border-zinc-700 mb-3 text-[10px] tracking-widest uppercase shadow-sm">
                         {q.category}
                       </Badge>
                       <h3 className="text-xl font-serif font-bold text-white mb-2 leading-tight">
                         {q.title}
                       </h3>
                       <p className="text-white/80 text-[15px] italic font-serif leading-relaxed">
                         "{q.content}"
                       </p>
                       <p className="text-[10px] text-white/50 mt-3 uppercase tracking-widest">
                         Asked by {q.authorName || 'Anonymous'} {q.createdAt?.toDate ? `• ${q.createdAt.toDate().toLocaleDateString()}` : ''}
                       </p>
                     </div>

                     {q.answers && q.answers.length > 0 && (
                       <div className="bg-[#0f172a]/60 p-5 rounded-2xl border-l-2 border-zinc-500 mt-4 space-y-4 shadow-inner">
                         <h4 className="text-[10px] uppercase tracking-widest text-zinc-400 font-black flex items-center gap-2">
                           <MessageSquare className="w-3 h-3" />
                           Official Answers
                         </h4>
                         {q.answers.map((ans: any) => (
                           <div key={ans.id} className="space-y-2 relative">
                             <p className="text-[14px] text-white/90 leading-relaxed font-serif italic">
                               "{ans.text}"
                             </p>
                             <p className="text-[10px] text-zinc-400 block font-bold tracking-widest uppercase">
                               — {ans.author}
                             </p>
                           </div>
                         ))}
                       </div>
                     )}

                     {isResponder && !q.isStatic && (
                       <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                         <Textarea 
                           placeholder="Type your authoritative answer here..." 
                           value={replyText[q.id] || ''}
                           onChange={(e) => setReplyText(prev => ({ ...prev, [q.id]: e.target.value }))}
                           className="bg-black/20 border-white/10 text-white min-h-[80px]"
                         />
                         <Button 
                           onClick={() => handlePostAnswer(q.id)}
                           className="text-xs bg-zinc-200 text-zinc-900 hover:bg-zinc-300 transition-all font-bold tracking-widest uppercase rounded-xl"
                         >
                           Post Answer as {responderName}
                         </Button>
                       </div>
                     )}
                   </CardContent>
                 </Card>
               ))}
               {filteredQuestions.length === 0 && (
                 <div className="text-center py-10 text-white/50 text-sm italic">No matching questions found.</div>
               )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
