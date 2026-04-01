import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Bookmark, Search, MapPin, Building2, DollarSign,
  Clock, Briefcase, Trash2, ExternalLink, Filter, Star
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';

const C = {
  primary: '#D4A853',
  accent: '#C8884A',
  lightGold: '#E8C17A',
  bgDark: '#0A0A0F',
  bgMid: '#121218',
  card: '#1A1D26',
  cardAlt: '#252532',
  white: '#F5F0E6',
  muted: '#7A7F8A',
  goldBorder: 'rgba(212,168,83,0.15)',
  goldDim: 'rgba(212,168,83,0.08)',
  dim: '#2A2E3A',
};

const SAVED_API = 'http://localhost:5000/api/v1/saved-jobs';

const AdminSaved = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [removing, setRemoving]   = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchSaved(); }, []);

  const fetchSaved = async () => {
    try {
      const res = await axios.get(`${SAVED_API}/user`, { withCredentials: true });
      setSavedJobs(res.data.savedJobs || []);
    } catch {
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId, e) => {
    e.stopPropagation();
    setRemoving(jobId);
    setSavedJobs(prev => prev.filter(s => s.job?._id !== jobId));
    try {
      await axios.delete(`${SAVED_API}/unsave/${jobId}`, { withCredentials: true });
      toast.success('Job removed from saved');
    } catch {
      toast.error('Failed to remove');
      fetchSaved();
    } finally {
      setRemoving(null);
    }
  };

  const filtered = savedJobs.filter(s =>
    s.job?.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.job?.company?.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.job?.location?.toLowerCase().includes(search.toLowerCase())
  );

  const COLORS = [
    { g: 'linear-gradient(to right, #D4A853, #C8884A)', bg: 'rgba(212,168,83,0.08)', border: C.goldBorder },
    { g: 'linear-gradient(to right, #C8884A, #E8C17A)', bg: 'rgba(200,136,74,0.08)', border: C.goldBorder },
    { g: 'linear-gradient(to right, #10b981, #059669)', bg: 'rgba(16,185,129,0.08)', border: C.goldBorder },
    { g: 'linear-gradient(to right, #ef4444, #dc2626)', bg: 'rgba(239,68,68,0.08)', border: C.goldBorder },
    { g: 'linear-gradient(to right, #ec4899, #db2777)', bg: 'rgba(236,72,153,0.08)', border: C.goldBorder },
    { g: 'linear-gradient(to right, #06b6d4, #0891b2)', bg: 'rgba(6,182,212,0.08)', border: C.goldBorder },
  ];

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse" style={{ background: 'linear-gradient(to bottom right, #D4A853, #C8884A)' }}>
            <Bookmark className="w-10 h-10 text-white" />
          </div>
          <p className="font-semibold text-lg" style={{ color: C.muted }}>Loading Saved Items...</p>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">

        {/* ── Hero Banner ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl" style={{ background: 'linear-gradient(to right, #C8884A, #D4A853, #E8C17A)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-16 -mb-16" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl flex-shrink-0">
                  <Bookmark className="h-9 w-9 text-white fill-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">Saved Items</h1>
                  <p className="text-[#E8C17A]">Your bookmarked jobs & opportunities</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{savedJobs.length} Saved Jobs</span>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{filtered.length} Showing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Saved',   value: savedJobs.length, g: 0 },
            { label: 'Full-time',     value: savedJobs.filter(s => s.job?.jobType?.toLowerCase().includes('full')).length, g: 1 },
            { label: 'Remote',        value: savedJobs.filter(s => s.job?.location?.toLowerCase().includes('remote')).length, g: 2 },
            { label: 'Companies',     value: new Set(savedJobs.map(s => s.job?.company?._id)).size, g: 3 },
          ].map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }} whileHover={{ y: -4, scale: 1.04 }}>
              <Card className="border shadow-md overflow-hidden" style={{ backgroundColor: C.card, borderColor: C.goldBorder }}>
                <CardContent className="p-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md mb-3" style={{ background: COLORS[c.g].g }}>
                    <Bookmark className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs font-medium mb-1" style={{ color: C.muted }}>{c.label}</p>
                  <p className="text-2xl font-black" style={{ color: C.white }}>{c.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Search ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden" style={{ backgroundColor: C.card }}>
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: C.muted }} />
                  <Input className="pl-12 h-12 border-2 rounded-xl transition-all"
                    placeholder="Search saved jobs..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }} />
                </div>
                <Button variant="outline" className="h-12 px-4 border-2 rounded-xl" style={{ borderColor: C.goldBorder, color: C.white }}>
                  <Filter className="w-4 h-4 mr-2" />Filter
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Jobs Grid ── */}
        <AnimatePresence>
          {filtered.length > 0 ? (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((saved, index) => {
                const job = saved.job;
                if (!job) return null;
                const col = COLORS[index % COLORS.length];
                return (
                  <motion.div key={saved._id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: 0.05 * index }}
                    whileHover={{ y: -8, scale: 1.02 }}>
                    <Card className="hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden group cursor-pointer"
                      onClick={() => navigate(`/description/${job._id}`)} style={{ backgroundColor: C.card }}>
                      <div className="h-1.5 group-hover:h-2 transition-all" style={{ background: col.g }} />
                      <CardContent className="p-6">

                        {/* Top Row */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-xl truncate mb-1 group-hover:transition-colors" style={{ color: C.white }}>
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.muted }} />
                              <p className="text-sm truncate font-medium" style={{ color: C.muted }}>{job.company?.name}</p>
                            </div>
                          </div>
                          {job.company?.logo ? (
                            <img src={job.company.logo} alt={job.company.name}
                              className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 ml-3 flex-shrink-0 group-hover:scale-110 transition-transform" style={{ borderColor: C.card }} />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ml-3 flex-shrink-0" style={{ background: col.g }}>
                              <Building2 className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 p-3 rounded-2xl border" style={{ backgroundColor: col.bg, borderColor: C.goldBorder }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0" style={{ background: col.g }}>
                              <MapPin className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold" style={{ color: C.primary }}>Location</p>
                              <p className="text-xs truncate font-medium" style={{ color: C.white }}>{job.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-3 rounded-2xl border" style={{ backgroundColor: 'rgba(16,185,129,0.08)', borderColor: C.goldBorder }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0" style={{ background: 'linear-gradient(to right, #10b981, #059669)' }}>
                              <DollarSign className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold" style={{ color: '#10b981' }}>Salary</p>
                              <p className="text-xs font-medium" style={{ color: C.white }}>₹{job.salary || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className="shadow-sm text-xs text-white" style={{ background: col.g }}>{job.jobType}</Badge>
                          <Badge variant="outline" className="text-xs" style={{ borderColor: C.goldBorder, color: C.white }}>{job.experienceLevel} exp</Badge>
                          <Badge variant="outline" className="text-xs" style={{ borderColor: C.goldBorder, color: C.muted }}>
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(saved.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-3 border-t" style={{ borderColor: C.goldBorder }}>
                          <Button size="sm" onClick={e => { e.stopPropagation(); navigate(`/description/${job._id}`); }}
                            className={`flex-1 h-9 shadow-sm hover:shadow-md text-xs font-semibold text-white`} style={{ background: col.g }}>
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />View Job
                          </Button>
                          <Button size="sm" variant="outline"
                            onClick={e => handleUnsave(job._id, e)}
                            disabled={removing === job._id}
                            className="h-9 px-3 border-2 rounded-xl" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="w-32 h-32 mx-auto mb-8 rounded-3xl flex items-center justify-center shadow-xl" style={{ background: 'linear-gradient(to bottom right, rgba(212,168,83,0.2), rgba(200,136,74,0.2))' }}>
                <Bookmark size={64} style={{ color: C.primary }} />
              </div>
              <h3 className="text-3xl font-black mb-3" style={{ color: C.white }}>
                {search ? 'No results found' : 'No saved jobs yet'}
              </h3>
              <p className="text-lg mb-6" style={{ color: C.muted }}>
                {search ? 'Try a different search term' : 'Jobs you save will appear here'}
              </p>
              {!search && (
                <Button onClick={() => navigate('/admin/all-jobs')}
                  className="shadow-lg h-12 px-8 text-white" style={{ background: 'linear-gradient(to right, #C8884A, #D4A853)' }}>
                  <Briefcase className="w-5 h-5 mr-2" />Browse Jobs
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
};

export default AdminSaved;
