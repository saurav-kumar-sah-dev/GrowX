import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API } from '@/config/api';
import { Briefcase, Loader2, TrendingUp, Search, Briefcase as BriefcaseIcon } from 'lucide-react';
import Navbar from './shared/Navbar';

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
  white: "#FAFAF8",
};

const Browse = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API.job}/get`, { withCredentials: true });
        setAllJobs(res.data?.jobs || []);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${C.charcoal} 0%, ${C.obsidian} 100%)` }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-12"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" 
            style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}>
            <Search className="w-3.5 h-3.5" style={{ color: C.gold }} />
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.gold }}>
              Explore
            </span>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            <span style={{ color: C.white }}>Browse </span>
            <span style={{ color: C.gold }}>All Jobs</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-sm md:text-base" style={{ color: C.ivoryMuted }}>
            Discover {allJobs.length} {allJobs.length === 1 ? 'job opportunity' : 'job opportunities'} from top companies
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 md:py-24"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full absolute animate-ping opacity-20" style={{ background: C.gold }} />
              <Loader2 className="h-16 w-16 animate-spin relative" style={{ color: C.gold }} />
            </div>
            <p className="mt-6 text-sm md:text-base font-medium" style={{ color: C.ivoryMuted }}>
              Loading opportunities...
            </p>
          </motion.div>
        ) : allJobs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="flex flex-col items-center justify-center py-16 md:py-20 rounded-2xl"
            style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-4 md:mb-6"
              style={{ background: C.surfaceLight }}>
              <BriefcaseIcon className="w-8 h-8 md:w-10 md:h-10" style={{ color: C.ivoryMuted }} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-1" style={{ color: C.white }}>
              No Jobs Found
            </h3>
            <p className="text-sm text-center max-w-md px-4" style={{ color: C.ivoryMuted }}>
              We couldn't find any jobs matching your criteria. Check back later for new opportunities.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 lg:gap-6"
          >
            {allJobs.map((job, idx) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
                className="rounded-2xl p-5 border transition-all cursor-pointer"
                style={{ 
                  background: C.surface, 
                  borderColor: C.goldBorder,
                  boxShadow: `0 4px 20px rgba(0,0,0,0.2)`
                }}
                whileHover={{ y: -4, borderColor: C.gold }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: C.surfaceLight }}>
                    <Briefcase className="w-6 h-6" style={{ color: C.gold }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">{job.title}</h3>
                    <p className="text-sm" style={{ color: C.ivoryMuted }}>{job.company?.name || 'Company'}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: C.goldDim, color: C.gold }}>
                    {job.jobType}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: C.surfaceLight, color: C.ivoryMuted }}>
                    {job.location}
                  </span>
                </div>
                {job.salary && (
                  <p className="text-sm mt-3 font-semibold" style={{ color: '#22c55e' }}>
                    {job.salary}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Browse;
