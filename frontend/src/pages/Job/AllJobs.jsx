import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Search, MapPin, Clock, DollarSign, ArrowRight, Sparkles, Loader2, Filter, X, Building2, Users, Globe as GlobeIcon, Zap, Award, Star, Calendar } from 'lucide-react';
import axios from 'axios';
import { API } from '@/config/api';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
  surface: "#1A1A24",
  surfaceLight: "#252532",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDark: "#B8923F",
  ivory: "#F5F0E6",
  ivoryMuted: "#A8A099",
  accent: "#C8884A",
  goldBorder: "rgba(212,168,83,0.15)",
  goldDim: "rgba(212,168,83,0.08)",
  success: "#10B981",
};

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#14B8A6", "#F97316", "#06B6D4"];

function getRelativeTime(dateString) {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function getCompanyInitials(name) {
  if (!name) return 'CO';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const JOB_TYPES = ["All", "Full-time", "Part-time", "Contract", "Internship", "Remote"];
const EXPERIENCE_LEVELS = ["All", "Fresher", "0-2 Years", "2-5 Years", "5-10 Years", "10+ Years"];

export default function AllJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('All');
  const [experience, setExperience] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API.job}/get`, { withCredentials: true });
        const allJobs = res.data?.jobs || [];
        const activeJobs = allJobs.filter(j => j.status === 'active');
        setJobs(activeJobs);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !search || 
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase()) ||
      job.description?.toLowerCase().includes(search.toLowerCase());

    const matchesType = jobType === 'All' || job.jobType === jobType || 
      (jobType === 'Remote' && job.location?.toLowerCase().includes('remote'));

    return matchesSearch && matchesType;
  });

  const activeFilters = [jobType !== 'All', experience !== 'All', search !== ''].filter(Boolean).length;

  const clearFilters = () => {
    setSearch('');
    setJobType('All');
    setExperience('All');
  };

  return (
    <div className="min-h-screen" style={{ background: C.obsidian }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .jobs-root { font-family: 'DM Sans', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="jobs-root">
        <div className="relative overflow-hidden py-16 px-4" style={{ 
          background: `linear-gradient(135deg,${C.charcoal} 0%,${C.obsidian} 100%)`,
          borderBottom: `1px solid ${C.goldBorder}`
        }}>
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)",
            backgroundSize: "50px 50px"
          }} />

          <motion.div 
            className="max-w-7xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} color={C.gold} />
              <span className="text-xs font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
                LATEST OPENINGS
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>
              All <span style={{ color: C.gold }}>Jobs</span>
            </h1>

            <p className="text-lg" style={{ color: C.ivoryMuted }}>
              {loading ? 'Loading...' : `${filteredJobs.length} jobs found`}
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={20} color={C.ivoryMuted} />
              <input
                type="text"
                placeholder="Search jobs, companies, locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-gray-500 outline-none"
                style={{ 
                  background: C.surface, 
                  border: `1px solid ${C.goldBorder}`,
                  fontSize: '16px'
                }}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold"
              style={{ 
                background: showFilters ? C.gold : C.surface,
                color: showFilters ? C.obsidian : C.ivory,
                border: `1px solid ${C.goldBorder}`
              }}
            >
              <Filter size={20} />
              Filters
              {activeFilters > 0 && (
                <span 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: C.obsidian, color: C.gold }}
                >
                  {activeFilters}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-6 rounded-2xl"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: C.ivory }}>Filters</h3>
                {activeFilters > 0 && (
                  <button 
                    onClick={clearFilters}
                    className="text-sm font-medium flex items-center gap-1"
                    style={{ color: C.gold }}
                  >
                    <X size={14} /> Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: C.ivoryMuted }}>Job Type</label>
                  <div className="flex flex-wrap gap-2">
                    {JOB_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => setJobType(type)}
                        className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: jobType === type ? C.gold : 'transparent',
                          color: jobType === type ? C.obsidian : C.ivoryMuted,
                          border: `1px solid ${jobType === type ? C.gold : C.goldBorder}`
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: C.ivoryMuted }}>Experience Level</label>
                  <div className="flex flex-wrap gap-2">
                    {EXPERIENCE_LEVELS.map(level => (
                      <button
                        key={level}
                        onClick={() => setExperience(level)}
                        className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: experience === level ? C.gold : 'transparent',
                          color: experience === level ? C.obsidian : C.ivoryMuted,
                          border: `1px solid ${experience === level ? C.gold : C.goldBorder}`
                        }}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin" size={48} color={C.gold} />
            </div>
          ) : filteredJobs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }}
              className="text-center py-20 rounded-3xl"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
            >
              <Briefcase size={64} className="mx-auto mb-4" color={C.ivoryMuted} style={{ opacity: 0.3 }} />
              <p className="text-xl font-bold mb-2" style={{ color: C.ivory }}>No jobs found</p>
              <p style={{ color: C.ivoryMuted }}>Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map((job, idx) => {
                const color = COLORS[idx % COLORS.length];
                const companyName = job.company?.name || 'Company';
                const companyInitials = getCompanyInitials(companyName);
                
                return (
                  <motion.div 
                    key={job._id || idx}
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => navigate(`/description/${job._id}`)}
                    className="relative rounded-2xl p-6 cursor-pointer group"
                    style={{ 
                      background: C.surface, 
                      border: `1px solid ${C.goldBorder}`,
                      boxShadow: `0 4px 20px rgba(0,0,0,0.2)`
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 overflow-hidden"
                        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
                      >
                        {job.company?.logo ? (
                          <img src={job.company.logo} alt={companyName} className="w-full h-full object-cover" />
                        ) : (
                          <span style={{ color }}>{companyInitials}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <h3 className="font-bold text-lg" style={{ color: C.ivory }}>{job.title}</h3>
                            <p className="text-sm" style={{ color: C.ivoryMuted }}>{companyName}</p>
                          </div>
                          <div className="flex gap-2">
                            {job.urgent && (
                              <span 
                                className="px-3 py-1 rounded-full text-xs font-bold"
                                style={{ background: `${C.success}20`, color: C.success }}
                              >
                                🔥 Urgent
                              </span>
                            )}
                            {job.featured && (
                              <span 
                                className="px-3 py-1 rounded-full text-xs font-bold"
                                style={{ background: `${C.gold}20`, color: C.gold }}
                              >
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: C.ivoryMuted }}>
                      {job.description?.substring(0, 150)}...
                    </p>

                    {/* Key Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm" style={{ color: C.ivoryMuted }}>
                        <MapPin size={14} className="shrink-0" /> 
                        <span className="truncate">{job.location || 'Remote'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: C.ivoryMuted }}>
                        <DollarSign size={14} className="shrink-0" /> 
                        <span className="truncate" style={{ color: C.success }}>{job.salary || 'Not Disclosed'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: C.ivoryMuted }}>
                        <Clock size={14} className="shrink-0" /> 
                        <span className="truncate">{job.jobType || 'Full-time'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: C.ivoryMuted }}>
                        <GlobeIcon size={14} className="shrink-0" /> 
                        <span className="truncate">{job.workMode || 'On-site'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: C.ivoryMuted }}>
                        <Award size={14} className="shrink-0" /> 
                        <span className="truncate">{job.experienceLevel || 'Fresher'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: C.ivoryMuted }}>
                        <Users size={14} className="shrink-0" /> 
                        <span className="truncate">{job.position || 1} Position{job.position > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 4).map((skill, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ background: C.goldDim, color: C.gold }}
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ background: C.surface, color: C.ivoryMuted, border: `1px solid ${C.goldBorder}` }}
                          >
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Benefits */}
                    {job.benefits && job.benefits.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.benefits.slice(0, 3).map((benefit, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ background: `${C.success}15`, color: C.success }}
                          >
                            <Star size={10} className="inline mr-1" />{benefit}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <motion.div 
                      className="mt-4 pt-4 flex items-center justify-between"
                      style={{ borderTop: `1px solid ${C.goldBorder}` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm" style={{ color: C.ivoryMuted }}>
                          <Calendar size={12} className="inline mr-1" />
                          Posted {getRelativeTime(job.createdAt)}
                        </span>
                        {job.applicationDeadline && (
                          <span className="text-sm" style={{ color: C.gold }}>
                            <Clock size={12} className="inline mr-1" />
                            Apply by {new Date(job.applicationDeadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/description/${job._id}`);
                        }}
                        className="px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2"
                        style={{ background: `linear-gradient(135deg,${C.gold},${C.accent})`, color: C.obsidian }}
                      >
                        Apply Now
                        <ArrowRight size={14} />
                      </motion.button>
                    </motion.div>

                    <div 
                      className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: `linear-gradient(90deg,${C.gold},${C.accent})` }}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
