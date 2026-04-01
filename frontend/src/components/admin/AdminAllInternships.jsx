import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  GraduationCap, Search, CheckCircle, Clock, Mail, Phone, Trash2, ChevronDown, 
  Building2, Code2, Filter, Eye, EyeOff, Edit, Star, Award, Calendar, Users,
  MapPin, Globe, Linkedin, Github, FileText, MessageSquare, X, Check, Loader2,
  Download, Send, User, BookOpen, Trophy, Zap, Coffee, StarHalf, ThumbsUp, FilterX
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
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
  green: "#10b981",
  greenDark: "#059669",
  greenDim: "rgba(16,185,129,0.08)",
  greenBorder: "rgba(16,185,129,0.15)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
  dim: "#2A2E3A",
  amber: "#f59e0b",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  rose: "#f43f5e",
};

const STATUS_STYLES = {
  accepted: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', label: 'Accepted' },
  pending: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', label: 'Pending' },
  rejected: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Rejected' },
};

const COMPLETION_STYLES = {
  "Not Started": { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8' },
  "In Progress": { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  "Completed": { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  "Terminated": { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
};

const AdminAllInternships = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API.internship}/all`, { withCredentials: true });
      setApplications(res.data.data || res.data.applications || []);
    } catch (err) {
      toast.error('Failed to fetch internship applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${API.internship}/status/${id}`, { status }, { withCredentials: true });
      setApplications(prev => prev.map(a => a._id === id ? { ...a, status } : a));
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return;
    try {
      await axios.delete(`${API.internship}/${id}`, { withCredentials: true });
      setApplications(prev => prev.filter(a => a._id !== id));
      toast.success('Application deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleUpdateField = async (id, field, value) => {
    try {
      await axios.patch(`${API.internship}/update/${id}`, { [field]: value }, { withCredentials: true });
      setApplications(prev => prev.map(a => a._id === id ? { ...a, [field]: value } : a));
      toast.success(`${field} updated`);
    } catch {
      toast.error(`Failed to update ${field}`);
    }
  };

  const filtered = applications.filter(a => {
    const matchSearch = search === '' || 
      a.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.category?.toLowerCase().includes(search.toLowerCase()) ||
      a.college?.toLowerCase().includes(search.toLowerCase()) ||
      a.phone?.includes(search);
    
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || a.category === categoryFilter;
    
    return matchSearch && matchStatus && matchCategory;
  });

  const accepted = applications.filter(a => a.status === 'accepted').length;
  const pending = applications.filter(a => a.status === 'pending').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;
  const categories = [...new Set(applications.map(a => a.category))];
  const completed = applications.filter(a => a.completionStatus === 'Completed').length;

  const stats = [
    { title: 'Total', value: applications.length, icon: GraduationCap, color: C.gold, glow: 'rgba(212,168,83,0.4)' },
    { title: 'Accepted', value: accepted, icon: CheckCircle, color: '#22c55e', glow: 'rgba(34,197,94,0.4)' },
    { title: 'Pending', value: pending, icon: Clock, color: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
    { title: 'Completed', value: completed, icon: Trophy, color: C.green, glow: 'rgba(16,185,129,0.4)' },
  ];

  const RatingStars = ({ rating }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        star <= rating ? (
          <Star key={star} size={14} fill="#facc15" color="#facc15" />
        ) : star - 0.5 <= rating ? (
          <StarHalf key={star} size={14} fill="#facc15" color="#facc15" />
        ) : (
          <Star key={star} size={14} color="#6b7280" />
        )
      ))}
      <span className="ml-1 text-xs text-gray-400">({rating})</span>
    </div>
  );

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
          style={{ background: `linear-gradient(135deg,${C.green},${C.greenDark})` }}>
          <GraduationCap size={24} style={{ color: '#fff' }} />
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, border: `1px solid ${C.greenBorder}` }}>
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(30%,-30%)' }} />
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                <GraduationCap className="h-9 w-9 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">All Internships</h1>
                <p className="text-white/80">Complete internship application management</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {stats.map(s => (
                    <span key={s.title} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {s.value} {s.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.04 * i }} whileHover={{ y: -4, scale: 1.04 }}>
              <div className="rounded-2xl border overflow-hidden" style={{ background: C.card, borderColor: C.greenBorder }}>
                <CardContent className="p-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md mb-3"
                    style={{ background: c.glow, boxShadow: `0 0 16px ${c.glow}` }}>
                    <c.icon className="w-4 h-4" style={{ color: c.color }} />
                  </div>
                  <p className="text-xs font-medium mb-1" style={{ color: C.muted }}>{c.title}</p>
                  <p className="text-2xl font-black" style={{ color: C.white }}>{c.value}</p>
                </CardContent>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search + Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: C.muted }} />
            <Input className="pl-12 h-12 border-2 rounded-xl transition-all"
              style={{ background: C.obsidian, borderColor: C.greenBorder, color: C.white }}
              placeholder="Search by name, email, category, college, phone..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="h-10"
              style={{ borderColor: C.greenBorder, color: C.green }}>
              <Filter size={16} className="mr-2" /> Filters
            </Button>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-6 rounded-2xl" style={{ background: C.card, border: `1px solid ${C.greenBorder}` }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold" style={{ color: C.white }}>Filters</h3>
                <Button variant="ghost" size="sm" onClick={() => { setStatusFilter('all'); setCategoryFilter('all'); setSearch(''); }}
                  style={{ color: C.muted }}>
                  <FilterX size={14} className="mr-1" /> Clear
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: C.muted }}>Status</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'accepted', 'rejected'].map(s => (
                      <button key={s} onClick={() => setStatusFilter(s)}
                        className="px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all"
                        style={{
                          background: statusFilter === s ? C.green : 'transparent',
                          color: statusFilter === s ? '#fff' : C.muted,
                          border: `1px solid ${statusFilter === s ? C.green : C.greenBorder}`
                        }}>
                        {s === 'all' ? `All (${applications.length})` : `${s} (${applications.filter(a => a.status === s).length})`}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: C.muted }}>Category</label>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setCategoryFilter('all')}
                      className="px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all"
                      style={{
                        background: categoryFilter === 'all' ? C.green : 'transparent',
                        color: categoryFilter === 'all' ? '#fff' : C.muted,
                        border: `1px solid ${categoryFilter === 'all' ? C.green : C.greenBorder}`
                      }}>
                      All ({applications.length})
                    </button>
                    {categories.slice(0, 5).map(cat => (
                      <button key={cat} onClick={() => setCategoryFilter(cat)}
                        className="px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all"
                        style={{
                          background: categoryFilter === cat ? C.green : 'transparent',
                          color: categoryFilter === cat ? '#fff' : C.muted,
                          border: `1px solid ${categoryFilter === cat ? C.green : C.greenBorder}`
                        }}>
                        {cat} ({applications.filter(a => a.category === cat).length})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Applications Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-4">
          {filtered.map((a, i) => (
            <motion.div key={a._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i }}>
              <div className="rounded-2xl border overflow-hidden transition-all"
                style={{ background: C.card, borderColor: C.greenBorder }}>
                <div className="h-1.5" style={{ 
                  background: a.status === 'accepted' ? '#22c55e' : a.status === 'rejected' ? '#ef4444' : '#f59e0b',
                  opacity: 0.8
                }} />
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Avatar + Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})` }}>
                        <span className="text-white font-black text-lg">{a.fullName?.charAt(0)?.toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-black text-lg" style={{ color: C.white }}>{a.fullName}</h3>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                            style={{ background: STATUS_STYLES[a.status]?.bg, color: STATUS_STYLES[a.status]?.color }}>
                            {STATUS_STYLES[a.status]?.label}
                          </span>
                          {a.completionStatus && a.completionStatus !== 'Not Started' && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                              style={{ background: COMPLETION_STYLES[a.completionStatus]?.bg, color: COMPLETION_STYLES[a.completionStatus]?.color }}>
                              {a.completionStatus}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs" style={{ color: C.muted }}>
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{a.email}</span>
                          {a.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{a.phone}</span>}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{ background: C.greenDim, color: C.green }}>{a.category}</span>
                          {a.college && (
                            <span className="text-xs px-2 py-1 rounded-full font-medium border"
                              style={{ borderColor: C.greenBorder, color: C.muted }}>{a.college}</span>
                          )}
                          {a.duration && (
                            <span className="text-xs px-2 py-1 rounded-full font-medium border"
                              style={{ borderColor: C.greenBorder, color: C.muted }}>{a.duration}</span>
                          )}
                          {a.course && (
                            <span className="text-xs px-2 py-1 rounded-full font-medium border"
                              style={{ borderColor: C.greenBorder, color: C.muted }}>{a.course}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Rating (if completed with review) */}
                      {a.rating && <RatingStars rating={a.rating} />}
                      
                      <select value={a.status}
                        onChange={e => handleStatusChange(a._id, e.target.value)}
                        className="border-2 rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                        style={{ background: C.surface, borderColor: C.greenBorder, color: C.white }}>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      
                      {a.certificateIssued && (
                        <Button size="sm" variant="outline" className="h-9 px-3"
                          style={{ borderColor: C.greenBorder, color: C.green }}
                          onClick={() => a.certificateUrl && window.open(a.certificateUrl, '_blank')}>
                          <Download size={14} />
                        </Button>
                      )}
                      
                      <Button size="sm" variant="outline" className="h-9 w-9 p-0"
                        style={{ borderColor: C.greenBorder, color: C.muted }}
                        onClick={() => setExpanded(expanded === a._id ? null : a._id)}>
                        <motion.div animate={{ rotate: expanded === a._id ? 180 : 0 }}>
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </Button>
                      
                      <Button size="sm" variant="outline" className="h-9 w-9 p-0"
                        style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}
                        onClick={() => handleDelete(a._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expanded === a._id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                        className="overflow-hidden">
                        <div className="mt-6 pt-6 border-t space-y-6" style={{ borderColor: C.greenBorder }}>
                          {/* Personal Info */}
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: C.muted }}>
                              Personal Information
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {[['Gender', a.gender], ['Year', a.year], ['City', a.city], ['State', a.state]].map(([l, v]) => v && (
                                <div key={l} className="p-3 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.greenBorder }}>
                                  <p className="text-xs font-bold mb-0.5" style={{ color: C.green }}>{l}</p>
                                  <p className="text-sm font-medium" style={{ color: C.white }}>{v}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Experience & Skills */}
                          {a.experience && (
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: C.muted }}>
                                Experience & Skills
                              </h4>
                              <div className="p-3 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.greenBorder }}>
                                <p className="text-xs font-bold mb-1" style={{ color: C.green }}>Experience</p>
                                <p className="text-sm" style={{ color: C.white }}>{a.experience}</p>
                              </div>
                            </div>
                          )}

                          {/* Certifications */}
                          {a.certifications?.length > 0 && (
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: C.muted }}>
                                Certifications
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {a.certifications.map((cert, i) => (
                                  <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium"
                                    style={{ background: C.greenDim, color: C.green, border: `1px solid ${C.greenBorder}` }}>
                                    <Award className="w-3 h-3 inline mr-1" />{cert}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Links */}
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: C.muted }}>
                              Links & Resume
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {a.linkedin && (
                                <a href={a.linkedin} target="_blank" rel="noreferrer"
                                  className="p-3 rounded-xl border flex items-center gap-2 hover:border-blue-500 transition-colors"
                                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.greenBorder }}>
                                  <Linkedin className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm font-medium truncate" style={{ color: C.white }}>LinkedIn</span>
                                </a>
                              )}
                              {a.github && (
                                <a href={a.github} target="_blank" rel="noreferrer"
                                  className="p-3 rounded-xl border flex items-center gap-2 hover:border-purple-500 transition-colors"
                                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.greenBorder }}>
                                  <Github className="w-4 h-4 text-purple-500" />
                                  <span className="text-sm font-medium truncate" style={{ color: C.white }}>GitHub</span>
                                </a>
                              )}
                              {a.resume && (
                                <a href={a.resume} target="_blank" rel="noreferrer"
                                  className="p-3 rounded-xl border flex items-center gap-2 hover:border-green-500 transition-colors"
                                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.greenBorder }}>
                                  <FileText className="w-4 h-4 text-green-500" />
                                  <span className="text-sm font-medium" style={{ color: C.white }}>View Resume</span>
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Projects */}
                          {a.projects?.length > 0 && (
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: C.muted }}>
                                Projects
                              </h4>
                              <div className="space-y-2">
                                {a.projects.map((proj, i) => (
                                  <div key={i} className="p-3 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.greenBorder }}>
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-bold" style={{ color: C.white }}>{proj.title}</p>
                                      {proj.link && (
                                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs" style={{ color: C.green }}>
                                          View <ExternalLink className="w-3 h-3 inline" />
                                        </a>
                                      )}
                                    </div>
                                    {proj.description && (
                                      <p className="text-xs mt-1" style={{ color: C.muted }}>{proj.description}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Message / Cover Letter */}
                          {a.message && (
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: C.muted }}>
                                Message
                              </h4>
                              <div className="p-4 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.greenBorder }}>
                                <p className="text-sm whitespace-pre-wrap" style={{ color: C.white }}>{a.message}</p>
                              </div>
                            </div>
                          )}

                          {/* Review (if rated) */}
                          {a.review && (
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: C.muted }}>
                                Intern Review
                              </h4>
                              <div className="p-4 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.greenBorder }}>
                                <RatingStars rating={a.rating} />
                                <p className="text-sm mt-2 whitespace-pre-wrap" style={{ color: C.white }}>{a.review}</p>
                                <p className="text-xs mt-2" style={{ color: C.muted }}>
                                  Reviewed on {a.reviewDate ? new Date(a.reviewDate).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Dates */}
                          <div className="flex flex-wrap gap-3 text-xs" style={{ color: C.muted }}>
                            <span>Applied: {new Date(a.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            {a.startDate && <span>Started: {new Date(a.startDate).toLocaleDateString()}</span>}
                            {a.endDate && <span>Ended: {new Date(a.endDate).toLocaleDateString()}</span>}
                            {a.interviewDate && <span>Interview: {new Date(a.interviewDate).toLocaleDateString()}</span>}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-28 h-28 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-xl"
              style={{ background: C.greenDim }}>
              <GraduationCap size={56} style={{ color: C.green }} />
            </div>
            <h3 className="text-2xl font-black mb-2" style={{ color: C.white }}>No applications found</h3>
            <p style={{ color: C.muted }}>No internship applications match your filters</p>
          </motion.div>
        )}

        {filtered.length > 0 && (
          <p className="text-center text-sm mt-8" style={{ color: C.muted }}>
            Showing <span className="font-bold" style={{ color: C.white }}>{filtered.length}</span> of{' '}
            <span className="font-bold" style={{ color: C.white }}>{applications.length}</span> applications
          </p>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAllInternships;
