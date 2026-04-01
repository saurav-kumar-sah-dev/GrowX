import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Brain, CheckCircle2, Trophy, Clock, Play, TrendingUp, Target, BarChart2, Award, Zap, Search, Filter, BookOpen, Star, ChevronRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { API } from '@/config/api';

const C = {
  primary: "#6366F1",
  primaryLight: "#818CF8",
  primaryDark: "#4F46E5",
  secondary: "#EC4899",
  tertiary: "#14B8A6",
  quaternary: "#F59E0B",
  obsidian: "#0F172A",
  slate: "#1E293B",
  surface: "#334155",
  surfaceLight: "#475569",
  white: "#F8FAFC",
  muted: "#94A3B8",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  glass: "rgba(255,255,255,0.08)",
  glassBorder: "rgba(255,255,255,0.12)",
};

const f = (d = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: d } });

const LEVEL_COLOR = {
  beginner: { bg: 'rgba(99,102,241,0.2)', text: '#818CF8', border: 'rgba(99,102,241,0.4)', icon: Zap },
  intermediate: { bg: 'rgba(236,72,153,0.2)', text: '#EC4899', border: 'rgba(236,72,153,0.4)', icon: Star },
  advanced: { bg: 'rgba(20,184,166,0.2)', text: '#14B8A6', border: 'rgba(20,184,166,0.4)', icon: Trophy },
};

const categoryColors = ['#6366F1', '#EC4899', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];

const customTooltipStyle = {
  backgroundColor: 'rgba(30,41,59,0.95)', border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '12px', color: '#F8FAFC', fontSize: 12, padding: '10px 14px',
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
  
  .quiz-root { font-family: 'Outfit', sans-serif; }
  .quiz-root * { box-sizing: border-box; }
  
  .quiz-glass {
    background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(30,41,59,0.8) 100%);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.1);
  }
  
  .quiz-card {
    background: linear-gradient(145deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%);
    border: 1px solid rgba(255,255,255,0.08);
    transition: all 0.3s ease;
  }
  
  .quiz-card:hover {
    border-color: rgba(99,102,241,0.4);
    transform: translateY(-2px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }
  
  .quiz-glow-primary {
    box-shadow: 0 0 30px rgba(99,102,241,0.3);
  }
  
  .quiz-glow-pink {
    box-shadow: 0 0 30px rgba(236,72,153,0.3);
  }
  
  .quiz-glow-teal {
    box-shadow: 0 0 30px rgba(20,184,166,0.3);
  }
  
  .quiz-glow-amber {
    box-shadow: 0 0 30px rgba(245,158,11,0.3);
  }
  
  .quiz-gradient-text {
    background: linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #14B8A6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .quiz-scroll::-webkit-scrollbar { width: 6px; }
  .quiz-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 3px; }
  .quiz-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 3px; }
  .quiz-scroll::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.6); }
  
  @keyframes quiz-float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
  }
  
  @keyframes quiz-pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.3); }
    50% { box-shadow: 0 0 40px rgba(99,102,241,0.5); }
  }
  
  .quiz-float { animation: quiz-float 6s ease-in-out infinite; }
  .quiz-pulse-glow { animation: quiz-pulse-glow 3s ease-in-out infinite; }
  
  @media (max-width: 768px) {
    .quiz-grid-stats { grid-template-columns: 1fr !important; }
    .quiz-grid-charts { grid-template-columns: 1fr !important; }
    .quiz-card-pad { padding: 16px !important; }
    .quiz-btn-full { width: 100% !important; justify-content: center !important; }
  }
  
  @media (max-width: 480px) {
    .quiz-hero-pad { padding: 0 12px !important; }
    .quiz-card-pad { padding: 14px !important; }
    .quiz-title-xl { font-size: 24px !important; }
  }
`;

function StatCard({ icon: Icon, label, value, color, delay, glow }) {
  return (
    <motion.div {...f(delay)} className="quiz-card rounded-2xl p-5 text-center"
      style={{ background: `linear-gradient(135deg, ${color}15 0%, rgba(30,41,59,0.9) 100%)`, border: `1px solid ${color}30` }}>
      <motion.div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${color}25 0%, ${color}10 100%)`, boxShadow: `0 0 20px ${color}40` }}
        whileHover={{ scale: 1.1, rotate: 5 }}>
        <Icon size={22} style={{ color }} />
      </motion.div>
      <p className="text-3xl font-black text-white mb-1">{value}</p>
      <p className="text-sm font-semibold" style={{ color: `${color}` }}>{label}</p>
    </motion.div>
  );
}

function QuizItem({ q, isDone, onMark, navigate, index }) {
  const lv = LEVEL_COLOR[q.level?.toLowerCase()] || LEVEL_COLOR.beginner;
  const Icon = lv.icon;
  
  return (
    <motion.div {...f(0.35 + index * 0.04)} 
      className="quiz-card rounded-xl p-4 flex items-center gap-4 cursor-pointer group"
      style={{ background: isDone ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isDone ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'}` }}
      onClick={() => navigate(`/quiz/${q._id}`)}>
      <motion.div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: isDone ? 'rgba(16,185,129,0.2)' : `linear-gradient(135deg, ${lv.text}25 0%, ${lv.text}10 100%)`, border: `1px solid ${isDone ? 'rgba(16,185,129,0.4)' : lv.border}` }}
        whileHover={{ scale: 1.1, rotate: isDone ? 0 : 5 }}>
        {isDone ? <Trophy size={20} style={{ color: C.success }} /> : <Icon size={20} style={{ color: lv.text }} />}
      </motion.div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold truncate mb-1 ${isDone ? 'line-through' : ''}`}
          style={{ color: isDone ? C.muted : C.white }}>
          {q.title}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md capitalize"
            style={{ background: lv.bg, color: lv.text, border: `1px solid ${lv.border}` }}>
            {q.level || 'Beginner'}
          </span>
          <span className="text-xs" style={{ color: C.muted }}>
            {q.questions?.length || 0} Questions
          </span>
          <span className="text-xs" style={{ color: C.muted }}>
            {q.timeLimit || 10} min
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/quiz/${q._id}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`, boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
          <Play size={14} /> Start
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => onMark(q._id)}
          className="p-2 rounded-lg" style={{ background: isDone ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)' }}>
          <CheckCircle2 size={22} style={{ color: isDone ? C.success : C.surfaceLight }} />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function QuizPage() {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const KEY = `growx_quiz_done_${user?._id}`;

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [done, setDone] = useState(() => new Set(JSON.parse(localStorage.getItem(KEY) || '[]')));

  useEffect(() => {
    axios.get(`${API.quiz}/all`, { withCredentials: true })
      .then(r => setQuizzes(r.data?.quizzes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markDone = (id) => {
    const u = new Set(done);
    u.has(id) ? u.delete(id) : u.add(id);
    setDone(u);
    localStorage.setItem(KEY, JSON.stringify([...u]));
  };

  const filteredQuizzes = quizzes.filter(q => {
    const matchesSearch = q.title?.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = filterLevel === 'all' || q.level?.toLowerCase() === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const doneCount = done.size;
  const total = quizzes.length;
  const pct = total ? Math.round(doneCount / total * 100) : 0;

  const categoryMap = {};
  quizzes.forEach(q => { const cat = q.category || q.level || 'General'; categoryMap[cat] = (categoryMap[cat] || 0) + 1; });
  const categoryData = Object.entries(categoryMap).map(([cat, count], i) => ({ 
    cat, count, fill: categoryColors[i % categoryColors.length] 
  }));

  const levelMap = { beginner: 0, intermediate: 0, advanced: 0 };
  quizzes.forEach(q => { const l = q.level?.toLowerCase(); if (l in levelMap) levelMap[l]++; });
  const levelData = Object.entries(levelMap).map(([name, value], i) => ({ 
    name: name.charAt(0).toUpperCase() + name.slice(1), value, fill: [C.primary, C.secondary, C.tertiary][i] 
  }));

  return (
    <div className="quiz-root min-h-screen" style={{ background: `linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)` }}>
      <style>{styles}</style>
      
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <motion.div animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 20, repeat: Infinity }} 
          style={{ position: 'absolute', top: '5%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <motion.div animate={{ x: [0, -40, 0], y: [0, 40, 0] }} transition={{ duration: 25, repeat: Infinity }} 
          style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 p-6 sm:p-8 quiz-hero-pad">
        <motion.div {...f(0)} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} 
                style={{ width: 8, height: 8, borderRadius: '50%', background: C.success, boxShadow: `0 0 10px ${C.success}` }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.primaryLight, letterSpacing: '0.1em' }}>LEARNING HUB</span>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-black text-white quiz-title-xl">
              Test Your <span className="quiz-gradient-text">Knowledge</span>
            </h1>
            <p className="text-sm mt-2" style={{ color: C.muted }}>Challenge yourself with quizzes and track your progress.</p>
          </div>
          <motion.button whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(99,102,241,0.4)' }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/user/analytics/quiz')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)` }}>
            <BarChart2 size={16} /> View Analytics
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 mb-6 quiz-grid-stats">
          <StatCard icon={Brain} label="Total Quizzes" value={total} color={C.primary} delay={0.05} />
          <StatCard icon={CheckCircle2} label="Completed" value={doneCount} color={C.success} delay={0.1} />
          <StatCard icon={Clock} label="Remaining" value={total - doneCount} color={C.warning} delay={0.15} />
        </div>

        <motion.div {...f(0.2)} className="quiz-card rounded-2xl p-5 mb-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primary}25 0%, ${C.primaryDark}15 100%)` }}>
                <TrendingUp size={18} style={{ color: C.primaryLight }} />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Overall Progress</p>
                <p className="text-xs" style={{ color: C.muted }}>{doneCount} of {total} quizzes completed</p>
              </div>
            </div>
            <div className="text-2xl font-black" style={{ color: C.primary }}>{pct}%</div>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})`, boxShadow: `0 0 15px ${C.primary}60` }} />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs" style={{ color: C.muted }}>Keep going!</span>
            <span className="text-xs font-semibold" style={{ color: pct >= 100 ? C.success : C.primary }}>{pct >= 100 ? 'All Done!' : `${100 - pct}% remaining`}</span>
          </div>
        </motion.div>

        {!loading && quizzes.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6 quiz-grid-charts">
            <motion.div {...f(0.25)} className="quiz-card rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Target size={16} style={{ color: C.primary }} />
                <h3 className="font-bold text-white text-sm">Difficulty Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={levelData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                    {levelData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {levelData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.fill }} />
                    <span className="text-xs" style={{ color: C.muted }}>{d.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...f(0.3)} className="quiz-card rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={16} style={{ color: C.tertiary }} />
                <h3 className="font-bold text-white text-sm">Category Breakdown</h3>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="cat" type="category" width={80} tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {categoryData.map((_, i) => <Cell key={i} fill={categoryColors[i % categoryColors.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        <motion.div {...f(0.35)} className="quiz-card rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-5 py-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2">
              <Brain size={16} style={{ color: C.secondary }} />
              <h3 className="font-bold text-white text-sm">All Quizzes</h3>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${C.primary}20`, color: C.primaryLight }}>
                {filteredQuizzes.length}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
                <input type="text" placeholder="Search quizzes..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full sm:w-48 pl-9 pr-3 py-2 rounded-lg text-sm"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: C.white, outline: 'none' }} />
              </div>
              <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: C.white, outline: 'none' }}>
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          
          <div className="p-3 space-y-2 quiz-scroll" style={{ maxHeight: 500, overflowY: 'auto' }}>
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="h-20 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
                ))
              ) : filteredQuizzes.length === 0 ? (
                <div className="text-center py-16" style={{ color: C.muted }}>
                  <Brain size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-base font-semibold mb-2">No quizzes found</p>
                  <p className="text-sm opacity-60">{search ? 'Try a different search term' : 'Check back later for new quizzes'}</p>
                </div>
              ) : (
                filteredQuizzes.map((q, i) => (
                  <QuizItem key={q._id} q={q} isDone={done.has(q._id)} onMark={markDone} navigate={navigate} index={i} />
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
