import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, MapPin, Briefcase, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
  white: "#FAFAF8",
};

const SavedJobsDashboard = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch(`${API.savedJob}/user`, {
        credentials: 'include'
      });
      const data = await res.json();
      setSavedJobs(data.savedJobs || []);
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await fetch(`${API.savedJob}/unsave/${jobId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setSavedJobs(savedJobs.filter(item => item.job._id !== jobId));
    } catch (error) {
      console.error('Failed to unsave job:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="w-full px-4 py-8 md:py-12"
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3" 
            style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}>
            <Bookmark className="w-3.5 h-3.5" style={{ color: C.gold }} />
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.gold }}>
              Your Collection
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: C.white }}>
            Saved <span style={{ color: C.gold }}>Jobs</span>
          </h1>
          <p className="text-sm" style={{ color: C.ivoryMuted }}>
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin" style={{ color: C.gold }} />
            <p className="mt-4 text-sm" style={{ color: C.ivoryMuted }}>Loading saved jobs...</p>
          </div>
        ) : !savedJobs || savedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-2xl"
            style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: C.surfaceLight }}>
              <Bookmark className="w-8 h-8" style={{ color: C.ivoryMuted }} />
            </div>
            <h3 className="text-lg font-semibold mb-1" style={{ color: C.white }}>
              No Saved Jobs
            </h3>
            <p className="text-sm mb-4" style={{ color: C.ivoryMuted }}>
              Start saving jobs to view them here
            </p>
            <Button
              onClick={() => navigate('/browse')}
              className="px-6 py-2 rounded-lg text-sm font-medium gap-2"
              style={{ background: C.gold, color: C.obsidian }}
            >
              Browse Jobs
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((item, index) => (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl overflow-hidden"
                style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
              >
                {/* Top Accent */}
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.goldDark})` }} />

                <div className="p-5 md:p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    
                    {/* Left - Job Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        
                        {/* Company Logo */}
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: C.surfaceLight }}>
                          {item?.job?.company?.logo ? (
                            <img src={item.job.company.logo} alt="" className="w-7 h-7 object-contain" />
                          ) : (
                            <Briefcase className="w-6 h-6" style={{ color: C.gold }} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Title */}
                          <h3 className="font-bold text-base md:text-lg mb-1 truncate" style={{ color: C.white }}>
                            {item?.job?.title}
                          </h3>
                          
                          {/* Company */}
                          <p className="text-sm mb-2" style={{ color: C.ivoryMuted }}>
                            {item?.job?.company?.name}
                          </p>

                          {/* Info Row */}
                          <div className="flex flex-wrap items-center gap-3 text-[11px] mb-3">
                            <div className="flex items-center gap-1" style={{ color: C.ivoryMuted }}>
                              <MapPin className="w-3 h-3" style={{ color: C.gold }} />
                              {item?.job?.location || 'India'}
                            </div>
                            <div className="flex items-center gap-1" style={{ color: C.ivoryMuted }}>
                              <Briefcase className="w-3 h-3" style={{ color: C.gold }} />
                              {item?.job?.jobType}
                            </div>
                            <div style={{ color: C.ivoryMuted }}>
                              Saved {new Date(item?.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            <Badge className="text-[10px] px-2 py-1 uppercase"
                              style={{ background: C.goldDim, color: C.gold }}>
                              {item?.job?.position}P
                            </Badge>
                            <Badge className="text-[10px] px-2 py-1 uppercase"
                              style={{ background: C.gold, color: C.obsidian }}>
                              ₹{item?.job?.salary}L
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right - Actions */}
                    <div className="flex lg:flex-col items-center gap-2 lg:items-end">
                      <Button
                        onClick={() => navigate(`/description/${item?.job?._id}`)}
                        className="px-5 py-2 rounded-lg text-sm font-medium gap-2 flex-1 lg:flex-none"
                        style={{ background: C.gold, color: C.obsidian }}
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleUnsave(item?.job?._id)}
                        variant="outline"
                        className="px-3 py-2 rounded-lg text-sm gap-2"
                        style={{ 
                          borderColor: C.goldBorder, 
                          color: C.ivoryMuted,
                          background: 'transparent'
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SavedJobsDashboard;
