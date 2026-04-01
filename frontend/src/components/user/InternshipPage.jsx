import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  GraduationCap, Search, Users, TrendingUp, CheckCircle,
  Clock, Mail, Phone, ChevronDown, Building2, Code2, Briefcase,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { toast } from 'sonner';
import { API } from '@/config/api';

const chartData = [
  { name: 'Jan', applications: 12, accepted: 5 },
  { name: 'Feb', applications: 28, accepted: 12 },
  { name: 'Mar', applications: 45, accepted: 22 },
  { name: 'Apr', applications: 38, accepted: 18 },
  { name: 'May', applications: 52, accepted: 32 },
  { name: 'Jun', applications: 65, accepted: 38 },
];

const f = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d, ease: [0.23, 1, 0.32, 1] }
});

const InternshipView = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axios.get(`${API.internship}/my`, { withCredentials: true })
      .then(r => setApplications(r.data.data || []))
      .catch(() => toast.error('Failed to fetch internship applications'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = applications.filter(a => {
    const matchSearch =
      a.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.category?.toLowerCase().includes(search.toLowerCase()) ||
      a.college?.toLowerCase().includes(search.toLowerCase());
    if (statusFilter !== 'all') return matchSearch && a.status === statusFilter;
    return matchSearch;
  });

  const accepted  = applications.filter(a => a.status === 'accepted').length;
  const pending   = applications.filter(a => a.status === 'pending').length;
  const rejected  = applications.filter(a => a.status === 'rejected').length;
  const categories = new Set(applications.map(a => a.category)).size;

  const statusChartData = [
    { name: 'Accepted', value: accepted, fill: '#10b981' },
    { name: 'Pending', value: pending, fill: '#f59e0b' },
    { name: 'Rejected', value: rejected, fill: '#ef4444' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600" />
    </div>
  );
  const f = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d, ease: [0.23, 1, 0.32, 1] }
})

  const STATUS_STYLES = {
    pending:  { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
    accepted: { bg: 'rgba(16,185,129,0.1)', text: '#10b981', border: 'rgba(16,185,129,0.2)' },
    rejected: { bg: 'rgba(239,68,68,0.1)',  text: '#ef4444', border: 'rgba(239,68,68,0.2)' },
  };

  return (
    <div className="min-h-screen p-5 sm:p-8 space-y-7"
      style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)' }}>

      <motion.div {...f(0)} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Internship Applications</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Track your internship applications.</p>
        </div>

      </motion.div>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} {...f(0.05)}
        className="rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg,rgba(14,165,233,0.2) 0%,rgba(79,70,229,0.2) 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="p-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', boxShadow: '0 0 20px rgba(14,165,233,0.4)' }}>
              <GraduationCap className="h-9 w-9 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">Internship Applications</h1>
              <p className="text-blue-300">View and track your applications</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(14,165,233,0.2)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.3)' }}>
                  {applications.length} Total
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
                  {accepted} Accepted
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>
                  {pending} Pending
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                  {rejected} Rejected
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: 'Total', value: applications.length, icon: GraduationCap, color: '#0ea5e9', glow: 'rgba(14,165,233,0.4)' },
          { title: 'Accepted', value: accepted, icon: CheckCircle, color: '#10b981', glow: 'rgba(16,185,129,0.4)' },
          { title: 'Pending', value: pending, icon: Clock, color: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
          { title: 'Rejected', value: rejected, icon: Code2, color: '#ef4444', glow: 'rgba(239,68,68,0.4)' },
          { title: 'Categories', value: categories, icon: Briefcase, color: '#8b5cf6', glow: 'rgba(139,92,246,0.4)' },
        ].map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + 0.04 * i }} whileHover={{ y: -4, scale: 1.02 }}
            className="rounded-2xl p-4 relative overflow-hidden"
            style={{ background: `${c.color}12`, border: `1px solid ${c.color}25` }}>
            <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle,${c.glow},transparent 70%)` }} />
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${c.color}20`, boxShadow: `0 0 12px ${c.glow}` }}>
              <c.icon size={18} style={{ color: c.color }} />
            </div>
            <p className="text-2xl font-black text-white">{c.value}</p>
            <p className="text-xs font-bold mt-0.5" style={{ color: c.color }}>{c.title}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">Applications Trend</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#0ea5e9' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Applied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Accepted</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAccepted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
              <Area type="monotone" dataKey="applications" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorApplied)" />
              <Area type="monotone" dataKey="accepted" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAccepted)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="font-bold text-white text-sm mb-4">Application Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {statusChartData.map((entry, index) => (
                  <rect key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Search + Filter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <Input className="h-12 rounded-xl text-sm"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            placeholder="Search by name, email, category..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'accepted', 'rejected'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border capitalize ${
                statusFilter === s
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
              }`}>
              {s === 'all' ? `All (${applications.length})` : `${s} (${applications.filter(a => a.status === s).length})`}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Cards */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-4">
        {filtered.map((a, i) => {
            const st = STATUS_STYLES[a.status] || STATUS_STYLES.pending;
            return (
          <motion.div key={a._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * i }}>
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="h-1" style={{ background: 'linear-gradient(90deg,#0ea5e9,#6366f1)' }} />
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  {/* Left: Avatar + Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', boxShadow: '0 0 12px rgba(14,165,233,0.4)' }}>
                      <span className="text-white font-black text-lg">{a.fullName?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-white text-lg">{a.fullName}</h3>
                        <span className="text-xs font-bold px-2 py-1 rounded-lg capitalize"
                          style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                          {a.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}><Mail className="w-3 h-3" />{a.email}</span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}><Phone className="w-3 h-3" />{a.phone}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs font-bold px-2 py-1 rounded-lg"
                          style={{ background: 'rgba(14,165,233,0.15)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.25)' }}>
                          {a.category}
                        </span>
                        {a.college && <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>{a.college}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Right: Toggle Detail */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button size="sm"
                      className="h-9 px-4 flex gap-2 items-center"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
                      onClick={() => setExpanded(expanded === a._id ? null : a._id)}>
                      <span className="text-xs font-bold">Details</span>
                      <motion.div animate={{ rotate: expanded === a._id ? 180 : 0 }}>
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expanded === a._id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="overflow-hidden">
                      <div className="mt-5 pt-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }} space-y-4>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Personal & Academic</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[['Gender', a.gender], ['Phone', a.phone], ['Course', a.course], ['Year', a.year]].map(([l, v]) => v && (
                            <div key={l} className="p-3 rounded-xl" style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}>
                              <p className="text-xs font-bold mb-0.5" style={{ color: '#38bdf8' }}>{l}</p>
                              <p className="text-sm text-white font-medium">{v}</p>
                            </div>
                          ))}
                        </div>

                        {a.linkedin && (
                          <div className="p-3 rounded-xl" style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}>
                            <p className="text-xs font-bold mb-0.5" style={{ color: '#38bdf8' }}>LinkedIn</p>
                            <a href={a.linkedin} target="_blank" rel="noreferrer" className="text-sm text-white hover:underline truncate block">{a.linkedin}</a>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                            <p className="text-xs font-bold mb-0.5" style={{ color: '#fbbf24' }}>Applied On</p>
                            <p className="text-sm text-white font-medium">{new Date(a.createdAt).toLocaleDateString()}</p>
                          </div>
                          {a.message && (
                            <div className="p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                              <p className="text-xs font-bold mb-0.5" style={{ color: '#a78bfa' }}>Message</p>
                              <p className="text-sm text-white">{a.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );})}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem' }}>
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(14,165,233,0.15)', border: '2px dashed rgba(14,165,233,0.3)' }}>
            <GraduationCap size={36} style={{ color: 'rgba(14,165,233,0.5)' }} />
          </div>
          <h3 className="text-xl font-black text-white mb-2">No applications found</h3>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Try adjusting your filters or search terms</p>
        </motion.div>
      )}

      {filtered.length > 0 && (
        <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Showing <span className="font-bold text-white">{filtered.length}</span> of{' '}
          <span className="font-bold text-white">{applications.length}</span> applications
        </p>
      )}
    </div>
  );
};

export default InternshipView;