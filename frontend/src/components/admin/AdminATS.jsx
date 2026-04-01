import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSearch, Users, TrendingUp, Award, Trash2, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Search, BarChart2, Target, Zap, BookOpen, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { API } from '@/config/api';

const COLORS  = ['#D4A853','#2563eb','#059669','#d97706','#dc2626','#0891b2','#7c3aed'];

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
  goldBorderHover: "rgba(212,168,83,0.3)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
  dim: "#2A2E3A",
};

const ScoreRing = ({ score }) => {
  const color = score >= 75 ? '#059669' : score >= 50 ? '#d97706' : '#dc2626';
  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke={C.dim} strokeWidth="3" />
        <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={`${score} 100`} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-black"
        style={{ color }}>{score}</span>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl shadow-xl p-3 text-xs" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
      {label && <p className="font-bold mb-1" style={{ color: C.white }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const AdminATS = () => {
  const [records,    setRecords]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [expanded,   setExpanded]   = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const res = await axios.get(`${API.ats}/all`, { withCredentials: true });
      setRecords(res.data.records || []);
    } catch { toast.error('Failed to load ATS records'); }
    finally  { setLoading(false); }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setRecords(prev => prev.filter(r => r._id !== id)); // optimistic
    try {
      await axios.delete(`${API.ats}/delete/${id}`, { withCredentials: true });
      toast.success('Record deleted');
    } catch {
      toast.error('Delete failed');
      fetchAll(); // revert
    } finally { setDeletingId(null); }
  };

  const filtered = records.filter(r =>
    r.user?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
    r.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Analytics ──
  const avgScore   = records.length ? Math.round(records.reduce((s, r) => s + r.score, 0) / records.length) : 0;
  const highScores = records.filter(r => r.score >= 75).length;
  const lowScores  = records.filter(r => r.score  < 50).length;

  const scoreRanges = [
    { range: '0-25',  count: records.filter(r => r.score < 25).length,                    fill: '#dc2626' },
    { range: '25-50', count: records.filter(r => r.score >= 25 && r.score < 50).length,   fill: '#f97316' },
    { range: '50-75', count: records.filter(r => r.score >= 50 && r.score < 75).length,   fill: '#d97706' },
    { range: '75-100',count: records.filter(r => r.score >= 75).length,                   fill: '#059669' },
  ];

  const monthlyMap = {};
  records.forEach(r => {
    const m = new Date(r.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
    monthlyMap[m] = (monthlyMap[m] || 0) + 1;
  });
  const monthlyData = Object.entries(monthlyMap).map(([month, count]) => ({ month, count }));

  const userMap = {};
  records.forEach(r => {
    const name = r.user?.fullname || 'Unknown';
    userMap[name] = (userMap[name] || 0) + 1;
  });
  const topUsers = Object.entries(userMap).sort((a,b) => b[1]-a[1]).slice(0,6)
    .map(([name, checks]) => ({ name: name.length > 12 ? name.slice(0,12)+'..' : name, checks }));

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse"
          style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` }}>
          <FileSearch className="w-8 h-8" style={{ color: C.obsidian }} />
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Hero ── */}
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}>
          <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${C.gold}, #C8884A)`, border: `1px solid ${C.goldBorder}` }}>
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(30%,-30%)' }} />
            <div className="relative flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                  style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)' }}>
                  <FileSearch className="w-9 h-9 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white mb-1">ATS Checker Analytics</h1>
                  <p className="text-white/80 text-sm">All user resume analysis records</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background:'rgba(255,255,255,0.2)', color:'#fff' }}>{records.length} Total Checks</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background:'rgba(52,211,153,0.25)', color:'#6ee7b7' }}>Avg Score: {avgScore}</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background:'rgba(251,191,36,0.25)', color:'#fde68a' }}>{highScores} High Scores</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label:'Total Checks',  value: records.length, icon: FileSearch, color: C.gold },
            { label:'Avg ATS Score', value: avgScore+'%',   icon: TrendingUp, color: '#3b82f6' },
            { label:'High Scores',   value: highScores,     icon: Award,      color: '#10b981' },
            { label:'Need Work',     value: lowScores,      icon: Target,     color: '#ef4444' },
          ].map((c, i) => (
            <motion.div key={c.label} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
              transition={{ delay:0.05*i }} whileHover={{ y:-4 }}>
              <Card className="border shadow-lg" style={{ background: C.card, borderColor: C.goldBorder }}>
                <CardContent className="p-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md mb-3" style={{ background: `${c.color}15` }}>
                    <c.icon className="w-5 h-5" style={{ color: c.color }} />
                  </div>
                  <p className="text-xs font-medium mb-1" style={{ color: C.muted }}>{c.label}</p>
                  <p className="text-2xl font-black" style={{ color: C.white }}>{c.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Charts Row ── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Area — monthly */}
          <Card className="lg:col-span-2 border-0 shadow-xl rounded-3xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
            <CardHeader className="px-6 py-4 border-b" style={{ background: C.surface, borderColor: C.goldBorder }}>
              <CardTitle className="flex items-center gap-2 text-sm" style={{ color: C.white }}>
                <TrendingUp className="w-4 h-4" style={{ color: C.gold }} /> Monthly ATS Checks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="atsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.gold} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={C.gold} stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.dim} />
                  <XAxis dataKey="month" tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:11, fill:C.muted }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" stroke={C.gold} strokeWidth={3}
                    fill="url(#atsGrad)" dot={{ fill:C.gold, r:4, stroke:C.card, strokeWidth:2 }}
                    activeDot={{ r:7 }} name="Checks" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie — score ranges */}
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
            <CardHeader className="px-6 py-4 border-b" style={{ background: C.surface, borderColor: C.goldBorder }}>
              <CardTitle className="flex items-center gap-2 text-sm" style={{ color: C.white }}>
                <BarChart2 className="w-4 h-4" style={{ color: C.gold }} /> Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={scoreRanges} dataKey="count" cx="50%" cy="50%"
                    innerRadius={40} outerRadius={65} paddingAngle={3}>
                    {scoreRanges.map((s, i) => <Cell key={i} fill={s.fill} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {scoreRanges.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background:s.fill }} />
                    <span className="text-gray-600">{s.range}</span>
                    <span className="font-black ml-auto" style={{ color:s.fill }}>{s.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar — top users */}
        {topUsers.length > 0 && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.16 }}>
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100 px-6 py-4">
                <CardTitle className="flex items-center gap-2 text-sm text-gray-800">
                  <Users className="w-4 h-4 text-blue-600" /> Most Active Users
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topUsers} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="checks" radius={[8,8,0,0]} name="Checks">
                      {topUsers.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Records Table ── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100 px-6 py-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <FileSearch className="w-5 h-5 text-violet-600" />
                  All ATS Records
                  <span className="text-sm font-normal text-gray-400 ml-1">({filtered.length})</span>
                </CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="pl-9 h-9 rounded-xl border-2 border-gray-200 focus:border-violet-400 text-sm" />
                </div>
              </div>
            </CardHeader>

            <div className="divide-y divide-gray-50">
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-3">
                      <FileSearch className="w-8 h-8 text-violet-300" />
                    </div>
                    <p className="font-bold text-gray-400">No ATS records found</p>
                  </div>
                ) : filtered.map((record, idx) => {
                  const isOpen   = expanded === record._id;
                  const score    = record.score;
                  const scoreColor = score >= 75 ? '#059669' : score >= 50 ? '#d97706' : '#dc2626';
                  const scoreBg   = score >= 75 ? '#d1fae5' : score >= 50 ? '#fef3c7' : '#fee2e2';

                  return (
                    <motion.div key={record._id}
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                      exit={{ opacity:0, x:-20 }} transition={{ delay: idx * 0.03 }}>

                      {/* Row */}
                      <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors">

                        {/* Score ring */}
                        <ScoreRing score={score} />

                        {/* User info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                              style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                              {record.user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{record.user?.fullname || 'Unknown'}</p>
                              <p className="text-xs text-gray-400">{record.user?.email || '—'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Score badge */}
                        <span className="text-xs font-black px-3 py-1.5 rounded-full flex-shrink-0"
                          style={{ background: scoreBg, color: scoreColor }}>
                          {score >= 75 ? '✅' : score >= 50 ? '⚠️' : '❌'} {score}%
                        </span>

                        {/* Matched keywords count */}
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 flex-shrink-0 hidden sm:inline">
                          {record.matchedKeywords?.length || 0} keywords
                        </span>

                        {/* Date */}
                        <span className="text-xs text-gray-400 flex-shrink-0 hidden md:inline">
                          {new Date(record.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                        </span>

                        {/* Expand */}
                        <button onClick={() => setExpanded(isOpen ? null : record._id)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                          style={{ background: isOpen ? '#ede9fe' : '#f8fafc', color: isOpen ? '#7c3aed' : '#94a3b8' }}>
                          {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>

                        {/* Delete */}
                        <motion.button whileTap={{ scale:0.9 }}
                          onClick={() => handleDelete(record._id)}
                          disabled={deletingId === record._id}
                          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                          style={{ background:'#fee2e2', color:'#dc2626' }}>
                          {deletingId === record._id
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Trash2 size={14} />}
                        </motion.button>
                      </div>

                      {/* Expanded detail */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                            exit={{ height:0, opacity:0 }} transition={{ duration:0.2 }}
                            className="overflow-hidden">
                            <div className="px-6 pb-5 pt-2 border-t" style={{ background: C.surface, borderColor: C.goldBorder }}>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                {/* Sub-scores */}
                                <div className="space-y-2">
                                  <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: C.muted }}>Sub Scores</p>
                                  {[
                                    ['Formatting',   record.detailedAnalysis?.formatting?.score,   '#D4A853'],
                                    ['Content',      record.detailedAnalysis?.content?.score,      '#2563eb'],
                                    ['Keywords',     record.detailedAnalysis?.keywords?.score,     '#059669'],
                                    ['Readability',  record.detailedAnalysis?.readability?.score,  '#d97706'],
                                    ['Optimization', record.detailedAnalysis?.optimization?.score, '#dc2626'],
                                  ].map(([label, val, color]) => (
                                    <div key={label} className="flex items-center gap-2">
                                      <span className="text-xs w-24 flex-shrink-0" style={{ color: C.muted }}>{label}</span>
                                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: C.dim }}>
                                        <div className="h-full rounded-full transition-all"
                                          style={{ width:`${val || 0}%`, background: color }} />
                                      </div>
                                      <span className="text-xs font-black w-8 text-right" style={{ color }}>{val || 0}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Matched keywords */}
                                <div>
                                  <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                                    Matched Keywords ({record.matchedKeywords?.length || 0})
                                  </p>
                                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                                    {(record.matchedKeywords || []).slice(0, 20).map((kw, i) => (
                                      <span key={i} className="text-xs px-2 py-0.5 rounded-full font-medium"
                                        style={{ background:'#d1fae5', color:'#059669' }}>
                                        ✓ {kw}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Suggestions */}
                                <div>
                                  <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                                    Suggestions ({record.suggestions?.length || 0})
                                  </p>
                                  <div className="space-y-1.5 max-h-28 overflow-y-auto">
                                    {(record.suggestions || []).map((s, i) => (
                                      <p key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                                        <span className="text-amber-500 flex-shrink-0 mt-0.5">→</span> {s}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

      </div>
    </AdminLayout>
  );
};

export default AdminATS;
