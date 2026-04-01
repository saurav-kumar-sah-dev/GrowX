import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Search, Plus, MapPin, Clock, Users, Building2, DollarSign, Star, TrendingUp, Eye, Filter, Calendar, Award, Target, BarChart2, Activity, Edit, MoreVertical, AlertCircle, Zap, Check, ChevronDown, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
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
  green: "#10b981",
  greenDark: "#059669",
  greenDim: "rgba(16,185,129,0.08)",
  greenBorder: "rgba(16,185,129,0.15)",
};

const getJobColors = (jobType) => {
  if (jobType === 'Internship') {
    return {
      primary: C.green,
      primaryLight: C.greenDark,
      dim: C.greenDim,
      border: C.greenBorder,
      gradient: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`,
      gradientBar: `linear-gradient(135deg, ${C.green}, #34d399)`,
      text: '#10b981'
    };
  }
  return {
    primary: C.gold,
    primaryLight: C.goldLight,
    dim: C.goldDim,
    border: C.goldBorder,
    gradient: `linear-gradient(135deg, ${C.gold}, #C8884A)`,
    gradientBar: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
    text: C.gold
  };
};

const COLORS = ['#D4A853', '#C8884A', '#E8C17A', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl shadow-2xl p-4 min-w-[140px]" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
        {label && <p className="font-bold text-sm mb-2" style={{ color: C.white }}>{label}</p>}
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-xs" style={{ color: C.muted }}>{p.name}:</span>
            <span className="text-xs font-bold" style={{ color: C.white }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AdminAllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API.job}/getadminjobs`, { withCredentials: true });
      setJobs(res.data.jobs || []);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const res = await axios.put(`${API.job}/update/${jobId}`, { status: newStatus }, { withCredentials: true });
      if (res.data.success) {
        setJobs(prev => prev.map(j => j._id === jobId ? { ...j, status: newStatus } : j));
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
    setOpenMenu(null);
  };

  const handleToggleUrgent = async (jobId, urgent) => {
    try {
      const res = await axios.put(`${API.job}/update/${jobId}`, { urgent }, { withCredentials: true });
      if (res.data.success) {
        setJobs(prev => prev.map(j => j._id === jobId ? { ...j, urgent } : j));
        toast.success(urgent ? 'Job marked as urgent' : 'Urgent tag removed');
      }
    } catch (err) {
      toast.error('Failed to update');
    }
    setOpenMenu(null);
  };

  const handleToggleFeatured = async (jobId, featured) => {
    try {
      const res = await axios.put(`${API.job}/update/${jobId}`, { featured }, { withCredentials: true });
      if (res.data.success) {
        setJobs(prev => prev.map(j => j._id === jobId ? { ...j, featured } : j));
        toast.success(featured ? 'Job marked as featured' : 'Featured tag removed');
      }
    } catch (err) {
      toast.error('Failed to update');
    }
    setOpenMenu(null);
  };

  const filteredJobs = jobs.filter(job =>
    job.jobType !== 'Internship' &&
    (job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeJobs = jobs.filter(job => job.status !== 'closed');
  const totalApplications = jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);
  const internshipCount = jobs.filter(j => j.jobType === 'Internship').length;
  const jobCount = jobs.filter(j => j.jobType !== 'Internship').length;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active': return { bg: 'rgba(16,185,129,0.15)', color: '#10b981', label: 'Active', icon: Check };
      case 'paused': return { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', label: 'Paused', icon: Clock };
      case 'closed': return { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Closed', icon: X };
      case 'draft': return { bg: 'rgba(107,114,128,0.15)', color: '#6b7280', label: 'Draft', icon: AlertCircle };
      default: return { bg: 'rgba(107,114,128,0.15)', color: '#6b7280', label: status, icon: AlertCircle };
    }
  };

  const QuickActionsMenu = ({ job, onClose }) => {
    const statusConfig = getStatusConfig(job.status);
    const StatusIcon = statusConfig.icon;

    return (
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-2xl z-50 overflow-hidden"
        style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}
      >
        <div className="p-2 border-b" style={{ borderColor: C.goldBorder }}>
          <p className="text-xs font-semibold px-3 py-2" style={{ color: C.muted }}>Quick Actions</p>
        </div>
        <div className="p-2">
          <button
            onClick={() => navigate(`/admin/jobs/edit/${job._id}`)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#252532] transition-colors"
          >
            <Edit className="w-4 h-4" style={{ color: C.gold }} />
            <span className="text-sm font-medium" style={{ color: C.white }}>Edit Job</span>
          </button>
          <button
            onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#252532] transition-colors"
          >
            <Users className="w-4 h-4" style={{ color: C.gold }} />
            <span className="text-sm font-medium" style={{ color: C.white }}>View Applicants</span>
          </button>
          <div className="my-2 border-t" style={{ borderColor: C.goldBorder }} />
          <button
            onClick={() => handleToggleUrgent(job._id, !job.urgent)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#252532] transition-colors"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {job.urgent ? <Zap className="w-4 h-4" style={{ color: '#ef4444' }} /> : <Zap className="w-4 h-4" style={{ color: C.muted }} />}
            </div>
            <span className="text-sm font-medium" style={{ color: job.urgent ? '#ef4444' : C.white }}>{job.urgent ? 'Remove Urgent' : 'Mark Urgent'}</span>
          </button>
          <button
            onClick={() => handleToggleFeatured(job._id, !job.featured)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#252532] transition-colors"
          >
            <Star className="w-4 h-4" style={{ color: job.featured ? '#f59e0b' : C.muted, fill: job.featured ? '#f59e0b' : 'none' }} />
            <span className="text-sm font-medium" style={{ color: job.featured ? '#f59e0b' : C.white }}>{job.featured ? 'Remove Featured' : 'Mark Featured'}</span>
          </button>
          <div className="my-2 border-t" style={{ borderColor: C.goldBorder }} />
          <p className="text-xs font-semibold px-3 py-2" style={{ color: C.muted }}>Change Status</p>
          {['active', 'paused', 'closed', 'draft'].map(status => {
            const cfg = getStatusConfig(status);
            const StatusIconInner = cfg.icon;
            return (
              <button
                key={status}
                onClick={() => handleStatusChange(job._id, status)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${job.status === status ? '' : 'hover:bg-[#252532]'}`}
                style={{ background: job.status === status ? cfg.bg : 'transparent' }}
              >
                <StatusIconInner className="w-4 h-4" style={{ color: cfg.color }} />
                <span className="text-sm font-medium" style={{ color: job.status === status ? cfg.color : C.white }}>{cfg.label}</span>
                {job.status === status && <Check className="w-4 h-4 ml-auto" style={{ color: cfg.color }} />}
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4" style={{ borderColor: C.gold }}></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl" style={{ background: `linear-gradient(135deg, ${C.gold}, #C8884A)` }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(30%,-30%)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(-30%,30%)' }} />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                  <Briefcase className="h-9 w-9 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">Job Management</h1>
                  <p className="text-white/70">Manage all job postings & track applications</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{jobCount} Jobs</span>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{activeJobs.length} Active</span>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{totalApplications} Applications</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={() => navigate('/admin/jobs/create')}
                    className="h-12 px-6 font-semibold shadow-xl" style={{ background: C.obsidian, color: C.gold }}>
                    <Plus className="w-5 h-5 mr-2" />Post Job
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { title: 'Total Jobs', value: jobs.length, icon: Briefcase, g: 'from-amber-500 to-orange-500' },
            { title: 'Active Jobs', value: activeJobs.length, icon: TrendingUp, g: 'from-amber-400 to-yellow-500' },
            { title: 'Applications', value: totalApplications, icon: Users, g: 'from-yellow-400 to-amber-500' },
            { title: 'Companies', value: new Set(jobs.map(job => job.company?._id)).size, icon: Building2, g: 'from-orange-400 to-red-500' },
            { title: 'Avg Salary', value: jobs.length ? `₹${Math.round(jobs.reduce((s, j) => s + (j.salary || 0), 0) / jobs.length / 1000)}K` : '₹0', icon: DollarSign, g: 'from-amber-300 to-yellow-400' },
            { title: 'This Month', value: jobs.filter(j => new Date(j.createdAt).getMonth() === new Date().getMonth()).length, icon: Calendar, g: 'from-yellow-300 to-amber-400' },
          ].map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.04 * i }} whileHover={{ y: -4, scale: 1.04 }}>
              <div className="rounded-xl p-4 overflow-hidden" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.g} flex items-center justify-center shadow-md mb-3`}>
                  <c.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-medium leading-tight mb-1" style={{ color: C.muted }}>{c.title}</p>
                <p className="text-xl font-black" style={{ color: C.white }}>{c.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Search & Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <div className="rounded-2xl p-6 overflow-hidden" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: C.muted }} />
                <Input className="pl-12 h-12 rounded-xl transition-all shadow-sm"
                  placeholder="Search jobs by title, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ background: C.surface, border: `1px solid ${C.goldBorder}`, color: C.white }}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="h-12 px-4 rounded-xl" style={{ borderColor: C.goldBorder, color: C.gold }}>
                  <Filter className="w-4 h-4 mr-2" />Filter
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs px-3 py-1 rounded-full font-medium cursor-pointer" style={{ background: C.goldDim, color: C.gold }}>All Jobs ({jobs.length})</span>
              <span className="text-xs px-3 py-1 rounded-full font-medium cursor-pointer" style={{ background: C.surface, color: C.muted }}>Active ({activeJobs.length})</span>
              <span className="text-xs px-3 py-1 rounded-full font-medium cursor-pointer" style={{ background: C.surface, color: C.muted }}>Remote</span>
              <span className="text-xs px-3 py-1 rounded-full font-medium cursor-pointer" style={{ background: C.surface, color: C.muted }}>Full-time</span>
            </div>
          </div>
        </motion.div>

        {/* Premium Jobs Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => {
            const colors = getJobColors(job.jobType);
            const statusConfig = getStatusConfig(job.status);
            const StatusIcon = statusConfig.icon;
            return (
            <motion.div key={job._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }} whileHover={{ y: -8, scale: 1.02 }}
              className="rounded-xl overflow-hidden relative group"
              onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
              style={{ background: C.card, border: `1px solid ${colors.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <div className="h-1.5 group-hover:h-2 transition-all" style={{ background: colors.gradientBar }} />
              
              <div className="absolute top-4 right-4 z-10">
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === job._id ? null : job._id); }}
                    className="p-2 rounded-xl transition-all hover:scale-110"
                    style={{ background: C.surface, color: C.muted }}
                  >
                    <MoreVertical size={18} />
                  </button>
                  <AnimatePresence>
                    {openMenu === job._id && (
                      <QuickActionsMenu job={job} />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0 pr-8">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-xl truncate transition-colors" style={{ color: C.white }}>{job.title}</h3>
                        {job.urgent && (
                          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold animate-pulse" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
                            <Zap size={10} /> URGENT
                          </span>
                        )}
                        {job.featured && (
                          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}>
                            <Star size={10} fill="#f59e0b" /> FEATURED
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: C.surface }}>
                          <Building2 className="w-3 h-3" style={{ color: colors.primary }} />
                        </div>
                        <p className="text-sm truncate font-medium" style={{ color: C.muted }}>{job.company?.name}</p>
                      </div>
                    </div>
                    {job.company?.logo ? (
                      <div className="flex-shrink-0 ml-4">
                        <img src={job.company.logo} alt={job.company.name}
                          className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 group-hover:scale-110 transition-transform" style={{ borderColor: colors.border }} />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: colors.gradient }}>
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: statusConfig.bg, color: statusConfig.color }}>
                      <StatusIcon size={12} /> {statusConfig.label}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: C.surface }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: colors.dim }}>
                          <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold mb-0.5" style={{ color: colors.primary }}>Location</p>
                          <p className="text-sm truncate font-medium" style={{ color: C.white }}>{job.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: C.surface }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: colors.dim }}>
                          <Users className="w-4 h-4" style={{ color: colors.primary }} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-0.5" style={{ color: colors.primary }}>Applications</p>
                          <p className="text-sm font-bold" style={{ color: C.white }}>{job.applications?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: C.surface }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: colors.dim }}>
                        <Clock className="w-4 h-4" style={{ color: colors.primary }} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-0.5" style={{ color: colors.primary }}>Posted</p>
                        <p className="text-sm font-medium" style={{ color: C.white }}>
                          {new Date(job.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: colors.primary, color: job.jobType === 'Internship' ? 'white' : C.obsidian }}>{job.jobType}</span>
                      <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: C.surface, color: colors.primary }}>{job.experienceLevel} exp</span>
                      {job.salary && (
                        <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: C.surface, color: colors.primary }}>
                          <DollarSign className="w-3 h-3 inline mr-1" />₹{job.salary}
                        </span>
                      )}
                    </div>
                    
                    {job.applications?.length > 0 && (
                      <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium" style={{ color: C.muted }}>Popularity</span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} style={{
                                color: i < Math.min(5, Math.ceil((job.applications?.length || 0) / 2)) ? colors.primary : C.muted,
                                fill: i < Math.min(5, Math.ceil((job.applications?.length || 0) / 2)) ? colors.primary : 'none'
                              }} />
                            ))}
                            <span className="ml-2 text-xs font-medium" style={{ color: C.muted }}>({job.applications?.length})</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* View Applicants Button */}
                    <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
                      <Button 
                        size="sm" 
                        className="w-full h-9 text-xs font-semibold"
                        style={{ background: colors.primary, color: job.jobType === 'Internship' ? 'white' : C.obsidian }}
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/jobs/${job._id}/applicants`); }}
                      >
                        <Users className="w-3 h-3 mr-1" /> View Applicants ({job.applications?.length || 0})
                      </Button>
                    </div>
                  </div>
              </div>
            </motion.div>
          );
          })}
        </motion.div>

        {/* ── Job Applications Analytics Graph ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-10 mb-8">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: C.goldDim }}>
              <BarChart2 className="w-5 h-5" style={{ color: C.gold }} />
            </div>
            <div>
              <h2 className="text-2xl font-black" style={{ color: C.white }}>Job Applications Analytics</h2>
              <p className="text-sm" style={{ color: C.muted }}>Visual insights across all job postings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Area Chart — Monthly Job Postings */}
            <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <div className="rounded-3xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
                <div className="px-6 py-4 border-b" style={{ borderColor: C.goldBorder, background: C.surface }}>
                  <div className="flex items-center gap-2 text-base" style={{ color: C.white }}>
                    <TrendingUp className="w-5 h-5" style={{ color: C.gold }} />
                    Monthly Job Postings Trend
                  </div>
                </div>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={(() => {
                      const map = {};
                      jobs.forEach(j => {
                        if (j.createdAt) {
                          const m = new Date(j.createdAt).toLocaleString('default', { month: 'short' });
                          map[m] = (map[m] || 0) + 1;
                        }
                      });
                      return Object.entries(map).map(([month, count]) => ({ month, count }));
                    })()}>
                      <defs>
                        <linearGradient id="jobAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.gold} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.dim} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="count" stroke={C.gold} strokeWidth={3}
                        fill="url(#jobAreaGrad)" dot={{ fill: C.gold, r: 5, strokeWidth: 2, stroke: C.obsidian }}
                        activeDot={{ r: 8 }} name="Jobs Posted" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </div>
            </motion.div>

            {/* Pie — Job Type Distribution */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <div className="rounded-3xl overflow-hidden h-full" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
                <div className="px-6 py-4 border-b" style={{ borderColor: C.goldBorder, background: C.surface }}>
                  <div className="flex items-center gap-2 text-base" style={{ color: C.white }}>
                    <Target className="w-5 h-5" style={{ color: C.gold }} />
                    Job Type Distribution
                  </div>
                </div>
                <CardContent className="p-6 flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={(() => {
                          const map = {};
                          jobs.forEach(j => { if (j.jobType) map[j.jobType] = (map[j.jobType] || 0) + 1; });
                          return Object.entries(map).map(([name, value]) => ({ name, value }));
                        })()}
                        cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                        dataKey="value" paddingAngle={4}>
                        {jobs.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2 w-full mt-2">
                    {(() => {
                      const map = {};
                      jobs.forEach(j => { if (j.jobType) map[j.jobType] = (map[j.jobType] || 0) + 1; });
                      return Object.entries(map).map(([name, value], i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl"
                          style={{ backgroundColor: `${COLORS[i % COLORS.length]}18` }}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="text-sm font-semibold" style={{ color: C.white }}>{name}</span>
                          </div>
                          <span className="text-sm font-black" style={{ color: COLORS[i % COLORS.length] }}>{value}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </CardContent>
              </div>
            </motion.div>
          </div>

          {/* Bar Chart — Top Jobs by Applications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <div className="rounded-3xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
              <div className="px-6 py-4 border-b" style={{ borderColor: C.goldBorder, background: C.surface }}>
                <div className="flex items-center gap-2 text-base" style={{ color: C.white }}>
                  <Activity className="w-5 h-5" style={{ color: C.gold }} />
                  Job Applications Analytics Graph
                </div>
              </div>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={[...jobs]
                      .sort((a, b) => (b.applications?.length || 0) - (a.applications?.length || 0))
                      .slice(0, 8)
                      .map(j => ({
                        name: j.title?.length > 14 ? j.title.slice(0, 14) + '..' : (j.title || 'N/A'),
                        applications: j.applications?.length || 0,
                        company: j.company?.name || '',
                      }))}
                    barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.dim} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px', color: C.muted }} />
                    <Bar dataKey="applications" radius={[8, 8, 0, 0]} name="Applications" maxBarSize={44}>
                      {jobs.slice(0, 8).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Empty State */}
        {filteredJobs.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 rounded-3xl flex items-center justify-center shadow-xl" style={{ background: C.goldDim }}>
              <Briefcase size={64} style={{ color: C.gold }} />
            </div>
            <h3 className="text-3xl font-black mb-3" style={{ color: C.white }}>No jobs found</h3>
            <p className="text-lg mb-6" style={{ color: C.muted }}>Try adjusting your search criteria or create a new job posting</p>
            <Button onClick={() => navigate('/admin/jobs/create')}
              className="h-12 px-8 shadow-lg font-semibold" style={{ background: C.gold, color: C.obsidian }}>
              <Plus className="w-5 h-5 mr-2" />Create First Job
            </Button>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAllJobs;