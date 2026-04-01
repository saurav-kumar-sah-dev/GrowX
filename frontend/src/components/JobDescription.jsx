import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { 
  Bookmark, MapPin, Briefcase, Clock, Users, DollarSign, Calendar, Building2, 
  ArrowLeft, Globe, Award, Star, CheckCircle, Target, Zap, FileText, TrendingUp,
  Share2, ExternalLink, Upload, FileCheck, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { API } from '@/config/api';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
  surface: "#1A1A24",
  surfaceLight: "#252532",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  accent: "#C8884A",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
  ivory: "#F5F0E6",
  muted: "#A8A099",
  success: "#10b981",
  danger: "#ef4444",
};

const InfoCard = ({ icon: Icon, title, value, color = C.gold }) => (
  <div 
    className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02]"
    style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
  >
    <div 
      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: `${color}15` }}
    >
      <Icon className="w-6 h-6" style={{ color }} />
    </div>
    <div>
      <p className="text-xs" style={{ color: C.muted }}>{title}</p>
      <p className="font-bold" style={{ color: C.ivory }}>{value || 'N/A'}</p>
    </div>
  </div>
);

const Section = ({ icon: Icon, title, children, color = C.gold }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-3xl overflow-hidden"
    style={{ background: C.charcoal, border: `1px solid ${C.goldBorder}` }}
  >
    <div 
      className="px-6 py-4 flex items-center gap-3"
      style={{ background: C.surface, borderBottom: `1px solid ${C.goldBorder}` }}
    >
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}20` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <h2 className="text-lg font-bold" style={{ color: C.ivory }}>{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </motion.div>
);

const JobDescription = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const { user } = useSelector(store => store.auth);
  const params = useParams();
  const jobId = params.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API.job}/get/${jobId}`, { withCredentials: true });
        if (res.data.success) {
          setJob(res.data.job);
          const applied = res.data.job.applications?.some(app => app.applicant === user?._id);
          setIsApplied(applied);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load job');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    if (user) {
      checkIfSaved();
      checkIfHasResume();
    }
  }, [jobId, user?._id]);

  const checkIfHasResume = async () => {
    try {
      const res = await axios.get(`${API.resume}/my`, { withCredentials: true });
      const resumeList = res.data?.data || res.data?.resumes || [];
      setResumes(resumeList);
      if (resumeList.length > 0) {
        setSelectedResume(resumeList[0]);
      }
    } catch (error) {
      console.log('No resume found');
    }
  };

  const checkIfSaved = async () => {
    try {
      const res = await axios.get(`${API.savedJob}/user`, { withCredentials: true });
      const saved = res.data?.savedJobs?.some(item => item.job?._id === jobId);
      setIsSaved(saved);
    } catch (error) {
      console.error('Failed to check saved status');
    }
  };

  const handleUploadResume = async (file) => {
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload PDF or Word document');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

      const res = await axios.post(`${API.resume}/upload`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        toast.success('Resume uploaded successfully');
        await checkIfHasResume();
        setShowUploadModal(false);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error?.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const applyJobHandler = async () => {
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }
    if (resumes.length === 0) {
      setShowUploadModal(true);
      return;
    }
    try {
      const res = await axios.get(`${API.application}/apply/${jobId}`, { withCredentials: true });
      if (res.data.success) {
        setIsApplied(true);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const saveJobHandler = async () => {
    if (!user) {
      toast.error('Please login to save job');
      navigate('/login');
      return;
    }
    try {
      if (isSaved) {
        await axios.delete(`${API.savedJob}/unsave/${jobId}`, { withCredentials: true });
        setIsSaved(false);
        toast.success('Job removed from saved');
      } else {
        await axios.post(`${API.savedJob}/save`, { jobId }, { withCredentials: true });
        setIsSaved(true);
        toast.success('Job saved successfully');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.obsidian }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent mx-auto mb-4" style={{ borderBottomColor: C.gold }} />
          <p style={{ color: C.muted }}>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.obsidian }}>
        <div className="text-center">
          <div className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center" style={{ background: `${C.gold}15` }}>
            <Briefcase className="w-12 h-12" style={{ color: C.gold }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: C.ivory }}>Job Not Found</h2>
          <p style={{ color: C.muted }}>This job may have been removed or doesn't exist</p>
          <button
            onClick={() => navigate('/jobs')}
            className="mt-6 px-6 py-3 rounded-xl font-bold"
            style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: C.obsidian }}
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  const companyName = job.company?.name || 'Company';

  return (
    <div className="min-h-screen" style={{ background: C.obsidian }}>
      {/* Hero Section */}
      <div 
        className="relative py-12 px-4"
        style={{ 
          background: `linear-gradient(135deg, ${C.charcoal} 0%, ${C.obsidian} 100%)`,
          borderBottom: `1px solid ${C.goldBorder}`
        }}
      >
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.3) 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/jobs')}
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105"
            style={{ background: C.surface, color: C.ivory, border: `1px solid ${C.goldBorder}` }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Jobs
          </motion.button>

          {/* Company Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-6 items-start"
          >
            <div className="shrink-0">
              {job.company?.logo ? (
                <img 
                  src={job.company.logo} 
                  alt={companyName} 
                  className="w-24 h-24 rounded-2xl object-cover shadow-xl"
                  style={{ border: `3px solid ${C.gold}` }}
                />
              ) : (
                <div 
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black shadow-xl"
                  style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: C.obsidian }}
                >
                  {companyName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-black" style={{ color: C.ivory }}>
                      {job.title}
                    </h1>
                    {(job.urgent || job.featured) && (
                      <div className="flex gap-2">
                        {job.urgent && (
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{ background: `${C.danger}20`, color: C.danger }}
                          >
                            🔥 Urgent
                          </span>
                        )}
                        {job.featured && (
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{ background: `${C.gold}20`, color: C.gold }}
                          >
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xl font-semibold" style={{ color: C.gold }}>{companyName}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={saveJobHandler}
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    style={{ 
                      background: isSaved ? `${C.gold}20` : C.surface, 
                      border: `1px solid ${isSaved ? C.gold : C.goldBorder}`
                    }}
                  >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} style={{ color: isSaved ? C.gold : C.muted }} />
                  </button>
                  <button
                    onClick={() => navigator.share?.({ title: job.title, text: `Check out this job: ${job.title} at ${companyName}` })}
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                  >
                    <Share2 className="w-5 h-5" style={{ color: C.muted }} />
                  </button>
                </div>
              </div>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: C.surface }}>
                  <MapPin className="w-4 h-4" style={{ color: C.gold }} />
                  <span className="text-sm font-medium" style={{ color: C.ivory }}>{job.location || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: C.surface }}>
                  <Clock className="w-4 h-4" style={{ color: C.gold }} />
                  <span className="text-sm font-medium" style={{ color: C.ivory }}>{job.jobType || 'Full-time'}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: C.surface }}>
                  <Globe className="w-4 h-4" style={{ color: C.gold }} />
                  <span className="text-sm font-medium" style={{ color: C.ivory }}>{job.workMode || 'On-site'}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: C.surface }}>
                  <DollarSign className="w-4 h-4" style={{ color: C.success }} />
                  <span className="text-sm font-bold" style={{ color: C.success }}>{job.salary || 'Not Disclosed'}</span>
                </div>
              </div>

              {/* Apply Button */}
              {isApplied ? (
                <div 
                  className="w-full py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 cursor-not-allowed select-none"
                  style={{ 
                    background: `linear-gradient(135deg, #374151, #1f2937)`,
                    color: '#9ca3af',
                    cursor: 'not-allowed',
                    border: '2px solid #4b5563',
                    opacity: 0.8
                  }}
                >
                  <CheckCircle className="w-6 h-6" />
                  <span>You have already applied for this job</span>
                </div>
              ) : (
                <button
                  onClick={applyJobHandler}
                  className="w-full py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                  style={{ 
                    background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`,
                    color: C.obsidian,
                    cursor: 'pointer',
                    border: 'none'
                  }}
                >
                  <span>Apply Now</span>
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 p-1 rounded-2xl" style={{ background: C.surface }}>
              {['about', 'skills', 'benefits', 'responsibilities'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm capitalize transition-all"
                  style={{
                    background: activeTab === tab ? `linear-gradient(135deg, ${C.gold}, ${C.accent})` : 'transparent',
                    color: activeTab === tab ? C.obsidian : C.muted
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* About */}
            {activeTab === 'about' && (
              <Section icon={FileText} title="About This Role">
                <div className="prose max-w-none">
                  <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: C.ivory }}>
                    {job.description || 'No description provided.'}
                  </p>
                </div>
                
                {job.requirements && job.requirements.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: C.ivory }}>
                      <Target className="w-5 h-5" style={{ color: C.gold }} />
                      Requirements
                    </h3>
                    <div className="space-y-3">
                      {job.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${C.gold}20` }}>
                            <CheckCircle className="w-4 h-4" style={{ color: C.gold }} />
                          </div>
                          <span className="text-sm" style={{ color: C.ivory }}>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {job.qualifications && job.qualifications.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: C.ivory }}>
                      <Award className="w-5 h-5" style={{ color: C.gold }} />
                      Qualifications
                    </h3>
                    <div className="space-y-3">
                      {job.qualifications.map((qual, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${C.accent}20` }}>
                            <Star className="w-4 h-4" style={{ color: C.accent }} />
                          </div>
                          <span className="text-sm" style={{ color: C.ivory }}>{qual}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* Skills */}
            {activeTab === 'skills' && (
              <Section icon={Zap} title="Required Skills">
                {job.skills && job.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {job.skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-4 py-2 rounded-xl font-semibold text-sm"
                        style={{ 
                          background: `${C.gold}15`, 
                          color: C.gold,
                          border: `1px solid ${C.goldBorder}`
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: C.muted }}>No skills specified</p>
                )}
              </Section>
            )}

            {/* Benefits */}
            {activeTab === 'benefits' && (
              <Section icon={Star} title="Benefits & Perks">
                {job.benefits && job.benefits.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {job.benefits.map((benefit, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-3 p-4 rounded-xl"
                        style={{ background: `${C.success}10`, border: `1px solid ${C.success}30` }}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.success}20` }}>
                          <Star className="w-5 h-5" style={{ color: C.success }} />
                        </div>
                        <span className="font-semibold" style={{ color: C.ivory }}>{benefit}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: C.muted }}>No benefits specified</p>
                )}
              </Section>
            )}

            {/* Responsibilities */}
            {activeTab === 'responsibilities' && (
              <Section icon={Target} title="Key Responsibilities">
                {job.responsibilities && job.responsibilities.length > 0 ? (
                  <div className="space-y-4">
                    {job.responsibilities.map((resp, idx) => (
                      <div 
                        key={idx}
                        className="flex items-start gap-4 p-4 rounded-xl"
                        style={{ background: C.surface }}
                      >
                        <div 
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold"
                          style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: C.obsidian }}
                        >
                          {idx + 1}
                        </div>
                        <span className="text-sm pt-1" style={{ color: C.ivory }}>{resp}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: C.muted }}>No responsibilities specified</p>
                )}
              </Section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Job Overview */}
            <div className="rounded-3xl overflow-hidden" style={{ background: C.charcoal, border: `1px solid ${C.goldBorder}` }}>
              <div 
                className="px-6 py-4"
                style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})` }}
              >
                <h2 className="text-lg font-bold" style={{ color: C.obsidian }}>Job Overview</h2>
              </div>
              <div className="p-6 space-y-4">
                <InfoCard icon={Briefcase} title="Job Type" value={job.jobType || 'Full-time'} />
                <InfoCard icon={Globe} title="Work Mode" value={job.workMode || 'On-site'} color={C.accent} />
                <InfoCard icon={Award} title="Experience" value={job.experienceLevel || 'Fresher'} color="#8b5cf6" />
                <InfoCard icon={Users} title="Positions" value={`${job.position || 1} Opening${(job.position || 1) > 1 ? 's' : ''}`} color="#10b981" />
                <InfoCard icon={DollarSign} title="Salary" value={job.salary || 'Not Disclosed'} color={C.success} />
                <InfoCard icon={Calendar} title="Posted" value={job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'} color="#ec4899" />
                {job.applicationDeadline && (
                  <InfoCard icon={Clock} title="Deadline" value={new Date(job.applicationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} color={C.danger} />
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="rounded-3xl overflow-hidden" style={{ background: C.charcoal, border: `1px solid ${C.goldBorder}` }}>
              <div 
                className="px-6 py-4"
                style={{ background: C.surface, borderBottom: `1px solid ${C.goldBorder}` }}
              >
                <h2 className="text-lg font-bold" style={{ color: C.ivory }}>About Company</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {job.company?.logo ? (
                    <img src={job.company.logo} alt={companyName} className="w-14 h-14 rounded-xl object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})` }}>
                      <span className="text-white font-black text-xl">{companyName.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-bold" style={{ color: C.ivory }}>{companyName}</p>
                    <p className="text-sm" style={{ color: C.muted }}>{job.company?.industry || 'Company'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {job.company?.website && (
                    <a 
                      href={job.company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm"
                      style={{ color: C.gold }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Website
                    </a>
                  )}
                  <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
                    <Users className="w-4 h-4" />
                    {job.company?.jobs?.length || 0} Active Jobs
                  </div>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="rounded-3xl p-6" style={{ background: C.charcoal, border: `1px solid ${C.goldBorder}` }}>
              <h3 className="font-bold mb-4" style={{ color: C.ivory }}>Share this job</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => navigator.share?.({ title: job.title, text: `Check out this job: ${job.title} at ${companyName}` })}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                  style={{ background: C.surface, color: C.ivory, border: `1px solid ${C.goldBorder}` }}
                >
                  Share
                </button>
                <button
                  onClick={() => navigate('/jobs')}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: C.obsidian }}
                >
                  More Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Selection Modal */}
      {showResumeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setShowResumeModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="rounded-3xl shadow-2xl p-6 max-w-md w-full"
            style={{ background: C.charcoal, border: `1px solid ${C.goldBorder}` }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: C.ivory }}>Select Resume</h3>
              <button
                onClick={() => setShowResumeModal(false)}
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: C.surface }}
              >
                <span style={{ color: C.muted }}>✕</span>
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {resumes.map((resume, index) => (
                <button
                  key={resume._id || index}
                  onClick={() => {
                    setSelectedResume(resume);
                    setShowResumeModal(false);
                  }}
                  className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${
                    selectedResume?._id === resume._id ? 'ring-2' : ''
                  }`}
                  style={{ 
                    background: C.surface,
                    border: `1px solid ${selectedResume?._id === resume._id ? C.gold : C.goldBorder}`,
                    ringColor: C.gold
                  }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${C.gold}20` }}>
                    <FileText className="w-6 h-6" style={{ color: C.gold }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold" style={{ color: C.ivory }}>
                      {resume.personalInfo?.fullName || `Resume ${index + 1}`}
                    </p>
                    <p className="text-xs" style={{ color: C.muted }}>
                      {resume.personalInfo?.email || 'No email'}
                    </p>
                  </div>
                  {selectedResume?._id === resume._id && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: C.gold }}>
                      <CheckCircle className="w-4 h-4" style={{ color: C.obsidian }} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => { setShowResumeModal(false); setShowUploadModal(true); }}
              className="w-full mt-4 py-3 rounded-xl font-bold transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: C.obsidian }}
            >
              Upload New Resume
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Upload Resume Modal */}
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setShowUploadModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="rounded-3xl shadow-2xl p-6 max-w-md w-full"
            style={{ background: C.charcoal, border: `1px solid ${C.goldBorder}` }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: C.ivory }}>Upload Resume</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: C.surface }}
              >
                <span style={{ color: C.muted }}>✕</span>
              </button>
            </div>

            {/* Existing Resumes */}
            {resumes.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold mb-3" style={{ color: C.muted }}>Or select existing:</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {resumes.map((resume, index) => (
                    <button
                      key={resume._id || index}
                      onClick={() => {
                        setSelectedResume(resume);
                        setShowUploadModal(false);
                      }}
                      className="w-full p-3 rounded-xl flex items-center gap-3 transition-all"
                      style={{ 
                        background: C.surface,
                        border: `1px solid ${C.goldBorder}`
                      }}
                    >
                      <FileText className="w-5 h-5" style={{ color: C.gold }} />
                      <span className="text-sm font-medium truncate" style={{ color: C.ivory }}>
                        {resume.personalInfo?.fullName || `Resume ${index + 1}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUploadResume(e.dataTransfer.files[0]); }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragOver ? 'scale-105' : ''
              }`}
              style={{ 
                borderColor: dragOver ? C.gold : C.goldBorder,
                background: dragOver ? `${C.gold}10` : 'transparent'
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleUploadResume(e.target.files[0])}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${C.gold}15` }}>
                {uploading ? (
                  <div className="w-8 h-8 border-4 border-transparent border-t-current animate-spin rounded-full" style={{ borderColor: C.gold }} />
                ) : (
                  <Upload className="w-8 h-8" style={{ color: C.gold }} />
                )}
              </div>
              <p className="font-semibold mb-1" style={{ color: C.ivory }}>
                {uploading ? 'Uploading...' : 'Drop your resume here'}
              </p>
              <p className="text-sm mb-3" style={{ color: C.muted }}>
                or click to browse
              </p>
              <p className="text-xs" style={{ color: C.muted }}>
                PDF, DOC, DOCX (max 5MB)
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default JobDescription;
