import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Plus, BarChart3, CheckCircle2, Clock, AlertCircle, TrendingUp, Target, CheckCircle, RefreshCw, Calendar, Briefcase, Video, Mail, User, X, MapPin, Phone } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { API } from "@/config/api";

const statusConfig = {
  todo: { label: "To Do", color: "#D4A853" },
  thisweek: { label: "This Week", color: "#6366F1" },
  inprocess: { label: "In Process", color: "#EC4899" },
  done: { label: "Done", color: "#10B981" },
};

const f = (d = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: d } });

export default function KanbanPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleModal, setScheduleModal] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({ title: '', interviewDate: '', interviewTime: '', type: 'video', meetingLink: '' });
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksRes, appsRes, jobsRes] = await Promise.all([
        axios.get(`${API.kanban}/get`, { withCredentials: true }),
        axios.get(`${API.application}/get`, { withCredentials: true }).catch(() => ({ data: { application: [] } })),
        axios.get(`${API.job}/get`, { withCredentials: true }).catch(() => ({ data: { jobs: [] } }))
      ]);
      
      const raw = tasksRes.data;
      let taskList = [];
      
      if (Array.isArray(raw)) {
        taskList = raw;
      } else if (raw?.tasks) {
        taskList = raw.tasks;
      } else if (raw?.data) {
        taskList = Array.isArray(raw.data) ? raw.data : [raw.data];
      } else if (raw?.allTasks) {
        taskList = raw.allTasks;
      } else if (raw?.result) {
        taskList = Array.isArray(raw.result) ? raw.result : [raw.result];
      }
      
      setTasks(taskList);
      setApplications(appsRes.data?.application || []);
      setJobs(jobsRes.data?.jobs || []);
    } catch (err) {
      console.error("Kanban fetch error:", err);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!scheduleForm.title || !scheduleForm.interviewDate || !scheduleForm.interviewTime) {
      return toast.error("Title, date and time are required!");
    }

    setScheduleLoading(true);
    try {
      const taskData = {
        title: scheduleForm.title,
        description: `Interview Type: ${scheduleForm.type}${scheduleForm.meetingLink ? `\nMeeting Link: ${scheduleForm.meetingLink}` : ''}`,
        status: "todo",
        date: scheduleForm.interviewDate,
        interviewType: scheduleForm.type,
        interviewTime: scheduleForm.interviewTime,
        meetingLink: scheduleForm.meetingLink,
        isInterview: true
      };

      await axios.post(`${API.kanban}/add`, taskData, { withCredentials: true });
      toast.success("Interview scheduled successfully!");
      setScheduleModal(null);
      setScheduleForm({ title: '', interviewDate: '', interviewTime: '', type: 'video', meetingLink: '' });
      fetchTasks();
    } catch (error) {
      toast.error("Failed to schedule interview");
    } finally {
      setScheduleLoading(false);
    }
  };

  const acceptedApps = applications.filter(a => a.status === 'accepted');
  const appliedCount = applications.length;
  const interviewTasks = tasks.filter(t => t.isInterview);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const groupedTasks = { todo: [], thisweek: [], inprocess: [], done: [] };
  tasks.forEach(task => {
    const status = task.status?.toLowerCase();
    if (groupedTasks[status]) {
      groupedTasks[status].push(task);
    } else {
      groupedTasks.todo.push(task);
    }
  });

  const totalTasks = tasks.length;
  const completedTasks = groupedTasks.done.length;
  const pendingTasks = groupedTasks.todo.length;
  const thisWeekTasks = groupedTasks.thisweek.length;
  const inProcessTasks = groupedTasks.inprocess.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statsCards = [
    { label: "Total Tasks", value: totalTasks, icon: Target, color: "#D4A853" },
    { label: "This Week", value: thisWeekTasks, icon: Clock, color: "#6366F1" },
    { label: "In Process", value: inProcessTasks, icon: AlertCircle, color: "#EC4899" },
    { label: "Completed", value: completedTasks, icon: CheckCircle2, color: "#10B981" },
  ];

  const barChartData = [
    { name: "To Do", value: groupedTasks.todo.length, fill: "#D4A853" },
    { name: "This Week", value: groupedTasks.thisweek.length, fill: "#6366F1" },
    { name: "In Process", value: groupedTasks.inprocess.length, fill: "#EC4899" },
    { name: "Done", value: groupedTasks.done.length, fill: "#10B981" },
  ];

  return (
    <div className="min-h-screen p-5 sm:p-8"
      style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .kanban-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .kanban-card { background: linear-gradient(145deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%); border: 1px solid rgba(255,255,255,0.08); transition: all 0.3s ease; }
        .kanban-card:hover { transform: translateY(-2px); border-color: rgba(212,168,83,0.4); }
      `}</style>

      <div className="kanban-root max-w-7xl mx-auto space-y-6">
        <motion.div {...f(0)} className="relative rounded-3xl overflow-hidden p-6 sm:p-8"
          style={{ background: 'linear-gradient(135deg,rgba(212,168,83,0.2) 0%,rgba(30,41,59,0.95) 100%)', border: '1px solid rgba(212,168,83,0.2)' }}>
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(212,168,83,0.4),transparent 70%)' }} />
          <div className="absolute -bottom-8 left-1/4 w-32 h-32 rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(16,185,129,0.3),transparent 70%)' }} />
          
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                style={{ background: 'rgba(212,168,83,0.2)', border: '1px solid rgba(212,168,83,0.3)' }}>
                <LayoutDashboard size={12} style={{ color: '#D4A853' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#D4A853', letterSpacing: '0.1em' }}>KANBAN</span>
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Task <span style={{ background: 'linear-gradient(135deg, #D4A853, #E8C17A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard</span>
              </h1>
              <p className="text-white/50 text-sm mt-2 max-w-md">
                Track and manage your tasks efficiently.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {statsCards.map((stat, i) => (
                <motion.div key={stat.label} {...f(0.1 + i * 0.05)}
                  className="px-3 py-2 rounded-xl text-center"
                  style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                  <stat.icon size={14} style={{ color: stat.color }} className="mx-auto mb-1" />
                  <p className="text-lg font-black text-white">{stat.value}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={fetchTasks}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/taskForm')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white w-fit shrink-0"
              style={{ background: 'linear-gradient(135deg, #D4A853, #C8884A)', boxShadow: '0 4px 20px rgba(212,168,83,0.4)' }}>
              <Plus size={14} /> Create Task
            </motion.button>
          </div>
        </motion.div>

        <motion.div {...f(0.2)} className="kanban-card rounded-2xl p-5"
          style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">Tasks by Status</h3>
            <TrendingUp size={16} style={{ color: '#D4A853' }} />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barChartData.map((entry, index) => (
                  <rect key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...f(0.25)} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(groupedTasks).map(([key, taskList]) => {
            const config = statusConfig[key];
            return (
              <motion.div key={key} {...f(0.3)}
                className="kanban-card rounded-2xl p-4"
                style={{ background: `${config.color}08`, border: `1px solid ${config.color}25` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: config.color }} />
                    <span className="text-xs font-bold" style={{ color: config.color }}>{config.label}</span>
                  </div>
                  <span className="text-lg font-black text-white">{taskList.length}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: totalTasks > 0 ? `${(taskList.length / totalTasks) * 100}%` : '0%' }}
                    className="h-full rounded-full"
                    style={{ background: config.color }} />
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {taskList.slice(0, 3).map(task => (
                    <div key={task._id} className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <p className="text-xs font-medium text-white truncate">{task.title}</p>
                    </div>
                  ))}
                  {taskList.length > 3 && (
                    <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      +{taskList.length - 3} more
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div {...f(0.35)} className="kanban-card rounded-2xl overflow-hidden"
          style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <h3 className="font-bold text-white text-sm">Recent Tasks</h3>
            <button onClick={() => navigate('/Taskkanbanboard')}
              className="text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(212,168,83,0.2)', color: '#D4A853' }}>
              View Board
            </button>
          </div>
          <div className="p-3 space-y-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
              ))
            ) : tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>No tasks yet</p>
                <button onClick={() => navigate('/taskForm')}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #D4A853, #C8884A)' }}>
                  Create First Task
                </button>
              </div>
            ) : tasks.slice(0, 5).map((task, i) => (
              <motion.div key={task._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.04 }}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-all"
                onClick={() => navigate(`/getTask/${task._id}`)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${statusConfig[task.status]?.color || '#D4A853'}20`, border: `1px solid ${statusConfig[task.status]?.color || '#D4A853'}30` }}>
                  <CheckCircle size={16} style={{ color: statusConfig[task.status]?.color || '#D4A853' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{task.title}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {statusConfig[task.status]?.label || 'Unknown'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {acceptedApps.length > 0 && (
          <motion.div {...f(0.4)} className="kanban-card rounded-2xl overflow-hidden"
            style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <h3 className="font-bold text-white text-sm">Accepted Applications - Schedule Interview</h3>
              <Briefcase size={16} style={{ color: '#10B981' }} />
            </div>
            <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
              {acceptedApps.map((app, i) => (
                <motion.div key={app._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(16,185,129,0.2)' }}>
                    <Briefcase size={20} style={{ color: '#10B981' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{app.job?.title || 'Position'}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{app.job?.company?.name || 'Company'}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Mail size={10} style={{ color: 'rgba(255,255,255,0.4)' }} />
                      <span className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{app.applicant?.email || app.job?.company?.email || 'No email'}</span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setScheduleModal(app)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', boxShadow: '0 4px 15px rgba(236,72,153,0.3)' }}>
                    <Calendar size={14} className="inline mr-1" /> Schedule
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {interviewTasks.length > 0 && (
          <motion.div {...f(0.45)} className="kanban-card rounded-2xl overflow-hidden"
            style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <h3 className="font-bold text-white text-sm">Scheduled Interviews</h3>
              <Calendar size={16} style={{ color: '#EC4899' }} />
            </div>
            <div className="p-3 space-y-2">
              {interviewTasks.map((task, i) => (
                <motion.div key={task._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.04 }}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-all"
                  style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(236,72,153,0.2)' }}>
                    {task.interviewType === 'video' ? <Video size={16} style={{ color: '#EC4899' }} /> : <Phone size={16} style={{ color: '#EC4899' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {task.interviewDate || task.date ? new Date(task.interviewDate || task.date).toLocaleDateString() : 'No date'}
                      </span>
                      {task.interviewTime && (
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          at {task.interviewTime}
                        </span>
                      )}
                    </div>
                  </div>
                  <CheckCircle2 size={16} style={{ color: '#10B981' }} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {scheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setScheduleModal(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl p-6"
              style={{ background: 'rgba(30,41,59,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Schedule Interview</h2>
                <button onClick={() => setScheduleModal(null)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all">
                  <X size={20} style={{ color: 'rgba(255,255,255,0.5)' }} />
                </button>
              </div>

              <div className="mb-5 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <p className="text-sm font-bold text-white">{scheduleModal.job?.title}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{scheduleModal.job?.company?.name}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Mail size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{scheduleModal.applicant?.email || scheduleModal.job?.company?.email || 'No email'}</span>
                </div>
              </div>

              <form onSubmit={handleScheduleInterview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Interview Title</label>
                  <input type="text" value={scheduleForm.title}
                    onChange={e => setScheduleForm({...scheduleForm, title: e.target.value})}
                    placeholder="e.g., Technical Interview"
                    className="w-full p-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-pink-500 focus:outline-none"
                    required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Date</label>
                    <input type="date" value={scheduleForm.interviewDate}
                      onChange={e => setScheduleForm({...scheduleForm, interviewDate: e.target.value})}
                      className="w-full p-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white focus:border-pink-500 focus:outline-none"
                      required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Time</label>
                    <input type="time" value={scheduleForm.interviewTime}
                      onChange={e => setScheduleForm({...scheduleForm, interviewTime: e.target.value})}
                      className="w-full p-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white focus:border-pink-500 focus:outline-none"
                      required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Meeting Link</label>
                  <input type="url" value={scheduleForm.meetingLink}
                    onChange={e => setScheduleForm({...scheduleForm, meetingLink: e.target.value})}
                    placeholder="https://meet.google.com/..."
                    className="w-full p-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-pink-500 focus:outline-none" />
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button type="submit" disabled={scheduleLoading}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', boxShadow: '0 4px 15px rgba(236,72,153,0.3)' }}>
                    {scheduleLoading ? 'Scheduling...' : 'Schedule Interview'}
                  </motion.button>
                  <motion.button type="button" onClick={() => setScheduleModal(null)}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-xl text-sm font-bold"
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
