import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API } from '@/config/api';
import { 
  CheckCircle2, XCircle, Clock, Mail, FileText, Phone, User, Calendar, 
  Loader2, Video, Code, Send, X, Search, Plus
} from 'lucide-react';

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
  blue: "#3B82F6",
  green: "#10B981",
  red: "#EF4444",
};

const statusConfig = {
  accepted: { label: 'Accepted', color: '#059669', bg: 'rgba(5,150,105,0.1)', border: 'rgba(5,150,105,0.3)', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: '#dc2626', bg: 'rgba(220,38,38,0.1)', border: 'rgba(220,38,38,0.3)', icon: XCircle },
  pending:  { label: 'Pending',  color: '#d97706', bg: 'rgba(217,119,6,0.1)', border: 'rgba(217,119,6,0.3)', icon: Clock },
};

const ApplicantsTable = ({ jobId }) => {
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`${API.application}/get`, { withCredentials: true });
        setApplicants(res.data?.application || []);
      } catch (err) {
        console.error('Failed to fetch applicants:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  const [scheduleForm, setScheduleForm] = useState({
    title: '',
    scheduledAt: '',
    duration: 30,
    type: 'video',
    enableProctoring: false,
    enableRecording: true,
    meetingLink: '',
    notes: ''
  });

  const handleStatus = async (status, applicationId) => {
    setLoadingId(applicationId + status);
    try {
      const res = await axios.post(
        `${APPLICATION_API}/status/${applicationId}/update`,
        { status },
        { withCredentials: true }
      );
      if (res.data.success) {
        const updated = {
          ...applicants,
          applications: applicants.applications.map(app =>
            app._id === applicationId ? { ...app, status: status.toLowerCase() } : app
          ),
        };
        dispatch(setAllApplicants(updated));
        toast.success(`Status set to ${status} — email sent to applicant`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoadingId(null);
    }
  };

  const openScheduleModal = (app) => {
    const candidate = app.applicant;
    setSelectedCandidate({
      _id: candidate._id,
      fullname: candidate.fullname,
      email: candidate.email,
      phone: candidate.phoneNumber,
      jobTitle: app.job?.title,
      applicationId: app._id
    });
    setScheduleForm({
      title: `${app.job?.title || 'Interview'} - ${candidate.fullname || 'Candidate'}`,
      scheduledAt: '',
      duration: 30,
      type: 'video',
      enableProctoring: false,
      enableRecording: true,
      meetingLink: '',
      notes: ''
    });
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleForm.scheduledAt) {
      toast.error('Please select date and time');
      return;
    }
    setScheduleLoading(true);
    try {
      const payload = {
        title: scheduleForm.title,
        candidateId: selectedCandidate._id,
        scheduledAt: new Date(scheduleForm.scheduledAt).toISOString(),
        duration: scheduleForm.duration,
        type: scheduleForm.type,
        enableProctoring: scheduleForm.enableProctoring,
        enableRecording: scheduleForm.enableRecording,
        meetingLink: scheduleForm.meetingLink,
        notes: scheduleForm.notes,
      };
      await axios.post(`${INTERVIEW_API}/schedule`, payload, { withCredentials: true });
      toast.success('Interview scheduled successfully! Candidate will receive an email.');
      setShowScheduleModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setScheduleLoading(false);
    }
  };

  const apps = applicants?.applications || [];
  
  const filteredApps = apps.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status?.toLowerCase() === filterStatus;
    const matchesSearch = !searchQuery || 
      app.applicant?.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: apps.length,
    pending: apps.filter(a => a.status === 'pending').length,
    accepted: apps.filter(a => a.status === 'accepted').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  };

  if (apps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4" style={{ background: C.goldDim }}>
          <User size={36} style={{ color: C.gold }} />
        </div>
        <p className="text-xl font-bold" style={{ color: C.white }}>No applicants yet</p>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Applications will appear here once users apply</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'pending', 'accepted', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: filterStatus === status ? C.gold : C.surface,
                color: filterStatus === status ? C.obsidian : C.muted,
                border: `1px solid ${filterStatus === status ? C.gold : C.goldBorder}`
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-auto">
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
          <input
            type="text"
            placeholder="Search by name, email, job..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl text-sm"
            style={{ background: C.surface, border: `1px solid ${C.goldBorder}`, color: C.white, outline: 'none' }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: C.surface }}>
              {['Applicant', 'Job', 'Contact', 'Resume', 'Applied', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider" style={{ color: C.muted }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: C.goldBorder }}>
            <AnimatePresence>
              {filteredApps.map((item, idx) => {
                const status = item.status?.toLowerCase() || 'pending';
                const cfg = statusConfig[status] || statusConfig.pending;
                const StatusIcon = cfg.icon;
                const isAccepting = loadingId === item._id + 'Accepted';
                const isRejecting = loadingId === item._id + 'Rejected';

                return (
                  <motion.tr key={item._id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="transition-colors group">

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` }}>
                          {item.applicant?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-sm" style={{ color: C.white }}>{item.applicant?.fullname || '—'}</p>
                          <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: C.muted }}>
                            <Mail size={10} /> {item.applicant?.email || '—'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-sm font-medium" style={{ color: C.white }}>{item.job?.title || '—'}</p>
                      <p className="text-xs" style={{ color: C.muted }}>{item.job?.company?.name || ''}</p>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-sm" style={{ color: C.muted }}>
                          <Phone size={13} style={{ color: C.muted }} />
                          {item.applicant?.phoneNumber || '—'}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {item.applicant?.profile?.resume ? (
                        <a href={item.applicant.profile.resume} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                          style={{ background: C.goldDim, color: C.gold }}>
                          <FileText size={12} />
                          View
                        </a>
                      ) : (
                        <span className="text-xs px-3 py-1.5 rounded-xl" style={{ background: C.surface, color: C.muted }}>No resume</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1.5 text-sm" style={{ color: C.muted }}>
                        <Calendar size={13} style={{ color: C.muted }} />
                        {item.createdAt?.split('T')[0] || '—'}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                        <StatusIcon size={12} />
                        {cfg.label}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => openScheduleModal(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                          style={{ background: `${C.blue}20`, color: C.blue, border: `1px solid ${C.blue}40` }}>
                          <Video size={12} />
                          Schedule
                        </motion.button>
                        {status === 'pending' && (
                          <>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              disabled={!!loadingId}
                              onClick={() => handleStatus('Accepted', item._id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                              style={{ background: 'rgba(5,150,105,0.1)', color: '#059669', border: '1px solid rgba(5,150,105,0.3)' }}>
                              {isAccepting ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                              Accept
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              disabled={!!loadingId}
                              onClick={() => handleStatus('Rejected', item._id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                              style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.3)' }}>
                              {isRejecting ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                              Reject
                            </motion.button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showScheduleModal && selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg p-6 rounded-2xl"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: C.gold }}>Schedule Interview</h2>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>Interview will be sent to candidate's email</p>
                </div>
                <button onClick={() => setShowScheduleModal(false)} className="p-2 rounded-lg" style={{ background: C.surfaceLight }}>
                  <X size={18} style={{ color: C.muted }} />
                </button>
              </div>

              <div className="p-4 rounded-xl mb-4" style={{ background: C.surfaceLight, border: `1px solid ${C.goldBorder}` }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                    style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: C.obsidian }}>
                    {selectedCandidate.fullname?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: C.white }}>{selectedCandidate.fullname}</p>
                    <p className="text-xs flex items-center gap-1" style={{ color: C.muted }}>
                      <Mail size={10} /> {selectedCandidate.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: C.muted }}>
                  <span>Applied for:</span>
                  <span className="font-semibold" style={{ color: C.gold }}>{selectedCandidate.jobTitle}</span>
                </div>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-2" style={{ color: C.muted }}>Interview Title</label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.title}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: C.obsidian, border: `1px solid ${C.goldBorder}`, color: C.white }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2" style={{ color: C.muted }}>Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={scheduleForm.scheduledAt}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledAt: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: C.obsidian, border: `1px solid ${C.goldBorder}`, color: C.white }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2" style={{ color: C.muted }}>Duration</label>
                    <select
                      value={scheduleForm.duration}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: C.obsidian, border: `1px solid ${C.goldBorder}`, color: C.white }}
                    >
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                      <option value={60}>60 min</option>
                      <option value={90}>90 min</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-2" style={{ color: C.muted }}>Interview Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { type: 'video', icon: Video, label: 'Video Call' },
                      { type: 'coding', icon: Code, label: 'Coding Round' },
                    ].map(opt => (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => setScheduleForm({ ...scheduleForm, type: opt.type })}
                        className="flex items-center gap-2 p-3 rounded-xl text-sm"
                        style={{
                          background: scheduleForm.type === opt.type ? `${C.blue}22` : C.obsidian,
                          border: `1px solid ${scheduleForm.type === opt.type ? C.blue : C.goldBorder}`,
                          color: scheduleForm.type === opt.type ? C.blue : C.muted,
                        }}
                      >
                        <opt.icon size={16} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-2" style={{ color: C.muted }}>Meeting Link (optional)</label>
                  <input
                    type="url"
                    value={scheduleForm.meetingLink}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: C.obsidian, border: `1px solid ${C.goldBorder}`, color: C.white }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-2" style={{ color: C.muted }}>Notes (optional)</label>
                  <textarea
                    value={scheduleForm.notes}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                    placeholder="Add any notes for the candidate..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                    style={{ background: C.obsidian, border: `1px solid ${C.goldBorder}`, color: C.white }}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold"
                    style={{ background: C.surfaceLight, color: C.muted }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={scheduleLoading}
                    className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.green})`, color: C.white }}
                  >
                    {scheduleLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
                    Schedule & Send Email
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicantsTable;
