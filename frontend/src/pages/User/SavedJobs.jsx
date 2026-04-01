import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bookmark, MapPin, Briefcase, Trash2, ArrowRight, Loader2, 
  Building2, Clock, DollarSign, Sparkles, X, Search, Filter
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { API } from '@/config/api';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
  surface: "#1A1A24",
  surfaceLight: "#252532",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  accent: "#C8884A",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
  ivory: "#F5F0E6",
  muted: "#A8A099",
  success: "#10b981",
  danger: "#ef4444",
};

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#14B8A6"];

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

const SavedJobsPage = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await axios.get(`${API.savedJob}/user`, { withCredentials: true });
      setSavedJobs(res.data?.savedJobs || []);
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      setRemovingId(jobId);
      await axios.delete(`${API.savedJob}/unsave/${jobId}`, { withCredentials: true });
      setSavedJobs(savedJobs.filter(item => item.job?._id !== jobId));
      toast.success('Job removed from saved');
    } catch (error) {
      toast.error('Failed to remove job');
    } finally {
      setRemovingId(null);
    }
  };

  const filteredJobs = savedJobs.filter(item => {
    if (!search) return true;
    const job = item.job || {};
    const searchLower = search.toLowerCase();
    return (
      job.title?.toLowerCase().includes(searchLower) ||
      job.company?.name?.toLowerCase().includes(searchLower) ||
      job.location?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen" style={{ background: C.obsidian }}>
      {/* Hero Header */}
      <div 
        className="relative py-12 px-4"
        style={{ 
          background: `linear-gradient(135deg, ${C.charcoal} 0%, ${C.obsidian} 100%)`,
          borderBottom: `1px solid ${C.goldBorder}`
        }}
      >
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.3) 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-3"
          >
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})` }}
            >
              <Bookmark className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: C.goldDim, color: C.gold }}>
              SAVED
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-3"
            style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}
          >
            Saved <span style={{ color: C.gold }}>Jobs</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg"
            style={{ color: C.muted }}
          >
            {loading ? 'Loading...' : `${filteredJobs.length} ${filteredJobs.length === 1 ? 'job' : 'jobs'} saved`}
          </motion.p>

          {/* Search */}
          {savedJobs.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 max-w-md"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: C.muted }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search saved jobs..."
                  className="w-full h-12 pl-12 pr-4 rounded-2xl outline-none transition-all"
                  style={{ 
                    background: C.surface, 
                    border: `1px solid ${C.goldBorder}`,
                    color: C.ivory
                  }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full border-4 border-transparent animate-spin" style={{ borderBottomColor: C.gold }} />
            <p className="mt-4" style={{ color: C.muted }}>Loading saved jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 rounded-3xl"
            style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
          >
            <div 
              className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: `${C.gold}15` }}
            >
              <Bookmark className="w-12 h-12" style={{ color: C.gold }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: C.ivory }}>
              {search ? 'No matching jobs found' : 'No Saved Jobs Yet'}
            </h2>
            <p className="mb-6" style={{ color: C.muted }}>
              {search ? 'Try a different search term' : 'Start exploring jobs and save the ones you like'}
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2"
              style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: C.obsidian }}
            >
              Browse Jobs
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((item, index) => {
              const job = item.job || {};
              const color = COLORS[index % COLORS.length];
              const companyName = job.company?.name || 'Company';
              
              return (
                <motion.div
                  key={item._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group rounded-3xl overflow-hidden"
                  style={{ 
                    background: C.surface,
                    border: `1px solid ${C.goldBorder}`
                  }}
                >
                  {/* Top Gradient */}
                  <div 
                    className="h-1"
                    style={{ background: `linear-gradient(90deg, ${color}, ${C.gold})` }}
                  />

                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Company Logo */}
                      <div className="shrink-0">
                        {job.company?.logo ? (
                          <img 
                            src={job.company.logo} 
                            alt={companyName} 
                            className="w-16 h-16 rounded-2xl object-cover"
                            style={{ border: `2px solid ${color}30` }}
                          />
                        ) : (
                          <div 
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black"
                            style={{ background: `linear-gradient(135deg, ${color}, ${color}90)`, color: 'white' }}
                          >
                            {companyName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Job Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-lg truncate" style={{ color: C.ivory }}>
                            {job.title || 'Job Title'}
                          </h3>
                          {job.urgent && (
                            <span 
                              className="shrink-0 px-2 py-1 rounded-full text-[10px] font-bold"
                              style={{ background: `${C.danger}20`, color: C.danger }}
                            >
                              🔥 Urgent
                            </span>
                          )}
                        </div>
                        <p className="font-medium mb-2" style={{ color: color }}>
                          {companyName}
                        </p>

                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-3 text-sm" style={{ color: C.muted }}>
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {job.location || 'Remote'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase size={14} />
                            {job.jobType || 'Full-time'}
                          </span>
                          {job.salary && (
                            <span className="flex items-center gap-1" style={{ color: C.success }}>
                              <DollarSign size={14} />
                              {job.salary}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 3).map((skill, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ background: `${color}15`, color: color }}
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ background: C.surfaceLight, color: C.muted }}
                          >
                            +{job.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${C.goldBorder}` }}>
                      <div className="flex items-center gap-2">
                        <Clock size={14} style={{ color: C.muted }} />
                        <span className="text-xs" style={{ color: C.muted }}>
                          Saved {getRelativeTime(item.createdAt)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUnsave(job._id)}
                          disabled={removingId === job._id}
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                          style={{ 
                            background: `${C.danger}10`,
                            border: `1px solid ${C.danger}30`,
                            opacity: removingId === job._id ? 0.5 : 1
                          }}
                        >
                          {removingId === job._id ? (
                            <Loader2 className="w-5 h-5 animate-spin" style={{ color: C.danger }} />
                          ) : (
                            <Trash2 className="w-5 h-5" style={{ color: C.danger }} />
                          )}
                        </button>
                        <button
                          onClick={() => navigate(`/description/${job._id}`)}
                          className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105"
                          style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: C.obsidian }}
                        >
                          View
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage;
