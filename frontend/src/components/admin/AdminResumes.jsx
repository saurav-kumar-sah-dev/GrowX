import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText, Search, Users, Calendar, Award, Briefcase,
  GraduationCap, Code2, Eye, Trash2, TrendingUp,
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
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
};

const AdminResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await axios.get(`${API.resume}`, { withCredentials: true });
      setResumes(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
      toast.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this resume?')) return;
    try {
      await axios.delete(`${API.resume}/${id}`, { withCredentials: true });
      setResumes(prev => prev.filter(r => r._id !== id));
      toast.success('Resume deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const filtered = resumes.filter(r =>
    r.personalInfo?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    r.personalInfo?.email?.toLowerCase().includes(search.toLowerCase()) ||
    r.user?.fullname?.toLowerCase().includes(search.toLowerCase())
  );

  const thisMonth = resumes.filter(r =>
    new Date(r.createdAt).getMonth() === new Date().getMonth()
  ).length;

  const totalSkills = resumes.reduce((s, r) => {
    const skills = r.technicalSkills || {};
    return s + Object.values(skills).flat().length;
  }, 0);

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4" style={{ borderColor: C.gold, borderTopColor: 'transparent' }} />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${C.gold}, #C8884A)`, border: `1px solid ${C.goldBorder}` }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20" 
              style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)` }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-16 -mb-16"
              style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)` }} />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl flex items-center justify-center shadow-xl"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                  <FileText className="h-7 w-7 sm:h-9 sm:w-9 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">Resume Management</h1>
                  <p className="text-white/80">View & manage all user-built resumes</p>
                  <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-3">
                    <span className="bg-white/20 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium">{resumes.length} Total</span>
                    <span className="bg-white/20 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium">{thisMonth} This Month</span>
                    <span className="bg-white/20 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium">{totalSkills} Skills</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Total Resumes', value: resumes.length, icon: FileText, color: C.gold },
            { title: 'Unique Users', value: new Set(resumes.map(r => r.user?._id)).size, icon: Users, color: '#3b82f6' },
            { title: 'This Month', value: thisMonth, icon: TrendingUp, color: '#10b981' },
            { title: 'Total Skills', value: totalSkills, icon: Code2, color: '#f59e0b' },
          ].map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.04 * i }} whileHover={{ y: -4, scale: 1.04 }}>
              <Card className="border shadow-md" style={{ background: C.card, borderColor: C.goldBorder }}>
                <CardContent className="p-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md mb-3" style={{ background: `${c.color}15` }}>
                    <c.icon className="w-4 h-4" style={{ color: c.color }} />
                  </div>
                  <p className="text-xs font-medium mb-1" style={{ color: C.muted }}>{c.title}</p>
                  <p className="text-xl font-black" style={{ color: C.white }}>{c.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
            <CardContent className="p-4 sm:p-6">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: C.muted }} />
                <Input className="pl-12 h-12 border-2 rounded-xl"
                  style={{ borderColor: C.goldBorder, background: C.surface, color: C.white }}
                  placeholder="Search by name, email..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge style={{ background: C.goldDim, color: C.gold, border: 'none' }}>All ({resumes.length})</Badge>
                <Badge variant="outline" style={{ borderColor: C.goldBorder, color: C.muted }}>This Month ({thisMonth})</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resume Cards */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((resume, index) => {
            const info = resume.personalInfo || {};
            const skills = resume.technicalSkills || {};
            const allSkills = Object.values(skills).flat();
            const expCount = resume.experience?.filter(e => e.company)?.length || 0;
            const eduCount = resume.education?.filter(e => e.institution)?.length || 0;
            const certCount = resume.certifications?.filter(c => c.name)?.length || 0;

            return (
              <motion.div key={resume._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }} whileHover={{ y: -8, scale: 1.02 }}>
                <Card className="hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden group"
                  style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
                  <div className="h-1.5 group-hover:h-2 transition-all" 
                    style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})` }} />
                  <CardContent className="p-6">

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl truncate group-hover:text-amber-400 transition-colors"
                          style={{ color: C.white }}>
                          {info.fullName || 'Unnamed'}
                        </h3>
                        {info.title && <p className="text-sm font-medium truncate" style={{ color: C.gold }}>{info.title}</p>}
                        <p className="text-xs truncate mt-0.5" style={{ color: C.muted }}>{info.email}</p>
                        {resume.user?.fullname && (
                          <p className="text-xs mt-0.5" style={{ color: C.muted }}>by {resume.user.fullname}</p>
                        )}
                      </div>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ml-3"
                        style={{ background: `linear-gradient(135deg, ${C.gold}, #C8884A)` }}>
                        <span className="text-white font-black text-lg">
                          {info.fullName?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="flex flex-col items-center p-2 rounded-xl" style={{ background: 'rgba(59,130,246,0.15)' }}>
                        <Briefcase className="w-4 h-4 text-blue-500 mb-1" />
                        <span className="text-sm font-black" style={{ color: C.white }}>{expCount}</span>
                        <span className="text-[10px]" style={{ color: C.muted }}>Exp</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-xl" style={{ background: 'rgba(16,185,129,0.15)' }}>
                        <GraduationCap className="w-4 h-4 text-emerald-500 mb-1" />
                        <span className="text-sm font-black" style={{ color: C.white }}>{eduCount}</span>
                        <span className="text-[10px]" style={{ color: C.muted }}>Edu</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-xl" style={{ background: 'rgba(245,158,11,0.15)' }}>
                        <Award className="w-4 h-4 text-amber-500 mb-1" />
                        <span className="text-sm font-black" style={{ color: C.white }}>{certCount}</span>
                        <span className="text-[10px]" style={{ color: C.muted }}>Certs</span>
                      </div>
                    </div>

                    {/* Skills */}
                    {allSkills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1.5">
                          {allSkills.slice(0, 5).map((s, i) => (
                            <Badge key={i} style={{ background: C.goldDim, color: C.gold, border: 'none' }} className="text-xs">{s}</Badge>
                          ))}
                          {allSkills.length > 5 && (
                            <Badge variant="outline" className="text-xs" style={{ borderColor: C.goldBorder, color: C.muted }}>+{allSkills.length - 5}</Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Date + Actions */}
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${C.goldBorder}` }}>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(resume.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline"
                          className="h-8 px-3"
                          style={{ borderColor: C.goldBorder, color: C.gold }}
                          onClick={() => navigate(`/resume/${resume._id}?admin=true`)}>
                          <Eye className="w-3.5 h-3.5 mr-1" />View
                        </Button>
                        <Button size="sm" variant="outline"
                          className="h-8 px-3"
                          style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}
                          onClick={() => handleDelete(resume._id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 rounded-3xl flex items-center justify-center shadow-xl" style={{ background: C.goldDim }}>
              <FileText size={64} style={{ color: C.gold }} />
            </div>
            <h3 className="text-3xl font-black mb-3" style={{ color: C.white }}>No resumes found</h3>
            <p style={{ color: C.muted }}>No resumes match your search</p>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminResumes;