import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Search, Users, Building2, 
  MapPin, Clock, ChevronRight, Zap,
  CheckCircle, XCircle, Clock3, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { toast } from 'sonner';
import { API } from '@/config/api';

const chartData = [
  { name: 'Jan', jobs: 12, applications: 45 },
  { name: 'Feb', jobs: 28, applications: 82 },
  { name: 'Mar', jobs: 45, applications: 120 },
  { name: 'Apr', jobs: 38, applications: 95 },
  { name: 'May', jobs: 52, applications: 156 },
  { name: 'Jun', jobs: 65, applications: 198 },
];

const f = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d, ease: [0.23, 1, 0.32, 1] }
});

const STATUS_STYLES = {
  pending: { bg: 'rgba(251,191,36,0.15)', color: '#FBBF24', border: 'rgba(251,191,36,0.3)', label: 'Pending', icon: Clock3 },
  accepted: { bg: 'rgba(16,185,129,0.15)', color: '#10B981', border: 'rgba(16,185,129,0.3)', label: 'Accepted', icon: CheckCircle },
  rejected: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', border: 'rgba(239,68,68,0.3)', label: 'Rejected', icon: XCircle },
};

const C = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  success: '#10B981',
  warning: '#FBBF24',
  error: '#EF4444',
  muted: '#94A3B8',
  white: '#F5F0E6',
};

const StatCard = ({ label, value, icon: Icon, color, delay }) => (
  <motion.div {...f(delay)} 
    className="rounded-2xl p-3 sm:p-4 lg:p-5 border transition-all hover:scale-[1.02]"
    style={{ background: `${color}10`, borderColor: `${color}30` }}>
    <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center mb-2 sm:mb-3"
      style={{ background: `${color}20` }}>
      <Icon size={16} className="sm:w-[18px] sm:h-[18px]" style={{ color }} />
    </div>
    <p className="text-xl sm:text-2xl lg:text-3xl font-black text-white">{value}</p>
    <p className="text-[10px] sm:text-xs font-semibold mt-1" style={{ color }}>{label}</p>
  </motion.div>
);

const Jobpage = () => {
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`${API.job}/get`, { withCredentials: true }),
      axios.get(`${API.application}/get`, { withCredentials: true })
    ])
      .then(([jobsRes, appsRes]) => {
        setJobs(jobsRes.data?.jobs || []);
        setMyApplications(appsRes.data?.application || []);
      })
      .catch(() => toast.error('Failed to fetch data'))
      .finally(() => setLoading(false));
  }, []);

  const getApplicationStatus = (jobId) => {
    const app = myApplications.find(a => 
      (a.job?._id && a.job._id.toString() === jobId) || a.jobId === jobId
    );
    return app?.status || null;
  };

  const filtered = jobs.filter(j => {
    const matchSearch = j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.name?.toLowerCase().includes(search.toLowerCase()) ||
      j.description?.toLowerCase().includes(search.toLowerCase());
    if (filterType !== 'all') return matchSearch && j.jobType === filterType;
    return matchSearch;
  });

  const acceptedCount = myApplications.filter(a => a.status === 'accepted').length;
  const pendingCount = myApplications.filter(a => a.status === 'pending').length;
  const rejectedCount = myApplications.filter(a => a.status === 'rejected').length;

  const statusChartData = [
    { name: 'Accepted', value: acceptedCount, fill: C.success },
    { name: 'Pending', value: pendingCount, fill: C.warning },
    { name: 'Rejected', value: rejectedCount, fill: C.error },
  ];

  const jobTypes = ['all', 'Full-time', 'Part-time', 'Internship', 'Remote'];

  return (
    <div className="min-h-screen p-3 sm:p-5 lg:p-8"
      style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .job-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .job-card { background: linear-gradient(145deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.98) 100%); border: 1px solid rgba(255,255,255,0.08); transition: all 0.3s ease; }
        .job-card:hover { transform: translateY(-3px); border-color: rgba(99,102,241,0.4); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .job-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .job-scroll::-webkit-scrollbar-track { background: transparent; }
        .job-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 2px; }
      `}</style>

      <div className="job-root max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Hero Section */}
        <motion.div {...f(0)} className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-4 sm:p-6 lg:p-8"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(30,41,59,0.95) 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div className="absolute -top-12 -right-12 sm:-top-16 sm:-right-16 w-32 sm:w-48 h-32 sm:h-48 rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.4),transparent 70%)' }} />
          
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full mb-2 sm:mb-4"
                style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
                  style={{ background: C.success, boxShadow: `0 0 8px ${C.success}` }} />
                <span className="text-[10px] sm:text-xs font-bold" style={{ color: '#A5B4FC', letterSpacing: '0.1em' }}>JOBS PORTAL</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
                Find Your <span style={{ background: 'linear-gradient(135deg, #6366F1, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dream Job</span>
              </h1>
              <p className="text-white/50 text-xs sm:text-sm mt-1 sm:mt-2 max-w-xs sm:max-w-md">
                Browse positions and apply to start your career.
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-white w-full sm:w-fit"
              style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, boxShadow: `0 4px 20px rgba(99,102,241,0.4)` }}>
              <Briefcase size={14} className="sm:w-4 sm:h-4" /> Browse Jobs
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 sm:gap-3 lg:gap-4">
          <StatCard label="Total Jobs" value={loading ? '—' : jobs.length} icon={Briefcase} color={C.primary} delay={0.05} />
          <StatCard label="Active" value={loading ? '—' : jobs.filter(j => j.status === 'active').length} icon={TrendingUp} color={C.success} delay={0.1} />
          <StatCard label="Companies" value={loading ? '—' : new Set(jobs.map(j => j.company?._id)).size} icon={Building2} color="#F59E0B" delay={0.15} />
          <StatCard label="Applied" value={loading ? '—' : myApplications.length} icon={Users} color="#8B5CF6" delay={0.2} />
          <StatCard label="Accepted" value={loading ? '—' : acceptedCount} icon={CheckCircle} color={C.success} delay={0.25} />
          <StatCard label="Pending" value={loading ? '—' : pendingCount} icon={Clock3} color={C.warning} delay={0.3} />
          <StatCard label="Rejected" value={loading ? '—' : rejectedCount} icon={XCircle} color={C.error} delay={0.35} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          <motion.div {...f(0.15)} className="job-card rounded-2xl p-3 sm:p-5"
            style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h3 className="font-bold text-white text-xs sm:text-sm">Jobs & Applications Trend</h3>
              <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: C.primary }} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: C.success }} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Applications</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160} className="sm:!h-[200px]">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.primary} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={C.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.success} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={C.success} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Area type="monotone" dataKey="jobs" stroke={C.primary} strokeWidth={2} fillOpacity={1} fill="url(#colorJobs)" />
                <Area type="monotone" dataKey="applications" stroke={C.success} strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div {...f(0.2)} className="job-card rounded-2xl p-3 sm:p-5"
            style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="font-bold text-white text-xs sm:text-sm mb-2 sm:mb-4">My Application Status</h3>
            <ResponsiveContainer width="100%" height={160} className="sm:!h-[200px]">
              <BarChart data={statusChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {statusChartData.map((entry, index) => (
                    <rect key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <motion.div {...f(0.25)} className="flex flex-col gap-2 sm:gap-3">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" size={14} style={{ color: C.muted }} />
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search jobs, companies..."
                className="w-full pl-9 sm:pl-11 pr-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm"
                style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold sm:hidden"
              style={{ background: 'rgba(99,102,241,0.2)', color: C.primary, border: '1px solid rgba(99,102,241,0.3)' }}>
              Filters {showFilters ? '▲' : '▼'}
            </button>
          </div>
          <div className={`flex gap-2 overflow-x-auto pb-1 job-scroll ${showFilters ? 'flex' : 'hidden sm:flex'}`}>
            {jobTypes.map(type => (
              <button key={type}
                onClick={() => setFilterType(type)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold whitespace-nowrap capitalize transition-all shrink-0"
                style={{
                  background: filterType === type ? `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})` : 'rgba(30,41,59,0.8)',
                  color: filterType === type ? '#fff' : C.muted,
                  border: `1px solid ${filterType === type ? C.primary : 'rgba(255,255,255,0.1)'}`
                }}>
                {type}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Job List */}
        <div className="space-y-2 sm:space-y-3">
          <AnimatePresence mode='popLayout'>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="h-20 sm:h-24 lg:h-28 rounded-xl animate-pulse" 
                  style={{ background: 'rgba(30,41,59,0.6)' }} />
              ))
            ) : filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-12 sm:py-16" style={{ color: C.muted }}>
                <Briefcase size={40} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-30" />
                <p className="text-base sm:text-lg font-semibold text-white">No jobs found</p>
                <p className="text-xs sm:text-sm mt-1">Try adjusting your search or filters</p>
              </motion.div>
            ) : filtered.map((job, i) => (
              <motion.div key={job._id || i} {...f(0.3 + i * 0.05)}
                layout
                className="job-card rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 cursor-pointer"
                style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.3)' }}>
                    {job.company?.logo ? (
                      <img src={job.company.logo} alt="" className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-lg object-contain" />
                    ) : (
                      <Briefcase size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" style={{ color: C.primary }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-white truncate">{job.title}</h3>
                        <p className="text-xs sm:text-sm" style={{ color: C.muted }}>{job.company?.name || 'Company'}</p>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold"
                          style={{ 
                            background: job.status === 'active' ? `${C.success}20` : `${C.error}20`, 
                            color: job.status === 'active' ? C.success : C.error, 
                            border: `1px solid ${job.status === 'active' ? `${C.success}40` : `${C.error}40`}` 
                          }}>
                          {job.status === 'active' ? 'Active' : 'Closed'}
                        </span>
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold hidden sm:inline-block"
                          style={{ background: `${C.primary}20`, color: C.primary, border: `1px solid ${C.primary}40` }}>
                          {job.jobType}
                        </span>
                      </div>
                    </div>
                    
                    {getApplicationStatus(job._id) && (
                      <div className="mt-1.5 sm:mt-2">
                        {(() => {
                          const status = getApplicationStatus(job._id);
                          const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
                          const StatusIcon = style.icon;
                          return (
                            <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold"
                              style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                              <StatusIcon size={10} className="sm:w-3 sm:h-3" /> {style.label}
                            </span>
                          );
                        })()}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-x-2 sm:gap-3 gap-y-1 mt-1.5 sm:mt-2">
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs" style={{ color: C.muted }}>
                        <MapPin size={10} className="sm:w-3 sm:h-3" /> {job.location || 'Remote'}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs sm:hidden" style={{ color: C.muted }}>
                        <Clock size={10} /> {job.jobType}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs" style={{ color: C.muted }}>
                        <Users size={10} className="sm:w-3 sm:h-3" /> {job.applications?.length || 0} applicants
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1 text-[10px] sm:text-xs" style={{ color: C.success }}>
                          <Zap size={10} className="sm:w-3 sm:h-3" /> {job.salary}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px] shrink-0 hidden sm:block" style={{ color: 'rgba(255,255,255,0.2)' }} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length > 0 && (
          <motion.p {...f(0.6)} className="text-center text-xs sm:text-sm font-medium" style={{ color: C.muted }}>
            Showing <span style={{ color: C.primary }}>{filtered.length}</span> of {jobs.length} jobs
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default Jobpage;
