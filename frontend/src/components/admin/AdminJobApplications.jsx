import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Search, Users, Building2, TrendingUp, CheckCircle, Mail, Clock, XCircle, Eye, Trash2, X, ChevronDown } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { API } from '@/config/api';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
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
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  accepted: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const AdminJobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  React.useEffect(() => {
    axios.get(`${API.application}/all`, { withCredentials: true })
      .then(r => setApplications(r.data.applications || []))
      .catch(() => toast.error('Failed to fetch applications'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API.application}/${id}`, { withCredentials: true });
      setApplications(prev => prev.filter(a => a._id !== id));
      toast.success('Application deleted successfully');
    } catch {
      toast.error('Failed to delete application');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.post(`${API.application}/status/${id}/update`, { status: newStatus }, { withCredentials: true });
      setApplications(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
      if (selectedApp?._id === id) setSelectedApp(prev => ({ ...prev, status: newStatus }));
      toast.success(`Application ${newStatus} successfully`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = applications.filter(a => {
    const matchSearch =
      a.applicant?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      a.applicant?.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.job?.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.job?.company?.name?.toLowerCase().includes(search.toLowerCase());
    if (statusFilter !== 'all') return matchSearch && a.status === statusFilter;
    return matchSearch;
  });

  const accepted = applications.filter(a => a.status === 'accepted').length;
  const pending  = applications.filter(a => a.status === 'pending').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;
  const uniqueUsers = new Set(applications.map(a => a.applicant?._id)).size;

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#D4A853]" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#121218] via-[#1A1A24] to-[#121218] p-8 shadow-2xl border border-[#252532]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A853]/5 rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C8884A]/5 rounded-full -ml-16 -mb-16" />
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4A853] to-[#C8884A] flex items-center justify-center shadow-xl flex-shrink-0">
                <Briefcase className="h-9 w-9 text-[#0A0A0F]" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#F5F0E6] mb-1">Job Applications</h1>
                <p className="text-[#A8A099]">All users who applied for jobs</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-[#D4A853]/20 text-[#D4A853] text-xs px-3 py-1 rounded-full font-medium">{applications.length} Total</span>
                  <span className="bg-[#D4A853]/20 text-[#D4A853] text-xs px-3 py-1 rounded-full font-medium">{uniqueUsers} Applicants</span>
                  <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full font-medium">{accepted} Accepted</span>
                  <span className="bg-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full font-medium">{pending} Pending</span>
                  <span className="bg-red-500/20 text-red-400 text-xs px-3 py-1 rounded-full font-medium">{rejected} Rejected</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Total Applications', value: applications.length, icon: Briefcase, g: 'from-[#D4A853] to-[#C8884A]', bg: 'bg-[#121218]', border: 'border-[#252532]' },
            { title: 'Unique Applicants', value: uniqueUsers, icon: Users, g: 'from-[#C8884A] to-[#E8C17A]', bg: 'bg-[#121218]', border: 'border-[#252532]' },
            { title: 'Accepted', value: accepted, icon: CheckCircle, g: 'from-green-500 to-emerald-600', bg: 'bg-[#121218]', border: 'border-[#252532]' },
            { title: 'Pending', value: pending, icon: Clock, g: 'from-amber-500 to-orange-600', bg: 'bg-[#121218]', border: 'border-[#252532]' },
            { title: 'Rejected', value: rejected, icon: XCircle, g: 'from-red-500 to-rose-600', bg: 'bg-[#121218]', border: 'border-[#252532]' },
          ].map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.04 * i }} whileHover={{ y: -4, scale: 1.04 }}>
              <Card className={`border ${c.border} ${c.bg} shadow-md`}>
                <CardContent className="p-4">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.g} flex items-center justify-center shadow-md mb-3`}>
                    <c.icon className="w-4 h-4 text-[#0A0A0F]" />
                  </div>
                  <p className="text-xs text-[#A8A099] font-medium mb-1">{c.title}</p>
                  <p className="text-xl font-black text-[#F5F0E6]">{c.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A8A099]" />
            <Input className="pl-12 h-12 border-2 border-[#252532] focus:border-[#D4A853] rounded-xl bg-[#121218] text-[#F5F0E6] placeholder:text-[#A8A099] transition-all"
              placeholder="Search by name, email, job, company..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'accepted', 'rejected'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border capitalize ${
                  statusFilter === s
                    ? 'bg-gradient-to-r from-[#D4A853] to-[#C8884A] text-[#0A0A0F] border-[#D4A853] shadow-lg'
                    : 'bg-[#121218] text-[#A8A099] border-[#252532] hover:border-[#D4A853]/50'
                }`}>
                {s === 'all' ? `All (${applications.length})` : `${s} (${applications.filter(a => a.status === s).length})`}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="border-[#252532] shadow-xl rounded-3xl overflow-hidden bg-[#121218]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0A0A0F] border-b border-[#252532]">
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#A8A099] uppercase tracking-wider">#</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#A8A099] uppercase tracking-wider">Applicant</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#A8A099] uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#A8A099] uppercase tracking-wider">Job Title</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#A8A099] uppercase tracking-wider">Company</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#A8A099] uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#A8A099] uppercase tracking-wider">Applied On</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#A8A099] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252532]">
                  {filtered.map((a, i) => (
                    <motion.tr key={a._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.02 * i }}
                      className="hover:bg-[#1A1A24] transition-colors">
                      <td className="px-6 py-4 text-sm text-[#A8A099] font-medium">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4A853] to-[#C8884A] flex items-center justify-center shadow-sm flex-shrink-0">
                            <span className="text-[#0A0A0F] font-black text-sm">
                              {a.applicant?.fullname?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <span className="font-semibold text-[#F5F0E6] text-sm">{a.applicant?.fullname || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-[#A8A099]">
                          <Mail className="w-3.5 h-3.5 text-[#A8A099] flex-shrink-0" />
                          {a.applicant?.email || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#F5F0E6] text-sm">{a.job?.title || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {a.job?.company?.logo ? (
                            <img src={a.job.company.logo} alt="" className="w-6 h-6 rounded-lg object-cover" />
                          ) : (
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#D4A853] to-[#C8884A] flex items-center justify-center">
                              <Building2 className="w-3 h-3 text-[#0A0A0F]" />
                            </div>
                          )}
                          <span className="text-sm text-[#A8A099] font-medium">{a.job?.company?.name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select value={a.status} onChange={(e) => handleStatusChange(a._id, e.target.value)}
                          className={`text-xs font-bold capitalize px-3 py-1.5 rounded-lg border cursor-pointer appearance-none ${STATUS_STYLES[a.status] || 'bg-[#252532] text-[#A8A099]'}`}
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', paddingRight: '28px' }}>
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#A8A099]">
                        {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedApp(a)}
                            className="p-2 rounded-lg bg-[#252532] hover:bg-[#D4A853]/20 text-[#A8A099] hover:text-[#D4A853] transition-all">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => handleDelete(a._id)}
                            disabled={deletingId === a._id}
                            className="p-2 rounded-lg bg-[#252532] hover:bg-red-500/20 text-[#A8A099] hover:text-red-400 transition-all disabled:opacity-50">
                            {deletingId === a._id ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-[#121218] border border-[#252532] flex items-center justify-center shadow-xl">
                    <Briefcase size={44} className="text-[#A8A099]" />
                  </div>
                  <h3 className="text-2xl font-black text-[#F5F0E6] mb-2">No applications found</h3>
                  <p className="text-[#A8A099]">No applications match your search</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {filtered.length > 0 && (
          <p className="text-center text-sm text-[#A8A099] mt-6">
            Showing <span className="font-bold text-[#F5F0E6]">{filtered.length}</span> of{' '}
            <span className="font-bold text-[#F5F0E6]">{applications.length}</span> applications
          </p>
        )}
      </div>

      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedApp(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121218] border border-[#252532] rounded-3xl w-full max-w-lg p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#F5F0E6]">Application Details</h2>
              <button onClick={() => setSelectedApp(null)} className="p-2 rounded-lg bg-[#252532] text-[#A8A099] hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1A1A24] border border-[#252532]">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4A853] to-[#C8884A] flex items-center justify-center">
                  <span className="text-[#0A0A0F] font-black text-xl">{selectedApp.applicant?.fullname?.charAt(0)?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-bold text-[#F5F0E6] text-lg">{selectedApp.applicant?.fullname || '—'}</p>
                  <p className="text-[#A8A099] text-sm flex items-center gap-1"><Mail size={14} /> {selectedApp.applicant?.email || '—'}</p>
                </div>
              </div>
                <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#1A1A24] border border-[#252532]">
                  <p className="text-xs text-[#A8A099] mb-1">Job Title</p>
                  <p className="font-semibold text-[#F5F0E6]">{selectedApp.job?.title || '—'}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#1A1A24] border border-[#252532]">
                  <p className="text-xs text-[#A8A099] mb-1">Company</p>
                  <p className="font-semibold text-[#F5F0E6]">{selectedApp.job?.company?.name || '—'}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#1A1A24] border border-[#252532]">
                  <p className="text-xs text-[#A8A099] mb-1">Applied On</p>
                  <p className="font-semibold text-[#F5F0E6]">{new Date(selectedApp.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#1A1A24] border border-[#252532]">
                <p className="text-xs text-[#A8A099] mb-3">Update Status</p>
                <div className="flex gap-2">
                  <button onClick={() => handleStatusChange(selectedApp._id, 'pending')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                      selectedApp.status === 'pending' ? 'bg-[#D4A853] text-[#0A0A0F]' : 'bg-[#252532] text-[#A8A099] hover:bg-[#D4A853]/20 hover:text-[#D4A853]'
                    }`}>
                    <Clock size={14} className="inline mr-1.5" /> Pending
                  </button>
                  <button onClick={() => handleStatusChange(selectedApp._id, 'accepted')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                      selectedApp.status === 'accepted' ? 'bg-green-500 text-white' : 'bg-[#252532] text-[#A8A099] hover:bg-green-500/20 hover:text-green-400'
                    }`}>
                    <CheckCircle size={14} className="inline mr-1.5" /> Accepted
                  </button>
                  <button onClick={() => handleStatusChange(selectedApp._id, 'rejected')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                      selectedApp.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-[#252532] text-[#A8A099] hover:bg-red-500/20 hover:text-red-400'
                    }`}>
                    <XCircle size={14} className="inline mr-1.5" /> Rejected
                  </button>
                </div>
              </div>
              {selectedApp.resume && (
                <a href={selectedApp.resume} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-4 rounded-xl bg-[#D4A853]/10 border border-[#D4A853]/30 text-[#D4A853] font-semibold hover:bg-[#D4A853]/20 transition-all">
                  <Eye size={18} /> View Resume
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminJobApplications;
