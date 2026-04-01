import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import {
  GraduationCap, Search, CheckCircle,
  Clock, Mail, Phone, Trash2, ChevronDown, Building2, Code2,
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
  white: "#F5F0E6",
  muted: "#7A7F8A",
  dim: "#2A2E3A",
};

const STATUS_STYLES = {
  accepted: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  pending: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  rejected: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
};

const AdminInternships = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axios.get(`${API.internship}/all`, { withCredentials: true })
      .then(r => setApplications(r.data.data || []))
      .catch(() => toast.error('Failed to fetch internship applications'))
      .finally(() => setLoading(false));
  }, []);

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

  const filtered = applications.filter(a => {
    const matchSearch =
      a.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.category?.toLowerCase().includes(search.toLowerCase()) ||
      a.college?.toLowerCase().includes(search.toLowerCase());
    if (statusFilter !== 'all') return matchSearch && a.status === statusFilter;
    return matchSearch;
  });

  const accepted  = applications.filter(a => a.status === 'accepted').length;
  const pending   = applications.filter(a => a.status === 'pending').length;
  const rejected  = applications.filter(a => a.status === 'rejected').length;
  const categories = new Set(applications.map(a => a.category)).size;

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
          style={{ background: `linear-gradient(135deg,${C.gold},${C.goldLight})` }}>
          <GraduationCap size={24} style={{ color: C.obsidian }} />
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
            style={{ background: `linear-gradient(135deg, ${C.gold}, #C8884A)`, border: `1px solid ${C.goldBorder}` }}>
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(30%,-30%)' }} />
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                <GraduationCap className="h-9 w-9 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">Internship Applications</h1>
                <p className="text-white/80">All internship applicants & their details</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{applications.length} Total</span>
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{accepted} Accepted</span>
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{pending} Pending</span>
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{categories} Categories</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Total Applications', value: applications.length, icon: GraduationCap, color: C.gold, glow: 'rgba(212,168,83,0.4)' },
            { title: 'Accepted',           value: accepted,            icon: CheckCircle,   color: '#22c55e', glow: 'rgba(34,197,94,0.4)' },
            { title: 'Pending',            value: pending,             icon: Clock,         color: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
            { title: 'Categories',         value: categories,          icon: Code2,         color: '#8b5cf6', glow: 'rgba(139,92,246,0.4)' },
          ].map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.04 * i }} whileHover={{ y: -4, scale: 1.04 }}>
              <div className="rounded-2xl border overflow-hidden" style={{ background: C.card, borderColor: C.goldBorder }}>
                <CardContent className="p-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md mb-3"
                    style={{ background: c.goldDim, boxShadow: `0 0 16px ${c.glow}` }}>
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
          className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: C.muted }} />
            <Input className="pl-12 h-12 border-2 rounded-xl transition-all"
              style={{ background: C.obsidian, borderColor: C.goldBorder, color: C.white }}
              placeholder="Search by name, email, category..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'accepted', 'rejected'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border capitalize ${
                  statusFilter === s
                    ? ''
                    : ''
                }`}
                style={{
                  background: statusFilter === s ? C.gold : C.card,
                  color: statusFilter === s ? C.obsidian : C.muted,
                  borderColor: statusFilter === s ? C.gold : C.goldBorder
                }}>
                {s === 'all' ? `All (${applications.length})` : `${s} (${applications.filter(a => a.status === s).length})`}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-4">
          {filtered.map((a, i) => (
            <motion.div key={a._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i }}>
              <div className="rounded-2xl border overflow-hidden transition-all"
                style={{ background: C.card, borderColor: C.goldBorder }}>
                <div className="h-1 bg-gradient-to-r" style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})` }} />
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    {/* Left: Avatar + Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` }}>
                        <span className="text-white font-black text-lg">{a.fullName?.charAt(0)?.toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-lg" style={{ color: C.white }}>{a.fullName}</h3>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                            style={{ background: STATUS_STYLES[a.status]?.bg, color: STATUS_STYLES[a.status]?.color }}>
                            {a.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs" style={{ color: C.muted }}><Mail className="w-3 h-3" />{a.email}</span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: C.muted }}><Phone className="w-3 h-3" />{a.phone}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs px-2 py-1 rounded-full" style={{ background: C.goldDim, color: C.gold }}>{a.category}</span>
                          {a.college && <span className="text-xs px-2 py-1 rounded-full border" style={{ borderColor: C.goldBorder, color: C.muted }}>{a.college}</span>}
                          {a.year && <span className="text-xs px-2 py-1 rounded-full border" style={{ borderColor: C.goldBorder, color: C.muted }}>{a.year}</span>}
                          {a.experience && <span className="text-xs px-2 py-1 rounded-full border" style={{ borderColor: C.goldBorder, color: C.muted }}>{a.experience}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <select value={a.status}
                        onChange={e => handleStatusChange(a._id, e.target.value)}
                        className="border-2 rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                        style={{ background: C.surface, borderColor: C.goldBorder, color: C.white }}>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <Button size="sm" variant="outline"
                        className="h-9 w-9 p-0"
                        style={{ borderColor: C.goldBorder, color: C.muted }}
                        onClick={() => setExpanded(expanded === a._id ? null : a._id)}>
                        <motion.div animate={{ rotate: expanded === a._id ? 180 : 0 }}>
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </Button>
                      <Button size="sm" variant="outline"
                        className="h-9 w-9 p-0"
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
                        <div className="mt-5 pt-5 border-t space-y-4" style={{ borderColor: C.goldBorder }}>
                          {/* Personal */}
                          <p className="text-xs font-black uppercase tracking-widest" style={{ color: C.muted }}>Personal</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[['Gender', a.gender], ['Phone', a.phone]].map(([l, v]) => v && (
                              <div key={l} className="p-3 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.goldBorder }}>
                                <p className="text-xs font-bold mb-0.5" style={{ color: C.gold }}>{l}</p>
                                <p className="text-sm font-medium" style={{ color: C.white }}>{v}</p>
                              </div>
                            ))}
                          </div>
                          {/* Academic */}
                          <p className="text-xs font-black uppercase tracking-widest" style={{ color: C.muted }}>Academic</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[['Course', a.course], ['Year', a.year], ['City', a.city], ['State', a.state]].map(([l, v]) => v && (
                              <div key={l} className="p-3 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.goldBorder }}>
                                <p className="text-xs font-bold mb-0.5" style={{ color: C.gold }}>{l}</p>
                                <p className="text-sm font-medium" style={{ color: C.white }}>{v}</p>
                              </div>
                            ))}
                          </div>
                          {/* Internship */}
                          <p className="text-xs font-black uppercase tracking-widest" style={{ color: C.muted }}>Internship</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[['Duration', a.duration]].map(([l, v]) => v && (
                              <div key={l} className="p-3 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.goldBorder }}>
                                <p className="text-xs font-bold mb-0.5" style={{ color: C.gold }}>{l}</p>
                                <p className="text-sm font-medium" style={{ color: C.white }}>{v}</p>
                              </div>
                            ))}
                          </div>
                          {/* Links & Resume */}
                          <p className="text-xs font-black uppercase tracking-widest" style={{ color: C.muted }}>Links & Resume</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {a.linkedin && (
                              <div className="p-3 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.goldBorder }}>
                                <p className="text-xs font-bold mb-0.5" style={{ color: C.gold }}>LinkedIn</p>
                                <a href={a.linkedin} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline truncate block" style={{ color: C.white }}>{a.linkedin}</a>
                              </div>
                            )}
                            {a.github && (
                              <div className="p-3 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.goldBorder }}>
                                <p className="text-xs font-bold mb-0.5" style={{ color: C.gold }}>GitHub</p>
                                <a href={a.github} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline truncate block" style={{ color: C.white }}>{a.github}</a>
                              </div>
                            )}
                            {a.portfolio && (
                              <div className="p-3 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.goldBorder }}>
                                <p className="text-xs font-bold mb-0.5" style={{ color: C.gold }}>Portfolio</p>
                                <a href={a.portfolio} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline truncate block" style={{ color: C.white }}>{a.portfolio}</a>
                              </div>
                            )}
                            {a.resume && (
                              <div className="p-3 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.goldBorder }}>
                                <p className="text-xs font-bold mb-0.5" style={{ color: C.gold }}>Resume</p>
                                <a href={a.resume} target="_blank" rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-sm font-semibold hover:underline" style={{ color: C.gold }}>
                                  View / Download
                                </a>
                              </div>
                            )}
                          </div>
                          {/* Applied On + Message */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.goldBorder }}>
                              <p className="text-xs font-bold mb-0.5" style={{ color: C.gold }}>Applied On</p>
                              <p className="text-sm font-medium" style={{ color: C.white }}>{new Date(a.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            {a.message && (
                              <div className="p-3 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.goldBorder }}>
                                <p className="text-xs font-bold mb-0.5" style={{ color: C.gold }}>Message</p>
                                <p className="text-sm" style={{ color: C.white }}>{a.message}</p>
                              </div>
                            )}
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
              style={{ background: C.goldDim }}>
              <GraduationCap size={56} style={{ color: C.gold }} />
            </div>
            <h3 className="text-2xl font-black mb-2" style={{ color: C.white }}>No applications found</h3>
            <p style={{ color: C.muted }}>No internship applications match your search</p>
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

export default AdminInternships;