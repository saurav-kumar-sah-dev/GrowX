import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Users, Search, UserCheck, UserX, Mail, Phone, Calendar,
  Crown, Trash2, ToggleLeft, ToggleRight, AlertTriangle
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
  goldBorderHover: "rgba(212,168,83,0.3)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
  dim: "#2A2E3A",
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API.user}/all`, { withCredentials: true });
      setUsers(res.data.users || []);
    } catch {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await axios.delete(`${API.user}/delete/${deleteTarget._id}`, { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.data.success) {
        setUsers(prev => prev.filter(u => u._id !== deleteTarget._id));
        toast.success(`"${deleteTarget.fullname}" deleted successfully`);
      } else {
        toast.error(res.data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err?.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await axios.patch(`${API.user}/toggle-status/${userId}`, {}, { withCredentials: true });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: res.data.user.isActive } : u));
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    }
  };

  const activeUsers   = users.filter(u => u.isActive !== false);
  const recruiters    = users.filter(u => u.role === 'recruiter');
  const students     = users.filter(u => u.role === 'student');
  const thisMonth    = users.filter(u => new Date(u.createdAt).getMonth() === new Date().getMonth());

  const filteredUsers = users.filter(u => {
    const matchSearch =
      u.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeFilter === 'recruiter') return matchSearch && u.role === 'recruiter';
    if (activeFilter === 'student')   return matchSearch && u.role === 'student';
    if (activeFilter === 'active')    return matchSearch && u.isActive !== false;
    return matchSearch;
  });

  const statCards = [
    { title: 'Total Users',    value: users.length,          icon: Users,      color: '#8b5cf6', glow: 'rgba(139,92,246,0.4)' },
    { title: 'Active Users',   value: activeUsers.length,    icon: UserCheck,  color: '#22c55e', glow: 'rgba(34,197,94,0.4)' },
    { title: 'Recruiters',    value: recruiters.length,     icon: Crown,      color: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
    { title: 'Students',      value: students.length,       icon: Users,      color: '#3b82f6', glow: 'rgba(59,130,246,0.4)' },
    { title: 'Inactive',       value: users.length - activeUsers.length, icon: UserX, color: '#ef4444', glow: 'rgba(239,68,68,0.4)' },
    { title: 'This Month',    value: thisMonth.length,      icon: Calendar,   color: '#ec4899', glow: 'rgba(236,72,153,0.4)' },
  ];

  const filters = [
    { key: 'all',       label: `All (${users.length})` },
    { key: 'student',   label: `Students (${students.length})` },
    { key: 'recruiter', label: `Recruiters (${recruiters.length})` },
    { key: 'active',    label: `Active (${activeUsers.length})` },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center animate-pulse"
              style={{ background: `linear-gradient(135deg,${C.gold},${C.goldLight})` }}>
              <Users className="w-10 h-10" style={{ color: C.obsidian }} />
            </div>
            <p style={{ color: C.muted }}>Loading Users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">

        {/* Hero Banner */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${C.gold}, #C8884A)`, border: `1px solid ${C.goldBorder}` }}>
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(30%,-30%)' }} />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                  <Users className="h-9 w-9 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">Active Users</h1>
                  <p className="text-white/80">Monitor & manage all platform users</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{users.length} Total</span>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{activeUsers.length} Active</span>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{recruiters.length} Recruiters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-6">
          <div className="rounded-3xl border overflow-hidden" style={{ background: C.card, borderColor: C.goldBorder }}>
            <div className="p-5">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: C.muted }} />
                  <Input
                    className="pl-12 h-12 border-2 rounded-2xl transition-all"
                    style={{ background: C.obsidian, borderColor: C.goldBorder, color: C.white }}
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.map(f => (
                    <button key={f.key} onClick={() => setActiveFilter(f.key)}
                      className="px-4 py-2 rounded-2xl text-xs font-bold transition-all border"
                      style={{
                        background: activeFilter === f.key ? C.gold : 'transparent',
                        color: activeFilter === f.key ? C.obsidian : C.muted,
                        borderColor: activeFilter === f.key ? C.gold : C.goldBorder
                      }}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.04 * i }} whileHover={{ y: -4, scale: 1.04 }}>
              <div className="rounded-2xl border overflow-hidden" style={{ background: C.card, borderColor: C.goldBorder }}>
                <CardContent className="p-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md mb-3"
                    style={{ background: C.goldDim, boxShadow: `0 0 16px ${c.glow}` }}>
                    <c.icon className="w-4 h-4" style={{ color: c.color }} />
                  </div>
                  <p className="text-xs font-medium mb-1" style={{ color: C.muted }}>{c.title}</p>
                  <p className="text-2xl font-black" style={{ color: C.white }}>{c.value}</p>
                </CardContent>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Users Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user, index) => (
            <motion.div key={user._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * index }} whileHover={{ y: -6, scale: 1.02 }}>
              <div className="rounded-2xl border overflow-hidden transition-all"
                style={{ background: C.card, borderColor: C.goldBorder }}>
                <div className="h-1.5 bg-gradient-to-r" style={{
                  background: user.role === 'recruiter'
                    ? 'linear-gradient(90deg, #f59e0b, #f97316, #ef4444)'
                    : `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`
                }} />

                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={user.profile?.profilePhoto} />
                        <AvatarFallback className="text-white text-xl font-black"
                          style={{ background: user.role === 'recruiter' ? 'linear-gradient(135deg, #f59e0b, #f97316)' : `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` }}>
                          {user.fullname?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2" style={{ background: '#22c55e', borderColor: C.card }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-lg truncate" style={{ color: C.white }}>{user.fullname}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.muted }} />
                        <p className="text-xs truncate" style={{ color: C.muted }}>{user.email}</p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: user.role === 'recruiter' ? 'rgba(245,158,11,0.15)' : C.goldDim, color: user.role === 'recruiter' ? '#f59e0b' : C.gold }}>
                          {user.role}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: user.isActive !== false ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: user.isActive !== false ? '#22c55e' : '#ef4444' }}>
                          {user.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2.5 p-3 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.goldBorder }}>
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: C.goldDim }}>
                        <Phone className="w-3.5 h-3.5" style={{ color: C.gold }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold" style={{ color: C.gold }}>Phone</p>
                        <p className="text-xs truncate font-medium" style={{ color: C.white }}>{user.phoneNumber || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-3 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.goldBorder }}>
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: C.goldDim }}>
                        <Calendar className="w-3.5 h-3.5" style={{ color: C.gold }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold" style={{ color: C.gold }}>Joined</p>
                        <p className="text-xs truncate font-medium" style={{ color: C.white }}>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: C.goldBorder }}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleStatus(user._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all border"
                      style={{
                        background: user.isActive !== false ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                        borderColor: user.isActive !== false ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)',
                        color: user.isActive !== false ? '#f59e0b' : '#22c55e'
                      }}>
                      {user.isActive !== false ? <><ToggleRight className="w-3.5 h-3.5" /> Deactivate</> : <><ToggleLeft className="w-3.5 h-3.5" /> Activate</>}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteTarget(user)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs transition-all border"
                      style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </motion.button>
                  </div>

                  {user.profile?.bio && (
                    <div className="mt-3 p-3 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.goldBorder }}>
                      <p className="text-xs line-clamp-2" style={{ color: C.muted }}>{user.profile.bio}</p>
                    </div>
                  )}
                </CardContent>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredUsers.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-28 h-28 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-xl" style={{ background: C.goldDim }}>
              <Users size={56} style={{ color: C.gold }} />
            </div>
            <h3 className="text-2xl font-black mb-2" style={{ color: C.white }}>No users found</h3>
            <p style={{ color: C.muted }}>Try adjusting your search or filter</p>
          </motion.div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={() => setDeleteTarget(null)}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="rounded-3xl shadow-2xl p-8 max-w-sm w-full border"
              style={{ background: C.card, borderColor: C.goldBorder }}
              onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'rgba(239,68,68,0.15)' }}>
                <AlertTriangle className="w-8 h-8" style={{ color: '#ef4444' }} />
              </div>
              <h3 className="text-xl font-black text-center mb-2" style={{ color: C.white }}>Delete User?</h3>
              <p className="text-center text-sm mb-6" style={{ color: C.muted }}>
                Are you sure you want to delete{' '}
                <span className="font-bold" style={{ color: C.white }}>"{deleteTarget.fullname}"</span>?
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setDeleteTarget(null)}
                  className="flex-1 h-11 rounded-2xl font-semibold border-2"
                  style={{ borderColor: C.goldBorder, color: C.white, background: 'transparent' }}>
                  Cancel
                </Button>
                <Button onClick={handleDelete} disabled={deleting}
                  className="flex-1 h-11 rounded-2xl font-bold shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white' }}>
                  {deleting ? 'Deleting...' : <><Trash2 className="w-4 h-4 mr-2" /> Delete</>}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </AdminLayout>
  );
};

export default AdminUsers;
