import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Booking, BookingStatus, Post } from '../types';
import { LogIn, LogOut, Download, PieChart as PieIcon, List, CheckCircle, Clock as ClockIcon, TrendingUp, MapPin, FileText, Plus, X, Save, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { cn } from '../lib/utils';

type ViewType = 'list' | 'stats' | 'blog';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>('list');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);

  // Hardcoded initial admin for demo. In production, check Firestore 'admins' collection.
  const ADMIN_EMAIL = '31choichoi@gmail.com'; 

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      console.log("Auth state changed:", u?.email);
      setUser(u);
      if (u && u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setIsAdmin(true);
        setAuthError(null);
      } else if (u) {
        setIsAdmin(false);
        setAuthError(`Email ${u.email} is not authorized as admin.`);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      const qBookings = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const unsubBookings = onSnapshot(qBookings, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
        setBookings(data);
      });

      const qPosts = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const unsubPosts = onSnapshot(qPosts, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        setPosts(data);
      });

      return () => {
        unsubBookings();
        unsubPosts();
      };
    }
  }, [isAdmin]);

  const handleLogin = async () => {
    setLoginLoading(true);
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      // Force local persistence for iframe environments
      const { setPersistence, browserLocalPersistence } = await import('firebase/auth');
      await setPersistence(auth, browserLocalPersistence);
      
      const result = await signInWithPopup(auth, provider);
      console.log("Login success:", result.user.email);
    } catch (err: any) {
      console.error("Login Error Details:", err);
      if (err.code === 'auth/popup-blocked') {
        setAuthError("Popup was blocked by your browser. Please allow popups for this site.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setAuthError("This domain is not authorized for Firebase Auth. Please check Firebase Console Settings.");
      } else {
        setAuthError(err.message || "An unexpected error occurred during login.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    await updateDoc(doc(db, 'bookings', id), { status: newStatus });
  };

  const handleDeleteBooking = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      await deleteDoc(doc(db, 'bookings', id));
    }
  };

  // Blog Logic
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.content) return;

    try {
      const postData = {
        ...editingPost,
        updatedAt: new Date().toISOString(),
      };

      if (editingPost.id) {
        const { id, ...data } = postData;
        await updateDoc(doc(db, 'posts', id!), data);
      } else {
        await addDoc(collection(db, 'posts'), {
          ...postData,
          authorId: user?.uid,
          createdAt: new Date().toISOString(),
          tags: editingPost.tags || [],
          published: editingPost.published ?? false,
          category: editingPost.category || 'Interior',
          excerpt: editingPost.excerpt || editingPost.content.substring(0, 100) + '...',
          thumbnailUrl: editingPost.thumbnailUrl || ''
        });
      }
      setIsPostModalOpen(false);
      setEditingPost(null);
    } catch (err) {
      console.error("Error saving post:", err);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deleteDoc(doc(db, 'posts', id));
    }
  };

  const togglePublished = async (post: Post) => {
    await updateDoc(doc(db, 'posts', post.id!), { published: !post.published });
  };

  const downloadCSV = () => {
    const headers = ['Name', 'Contact', 'Region', 'Address', 'Size', 'Budget', 'Date', 'Time', 'Status'];
    const rows = bookings.map(b => [
      b.clientName,
      b.contact,
      b.region,
      b.address,
      b.size,
      b.budget,
      format(new Date(b.date), 'yyyy-MM-dd'),
      b.time,
      b.status
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bookings_${format(new Date(), 'yyyyMMdd')}.csv`;
    link.click();
  };

  // Stats Logic
  const regionStats = bookings.reduce((acc: Record<string, number>, b) => {
    acc[b.region] = (acc[b.region] || 0) + 1;
    return acc;
  }, {});
  
  const pieData = Object.entries(regionStats).map(([name, value]) => ({ name, value: value as number }));
  const COLORS = ['#0F172A', '#B48C5E', '#475569', '#94A3B8'];

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!user || !isAdmin) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-100 px-6 text-center">
        <div className="bg-white p-12 shadow-2xl rounded-3xl max-w-md w-full">
          <div className="mb-8">
             <span className="text-4xl font-serif font-black tracking-tighter">MID</span>
             <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-2">Admin Control Panel</p>
          </div>
          <h2 className="text-2xl font-bold mb-6">Restricted Access</h2>
          <p className="text-slate-500 mb-8 font-light">Please sign in with your authorized Google account to access the dashboard.</p>
          
          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold">
              {authError}
            </div>
          )}

          <button 
            onClick={handleLogin}
            disabled={loginLoading}
            className={cn(
              "w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center space-x-3 transition-all",
              loginLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-slate-800"
            )}
          >
            {loginLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn size={20} />
            )}
            <span>{loginLoading ? 'Connecting...' : 'Login with Google'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manager Dashboard</h1>
            <p className="text-slate-500 font-light flex items-center">
              Welcome back, {user.displayName} <span className="mx-2">•</span> 
              <button onClick={() => signOut(auth)} className="text-red-400 hover:underline flex items-center">
                <LogOut size={14} className="mr-1" /> Logout
              </button>
            </p>
          </div>
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
             <button 
              onClick={() => setView('list')}
              className={cn("px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2", view === 'list' && "bg-slate-950 text-white shadow-md")}
             >
                <List size={14} /> <span>Bookings</span>
             </button>
             <button 
              onClick={() => setView('blog')}
              className={cn("px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2", view === 'blog' && "bg-slate-950 text-white shadow-md")}
             >
                <FileText size={14} /> <span>Journal</span>
             </button>
             <button 
              onClick={() => setView('stats')}
              className={cn("px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2", view === 'stats' && "bg-slate-950 text-white shadow-md")}
             >
                <PieIcon size={14} /> <span>Statistics</span>
             </button>
          </div>
        </div>

        {view === 'list' && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Total Requests', value: bookings.length, icon: <List className="text-brand-gold" /> },
                { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: <ClockIcon className="text-amber-400" /> },
                { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, icon: <CheckCircle className="text-emerald-400" /> },
                { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, icon: <TrendingUp className="text-blue-400" /> },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">{stat.label}</p>
                    <p className="text-3xl font-serif font-black">{stat.value}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">{stat.icon}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">Booking Details</h2>
                <button 
                  onClick={downloadCSV}
                  className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Download size={14} /> <span>Download CSV</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                    <tr>
                      <th className="px-8 py-5">Client</th>
                      <th className="px-8 py-5">Region/Address</th>
                      <th className="px-8 py-5">Schedule</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-800">{booking.clientName}</div>
                          <div className="text-xs text-slate-400 mt-1">{booking.contact}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center text-xs font-semibold text-slate-600 mb-1">
                            <MapPin size={12} className="mr-1 text-slate-300" /> {booking.region}
                          </div>
                          <div className="text-xs text-slate-400 font-light truncate max-w-[200px]">{booking.address}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-sm font-bold text-slate-700">{format(new Date(booking.date), 'MMM dd, yyyy')}</div>
                          <div className="text-xs text-slate-400">{booking.time}</div>
                        </td>
                        <td className="px-8 py-6">
                          <select 
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id!, e.target.value as BookingStatus)}
                            className={cn(
                              "px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border-none outline-none appearance-none cursor-pointer",
                              booking.status === 'pending' && "bg-amber-100 text-amber-700",
                              booking.status === 'confirmed' && "bg-emerald-100 text-emerald-700",
                              booking.status === 'completed' && "bg-blue-100 text-blue-700",
                              booking.status === 'contract_in_progress' && "bg-purple-100 text-purple-700",
                            )}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="contract_in_progress">Contract In Progress</option>
                          </select>
                        </td>
                        <td className="px-8 py-6">
                           <button 
                            onClick={() => handleDeleteBooking(booking.id!)}
                            className="text-xs font-bold text-red-300 hover:text-red-500 transition-colors"
                           >
                             Delete
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bookings.length === 0 && (
                  <div className="text-center py-20 text-slate-300 font-light italic">No bookings found.</div>
                )}
              </div>
            </div>
          </>
        )}

        {view === 'blog' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">MID Journal Posts</h2>
                <button 
                  onClick={() => {
                    setEditingPost({});
                    setIsPostModalOpen(true);
                  }}
                  className="flex items-center space-x-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-brand-gold transition-colors"
                >
                  <Plus size={16} /> <span>New Post</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                    <tr>
                      <th className="px-8 py-5">Post</th>
                      <th className="px-8 py-5">Category</th>
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-800">{post.title}</div>
                          <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{post.tags.join(', ')}</div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-xs font-semibold text-slate-500">{post.category}</span>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-xs text-slate-400">{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                        </td>
                        <td className="px-8 py-6">
                           <button 
                            onClick={() => togglePublished(post)}
                            className={cn(
                              "flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                              post.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                            )}
                           >
                             {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                             <span>{post.published ? 'Published' : 'Draft'}</span>
                           </button>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center space-x-4">
                              <button 
                                onClick={() => {
                                  setEditingPost(post);
                                  setIsPostModalOpen(true);
                                }}
                                className="text-slate-400 hover:text-blue-500 transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeletePost(post.id!)}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        )}

        {view === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-8">Requests by Region</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {pieData.map((item, i) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{item.name}</span>
                    <span className="text-xs font-black">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-8">Inquiry Volume</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pieData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill="#0F172A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {isPostModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPostModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 md:p-12"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{editingPost?.id ? 'Edit Post' : 'New Post'}</h2>
                <button onClick={() => setIsPostModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSavePost} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Title</label>
                    <input 
                      type="text" 
                      required
                      value={editingPost?.title || ''}
                      onChange={(e) => setEditingPost(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-gold outline-none transition-all"
                      placeholder="Post title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Category</label>
                    <input 
                      type="text" 
                      value={editingPost?.category || ''}
                      onChange={(e) => setEditingPost(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-gold outline-none transition-all"
                      placeholder="e.g. Interior, Design"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Thumbnail URL</label>
                  <input 
                    type="url" 
                    value={editingPost?.thumbnailUrl || ''}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-gold outline-none transition-all"
                    placeholder="https://images..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Content (Markdown)</label>
                  <textarea 
                    required
                    rows={12}
                    value={editingPost?.content || ''}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-gold outline-none transition-all font-mono"
                    placeholder="# Hello World\n\nWrite your story here..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      value={editingPost?.tags?.join(', ') || ''}
                      onChange={(e) => setEditingPost(prev => ({ ...prev, tags: e.target.value.split(',').map(s => s.trim()) }))}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-gold outline-none transition-all"
                      placeholder="Tag1, Tag2"
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div 
                        onClick={() => setEditingPost(prev => ({ ...prev, published: !prev?.published }))}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-colors duration-300",
                          editingPost?.published ? "bg-emerald-500" : "bg-slate-200"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300",
                          editingPost?.published ? "translate-x-6" : "translate-x-0"
                        )} />
                      </div>
                      <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-widest">
                        {editingPost?.published ? 'Publicly Visible' : 'Save as Draft'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 flex justify-end space-x-4">
                  <button 
                    type="button"
                    onClick={() => setIsPostModalOpen(false)}
                    className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-4 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors flex items-center space-x-2"
                  >
                    <Save size={16} /> <span>Save Post</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
