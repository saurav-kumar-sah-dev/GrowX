import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ScanLine, TrendingUp, Award, AlertTriangle, Plus, BarChart2, ChevronRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { API } from '@/config/api';

const f = (d = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: d } });

const customTooltipStyle = {
  backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px', color: '#fff', fontSize: 12,
};

const scoreColor = (s) =>
  s >= 80 ? { color: '#34d399', bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.3)', label: 'Excellent' } :
  s >= 60 ? { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)',  label: 'Good'      } :
            { color: '#f87171', bg: 'rgba(248,113,113,0.15)',border: 'rgba(248,113,113,0.3)', label: 'Needs Work' };

export default function ATSPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API.ats}/history`, { withCredentials: true })
      .then(r => setHistory(r.data?.history || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = history.length;
  const avg   = total ? Math.round(history.reduce((s, a) => s + (a.score || 0), 0) / total) : 0;
  const best  = total ? Math.max(...history.map(a => a.score || 0)) : 0;

  // Dynamic chart data from real history
  const trendData = history.map((h, i) => ({
    attempt: `#${i + 1}`,
    score: h.score || 0,
    date: h.createdAt ? new Date(h.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '',
  }));

  // Score distribution buckets
  const buckets = { '0-40': 0, '40-60': 0, '60-80': 0, '80-100': 0 };
  history.forEach(h => {
    const s = h.score || 0;
    if (s < 40) buckets['0-40']++;
    else if (s < 60) buckets['40-60']++;
    else if (s < 80) buckets['60-80']++;
    else buckets['80-100']++;
  });
  const distData = Object.entries(buckets).map(([range, count]) => ({ range, count }));
  const distColors = ['#f87171', '#f59e0b', '#60a5fa', '#34d399'];

  // Matched keyword stats from latest check
  const latest = history[history.length - 1];
  const keywordData = latest?.matchedKeywords?.slice(0, 6).map(k => ({ keyword: k.slice(0, 10), present: 1 })) || [];

  return (
    <div className="min-h-screen p-5 sm:p-8 space-y-7"
      style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)' }}>

      <motion.div {...f(0)} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">🤖 ATS Checker</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Track your resume ATS scores.</p>
        </div>
        <div className="flex gap-2">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/user/analytics/ats')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <BarChart2 size={14} /> Analytics
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/atschecker')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)', boxShadow: '0 4px 15px rgba(220,38,38,0.35)' }}>
            <Plus size={15} /> Check Now
          </motion.button>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Checks', value: loading ? '—' : total, color: '#dc2626', glow: 'rgba(220,38,38,0.4)',   icon: ScanLine    },
          { label: 'Avg Score',    value: loading ? '—' : (avg ? `${avg}%` : '—'), color: '#f59e0b', glow: 'rgba(245,158,11,0.4)', icon: TrendingUp },
          { label: 'Best Score',   value: loading ? '—' : (best ? `${best}%` : '—'), color: '#34d399', glow: 'rgba(52,211,153,0.4)', icon: Award   },
        ].map((s, i) => (
          <motion.div key={s.label} {...f(0.05 + i * 0.05)}
            className="rounded-2xl p-4 relative overflow-hidden"
            style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
            <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle,${s.glow},transparent 70%)` }} />
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${s.color}20`, boxShadow: `0 0 12px ${s.glow}` }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-xs font-bold mt-0.5" style={{ color: s.color }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts — only if data exists */}
      {!loading && history.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Score trend */}
          <motion.div {...f(0.2)} className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="font-black text-white text-sm mb-4">Score Improvement Trend</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="atsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="attempt" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={customTooltipStyle} labelFormatter={(l, p) => p?.[0]?.payload?.date || l} />
                <Area type="monotone" dataKey="score" stroke="#34d399" strokeWidth={2.5} fill="url(#atsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Score distribution */}
          <motion.div {...f(0.25)} className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="font-black text-white text-sm mb-4">Score Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={distData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="range" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="count" radius={[6,6,0,0]}>
                  {distData.map((_, i) => <Cell key={i} fill={distColors[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* History list */}
      <motion.div {...f(0.35)} className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <h3 className="font-black text-white text-sm">Check History</h3>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(220,38,38,0.15)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.25)' }}>
            {total} checks
          </span>
        </div>
        <div className="p-3 space-y-1.5">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <ScanLine size={36} className="mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.15)' }} />
              <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>No checks yet</p>
              <button onClick={() => navigate('/atschecker')}
                className="px-5 py-2 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)' }}>
                Check Resume Now
              </button>
            </div>
          ) : [...history].reverse().map((h, i) => {
            const sc = scoreColor(h.score || 0);
            return (
              <motion.div key={h._id || i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.37 + i * 0.03 }}
                onClick={() => navigate('/atschecker')}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.25)' }}>
                  <ScanLine size={16} style={{ color: '#dc2626' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">Resume Check #{history.length - i}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {h.createdAt ? new Date(h.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : 'Recent'}
                    {h.matchedKeywords?.length ? ` · ${h.matchedKeywords.length} keywords matched` : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-base font-black px-3 py-1 rounded-xl"
                    style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                    {h.score || 0}%
                  </span>
                  <span className="text-xs" style={{ color: sc.color }}>{sc.label}</span>
                </div>
                <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.25)' }} />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}