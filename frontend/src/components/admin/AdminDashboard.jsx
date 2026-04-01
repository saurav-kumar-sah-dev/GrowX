import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Briefcase, TrendingUp, Users, ArrowRight,
  GraduationCap, FileText, FileSearch, Crown,
  CheckCircle, Clock, XCircle, Award, BarChart3,
  Building2, MessageSquare, Plus, Eye,
  ArrowLeft, Tags, ExternalLink
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
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
  goldBorderHover: "rgba(212,168,83,0.3)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
  dim: "#2A2E3A",
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
          <span className="text-xs font-semibold">View all</span>
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

/* ── Main ───────────────────────────────────────────────────── */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem(`admin_dashboard_completions_${user?._id}`);
    return saved ? JSON.parse(saved) : {};
  });

  const dashboardTasks = [
    { id: 'quizzes', label: 'Manage Quizzes', icon: Brain, color: C.gold },
    { id: 'jobs', label: 'Post Jobs', icon: Briefcase, color: '#C8884A' },
    { id: 'internships', label: 'Review Internships', icon: GraduationCap, color: '#E8C17A' },
    { id: 'ats', label: 'Review ATS Checks', icon: FileSearch, color: '#f87171' },
    { id: 'resumes', label: 'View Resumes', icon: FileText, color: '#4ade80' },
    { id: 'users', label: 'Manage Users', icon: Users, color: '#8b5cf6' },
  ];

  const toggleTaskComplete = (taskId) => {
    const updated = { ...completedTasks, [taskId]: !completedTasks[taskId] };
    setCompletedTasks(updated);
    localStorage.setItem(`admin_dashboard_completions_${user?._id}`, JSON.stringify(updated));
    toast.success(updated[taskId] ? '✅ Task marked complete!' : '⏳ Task marked incomplete');
  };

  const completionPercentage = Math.round((Object.values(completedTasks).filter(Boolean).length / dashboardTasks.length) * 100);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [quizRes, jobRes, companyRes, internRes, atsRes, resumeRes, aiChatRes, categoryRes] = await Promise.allSettled([
          axios.get(`${API.quiz}/all`),
          axios.get(`${API.job}/getadminjobs`, { withCredentials: true }),
          axios.get(`${API.company}/getAll`, { withCredentials: true }),
          axios.get(`${API.internship}/all`, { withCredentials: true }),
          axios.get(`${API.ats}/all`, { withCredentials: true }),
          axios.get(API.resume, { withCredentials: true }),
          axios.get(`${API.aiChat}/all`, { withCredentials: true }),
          axios.get(`${API.category}/all`, { withCredentials: true }),
        ]);

        setData({
          quizzes:      quizRes.status      === 'fulfilled' ? quizRes.value.data.quizzes       || [] : [],
          jobs:         jobRes.status       === 'fulfilled' ? jobRes.value.data.jobs            || [] : [],
          companies:    companyRes.status    === 'fulfilled' ? companyRes.value.data.companies  || [] : [],
          internships:  internRes.status    === 'fulfilled' ? internRes.value.data.data         || [] : [],
          ats:          atsRes.status       === 'fulfilled' ? atsRes.value.data.records         || [] : [],
          resumes:      resumeRes.status    === 'fulfilled' ? resumeRes.value.data.data         || [] : [],
          aiChats:      aiChatRes.status    === 'fulfilled' ? aiChatRes.value.data.data         || [] : [],
        });
        setCategories(categoryRes.status === 'fulfilled' ? categoryRes.value.data.categories || [] : []);
      } catch { toast.error('Failed to load dashboard'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
          style={{ background: `linear-gradient(135deg,${C.gold},${C.goldLight})` }}>
          <Crown size={24} style={{ color: C.obsidian }} />
        </div>
      </div>
    </AdminLayout>
  );

  const { quizzes, jobs, companies, internships, ats, resumes, aiChats } = data;

  const totalApplicants  = jobs.reduce((s, j) => s + (j.applications?.length || 0), 0);
  const internAccepted   = internships.filter(i => i.status === 'accepted').length;
  const internPending    = internships.filter(i => i.status === 'pending').length;
  const avgATS           = ats.length ? Math.round(ats.reduce((s, r) => s + r.score, 0) / ats.length) : 0;
  const atsHigh          = ats.filter(r => r.score >= 75).length;

  const statCards = [
    { title: 'Total Users', value: new Set([...jobs.flatMap(j => j.applications || []).map(a => a.userId), ...internships.map(i => i.user)]).size || 0, sub: 'Active users', icon: Users, color: '#f472b6', glow: 'rgba(244,114,182,0.4)', path: '/admin/users' },
    { title: 'Total Quizzes', value: quizzes.length, sub: `${quizzes.filter(q => q.questions?.length > 0).length} with questions`, icon: Brain, color: C.gold, glow: 'rgba(212,168,83,0.4)', path: '/admin/all-quizzes' },
    { title: 'Total Jobs', value: jobs.length, sub: `${totalApplicants} applicants`, icon: Briefcase, color: '#C8884A', glow: 'rgba(200,136,74,0.4)', path: '/admin/jobs' },
    { title: 'Companies', value: companies.length, sub: 'Active companies', icon: Building2, color: '#fb923c', glow: 'rgba(251,146,60,0.4)', path: '/admin/companies' },
    { title: 'Internships', value: internships.length, sub: `${internPending} pending`, icon: GraduationCap, color: '#E8C17A', glow: 'rgba(232,193,122,0.4)', path: '/admin/internships' },
  ];

  const statCardsRow2 = [
    { title: 'ATS Checks', value: ats.length, sub: `Avg: ${avgATS}%`, icon: FileSearch, color: '#f87171', glow: 'rgba(248,113,113,0.4)', path: '/admin/ats' },
    { title: 'Resumes Built', value: resumes.length, sub: `${new Set(resumes.map(r => r.user?._id)).size} users`, icon: FileText, color: '#4ade80', glow: 'rgba(74,222,128,0.4)', path: '/admin/resumes' },
    { title: 'AI Chats', value: aiChats.length || 0, sub: 'Total sessions', icon: MessageSquare, color: '#f59e0b', glow: 'rgba(245,158,11,0.4)', path: '/admin/ai-chat' },
  ];

  const statusColor = s => s === 'accepted' ? '#22c55e' : s === 'rejected' ? '#ef4444' : '#f59e0b';

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Back Button ── */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all border"
            style={{ borderColor: C.goldBorder, color: C.white, background: 'rgba(255,255,255,0.03)' }}>
            <ArrowLeft size={16} style={{ color: C.gold }} />
            Back to Home
          </motion.button>
        </motion.div>

        {/* ── Hero ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${C.gold}, #C8884A)`, border: `1px solid ${C.goldBorder}` }}>
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(30%,-30%)' }} />
            <div className="relative flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                  <Crown size={28} className="text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">Welcome back</p>
                  <h1 className="text-3xl font-black text-white mb-1">{user?.fullname || 'Admin'} 👋</h1>
                  <p className="text-white/80 text-sm">Here's what's happening on your platform today</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Pill label="Quizzes" value={quizzes.length} />
                <Pill label="Jobs" value={jobs.length} />
                <Pill label="Resumes" value={resumes.length} />
                <Pill label="Internships" value={internships.length} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Quick Actions ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <div className="flex flex-wrap gap-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin/jobs/create')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{ background: C.gold, color: C.obsidian }}>
              <Plus size={16} />
              Post New Job
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin/quizzes/create')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all border"
              style={{ borderColor: C.goldBorder, color: C.white, background: 'rgba(255,255,255,0.03)' }}>
              <Brain size={16} style={{ color: C.gold }} />
              Create Quiz
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin/companies/create')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all border"
              style={{ borderColor: C.goldBorder, color: C.white, background: 'rgba(255,255,255,0.03)' }}>
              <Building2 size={16} style={{ color: '#fb923c' }} />
              Add Company
            </motion.button>
          </div>
        </motion.div>

        {/* ── INTERNSHIP PROGRAMS ── */}
        {categories.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="rounded-3xl border overflow-hidden" style={{ background: C.card, borderColor: C.goldBorder }}>
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: C.goldBorder }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
                    <GraduationCap size={20} style={{ color: '#10b981' }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: C.white }}>Internship Programs</h3>
                    <p className="text-xs" style={{ color: C.muted }}>{categories.length} categories available</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => window.open('/category', '_blank')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
                    style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#10b981', background: 'rgba(16,185,129,0.1)' }}>
                    <ExternalLink size={12} />
                    View Public
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/admin/categories')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}>
                    <Tags size={12} />
                    Manage
                  </motion.button>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {categories.slice(0, 12).map((cat, i) => (
                    <motion.div
                      key={cat._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * i }}
                      onClick={() => navigate(`/admin/categories`)}
                      className="flex items-center gap-2.5 p-3 rounded-xl cursor-pointer transition-all border"
                      style={{ background: `${cat.color}10`, borderColor: `${cat.color}30` }}
                      whileHover={{ y: -2 }}
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${cat.color}25` }}>
                        <Tags size={16} style={{ color: cat.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: C.white }}>{cat.name}</p>
                        <p className="text-[10px]" style={{ color: C.muted }}>{cat.topics?.length || 0} topics</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {categories.length > 12 && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/admin/categories')}
                    className="w-full mt-4 py-2 rounded-xl text-xs font-semibold transition-all border"
                    style={{ borderColor: C.goldBorder, color: C.gold, background: C.goldDim }}>
                    View All {categories.length} Categories
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Stat Cards Row 1 ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((c, i) => (
            <StatCard key={c.title} {...c} navigate={navigate} delay={0.05 * i} />
          ))}
        </div>

        {/* ── Stat Cards Row 2 ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCardsRow2.map((c, i) => (
            <StatCard key={c.title} {...c} navigate={navigate} delay={0.1 + 0.05 * i} />
          ))}
        </div>

        {/* ── Dashboard Completion Tracker ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="rounded-3xl border overflow-hidden" style={{ background: C.card, borderColor: C.goldBorder }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: C.goldBorder, background: C.surface }}>
              <div className="flex items-center gap-3">
                <Award size={18} style={{ color: C.gold }} />
                <div>
                  <span className="text-sm font-bold" style={{ color: C.white }}>Learning Path Progress</span>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>Mark tasks as you complete them</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black" style={{ color: C.gold }}>{completionPercentage}%</p>
                <p className="text-xs" style={{ color: C.muted }}>{Object.values(completedTasks).filter(Boolean).length}/{dashboardTasks.length}</p>
              </div>
            </div>

            <div className="px-5 py-4 border-b" style={{ borderColor: C.goldBorder }}>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: C.dim }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` }}
                />
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {dashboardTasks.map((task) => {
                  const Task = task.icon;
                  const isCompleted = completedTasks[task.id];
                  return (
                    <motion.button
                      key={task.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2 ${
                        isCompleted
                          ? 'border-green-500/50'
                          : 'border-transparent hover:border-white/10'
                      }`}
                      style={{ background: isCompleted ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.02)' }}
                    >
                      <div className="relative">
                        <Task size={20} style={{ color: task.color }} />
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <CheckCircle size={14} className="text-white" />
                          </motion.div>
                        )}
                      </div>
                      <span className={`text-xs font-semibold text-center leading-tight ${isCompleted ? 'text-green-400' : ''}`}
                        style={{ color: isCompleted ? undefined : C.muted }}>
                        {task.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Sections Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <Section title="Recent Quizzes" icon={Brain} color={C.gold} path="/admin/all-quizzes" navigate={navigate} delay={0.2}>
            {quizzes.length === 0
              ? <p className="text-sm text-center py-6" style={{ color: C.muted }}>No quizzes yet</p>
              : quizzes.slice(0, 5).map(q => (
                <RowItem key={q._id} left={q.title} sub={`${q.category} · ${q.level}`}
                  badge={`${q.questions?.length || 0} Qs`} badgeColor={C.gold}
                  onClick={() => navigate(`/admin/quizzes/edit/${q._id}`)} />
              ))
            }
          </Section>

          <Section title="Recent Jobs" icon={Briefcase} color="#C8884A" path="/admin/jobs" navigate={navigate} delay={0.25}>
            {jobs.length === 0
              ? <p className="text-sm text-center py-6" style={{ color: C.muted }}>No jobs yet</p>
              : jobs.slice(0, 5).map(j => (
                <RowItem key={j._id} left={j.title} sub={`${j.jobType} · ${j.location}`}
                  badge={`${j.applications?.length || 0} applied`} badgeColor="#C8884A"
                  onClick={() => navigate(`/admin/jobs/${j._id}/applicants`)} />
              ))
            }
          </Section>

          <Section title="Internship Applications" icon={GraduationCap} color="#E8C17A" path="/admin/internships" navigate={navigate} delay={0.3}>
            {internships.length === 0
              ? <p className="text-sm text-center py-6" style={{ color: C.muted }}>No applications yet</p>
              : internships.slice(0, 5).map(a => (
                <RowItem key={a._id} left={a.fullName} sub={`${a.category} · ${a.college || ''}`}
                  badge={a.status} badgeColor={statusColor(a.status)} />
              ))
            }
            {internships.length > 0 && (
              <div className="flex gap-3 mt-3 pt-3 border-t" style={{ borderColor: C.goldBorder }}>
                {[['Accepted', internAccepted, '#22c55e'], ['Pending', internPending, '#f59e0b'], ['Rejected', internships.filter(i => i.status === 'rejected').length, '#ef4444']].map(([l, v, c]) => (
                  <div key={l} className="flex-1 text-center p-2 rounded-xl" style={{ background: `${c}11` }}>
                    <p className="text-lg font-black" style={{ color: c }}>{v}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{l}</p>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="ATS Checker" icon={FileSearch} color="#f87171" path="/admin/ats" navigate={navigate} delay={0.35}>
            {ats.length === 0
              ? <p className="text-sm text-center py-6" style={{ color: C.muted }}>No ATS records yet</p>
              : ats.slice(0, 5).map(r => {
                const c = r.score >= 75 ? '#22c55e' : r.score >= 50 ? '#f59e0b' : '#ef4444';
                return (
                  <RowItem key={r._id} left={r.user?.fullname || 'Unknown'} sub={r.user?.email}
                    badge={`${r.score}%`} badgeColor={c} />
                );
              })
            }
            {ats.length > 0 && (
              <div className="flex gap-3 mt-3 pt-3 border-t" style={{ borderColor: C.goldBorder }}>
                {[['Avg Score', `${avgATS}%`, '#f87171'], ['High (75+)', atsHigh, '#22c55e'], ['Low (<50)', ats.filter(r => r.score < 50).length, '#ef4444']].map(([l, v, c]) => (
                  <div key={l} className="flex-1 text-center p-2 rounded-xl" style={{ background: `${c}11` }}>
                    <p className="text-lg font-black" style={{ color: c }}>{v}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{l}</p>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="Job Applications" icon={TrendingUp} color="#4ade80" path="/admin/job-applications" navigate={navigate} delay={0.4}>
            {jobs.slice(0, 5).map(j => (
              <RowItem key={j._id} left={j.title} sub={`${j.location}`}
                badge={`${j.applications?.length || 0} applied`} badgeColor="#4ade80"
                onClick={() => navigate(`/admin/jobs/${j._id}/applicants`)} />
            ))}
          </Section>

          <Section title="Quiz Access" icon={Eye} color="#f0abfc" path="/admin/quiz-access" navigate={navigate} delay={0.45}>
            <p className="text-sm text-center py-6" style={{ color: C.muted }}>Manage quiz access controls</p>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin/quiz-access')}
              className="w-full py-2 rounded-xl text-sm font-semibold mt-2"
              style={{ background: C.goldDim, color: C.gold }}>
              Manage Access
            </motion.button>
          </Section>

          <div className="lg:col-span-2">
            <Section title="Recent Resumes" icon={FileText} color="#4ade80" path="/admin/resumes" navigate={navigate} delay={0.5}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {resumes.length === 0
                  ? <p className="text-sm text-center py-6 col-span-2" style={{ color: C.muted }}>No resumes yet</p>
                  : resumes.slice(0, 6).map(r => {
                    const info = r.personalInfo || {};
                    const skills = Object.values(r.technicalSkills || {}).flat();
                    return (
                      <div key={r._id} onClick={() => navigate(`/resume/${r._id}?admin=true`)}
                        className="flex items-center gap-3 p-3 rounded-2xl transition-colors cursor-pointer border"
                        style={{ borderColor: 'rgba(74,222,128,0.15)', background: 'rgba(255,255,255,0.02)' }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-black"
                          style={{ background: `linear-gradient(135deg,${C.gold},${C.goldLight})` }}>
                          {info.fullName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: C.white }}>{info.fullName || 'Unnamed'}</p>
                          <p className="text-xs truncate" style={{ color: C.muted }}>
                            {skills.slice(0, 3).join(', ')}{skills.length > 3 ? ` +${skills.length - 3}` : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </Section>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
