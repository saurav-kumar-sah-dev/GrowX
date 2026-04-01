import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Brain, FileText, GraduationCap, ScanLine, UserCircle,
  TrendingUp, CheckCircle, ChevronRight, Zap,
  Briefcase, Clock, BookOpen, Target, Rocket, Sparkles,
  Award, Trophy, Star, MessageSquare, Palette,
  Building2, ListChecks, FolderKanban, ArrowRight, Crown
} from 'lucide-react';
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

const f = (d = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.42, delay: d, ease: [0.22, 1, 0.36, 1] },
});

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const LEVEL_CONFIG = {
  beginner: { 
    bg: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.1))', 
    text: '#34d399',
    border: 'rgba(52,211,153,0.3)',
    icon: '🌱',
    label: 'Beginner'
  },
  intermediate: { 
    bg: 'linear-gradient(135deg, rgba(96,165,250,0.2), rgba(59,130,246,0.1))', 
    text: '#60a5fa',
    border: 'rgba(96,165,250,0.3)',
    icon: '⚡',
    label: 'Intermediate'
  },
  advanced: { 
    bg: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.1))', 
    text: '#f87171',
    border: 'rgba(239,68,68,0.3)',
    icon: '🔥',
    label: 'Advanced'
  },
  expert: {
    bg: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(139,92,246,0.15))',
    text: '#a855f7',
    border: 'rgba(168,85,247,0.4)',
    icon: '💎',
    label: 'Expert'
  }
};

/* ── Mini stat pill ─────────────────────────────────────────── */
const Pill = ({ label, value }) => (
  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: C.goldDim, color: C.gold }}>
    {label}: {value}
  </span>
);

/* ── Stat card ──────────────────────────────────────────────── */
const StatCard = ({ title, value, sub, icon: Icon, color, glow, path, navigate, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    whileHover={{ y: -6, scale: 1.02 }} onClick={() => navigate(path)} className="cursor-pointer">
    <div className="relative overflow-hidden rounded-3xl p-5 border transition-all"
      style={{ background: C.card, borderColor: C.goldBorder }}>
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20"
        style={{ background: color }} />
      <div className="relative">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
          style={{ background: C.goldDim, boxShadow: `0 0 16px ${glow}` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <p className="text-xs font-semibold mb-1" style={{ color: C.muted }}>{title}</p>
        <p className="text-3xl font-black mb-1" style={{ color: C.white }}>{value}</p>
        {sub && <p className="text-xs" style={{ color: C.muted }}>{sub}</p>}
        <div className="flex items-center gap-1 mt-3" style={{ color: C.gold }}>
          <span className="text-xs font-semibold">View</span>
          <ArrowRight size={12} />
        </div>
      </div>
    </div>
  </motion.div>
);

/* ── Section card ───────────────────────────────────────────── */
const Section = ({ title, icon: Icon, color, children, path, navigate, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="rounded-3xl border overflow-hidden"
    style={{ background: C.card, borderColor: C.goldBorder }}>
    <div className="flex items-center justify-between px-5 py-4 border-b"
      style={{ borderColor: C.goldBorder }}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: C.goldDim }}>
          <Icon size={14} style={{ color }} />
        </div>
        <span className="text-sm font-bold" style={{ color: C.white }}>{title}</span>
      </div>
      <button onClick={() => navigate(path)}
        className="flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-80"
        style={{ color: C.gold }}>
        See all <ArrowRight size={11} />
      </button>
    </div>
    <div className="p-4">{children}</div>
  </motion.div>
);

/* ── Row item ───────────────────────────────────────────────── */
const RowItem = ({ left, right, sub, badge, badgeColor, onClick }) => (
  <div onClick={onClick}
    className="flex items-center justify-between py-2.5 px-3 rounded-2xl transition-colors cursor-pointer"
    style={{ background: 'rgba(255,255,255,0.02)' }}>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold truncate" style={{ color: C.white }}>{left}</p>
      {sub && <p className="text-xs truncate mt-0.5" style={{ color: C.muted }}>{sub}</p>}
    </div>
    {badge && (
      <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ml-3"
        style={{ background: C.goldDim, color: badgeColor }}>{badge}</span>
    )}
    {right && <span className="text-xs flex-shrink-0 ml-3" style={{ color: C.muted }}>{right}</span>}
  </div>
);

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [atsHistory, setAtsHistory] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [internships, setInternships] = useState([]);
  const [learningCourses, setLearningCourses] = useState([]);
  const [kanbanTasks, setKanbanTasks] = useState([]);

  const profileChecks = [
    { label: 'Full Name', done: !!user?.fullname },
    { label: 'Phone', done: !!user?.phoneNumber },
    { label: 'Bio', done: !!user?.profile?.bio },
    { label: 'Skills', done: user?.profile?.skills?.length > 0 },
    { label: 'Resume', done: !!user?.profile?.resume },
    { label: 'Profile Photo', done: !!user?.profile?.profilePhoto },
  ];
  const pct = Math.round(profileChecks.filter(c => c.done).length / profileChecks.length * 100);

  useEffect(() => {
    (async () => {
      const [q, t, j, r, i, l, k] = await Promise.allSettled([
        axios.get(`${API.quiz}/all`, { withCredentials: true }),
        axios.get(`${API.ats}/history`, { withCredentials: true }),
        axios.get(`${API.job}/get`, { withCredentials: true }),
        axios.get(`${API.resume}/my`, { withCredentials: true }),
        axios.get(`${API.internship}/my`, { withCredentials: true }),
        axios.get(`${API.learning}/all`, { withCredentials: true }),
        axios.get(`${API.kanban}/get`, { withCredentials: true }),
      ]);
      
      setQuizzes(q.status === 'fulfilled' ? (q.value.data?.quizzes || []) : []);
      setAtsHistory(t.status === 'fulfilled' ? (t.value.data?.history || []) : []);
      setJobs(j.status === 'fulfilled' ? (j.value.data?.jobs || []) : []);
      setResumes(r.status === 'fulfilled' ? (r.value.data?.data || r.value.data?.resumes || []) : []);
      setInternships(i.status === 'fulfilled' ? (i.value.data?.data || i.value.data?.internships || []) : []);
      setLearningCourses(l.status === 'fulfilled' ? (l.value.data?.data || []) : []);
      setKanbanTasks(k.status === 'fulfilled' ? (k.value.data?.data || []) : []);
      
      setLoading(false);
    })();
  }, []);

  const avgAts = atsHistory.length
    ? Math.round(atsHistory.reduce((s, a) => s + (a.score || 0), 0) / atsHistory.length)
    : null;

  const totalApplicants = jobs.reduce((s, j) => s + (j.applications?.length || 0), 0);
  const pendingInternships = internships.filter(inv => inv.status === 'pending').length;
  const completedInternships = internships.filter(inv => inv.status === 'approved').length;
  const completedCourses = learningCourses.filter(c => c.completed).length;
  const completedTasks = kanbanTasks.filter(t => t.status === 'completed').length;

  const statCards = [
    { title: 'Quizzes', value: quizzes.length, sub: `${quizzes.filter(q => q.questions?.length > 0).length} available`, icon: Brain, color: '#8B5CF6', glow: 'rgba(139,92,246,0.4)', path: '/user/quiz' },
    { title: 'Jobs', value: jobs.length, sub: `${totalApplicants} total`, icon: Briefcase, color: '#06B6D4', glow: 'rgba(6,182,212,0.4)', path: '/user/jobs' },
    { title: 'ATS Score', value: avgAts ? `${avgAts}%` : '—', sub: avgAts ? 'Average score' : 'Check now', icon: ScanLine, color: '#F59E0B', glow: 'rgba(245,158,11,0.4)', path: '/user/ats' },
    { title: 'Resumes', value: resumes.length, sub: resumes.length === 0 ? 'Build now' : 'Built', icon: FileText, color: '#10B981', glow: 'rgba(16,185,129,0.4)', path: '/user/resume' },
    { title: 'Internships', value: internships.length, sub: pendingInternships > 0 ? `${pendingInternships} pending` : `${completedInternships} approved`, icon: GraduationCap, color: '#EC4899', glow: 'rgba(236,72,153,0.4)', path: '/user/internship' },
  ];

  const statCardsRow2 = [
    { title: 'Courses', value: learningCourses.length, sub: `${completedCourses} completed`, icon: BookOpen, color: '#6366F1', glow: 'rgba(99,102,241,0.4)', path: '/user/learning' },
    { title: 'Kanban Tasks', value: kanbanTasks.length, sub: `${completedTasks} done`, icon: FolderKanban, color: '#14B8A6', glow: 'rgba(20,184,166,0.4)', path: '/user/kanban' },
  ];

  const quickActions = [
    { label: 'Browse Jobs', icon: Briefcase, color: '#06B6D4', glow: 'rgba(6,182,212,0.35)', route: '/user/jobs', desc: `${jobs.length || 0} opportunities` },
    { label: 'Take Quiz', icon: Brain, color: '#8B5CF6', glow: 'rgba(139,92,246,0.35)', route: '/user/quiz', desc: `${quizzes.length || 0} available` },
    { label: 'Check ATS', icon: ScanLine, color: '#F59E0B', glow: 'rgba(245,158,11,0.35)', route: '/user/ats', desc: 'Optimize resume' },
    { label: 'My Resume', icon: FileText, color: '#10B981', glow: 'rgba(16,185,129,0.35)', route: '/user/resume', desc: `${resumes.length || 0} built` },
    { label: 'Internship', icon: GraduationCap, color: '#EC4899', glow: 'rgba(236,72,153,0.35)', route: '/user/internship', desc: `${internships.length || 0} applied` },
    { label: 'Learning', icon: BookOpen, color: '#6366F1', glow: 'rgba(99,102,241,0.35)', route: '/user/learning', desc: `${learningCourses.length || 0} courses` },
    { label: 'Kanban', icon: FolderKanban, color: '#14B8A6', glow: 'rgba(20,184,166,0.35)', route: '/user/kanban', desc: `${kanbanTasks.length || 0} tasks` },
  ];

  const features = [
    { icon: Rocket, title: 'Launch Career', desc: 'Apply to top companies', color: '#06B6D4' },
    { icon: Target, title: 'Skill Check', desc: 'Take quizzes & improve', color: '#8B5CF6' },
    { icon: Award, title: 'Get Certified', desc: 'Earn credentials', color: '#F59E0B' },
    { icon: Trophy, title: 'Track Progress', desc: 'Monitor your growth', color: '#10B981' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)' }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
        style={{ background: `linear-gradient(135deg,${C.gold},${C.goldLight})` }}>
        <Sparkles size={24} style={{ color: C.obsidian }} />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)' }}>

      {/* ── Hero ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${C.gold}, #C8884A)`, border: `1px solid ${C.goldBorder}` }}>
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20"
            style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(30%,-30%)' }} />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                <Sparkles size={28} className="text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">{greeting()}</p>
                <h1 className="text-3xl font-black text-white mb-1">{user?.fullname || 'User'} ✦</h1>
                <p className="text-white/80 text-sm">Your career journey starts here. Track progress and achieve your goals.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                  <motion.circle cx="50" cy="50" r="42" fill="none"
                    stroke="url(#userDashGrad)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - pct / 100) }}
                    transition={{ duration: 1.4, delay: 0.3 }} />
                  <defs>
                    <linearGradient id="userDashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-white">{pct}%</span>
                  <span className="text-[10px] text-white/60">Profile</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <Pill label="Quizzes" value={quizzes.length} />
            <Pill label="Jobs" value={jobs.length} />
            <Pill label="Resumes" value={resumes.length} />
            <Pill label="Internships" value={internships.length} />
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards Row 1 ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((c, i) => (
          <StatCard key={c.title} {...c} navigate={navigate} delay={0.05 * i} />
        ))}
      </div>

      {/* ── Stat Cards Row 2 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCardsRow2.map((c, i) => (
          <StatCard key={c.title} {...c} navigate={navigate} delay={0.1 + 0.05 * i} />
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="rounded-3xl border overflow-hidden" style={{ background: C.card, borderColor: C.goldBorder }}>
          <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: C.goldBorder }}>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: C.goldDim }}>
              <Zap size={14} style={{ color: C.gold }} />
            </div>
            <span className="text-sm font-bold" style={{ color: C.white }}>Quick Actions</span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {quickActions.map((a, i) => (
                <motion.button key={a.label} {...f(0.18 + i * 0.03)}
                  whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(a.route)}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl text-center transition-all border group cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                    style={{ background: `${a.color}15`, border: `1px solid ${a.color}30`, boxShadow: `0 0 12px ${a.glow}` }}>
                    <a.icon size={18} style={{ color: a.color }} />
                  </div>
                  <p className="text-xs font-bold" style={{ color: C.white }}>{a.label}</p>
                  <p className="text-[10px]" style={{ color: C.muted }}>{a.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Sections Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Available Quizzes" icon={Brain} color="#8B5CF6" path="/user/quiz" navigate={navigate} delay={0.2}>
          {quizzes.length === 0
            ? <p className="text-sm text-center py-6" style={{ color: C.muted }}>No quizzes available</p>
            : quizzes.slice(0, 4).map((q, i) => {
              const levelKey = q.level?.toLowerCase() || 'beginner';
              const lv = LEVEL_CONFIG[levelKey] || LEVEL_CONFIG.beginner;
              return (
                <RowItem key={q._id || i} 
                  left={q.title} 
                  sub={`${q.questions?.length || 0} questions • ${q.timeLimit ? `${q.timeLimit} min` : 'No limit'}`}
                  badge={`${lv.icon} ${lv.label}`} 
                  badgeColor={lv.text}
                  onClick={() => navigate(`/quiz/${q._id}`)} />
              );
            })
          }
        </Section>

        <Section title="ATS Score History" icon={ScanLine} color="#F59E0B" path="/user/ats" navigate={navigate} delay={0.25}>
          {atsHistory.length === 0
            ? <div className="text-center py-6">
                <ScanLine size={32} className="mx-auto mb-2 opacity-30" style={{ color: C.muted }} />
                <p className="text-sm mb-3" style={{ color: C.muted }}>No checks yet</p>
                <button onClick={() => navigate('/user/ats')} className="text-xs font-bold px-4 py-2 rounded-lg"
                  style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }}>
                  Check Now →
                </button>
              </div>
            : atsHistory.slice(0, 4).map((h, i) => {
              const sc = h.score >= 80 ? '#10B981' : h.score >= 60 ? '#F59E0B' : '#EF4444';
              return (
                <RowItem key={h._id || i} 
                  left={`Resume Check #${atsHistory.length - i}`}
                  sub={h.createdAt ? new Date(h.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : 'Recent'}
                  badge={`${h.score || 0}%`} 
                  badgeColor={sc}
                  onClick={() => navigate('/user/ats')} />
              );
            })
          }
        </Section>
      </div>

      {/* ── Get Started ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="rounded-3xl border overflow-hidden"
          style={{ background: `linear-gradient(135deg, rgba(99,102,241,0.1) 0%, ${C.card} 100%)`, borderColor: C.goldBorder }}>
          <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: C.goldBorder }}>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: C.goldDim }}>
              <Sparkles size={14} style={{ color: C.gold }} />
            </div>
            <span className="text-sm font-bold" style={{ color: C.white }}>Get Started</span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {features.map((feat, i) => (
                <motion.div key={feat.title} {...f(0.35 + i * 0.05)} whileHover={{ scale: 1.03, y: -2 }}
                  className="text-center p-4 rounded-xl transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                    style={{ background: `${feat.color}18`, border: `1px solid ${feat.color}30`, boxShadow: `0 0 12px ${feat.color}20` }}>
                    <feat.icon size={20} style={{ color: feat.color }} />
                  </div>
                  <p className="text-sm font-bold text-white">{feat.title}</p>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
