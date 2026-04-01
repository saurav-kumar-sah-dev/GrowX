import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API } from '@/config/api';
import AdminLayout from './AdminLayout';
import {
  ArrowLeft, Building2, MapPin, DollarSign, Clock, Users,
  Briefcase, Calendar, Eye, Edit, Trash2, CheckCircle, XCircle, Loader2,
  X, Mail, Phone, MapPinned, Link as LinkIcon, FileText, GraduationCap,
  Award, CalendarDays, ExternalLink
} from 'lucide-react';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#0D1017",
  surface: "#151820",
  surfaceLight: "#1C1F28",
  card: "#1A1D26",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
  goldBorderHover: "rgba(212,168,83,0.3)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
  green: "#10b981",
  red: "#ef4444",
};

const Applicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, appRes] = await Promise.all([
          axios.get(`${API.job}/getadminjobs`, { withCredentials: true }),
          axios.get(`${API.application}/get`, { withCredentials: true })
        ]);

        const allJobs = jobRes.data.jobs || [];
        const foundJob = allJobs.find(j => j._id === id);
        setJob(foundJob);

        const allApps = appRes.data?.application || [];
        const jobApps = allApps.filter(app => app.jobId?._id === id || app.job === id);
        setApplicants(jobApps);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'rgba(16,185,129,0.3)' };
      case 'rejected': return { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'rgba(239,68,68,0.3)' };
      default: return { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' };
    }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      const res = await axios.post(`${API.application}/status/${appId}/update`, { status }, { withCredentials: true });
      if (res.data.success) {
        setApplicants(prev => prev.map(app => app._id === appId ? { ...app, status } : app));
        toast.success(`Application ${status}`);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.gold }} />
        </div>
      </AdminLayout>
    );
  }

  if (!job) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4" style={{ color: C.white }}>Job Not Found</h2>
          <button onClick={() => navigate('/admin/all-jobs')} className="px-6 py-3 rounded-xl" style={{ background: C.gold, color: C.obsidian }}>
            Back to Jobs
          </button>
        </div>
      </AdminLayout>
    );
  }

  const ApplicantDetailModal = ({ applicant, onClose }) => {
    if (!applicant) return null;
    
    const statusStyle = getStatusColor(applicant.status);
    
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
            style={{ background: C.card, borderColor: C.goldBorder }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b" style={{ background: C.card, borderColor: C.goldBorder }}>
              <h2 className="text-xl font-bold" style={{ color: C.white }}>Applicant Details</h2>
              <button onClick={onClose} className="p-2 rounded-xl transition-all hover:scale-110" style={{ background: C.surface, color: C.muted }}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-3xl" style={{ background: C.gold, color: C.obsidian }}>
                  {applicant.fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: C.white }}>{applicant.fullName || 'Not Provided'}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                      {applicant.status || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: C.surface }}>
                  <Mail size={18} style={{ color: C.gold }} />
                  <div>
                    <p className="text-xs" style={{ color: C.muted }}>Email</p>
                    <p className="font-medium" style={{ color: C.white }}>{applicant.email || 'Not Provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: C.surface }}>
                  <Phone size={18} style={{ color: C.gold }} />
                  <div>
                    <p className="text-xs" style={{ color: C.muted }}>Phone</p>
                    <p className="font-medium" style={{ color: C.white }}>{applicant.phone || 'Not Provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: C.surface }}>
                  <MapPinned size={18} style={{ color: C.gold }} />
                  <div>
                    <p className="text-xs" style={{ color: C.muted }}>Address</p>
                    <p className="font-medium" style={{ color: C.white }}>{applicant.address || 'Not Provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: C.surface }}>
                  <CalendarDays size={18} style={{ color: C.gold }} />
                  <div>
                    <p className="text-xs" style={{ color: C.muted }}>Applied On</p>
                    <p className="font-medium" style={{ color: C.white }}>
                      {applicant.createdAt ? new Date(applicant.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not Provided'}
                    </p>
                  </div>
                </div>
              </div>

              {applicant.skills && applicant.skills.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: C.gold }}>
                    <Award size={16} /> Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {applicant.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ background: C.goldDim, color: C.gold, border: `1px solid ${C.goldBorder}` }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {applicant.experience && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: C.gold }}>
                    <Briefcase size={16} /> Experience
                  </h4>
                  <div className="p-4 rounded-xl" style={{ background: C.surface }}>
                    <p className="whitespace-pre-wrap" style={{ color: C.white }}>{applicant.experience}</p>
                  </div>
                </div>
              )}

              {applicant.education && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: C.gold }}>
                    <GraduationCap size={16} /> Education
                  </h4>
                  <div className="p-4 rounded-xl" style={{ background: C.surface }}>
                    <p className="whitespace-pre-wrap" style={{ color: C.white }}>{applicant.education}</p>
                  </div>
                </div>
              )}

              {applicant.coverLetter && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: C.gold }}>
                    <FileText size={16} /> Cover Letter
                  </h4>
                  <div className="p-4 rounded-xl" style={{ background: C.surface }}>
                    <p className="whitespace-pre-wrap" style={{ color: C.white }}>{applicant.coverLetter}</p>
                  </div>
                </div>
              )}

              {applicant.portfolio && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: C.gold }}>
                    <LinkIcon size={16} /> Portfolio / LinkedIn
                  </h4>
                  <a href={applicant.portfolio} target="_blank" rel="noreferrer" 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105"
                    style={{ background: C.surface, color: C.gold, border: `1px solid ${C.goldBorder}` }}>
                    <ExternalLink size={16} />
                    {applicant.portfolio}
                  </a>
                </div>
              )}

              {applicant.resume && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3" style={{ color: C.gold }}>
                    <FileText size={16} /> Resume
                  </h4>
                  <a href={applicant.resume} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105"
                    style={{ background: C.gold, color: C.obsidian }}>
                    <Eye size={16} />
                    View Resume
                  </a>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: C.goldBorder }}>
                <span className="text-sm" style={{ color: C.muted }}>Update Status:</span>
                {['Accepted', 'Rejected', 'Pending'].map((status) => {
                  const s = getStatusColor(status);
                  const isActive = applicant.status?.toLowerCase() === status.toLowerCase();
                  return (
                    <button
                      key={status}
                      onClick={() => {
                        handleStatusUpdate(applicant._id, status);
                        setSelectedApplicant(prev => ({ ...prev, status }));
                      }}
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                      style={{
                        background: isActive ? s.bg : C.surface,
                        color: isActive ? s.color : C.muted,
                        border: `1px solid ${isActive ? s.border : C.goldBorder}`,
                        opacity: isActive ? 1 : 0.7
                      }}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => navigate('/admin/all-jobs')} className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl transition-all" style={{ background: C.surface, color: C.muted, border: `1px solid ${C.goldBorder}` }}>
            <ArrowLeft size={16} />
            Back to Jobs
          </button>

          <div className="rounded-3xl p-6 border" style={{ background: C.card, borderColor: C.goldBorder }}>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {job.company?.logo ? (
                  <img src={job.company.logo} alt={job.company.name} className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: C.gold }}>
                    <Building2 size={24} className="text-white" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: C.white }}>{job.title}</h1>
                  <p className="text-sm" style={{ color: C.muted }}>{job.company?.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: C.muted }}>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign size={12} /> {job.salary}</span>
                    <span className="flex items-center gap-1"><Briefcase size={12} /> {job.jobType}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {job.positionsOpen} positions</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: job.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: job.status === 'active' ? C.green : C.red }}>
                  {job.status?.toUpperCase()}
                </span>
                <p className="text-xs mt-2" style={{ color: C.muted }}>{applicants.length} applicants</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Applicants List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: C.white }}>Applicants ({applicants.length})</h2>

          {applicants.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border" style={{ background: C.card, borderColor: C.goldBorder }}>
              <Users size={48} className="mx-auto mb-4" style={{ color: C.muted }} />
              <p style={{ color: C.muted }}>No applicants yet for this job</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applicants.map((app, index) => {
                const statusStyle = getStatusColor(app.status);
                return (
                  <motion.div key={app._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                    className="rounded-2xl p-5 border" style={{ background: C.card, borderColor: C.goldBorder }}>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg" style={{ background: C.gold, color: C.obsidian }}>
                          {app.fullName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <h3 className="font-bold" style={{ color: C.white }}>{app.fullName || 'Unknown'}</h3>
                          <p className="text-sm" style={{ color: C.muted }}>{app.email}</p>
                          <p className="text-xs" style={{ color: C.muted }}>{app.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                          {app.status || 'Pending'}
                        </span>
                        <button onClick={() => setSelectedApplicant(app)} className="p-2 rounded-lg transition-all hover:scale-110" style={{ background: C.goldDim, color: C.gold, border: `1px solid ${C.goldBorder}` }} title="View Details">
                          <Eye size={16} />
                        </button>
                        {app.status?.toLowerCase() === 'pending' && (
                          <>
                            <button onClick={() => handleStatusUpdate(app._id, 'Accepted')} className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105" style={{ background: C.green, color: 'white' }}>
                              <CheckCircle size={14} className="inline mr-1" />Accept
                            </button>
                            <button onClick={() => handleStatusUpdate(app._id, 'Rejected')} className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105" style={{ background: C.red, color: 'white' }}>
                              <XCircle size={14} className="inline mr-1" />Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <ApplicantDetailModal applicant={selectedApplicant} onClose={() => setSelectedApplicant(null)} />
    </AdminLayout>
  );
};

export default Applicants;
