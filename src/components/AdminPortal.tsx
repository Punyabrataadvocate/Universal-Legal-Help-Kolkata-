import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Shield, Trash2, CheckCircle, XCircle, Mail, MessageSquare, FileText, Reply } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function AdminPortal({ userEmail }: { userEmail: string }) {
  const [activeTab, setActiveTab] = useState<'queries' | 'advocates' | 'directory' | 'blog'>('queries');
  
  const [queries, setQueries] = useState<any[]>([]);
  const [advocates, setAdvocates] = useState<any[]>([]);
  const [publicAdvocates, setPublicAdvocates] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  useEffect(() => {
    // 1. Queries
    const qQueries = query(collection(db, 'user_queries'), orderBy('createdAt', 'desc'));
    const unsubQueries = onSnapshot(qQueries, snap => {
      setQueries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 2. Advocate Registrations
    const qAdv = query(collection(db, 'advocate_registrations'), orderBy('createdAt', 'desc'));
    const unsubAdv = onSnapshot(qAdv, snap => {
      setAdvocates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Public Directory
    const qPubAdv = query(collection(db, 'public_advocates'));
    const unsubPubAdv = onSnapshot(qPubAdv, snap => {
      setPublicAdvocates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 3. Blog Questions (Let's assume "blog_posts" collection has type="question" and "answer")
    const qBlog = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
    const unsubBlog = onSnapshot(qBlog, async snap => {
      const posts = snap.docs.map(d => ({ id: d.id, ...d.data(), answers: [] as any[] }))
        .filter((post: any) => post.type === 'question');

      for (const q of posts) {
        const ansSnap = await getDocs(collection(db, `blog_posts/${q.id}/answers`));
        q.answers = ansSnap.docs.map(a => ({ id: a.id, ...a.data() }));
      }
      setBlogPosts(posts);
    });

    return () => {
      unsubQueries();
      unsubAdv();
      unsubPubAdv();
      unsubBlog();
    };
  }, []);

  const handleUpdateAdvocate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'advocate_registrations', id), { status });
    } catch (e) {
      console.error("Error updating advocate:", e);
      alert(`Failed to update status. Error: ${e instanceof Error ? e.message : 'Unknown'}`);
    }
  };

  const publishToPublicAdvocates = async (advocate: any) => {
    try {
      if (advocate.status !== 'approved') return;
      // Copy to public_advocates
      await addDoc(collection(db, 'public_advocates'), {
        fullName: advocate.fullName,
        experienceYears: advocate.experienceYears,
        courtOfPractice: advocate.courtOfPractice,
        specialization: advocate.specialization,
        enrollmentNumber: advocate.enrollmentNumber,
        barCouncil: advocate.barCouncil,
        createdAt: serverTimestamp(),
      });
      alert('Advocate published to Directory!');
    } catch (e) {
      console.error(e);
      alert('Failed to publish');
    }
  };

  const handleApproveAdvocate = async (advocate: any) => {
     await handleUpdateAdvocate(advocate.id, 'approved');
     // Auto publish without confirm
     await publishToPublicAdvocates({ ...advocate, status: 'approved' });
  };

  const handleDeleteQuery = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'user_queries', id));
    } catch (e) {
      console.error("Error deleting query:", e);
      alert(`Failed to delete query. Error: ${e instanceof Error ? e.message : 'Unknown'}`);
    }
  };

  const handleDeletePublicAdvocate = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'public_advocates', id));
    } catch (e) {
      console.error("Error removing public advocate:", e);
      alert(`Failed to remove public advocate. Error: ${e instanceof Error ? e.message : 'Unknown'}`);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blog_posts', id));
    } catch (e) {
      console.error("Error deleting blog post:", e);
      alert(`Failed to delete blog post. Error: ${e instanceof Error ? e.message : 'Unknown'}`);
    }
  };

  const handleDeleteBlogAnswer = async (postId: string, answerId: string) => {
    try {
      await deleteDoc(doc(db, `blog_posts/${postId}/answers`, answerId));
      // Refresh local state without waiting for full poll
      setBlogPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, answers: p.answers.filter((a: any) => a.id !== answerId) };
        }
        return p;
      }));
    } catch (e) {
      console.error("Error deleting answer:", e);
      alert(`Failed to delete answer. Error: ${e instanceof Error ? e.message : 'Unknown'}`);
    }
  };

  const handlePostAnswer = async (postId: string) => {
    const answer = replyText[postId];
    if (!answer?.trim()) return;
    try {
      await addDoc(collection(db, `blog_posts/${postId}/answers`), {
        text: answer,
        author: 'Admin | Legal Help Kolkata',
        createdAt: serverTimestamp()
      });
      setReplyText(prev => ({ ...prev, [postId]: '' }));
    } catch (e) {
      console.error(e);
      alert('Failed to post answer.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <Card className="border-0 shadow-2xl rounded-[2rem] overflow-hidden bg-white">
        <CardHeader className="bg-[#0f172a] text-white p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-gold" />
              <div>
                <CardTitle className="text-2xl font-serif">Admin Portal</CardTitle>
                <p className="text-gray-400 text-sm mt-1">{userEmail}</p>
              </div>
            </div>
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => signOut(auth)}>
               Sign Out
            </Button>
          </div>
        </CardHeader>
        
        <div className="flex border-b">
          <button 
            className={`flex-1 py-4 font-bold text-sm text-center border-b-2 transition-all ${activeTab === 'queries' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('queries')}
          >
            <Mail className="w-4 h-4 mx-auto mb-1" />
            User Queries
          </button>
          <button 
            className={`flex-1 py-4 font-bold text-sm text-center border-b-2 transition-all ${activeTab === 'advocates' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('advocates')}
          >
            <CheckCircle className="w-4 h-4 mx-auto mb-1" />
            Registrations
          </button>
          <button 
            className={`flex-1 py-4 font-bold text-sm text-center border-b-2 transition-all ${activeTab === 'directory' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('directory')}
          >
            <CheckCircle className="w-4 h-4 mx-auto mb-1" />
            Public Directory
          </button>
          <button 
            className={`flex-1 py-4 font-bold text-sm text-center border-b-2 transition-all ${activeTab === 'blog' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('blog')}
          >
            <MessageSquare className="w-4 h-4 mx-auto mb-1" />
            Blog Moderation
          </button>
        </div>

        <CardContent className="p-0">
          
          {/* QUERIES TAB */}
          {activeTab === 'queries' && (
            <div className="p-6 space-y-4">
              {queries.length === 0 ? <p className="text-gray-500 text-center py-10">No user queries found.</p> : null}
              {queries.map(q => (
                <div key={q.id} className="bg-gray-50 border rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg">{q.fullName}</h4>
                      <p className="text-xs text-gray-500">{q.phone} • {q.email} • {q.district}</p>
                    </div>
                    <Badge variant="outline" className="bg-white">{q.category}</Badge>
                  </div>
                  <p className="text-gray-700 bg-white p-4 rounded-xl border border-gray-100 italic">"{q.description}"</p>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-gray-400">
                      {q.createdAt?.toDate ? q.createdAt.toDate().toLocaleString() : 'New'}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteQuery(q.id)} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ADVOCATES TAB */}
          {activeTab === 'advocates' && (
            <div className="p-6 space-y-4">
              {advocates.length === 0 ? <p className="text-gray-500 text-center py-10">No advocate registrations found.</p> : null}
              {advocates.map(adv => (
                <div key={adv.id} className="bg-white border shadow-sm rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-start border-b pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xl font-serif">{adv.fullName}</h4>
                        <Badge className={
                          adv.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          adv.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }>{adv.status.toUpperCase()}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{adv.email} • {adv.phone}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong className="text-gray-500 block text-xs mb-1">Enrollment No.</strong>{adv.enrollmentNumber}</div>
                    <div><strong className="text-gray-500 block text-xs mb-1">Bar Council</strong>{adv.barCouncil}</div>
                    <div><strong className="text-gray-500 block text-xs mb-1">Experience</strong>{adv.experienceYears} Years</div>
                    <div><strong className="text-gray-500 block text-xs mb-1">Court</strong>{adv.courtOfPractice}</div>
                  </div>

                  <div className="pt-2">
                    <strong className="text-gray-500 block text-xs mb-2">Specializations</strong>
                    <div className="flex flex-wrap gap-2">
                      {adv.specialization?.map((spec: string, i: number) => (
                        <Badge key={i} variant="secondary" className="bg-gray-100">{spec}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    {adv.status !== 'approved' && (
                      <Button onClick={() => handleApproveAdvocate(adv)} className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                      </Button>
                    )}
                    {adv.status !== 'rejected' && (
                      <Button onClick={() => handleUpdateAdvocate(adv.id, 'rejected')} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DIRECTORY TAB */}
          {activeTab === 'directory' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                 <p className="text-gray-500">Manage advocates that are visible in the public directory.</p>
              </div>
              {publicAdvocates.length === 0 ? <p className="text-gray-500 text-center py-10">No advocates in public directory.</p> : null}
              {publicAdvocates.map(adv => (
                <div key={adv.id} className="bg-white border shadow-sm rounded-2xl p-6 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-xl font-serif">{adv.fullName}</h4>
                    <p className="text-sm text-gray-500 mt-1">{adv.enrollmentNumber} • {adv.barCouncil}</p>
                    <div className="flex gap-2 mt-2">
                       {adv.specialization?.slice(0, 3).map((spec: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">{spec}</Badge>
                       ))}
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => handleDeletePublicAdvocate(adv.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" /> Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* BLOG MODERATION */}
          {activeTab === 'blog' && (
             <div className="p-6 space-y-4">
                <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">Here you can moderate user questions on the Free Legal Blog and post official answers.</p>
                {blogPosts.length === 0 ? <p className="text-gray-500 text-center py-10">No blog posts found.</p> : null}
                {blogPosts.map(post => (
                  <div key={post.id} className="bg-white border rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                       <div>
                          <Badge variant="outline" className="mb-2">{post.category || 'General'}</Badge>
                          <h4 className="font-bold text-lg">{post.title}</h4>
                          <p className="text-xs text-gray-400 mt-1">Asked by {post.authorName || 'Anonymous'} • {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : 'New'}</p>
                       </div>
                       <Button variant="ghost" size="icon" onClick={() => handleDeleteBlog(post.id)} className="text-red-400 hover:text-red-500 hover:bg-red-50">
                         <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 italic">"{post.content}"</p>
                    
                    <div className="space-y-2 pt-2 border-t mt-4">
                      <Label className="text-xs font-bold text-gray-500 uppercase flex items-center"><Reply className="w-3 h-3 mr-1"/> Post Official Answer</Label>
                      <Textarea 
                         placeholder="Type Admin response..." 
                         value={replyText[post.id] || ''}
                         onChange={(e) => setReplyText({ ...replyText, [post.id]: e.target.value })}
                         className="bg-gray-50 border-gray-200"
                      />
                      <Button onClick={() => handlePostAnswer(post.id)} size="sm" className="bg-primary text-white">
                         Post Answer as Admin
                      </Button>
                    </div>

                    {/* Render subcollection of answers. Note: For simplicity, admin might want to view existing answers here. The `blog_posts` would need real answers fetch subcollection, but for now we just show capability to post. */}
                    {post.answers && post.answers.length > 0 && (
                      <div className="mt-4 space-y-4 border-l-2 border-gray-200 pl-4">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Existing Answers</Label>
                        {post.answers.map((ans: any) => (
                           <div key={ans.id} className="bg-gray-50 p-3 rounded-xl flex justify-between items-start">
                             <div>
                               <p className="text-sm italic">"{ans.text}"</p>
                               <p className="text-xs text-gray-400 mt-1">— {ans.author}</p>
                             </div>
                             <Button variant="ghost" size="icon" onClick={() => handleDeleteBlogAnswer(post.id, ans.id)} className="text-red-400 hover:text-red-500 hover:bg-red-50 shrink-0">
                               <Trash2 className="w-4 h-4" />
                             </Button>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
             </div>
          )}
          
        </CardContent>
      </Card>
    </div>
  );
}
