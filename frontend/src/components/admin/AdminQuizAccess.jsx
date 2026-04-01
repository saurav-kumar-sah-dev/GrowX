import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Search, Users, Trophy, TrendingUp, Clock, Mail, Star } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { API } from '@/config/api';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#0D1017",
  surface: "#151820",
  surfaceLight: "#1C1F28",
  card: "#1A1D26",
  cardHover: "#22252F",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
  dim: "#2A2E3A",
};

const AdminQuizAccess = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${API.quizResult}/all`, { withCredentials: true })
      .then(r => setResults(r.data.results || []))
      .catch(() => toast.error('Failed to fetch quiz results'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = results.filter(r =>
    r.user?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
    r.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    r.quiz?.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.quiz?.category?.toLowerCase().includes(search.toLowerCase())
  );

  const avgPercent = results.length
    ? Math.round(results.reduce((s, r) => s + (r.percentage || 0), 0) / results.length)
    : 0;
  const passed = results.filter(r => r.percentage >= 50).length;
  const uniqueUsers = new Set(results.map(r => r.user?._id)).size;

  const getScoreColor = (pct) => {
    if (pct >= 80) return { bg: 'rgba(16,185,129,0.15)', color: '#10b981' };
    if (pct >= 50) return { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' };
    return { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' };
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16" style={{ borderBottomColor: C.gold, borderColor: 'transparent' }} />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${C.gold}, #C8884A)`, border: `1px solid ${C.goldBorder}` }}>
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(30%,-30%)' }} />
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                <Brain className="h-9 w-9 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">Quiz Access</h1>
                <p className="text-white/80">All users who attempted quizzes</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{results.length} Attempts</span>
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{uniqueUsers} Users</span>
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{avgPercent}% Avg Score</span>
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{passed} Passed</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Total Attempts', value: results.length, icon: Brain, color: C.gold },
            { title: 'Unique Users', value: uniqueUsers, icon: Users, color: '#3b82f6' },
            { title: 'Passed (≥50%)', value: passed, icon: Trophy, color: '#10b981' },
            { title: 'Avg Score', value: `${avgPercent}%`, icon: TrendingUp, color: '#f59e0b' },
          ].map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.04 * i }} whileHover={{ y: -4, scale: 1.04 }}>
              <Card className="border shadow-md" style={{ background: C.card, borderColor: C.goldBorder }}>
                <CardContent className="p-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md mb-3" style={{ background: `${c.color}15` }}>
                    <c.icon className="w-4 h-4" style={{ color: c.color }} />
                  </div>
                  <p className="text-xs font-medium mb-1" style={{ color: C.muted }}>{c.title}</p>
                  <p className="text-xl font-black" style={{ color: C.white }}>{c.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: C.muted }} />
            <Input className="pl-12 h-12 border-2 rounded-xl"
              style={{ borderColor: C.goldBorder, background: C.card, color: C.white }}
              placeholder="Search by name, email, quiz..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: C.surface, borderBottom: `1px solid ${C.goldBorder}` }}>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">#</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Quiz</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Category</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Score</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Result</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Time</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody style={{ borderTop: `1px solid ${C.goldBorder}` }}>
                  {filtered.map((r, i) => {
                    const colors = getScoreColor(r.percentage);
                    return (
                      <motion.tr key={r._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        style={{ borderBottom: `1px solid ${C.goldBorder}` }}>
                        <td className="px-6 py-4 text-sm" style={{ color: C.muted }}>{i + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ background: C.goldDim, color: C.gold }}>
                              {r.user?.fullname?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <span className="text-sm font-semibold" style={{ color: C.white }}>{r.user?.fullname || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: C.muted }}>{r.user?.email || '—'}</td>
                        <td className="px-6 py-4 text-sm font-medium" style={{ color: C.white }}>{r.quiz?.title || '—'}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs px-2 py-1 rounded-full" style={{ background: C.goldDim, color: C.gold }}>{r.quiz?.category || '—'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold" style={{ color: colors.color }}>{r.percentage}%</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: colors.bg, color: colors.color }}>
                            {r.percentage >= 50 ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: C.muted }}>{r.timeTaken || '—'}m</td>
                        <td className="px-6 py-4 text-sm" style={{ color: C.muted }}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: C.goldDim }}>
              <Brain size={40} style={{ color: C.gold }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: C.white }}>No quiz results found</h3>
            <p style={{ color: C.muted }}>Try adjusting your search</p>
          </motion.div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminQuizAccess;
