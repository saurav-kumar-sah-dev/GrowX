import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, DollarSign, ArrowRight, Sparkles, Loader2, Briefcase, 
  Globe, Users, Star, Award, Building2, Calendar
} from 'lucide-react';
import axios from 'axios';
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

const JobCard = ({ job, index, onClick }) => {
  const color = COLORS[index % COLORS.length];
  const companyName = job.company?.name || 'Company';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onClick={onClick}
      className="group relative rounded-3xl overflow-hidden cursor-pointer"
      style={{ 
        background: C.surface,
        border: `1px solid ${C.goldBorder}`
      }}
    >
      {/* Gradient Border Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${color}15, transparent, ${C.gold}10)`,
          borderRadius: 'inherit'
        }}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          {/* Company Logo */}
          <div className="relative shrink-0">
            {job.company?.logo ? (
              <img 
                src={job.company.logo} 
                alt={companyName} 
                className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                style={{ border: `2px solid ${color}30` }}
              />
            ) : (
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${color}, ${color}90)`,
                  color: 'white'
                }}
              >
                {companyName.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Urgent Badge */}
            {job.urgent && (
              <div 
                className="absolute -top-2 -right-2 px-2 py-1 rounded-full text-[10px] font-bold shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, #ef4444, #dc2626)`,
                  color: 'white'
                }}
              >
                🔥
              </div>
            )}
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-lg truncate group-hover:text-transparent" style={{ 
                color: C.ivory,
                backgroundImage: `linear-gradient(135deg, ${C.ivory}, ${C.gold})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text'
              }}>
                {job.title}
              </h3>
              {job.featured && (
                <span 
                  className="shrink-0 px-2 py-1 rounded-full text-[10px] font-bold"
                  style={{ background: `${C.gold}20`, color: C.gold }}
                >
                  ⭐ Featured
                </span>
              )}
            </div>
            <p className="text-sm font-medium" style={{ color: color }}>
              {companyName}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm mb-5 line-clamp-2" style={{ color: C.muted }}>
          {job.description?.substring(0, 120)}...
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
              <MapPin size={14} style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider" style={{ color: C.muted }}>Location</p>
              <p className="text-xs font-semibold truncate" style={{ color: C.ivory }}>{job.location || 'Remote'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.gold}15` }}>
              <DollarSign size={14} style={{ color: C.gold }} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider" style={{ color: C.muted }}>Salary</p>
              <p className="text-xs font-semibold truncate" style={{ color: C.success }}>{job.salary || 'Negotiable'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.accent}15` }}>
              <Briefcase size={14} style={{ color: C.accent }} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider" style={{ color: C.muted }}>Type</p>
              <p className="text-xs font-semibold truncate" style={{ color: C.ivory }}>{job.jobType || 'Full-time'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
              <Globe size={14} style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider" style={{ color: C.muted }}>Mode</p>
              <p className="text-xs font-semibold truncate" style={{ color: C.ivory }}>{job.workMode || 'On-site'}</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {job.skills.slice(0, 3).map((skill, i) => (
              <span 
                key={i}
                className="px-3 py-1 rounded-full text-[11px] font-medium"
                style={{ background: `${color}15`, color: color }}
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span 
                className="px-3 py-1 rounded-full text-[11px] font-medium"
                style={{ background: C.surfaceLight, color: C.muted }}
              >
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${C.goldBorder}` }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Clock size={12} style={{ color: C.muted }} />
              <span className="text-xs" style={{ color: C.muted }}>{getRelativeTime(job.createdAt)}</span>
            </div>
            {job.position && (
              <div className="flex items-center gap-1.5">
                <Users size={12} style={{ color: C.muted }} />
                <span className="text-xs" style={{ color: C.muted }}>{job.position} Position{job.position > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`,
              color: C.obsidian
            }}
          >
            Apply
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div 
        className="h-1 w-0 group-hover:w-full transition-all duration-500"
        style={{ background: `linear-gradient(90deg, ${color}, ${C.gold}, ${C.accent})` }}
      />
    </motion.div>
  );
};

const LatestJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API.job}/get`, { withCredentials: true });
        const allJobs = res.data?.jobs || [];
        const activeJobs = allJobs
          .filter(j => j.status === 'active')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
        setJobs(activeJobs);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <section id="latest-jobs" className="py-20 px-4 relative overflow-hidden" style={{ background: C.obsidian }}>
      {/* Background Pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      {/* Decorative Blurs */}
      <div className="absolute top-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-10" style={{ background: C.gold }} />
      <div className="absolute bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-5" style={{ background: C.accent }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6"
            style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
          >
            <Sparkles size={16} color={C.gold} />
            <span className="text-sm font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
              LATEST OPENINGS
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4" style={{ 
            fontFamily: "'Playfair Display', serif", 
            color: C.ivory 
          }}>
            Recent <span style={{ color: C.gold }}>Jobs</span>
          </h2>

          <p className="text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
            Discover exciting opportunities from top companies. Apply now and take the next step in your career.
          </p>
        </motion.div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-transparent animate-spin" style={{ borderBottomColor: C.gold }} />
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }}
            className="text-center py-20 rounded-3xl"
            style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
          >
            <div className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center" style={{ background: `${C.gold}15` }}>
              <Briefcase size={48} style={{ color: C.gold }} />
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: C.ivory }}>No Jobs Available</h3>
            <p className="mb-6" style={{ color: C.muted }}>Check back soon for new opportunities</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin/jobs/create')}
              className="px-6 py-3 rounded-xl font-bold"
              style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: C.obsidian }}
            >
              Post a Job
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {jobs.map((job, idx) => (
                <JobCard
                  key={job._id || idx}
                  job={job}
                  index={idx}
                  onClick={() => navigate(`/description/${job._id}`)}
                />
              ))}
            </div>

            {/* View All Button */}
            {jobs.length >= 6 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/jobs')}
                  className="px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 shadow-xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`,
                    color: C.obsidian
                  }}
                >
                  View All Jobs
                  <ArrowRight size={20} />
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default LatestJobs;
