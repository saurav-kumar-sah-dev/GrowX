import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Search, Plus, Clock, Trophy, BookOpen, TrendingUp, BarChart2, Zap, Target, Award, Edit, Trash2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
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
  goldBorderHover: "rgba(212,168,83,0.3)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
  dim: "#2A2E3A",
};

const COLORS = ['#D4A853', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-2xl shadow-2xl p-4" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
        <p className="font-bold mb-1" style={{ color: C.white }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="text-sm font-semibold">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminAllQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('quizzes');
  const navigate = useNavigate();

  useEffect(() => { fetchQuizzes(); }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`${API.quiz}/all`);
      setQuizzes(res.data.quizzes || []);
    } catch {
      toast.error('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this quiz?')) return;
    // Optimistic UI update
    setQuizzes(prev => prev.filter(q => q._id !== id));
    try {
      await axios.delete(`${API.quiz}/${id}`, { withCredentials: true });
      toast.success('Quiz deleted successfully');
    } catch {
      toast.error('Failed to delete quiz');
      // Revert on failure
      fetchQuizzes();
    }
  };

  const filteredQuizzes = quizzes.filter(q =>
    q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.level?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Analytics Data ──
  const totalQuestions = quizzes.reduce((s, q) => s + (q.questions?.length || 0), 0);
  const totalMarks = quizzes.reduce((s, q) => s + (q.totalMarks || 0), 0);
  const avgTime = quizzes.length ? Math.round(quizzes.reduce((s, q) => s + (q.timeLimit || 0), 0) / quizzes.length) : 0;

  const levelData = ['Easy', 'Medium', 'Hard'].map((level, i) => ({
    name: level,
    value: quizzes.filter(q => q.level === level).length,
    fill: ['#10b981', '#f59e0b', '#ef4444'][i]
  }));

  const categoryMap = {};
  quizzes.forEach(q => { if (q.category) categoryMap[q.category] = (categoryMap[q.category] || 0) + 1; });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  const questionsData = quizzes.slice(0, 8).map(q => ({
    name: q.title?.length > 10 ? q.title.slice(0, 10) + '..' : q.title,
    questions: q.questions?.length || 0,
    marks: q.totalMarks || 0,
    time: q.timeLimit || 0
  }));

  const monthlyMap = {};
  quizzes.forEach(q => {
    const month = new Date(q.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });
  const monthlyData = Object.entries(monthlyMap).map(([month, count]) => ({ month, count }));

  const statCards = [
    { title: 'Total Quizzes', value: quizzes.length, icon: Brain, color: C.gold },
    { title: 'Total Questions', value: totalQuestions, icon: BookOpen, gradient: 'from-blue-600 to-cyan-600', bg: 'from-blue-50 to-cyan-50', border: 'border-blue-100' },
    { title: 'Total Marks', value: totalMarks, icon: Trophy, gradient: 'from-amber-500 to-orange-500', bg: 'from-amber-50 to-orange-50', border: 'border-amber-100' },
    { title: 'Avg Duration', value: `${avgTime}m`, icon: Clock, gradient: 'from-rose-500 to-pink-500', bg: 'from-rose-50 to-pink-50', border: 'border-rose-100' },
    { title: 'Categories', value: categoryData.length, icon: Target, gradient: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50', border: 'border-green-100' },
    { title: 'Easy Quizzes', value: levelData[0].value, icon: Zap, gradient: 'from-teal-500 to-cyan-500', bg: 'from-teal-50 to-cyan-50', border: 'border-teal-100' },
  ];

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center animate-pulse"
            style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` }}>
            <Brain className="w-10 h-10" style={{ color: C.obsidian }} />
          </div>
          <p className="font-semibold" style={{ color: C.muted }}>Loading Quiz Analytics...</p>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${C.gold}, #C8884A)`, border: `1px solid ${C.goldBorder}` }}>
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(30%,-30%)' }} />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center shadow-xl"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                  <Brain className="h-7 w-7 sm:h-9 sm:w-9 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">Quiz Management</h1>
                  <p className="text-white/80 text-sm sm:text-lg">Analytics & Quiz Control Center</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3">
                    <span className="bg-white/20 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium">{quizzes.length} Total</span>
                    <span className="bg-white/20 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium">{totalQuestions} Questions</span>
                    <span className="bg-white/20 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium">{categoryData.length} Categories</span>
                  </div>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  onClick={(e) => { e.stopPropagation(); navigate('/admin/quizzes/create'); }}
                  className="shadow-xl h-10 sm:h-12 px-4 sm:px-8 font-bold rounded-xl w-full sm:w-auto"
                  style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Create Quiz</span>
                  <span className="xs:hidden">New</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((card, idx) => (
            <motion.div key={card.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * idx }} whileHover={{ y: -4, scale: 1.03 }}>
              <Card className="relative overflow-hidden border shadow-lg" style={{ background: C.card, borderColor: C.goldBorder }}>
                <CardContent className="p-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md mb-3" style={{ background: C.goldDim }}>
                    <card.icon className="w-5 h-5" style={{ color: C.gold }} />
                  </div>
                  <p className="text-xs font-medium mb-1" style={{ color: C.muted }}>{card.title}</p>
                  <p className="text-2xl font-black" style={{ color: C.white }}>{card.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-8 p-1.5 rounded-2xl w-fit" style={{ background: C.surface }}>
          {[
            { key: 'quizzes', label: 'All Quizzes', icon: Brain },
            { key: 'analytics', label: 'Analytics', icon: BarChart2 }
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                background: activeTab === tab.key ? C.gold : 'transparent',
                color: activeTab === tab.key ? C.obsidian : C.muted,
                boxShadow: activeTab === tab.key ? '0 4px 12px rgba(212,168,83,0.3)' : 'none'
              }}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── QUIZZES TAB ── */}
        {activeTab === 'quizzes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: C.muted }} />
                <Input
                  className="pl-12 h-12 border-2 rounded-2xl shadow-sm"
                  style={{ borderColor: C.goldBorder, background: C.card, color: C.white }}
                  placeholder="Search by title, category, or level..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz, index) => (
                <motion.div key={quiz._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }} whileHover={{ y: -6 }}>
                  <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group"
                    onClick={() => navigate(`/admin/quizzes/edit/${quiz._id}`)}>
                    {/* Top color bar */}
                    <div className={`h-1.5 w-full ${
                      quiz.level === 'Easy' ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                      : quiz.level === 'Medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                      : 'bg-gradient-to-r from-red-400 to-pink-500'
                    }`} />

                    <CardContent className="p-6">
                      {/* Title row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0 pr-3">
                          <h3 className="font-bold text-lg truncate group-hover:text-amber-400 transition-colors"
                            style={{ color: C.white }}>
                            {quiz.title}
                          </h3>
                          <p className="text-sm mt-1 line-clamp-2" style={{ color: C.muted }}>{quiz.description}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/quizzes/edit/${quiz._id}`); }}
                            className="p-2 rounded-xl transition-colors"
                            style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={(e) => handleDelete(quiz._id, e)}
                            className="p-2 rounded-xl transition-colors"
                            style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Stats grid */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center p-2 rounded-xl" style={{ background: C.goldDim }}>
                          <p className="text-lg font-black" style={{ color: C.gold }}>{quiz.questions?.length || 0}</p>
                          <p className="text-xs" style={{ color: C.muted }}>Questions</p>
                        </div>
                        <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(59,130,246,0.15)' }}>
                          <p className="text-lg font-black" style={{ color: '#3b82f6' }}>{quiz.timeLimit}m</p>
                          <p className="text-xs" style={{ color: C.muted }}>Duration</p>
                        </div>
                        <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(245,158,11,0.15)' }}>
                          <p className="text-lg font-black" style={{ color: '#f59e0b' }}>{quiz.totalMarks}</p>
                          <p className="text-xs" style={{ color: C.muted }}>Marks</p>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge className={`text-white text-xs ${
                            quiz.level === 'Easy' ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : quiz.level === 'Medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                            : 'bg-gradient-to-r from-red-500 to-pink-500'
                          }`}>{quiz.level}</Badge>
                          <Badge variant="outline" className="text-xs" style={{ borderColor: C.goldBorder, color: C.gold }}>{quiz.category}</Badge>
                        </div>
                        <p className="text-xs" style={{ color: C.muted }}>
                          {new Date(quiz.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredQuizzes.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: C.goldDim }}>
                  <Brain size={44} style={{ color: C.gold }} />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: C.white }}>No quizzes found</h3>
                <p style={{ color: C.muted }}>Try adjusting your search or create a new quiz</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

            {/* Row 1 - Area + Pie */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border shadow-xl rounded-3xl overflow-hidden" style={{ background: C.card, borderColor: C.goldBorder }}>
                <CardHeader className="pb-4" style={{ background: C.surface, borderBottom: `1px solid ${C.goldBorder}` }}>
                  <CardTitle className="flex items-center gap-2" style={{ color: C.white }}>
                    <TrendingUp className="w-5 h-5" style={{ color: C.gold }} />
                    Quiz Creation Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="quizGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.gold} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.dim} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.muted }} />
                      <YAxis tick={{ fontSize: 11, fill: C.muted }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="count" stroke={C.gold} strokeWidth={3}
                        fill="url(#quizGrad)" dot={{ fill: C.gold, r: 5 }} activeDot={{ r: 8 }} name="Quizzes" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border shadow-xl rounded-3xl overflow-hidden" style={{ background: C.card, borderColor: C.goldBorder }}>
                <CardHeader className="pb-4" style={{ background: C.surface, borderBottom: `1px solid ${C.goldBorder}` }}>
                  <CardTitle className="flex items-center gap-2" style={{ color: C.white }}>
                    <Trophy className="w-5 h-5" style={{ color: '#10b981' }} />
                    Quizzes by Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="60%" height={260}>
                      <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={100}
                          dataKey="value" paddingAngle={3}>
                          {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {categoryData.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="text-xs truncate max-w-[80px]" style={{ color: C.muted }}>{item.name}</span>
                          </div>
                          <span className="text-xs font-bold" style={{ color: C.white }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Row 2 - Bar + Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border shadow-xl rounded-3xl overflow-hidden" style={{ background: C.card, borderColor: C.goldBorder }}>
                <CardHeader className="pb-4" style={{ background: C.surface, borderBottom: `1px solid ${C.goldBorder}` }}>
                  <CardTitle className="flex items-center gap-2" style={{ color: C.white }}>
                    <BookOpen className="w-5 h-5" style={{ color: '#3b82f6' }} />
                    Questions & Marks per Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={questionsData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.dim} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: C.muted }} />
                      <YAxis tick={{ fontSize: 10, fill: C.muted }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '12px', color: C.white }} />
                      <Bar dataKey="questions" fill={C.gold} radius={[6, 6, 0, 0]} name="Questions" />
                      <Bar dataKey="marks" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Marks" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border shadow-xl rounded-3xl overflow-hidden" style={{ background: C.card, borderColor: C.goldBorder }}>
                <CardHeader className="pb-4" style={{ background: C.surface, borderBottom: `1px solid ${C.goldBorder}` }}>
                  <CardTitle className="flex items-center gap-2" style={{ color: C.white }}>
                    <Award className="w-5 h-5" style={{ color: '#ef4444' }} />
                    Difficulty Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={levelData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke={C.dim} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: C.muted }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 13, fill: C.white, fontWeight: 600 }} width={60} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]} name="Quizzes">
                        {levelData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  {/* Level summary */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {levelData.map((l, i) => (
                      <div key={i} className="text-center p-3 rounded-2xl" style={{ backgroundColor: `${l.fill}15` }}>
                        <p className="text-2xl font-black" style={{ color: l.fill }}>{l.value}</p>
                        <p className="text-xs font-medium" style={{ color: C.muted }}>{l.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Row 3 - Full width Line */}
            <Card className="border shadow-xl rounded-3xl overflow-hidden" style={{ background: C.card, borderColor: C.goldBorder }}>
              <CardHeader className="pb-4" style={{ background: C.surface, borderBottom: `1px solid ${C.goldBorder}` }}>
                <CardTitle className="flex items-center gap-2" style={{ color: C.white }}>
                  <Clock className="w-5 h-5" style={{ color: '#f59e0b' }} />
                  Quiz Duration & Marks Comparison (Top 8)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={questionsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.dim} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.muted }} />
                    <YAxis tick={{ fontSize: 11, fill: C.muted }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: C.white }} />
                    <Line type="monotone" dataKey="time" stroke="#f59e0b" strokeWidth={3}
                      dot={{ fill: '#f59e0b', r: 5 }} activeDot={{ r: 8 }} name="Duration (min)" />
                    <Line type="monotone" dataKey="marks" stroke={C.gold} strokeWidth={3}
                      dot={{ fill: C.gold, r: 5 }} activeDot={{ r: 8 }} name="Total Marks" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAllQuizzes;
