import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { GoogleAuthProvider, signInWithRedirect, signOut, onAuthStateChanged, User, getRedirectResult } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Booking, BookingStatus } from '../types';
import { LogIn, LogOut, Download, PieChart as PieIcon, List, CheckCircle, Clock as ClockIcon, TrendingUp, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { cn } from '../lib/utils';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'stats'>('list');

  // Hardcoded initial admin for demo. In production, check Firestore 'admins' collection.
  const ADMIN_EMAIL = '31choichoi@gmail.com'; 

  useEffect(() => {
    // Check redirect result on mount to handle the login flow
    getRedirectResult(auth).catch((error) => {
      console.error("Auth redirect error:", error);
    });

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && u.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
        setBookings(data);
      });
      return () => unsub();
    }
  }, [isAdmin]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    await updateDoc(doc(db, 'bookings', id), { status: newStatus });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      await deleteDoc(doc(db, 'bookings', id));
    }
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
  const regionStats = bookings.reduce((acc: any, b) => {
    acc[b.region] = (acc[b.region] || 0) + 1;
    return acc;
  }, {});
  
  const pieData = Object.entries(regionStats).map(([name, value]) => ({ name, value }));
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
          {!user ? (
            <button 
              onClick={handleLogin}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center space-x-3 hover:bg-slate-800 transition-all"
            >
              <LogIn size={20} />
              <span>Login with Google</span>
            </button>
          ) : (
            <div className="text-red-500 text-sm mb-4">Unauthorized email: {user.email}</div>
          )}
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
              onClick={() => setView('stats')}
              className={cn("px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2", view === 'stats' && "bg-slate-950 text-white shadow-md")}
             >
                <PieIcon size={14} /> <span>Statistics</span>
             </button>
          </div>
        </div>

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

        {view === 'list' ? (
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
                          onClick={() => handleDelete(booking.id!)}
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
        ) : (
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
    </div>
  );
};

export default Admin;
