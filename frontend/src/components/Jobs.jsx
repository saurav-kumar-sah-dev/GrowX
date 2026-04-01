import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API } from '@/config/api';
import { Briefcase, MapPin, Clock, Users, Zap, Search } from 'lucide-react';

const T = {
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
  accentGlow: "rgba(212,168,83,0.12)",
  white: "#FAFAF8",
  gradient1: "#667eea",
  gradient2: "#764ba2",
};

const Jobs = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

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

  const filteredJobs = allJobs.filter(job => {
    const matchSearch = !search || 
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || job.jobType === filterType;
    return matchSearch && matchType;
  });

  const jobTypes = ['all', 'Full-time', 'Part-time', 'Internship', 'Remote'];

  return (
    <div className="min-h-screen py-12" style={{ background: `linear-gradient(180deg, ${T.obsidian} 0%, ${T.charcoal} 100%)` }}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${T.gold} 0%, ${T.goldLight} 100%)` }}>
              <Briefcase className="h-8 w-8" style={{ color: T.obsidian }} />
            </div>
            <div>
              <h1 className="font-bold text-3xl md:text-4xl" style={{ color: T.white }}>
                All <span style={{ color: T.gold }}>Jobs</span>
              </h1>
              <p className="text-base mt-1" style={{ color: T.ivoryMuted }}>{filteredJobs.length} opportunities available</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: T.ivoryMuted }} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-sm"
              style={{ background: T.surface, border: `1px solid ${T.accentGlow}`, color: T.white, outline: 'none' }}
            />
          </div>

          {/* Filter buttons */}
          <div className="flex gap-2 flex-wrap">
            {jobTypes.map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className="px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all"
                style={{
                  background: filterType === type ? T.gold : 'transparent',
                  color: filterType === type ? T.obsidian : T.ivoryMuted,
                  border: `1px solid ${filterType === type ? T.gold : T.accentGlow}`
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Jobs Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: T.surface }} />
            ))
          ) : filteredJobs.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: T.surface, border: `1px solid ${T.accentGlow}` }}>
                <Briefcase className="h-12 w-12" style={{ color: T.ivoryMuted }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: T.white }}>No Jobs Found</h3>
              <p style={{ color: T.ivoryMuted }}>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            filteredJobs.map((job, index) => (
              <motion.div
                key={job?._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl p-5 border transition-all cursor-pointer"
                style={{ 
                  background: T.surface, 
                  borderColor: T.accentGlow
                }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: T.surfaceLight }}>
                    <Briefcase className="w-6 h-6" style={{ color: T.gold }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">{job.title}</h3>
                    <p className="text-sm" style={{ color: T.ivoryMuted }}>{job.company?.name || 'Company'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: T.accentGlow, color: T.gold }}>
                    {job.jobType}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: T.surfaceLight, color: T.ivoryMuted }}>
                    {job.location}
                  </span>
                </div>

                <p className="text-sm line-clamp-2 mb-3" style={{ color: T.ivoryMuted }}>
                  {job.description || 'No description available'}
                </p>

                {job.salary && (
                  <p className="text-sm font-semibold flex items-center gap-1" style={{ color: '#22c55e' }}>
                    <Zap className="w-4 h-4" /> {job.salary}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-3 pt-3 border-t" style={{ borderColor: T.accentGlow }}>
                  <span className="flex items-center gap-1 text-xs" style={{ color: T.ivoryMuted }}>
                    <Users className="w-3 h-3" /> {job.applications?.length || 0} applicants
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
