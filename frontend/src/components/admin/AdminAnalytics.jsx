import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Trophy, Clock, BookOpen, TrendingUp, Users, Briefcase, BarChart2, Activity, Target, Zap, Award } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import axios from 'axios';
import { toast } from 'sonner';
import { API } from '@/config/api';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 min-w-[140px]">
        {label && <p className="font-bold text-gray-700 text-sm mb-2">{label}</p>}
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-xs text-gray-600">{p.name}:</span>
            <span className="text-xs font-bold text-gray-800">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AdminAnalytics = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [qRes, jRes, uRes] = await Promise.all([
        axios.get(`${API.quiz}/all`).catch(() => ({ data: { quizzes: [] } })),
        axios.get(`${API.job}/getadminjobs`, { withCredentials: true }).catch(() => ({ data: { jobs: [] } })),
        axios.get(`${API.user}/all`, { withCredentials: true }).catch(() => ({ data: { users: [] } })),
      ]);
      setQuizzes(qRes.data.quizzes || []);
      setJobs(jRes.data.jobs || []);
      setUsers(uRes.data.users || []);
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // ── Derived Data ──
  const totalQuestions = quizzes.reduce((s, q) => s + (q.questions?.length || 0), 0);
  const totalApplications = jobs.reduce((s, j) => s + (j.applications?.length || 0), 0);
  const avgTime = quizzes.length ? Math.round(quizzes.reduce((s, q) => s + (q.timeLimit || 0), 0) / quizzes.length) : 0;

  const levelData = [
    { name: 'Easy', value: quizzes.filter(q => q.level === 'Easy').length, fill: '#10b981' },
    { name: 'Medium', value: quizzes.filter(q => q.level === 'Medium').length, fill: '#f59e0b' },
    { name: 'Hard', value: quizzes.filter(q => q.level === 'Hard').length, fill: '#ef4444' },
  ];

  const categoryMap = {};
  quizzes.forEach(q => { if (q.category) categoryMap[q.category] = (categoryMap[q.category] || 0) + 1; });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  const questionsData = quizzes.slice(0, 7).map(q => ({
    name: q.title?.length > 10 ? q.title.slice(0, 10) + '..' : (q.title || 'N/A'),
    questions: q.questions?.length || 0,
    marks: q.totalMarks || 0,
    time: q.timeLimit || 0,
  }));

  const monthlyMap = {};
  quizzes.forEach(q => {
    if (q.createdAt) {
      const m = new Date(q.createdAt).toLocaleString('default', { month: 'short' });
      monthlyMap[m] = (monthlyMap[m] || 0) + 1;
    }
  });
  const monthlyData = Object.entries(monthlyMap).map(([month, quizCount]) => ({ month, quizCount }));

  const jobTypeMap = {};
  jobs.forEach(j => { if (j.jobType) jobTypeMap[j.jobType] = (jobTypeMap[j.jobType] || 0) + 1; });
  const jobTypeData = Object.entries(jobTypeMap).map(([name, value]) => ({ name, value }));

  const topJobs = [...jobs]
    .sort((a, b) => (b.applications?.length || 0) - (a.applications?.length || 0))
    .slice(0, 6)
    .map(j => ({
      name: j.title?.length > 12 ? j.title.slice(0, 12) + '..' : (j.title || 'N/A'),
      applications: j.applications?.length || 0,
    }));

  const statCards = [
    { title: 'Total Quizzes', value: quizzes.length, icon: Brain, g: 'from-violet-500 to-purple-600', bg: 'from-violet-50 to-purple-50', border: 'border-violet-100' },
    { title: 'Total Questions', value: totalQuestions, icon: BookOpen, g: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50', border: 'border-blue-100' },
    { title: 'Total Jobs', value: jobs.length, icon: Briefcase, g: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50', border: 'border-green-100' },
    { title: 'Applications', value: totalApplications, icon: Users, g: 'from-pink-500 to-rose-500', bg: 'from-pink-50 to-rose-50', border: 'border-pink-100' },
    { title: 'Platform Users', value: users.length, icon: Activity, g: 'from-amber-500 to-orange-500', bg: 'from-amber-50 to-orange-50', border: 'border-amber-100' },
    { title: 'Avg Quiz Time', value: `${avgTime}m`, icon: Clock, g: 'from-teal-500 to-cyan-600', bg: 'from-teal-50 to-cyan-50', border: 'border-teal-100' },
    { title: 'Categories', value: categoryData.length, icon: Target, g: 'from-indigo-500 to-blue-600', bg: 'from-indigo-50 to-blue-50', border: 'border-indigo-100' },
    { title: 'Hard Quizzes', value: levelData[2].value, icon: Zap, g: 'from-red-500 to-pink-500', bg: 'from-red-50 to-pink-50', border: 'border-red-100' },
  ];

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl animate-pulse">
            <BarChart2 className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-500 font-semibold text-lg">Loading Analytics...</p>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* ── Hero Header ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 shadow-2xl">
            {/* BG circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-16 -mb-16" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl flex-shrink-0">
                  <BarChart2 className="h-9 w-9 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">Platform Analytics</h1>
                  <p className="text-purple-200">Real-time insights across quizzes, jobs & users</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{quizzes.length} Quizzes</span>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{jobs.length} Jobs</span>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{users.length} Users</span>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{totalApplications} Applications</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {statCards.map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.04 * i }} whileHover={{ y: -4, scale: 1.04 }}>
              <Card className={`border ${c.border} shadow-md bg-gradient-to-br ${c.bg} overflow-hidden`}>
                <CardContent className="p-4">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.g} flex items-center justify-center shadow-md mb-3`}>
                    <c.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium leading-tight mb-1">{c.title}</p>
                  <p className="text-xl font-black text-gray-800">{c.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Row 1: Area + Donut ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Area Chart */}
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden h-full">
              <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-purple-100 px-6 py-4">
                <CardTitle className="flex items-center gap-2 text-gray-800 text-base">
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                  Monthly Quiz Creation Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="quizCount" stroke="#8b5cf6" strokeWidth={3}
                      fill="url(#areaGrad)" dot={{ fill: '#8b5cf6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8 }} name="Quizzes" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Donut - Difficulty */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden h-full">
              <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 px-6 py-4">
                <CardTitle className="flex items-center gap-2 text-gray-800 text-base">
                  <Award className="w-5 h-5 text-rose-500" />
                  Difficulty Levels
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col items-center">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={levelData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      dataKey="value" paddingAngle={4}>
                      {levelData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 w-full mt-2">
                  {levelData.map((l, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl"
                      style={{ backgroundColor: `${l.fill}15` }}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.fill }} />
                        <span className="text-sm font-semibold text-gray-700">{l.name}</span>
                      </div>
                      <span className="text-sm font-black" style={{ color: l.fill }}>{l.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── Row 2: Bar + Pie ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Grouped Bar - Questions & Marks */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100 px-6 py-4">
                <CardTitle className="flex items-center gap-2 text-gray-800 text-base">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Questions & Marks per Quiz
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={questionsData} barGap={3}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
                    <Bar dataKey="questions" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Questions" maxBarSize={28} />
                    <Bar dataKey="marks" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Marks" maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pie - Category */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 px-6 py-4">
                <CardTitle className="flex items-center gap-2 text-gray-800 text-base">
                  <Trophy className="w-5 h-5 text-green-600" />
                  Quizzes by Category
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="55%" height={240}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90}
                        dataKey="value" paddingAngle={3}>
                        {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2 overflow-y-auto max-h-[240px]">
                    {categoryData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-xs text-gray-600 truncate">{item.name}</span>
                        </div>
                        <span className="text-xs font-black text-gray-800 ml-2">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── Row 3: Jobs Bar + Job Type Pie ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Jobs by Applications */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b border-green-100 px-6 py-4">
                <CardTitle className="flex items-center gap-2 text-gray-800 text-base">
                  <Briefcase className="w-5 h-5 text-green-600" />
                  Top Jobs by Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={topJobs} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#374151', fontWeight: 600 }} width={70} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="applications" radius={[0, 8, 8, 0]} name="Applications" maxBarSize={22}>
                      {topJobs.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Job Type Distribution */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 px-6 py-4">
                <CardTitle className="flex items-center gap-2 text-gray-800 text-base">
                  <Target className="w-5 h-5 text-amber-600" />
                  Job Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={jobTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} name="Jobs" maxBarSize={40}>
                      {jobTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── Row 4: Full width Line ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden mb-6">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-indigo-100 px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-gray-800 text-base">
                <Activity className="w-5 h-5 text-indigo-600" />
                Quiz Duration vs Marks (Top 7)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={questionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                  <Line type="monotone" dataKey="time" stroke="#f59e0b" strokeWidth={3}
                    dot={{ fill: '#f59e0b', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} name="Duration (min)" />
                  <Line type="monotone" dataKey="marks" stroke="#8b5cf6" strokeWidth={3}
                    dot={{ fill: '#8b5cf6', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} name="Total Marks" />
                  <Line type="monotone" dataKey="questions" stroke="#10b981" strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} name="Questions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
