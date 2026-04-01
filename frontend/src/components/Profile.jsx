import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, FileText, FileCheck, Award, Pen, Briefcase,
  User, Calendar, CheckCircle, ExternalLink, Sparkles,
  Shield, TrendingUp, Save, Camera, Crown, Upload,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { API } from '@/config/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const AC = {
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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
});

const roleMeta = {
  student:   { bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500' },
  recruiter: { bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-500'  },
};

export default function Profile({ editMode: initialEditMode = false }) {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(initialEditMode);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    bio: '',
    skills: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const fileRef = useRef(null);
  const resumeRef = useRef(null);
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.profile?.bio || '',
        skills: user.profile?.skills?.join(', ') || '',
      });
      setPhotoPreview(user.profile?.profilePhoto || null);
      setResumePreview(user.profile?.resume || null);
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
    setResumePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!formData.fullname.trim() || !formData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      data.append('fullname', formData.fullname);
      data.append('email', formData.email);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('bio', formData.bio);
      data.append('skills', formData.skills);
      if (photoFile) data.append('file', photoFile);
      if (resumeFile) data.append('resume', resumeFile);

      const res = await axios.post(`${API.user}/profile/update`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        setPhotoFile(null);
        toast.success('Profile updated!');
        navigate('/user/profile');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // USER MODEL FIELDS:
  // fullname (required), email (required, unique), phoneNumber (optional, Number)
  // password (optional, null for Google), role (student | recruiter | admin)
  // profile: { bio, skills[], resume, resumeOriginalName, company, profilePhoto }
  // isActive, isEmailVerified, emailVerificationToken, emailVerificationExpiry
  // googleId, authProvider (local | google)
  // resetOtp, resetOtpExpires, resetOtpVerified, timestamps
  // ═══════════════════════════════════════════════════════════════════════════

  const T = {
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
  accentGlow: "rgba(212,168,83,0.12)",
  white: "#FAFAF8",
  gradient1: "#667eea",
  gradient2: "#764ba2",
};

  if (editMode) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: AC.bgDark }}>
        <div className="max-w-5xl mx-auto px-4 py-10">
          
          {/* Page Title */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(to bottom right, #D4A853, #C8884A)' }}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black" style={{ color: AC.white }}>Edit Profile</h1>
                <p className="text-sm" style={{ color: AC.muted }}>Update your personal information</p>
              </div>
            </div>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* LEFT — Avatar Card */}
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }} className="lg:col-span-2">
              <div className="rounded-3xl shadow-xl overflow-hidden h-full" style={{ backgroundColor: AC.card, border: `1px solid ${AC.goldBorder}` }}>

                {/* Gradient top strip */}
                <div className="h-28 relative" style={{ background: 'linear-gradient(to right, #C8884A, #D4A853, #E8C17A)' }}>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent)]" />
                  <div className="absolute top-2 right-4 w-16 h-16 rounded-full bg-white/10" />
                  <div className="absolute bottom-0 left-6 w-10 h-10 rounded-full bg-white/10" />
                </div>

                {/* Avatar — overlapping */}
                <div className="flex flex-col items-center -mt-14 px-6 pb-8">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 rounded-full blur-md opacity-40 scale-110" style={{ background: 'linear-gradient(to bottom right, #D4A853, #E8C17A)' }} />
                    <div className="relative w-28 h-28 rounded-full shadow-2xl overflow-hidden" style={{ backgroundColor: AC.dim }}>
                      {photoPreview ? (
                        <img src={photoPreview} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl font-black" style={{ color: AC.primary }}>
                            {formData.fullname?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                      onClick={() => fileRef.current?.click()}
                      className="absolute bottom-1 right-1 w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2" style={{ background: 'linear-gradient(to bottom right, #D4A853, #C8884A)', borderColor: AC.card }}>
                      <Camera size={14} className="text-white" />
                    </motion.button>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </div>

                  <h2 className="text-xl font-black text-center flex items-center gap-1.5" style={{ color: AC.white }}>
                    {formData.fullname || 'Your Name'}
                    <Crown size={14} style={{ color: AC.primary }} />
                  </h2>
                  <p className="text-sm mt-0.5 text-center truncate max-w-full" style={{ color: AC.muted }}>{formData.email || '—'}</p>

                  <div className="flex flex-wrap gap-2 justify-center mt-3">
                    <span className="text-xs px-3 py-1 rounded-full font-bold capitalize" style={{ backgroundColor: AC.goldDim, color: AC.primary }}>
                      {user?.role || 'student'}
                    </span>
                  </div>

                  <div className="w-full my-5" style={{ borderColor: AC.goldBorder }} />

                  <label className="w-full flex flex-col items-center gap-2 p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all group" style={{ borderColor: AC.goldBorder, backgroundColor: AC.dim }}>
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: AC.goldDim }}>
                      <Upload size={16} style={{ color: AC.primary }} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold transition-colors" style={{ color: AC.white }}>
                        {photoFile ? photoFile.name : 'Upload new photo'}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: AC.muted }}>PNG · JPG · WEBP · max 5MB</p>
                    </div>
                    {photoFile && <FileCheck size={16} className="text-emerald-500" />}
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>
              </div>
            </motion.div>

            {/* RIGHT — Form Card */}
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 }} className="lg:col-span-3">
              <div className="rounded-3xl shadow-xl p-6 sm:p-8" style={{ backgroundColor: AC.card, border: `1px solid ${AC.goldBorder}` }}>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold" style={{ color: AC.muted }}>Full Name</Label>
                      <Input 
                        value={formData.fullname}
                        onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                        className="mt-2 h-11 sm:h-12"
                        style={{ backgroundColor: AC.dim, borderColor: AC.goldBorder, color: AC.white }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold" style={{ color: AC.muted }}>Email</Label>
                      <Input 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="mt-2 h-11 sm:h-12"
                        style={{ backgroundColor: AC.dim, borderColor: AC.goldBorder, color: AC.white }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs sm:text-sm font-semibold" style={{ color: AC.muted }}>Phone Number</Label>
                    <Input 
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="mt-2 h-11 sm:h-12"
                      style={{ backgroundColor: AC.dim, borderColor: AC.goldBorder, color: AC.white }}
                    />
                  </div>

                  <div>
                    <Label className="text-xs sm:text-sm font-semibold" style={{ color: AC.muted }}>Bio</Label>
                    <textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full mt-2 p-3 sm:p-4 rounded-xl border resize-none text-sm sm:text-base"
                      rows={3}
                      style={{ backgroundColor: AC.dim, borderColor: AC.goldBorder, color: AC.white }}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <Label className="text-xs sm:text-sm font-semibold" style={{ color: AC.muted }}>Skills</Label>
                    <Input 
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                      placeholder="React, Node.js, Python, JavaScript"
                      className="mt-2 h-11 sm:h-12"
                      style={{ backgroundColor: AC.dim, borderColor: AC.goldBorder, color: AC.white }}
                    />
                    <p className="mt-1.5 text-xs" style={{ color: AC.muted }}>Separate skills with commas</p>
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <Label className="text-xs sm:text-sm font-semibold" style={{ color: AC.muted }}>Resume</Label>
                    <div 
                      onClick={() => resumeRef.current?.click()}
                      className="mt-2 p-4 sm:p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-emerald-400"
                      style={{ backgroundColor: resumePreview ? 'rgba(16,185,129,0.1)' : AC.dim, borderColor: resumePreview ? '#34d399' : AC.goldBorder }}
                    >
                      <input 
                        type="file" 
                        ref={resumeRef} 
                        onChange={handleResumeChange} 
                        accept=".pdf,.doc,.docx" 
                        className="hidden" 
                      />
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: resumePreview ? 'rgba(16,185,129,0.2)' : AC.goldDim }}>
                          {resumePreview ? (
                            <FileCheck size={24} style={{ color: '#34d399' }} />
                          ) : (
                            <FileText size={24} style={{ color: AC.primary }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: AC.white }}>
                            {resumeFile ? resumeFile.name : (user?.profile?.resumeOriginalName || 'Upload your resume')}
                          </p>
                          <p className="text-xs" style={{ color: AC.muted }}>
                            {resumeFile ? 'Click to change' : 'PDF, DOC, DOCX (max 5MB)'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
                  <Button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold"
                    style={{ background: 'linear-gradient(to bottom right, #D4A853, #C8884A)', color: AC.bgDark }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save size={16} /> Save Changes
                      </span>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/user/profile')}
                    className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold"
                    style={{ borderColor: AC.goldBorder, color: AC.white }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const joinDate = user?.createdAt

  const checks = [
    { label: 'Full Name',     done: !!user?.fullname },
    { label: 'Email',         done: !!user?.email },
    { label: 'Phone',         done: !!user?.phoneNumber },
    { label: 'Bio',           done: !!user?.profile?.bio },
    { label: 'Skills',        done: user?.profile?.skills?.length > 0 },
    { label: 'Resume',        done: !!user?.profile?.resume },
    { label: 'Profile Photo', done: !!user?.profile?.profilePhoto },
  ];
  const pct = Math.round((checks.filter(c => c.done).length / checks.length) * 100);
  const rm  = roleMeta[user?.role] || roleMeta.student;

  const avatar = user?.profile?.profilePhoto ||
    'https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg';

  return (
    <div className="min-h-screen bg-[#f4f6fb] pb-8 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* ══════════════════════════════════════════════════════════════
            HERO — MOBILE  (< sm)
        ══════════════════════════════════════════════════════════════ */}
        <motion.div {...fadeUp(0)} className="sm:hidden bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100">

          {/* Banner */}
          <div className="h-24 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#5b21b6 0%,#1d4ed8 60%,#0891b2 100%)' }}>
            <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10" />
          </div>

          {/* Avatar — pulled up over banner */}
          <div className="flex flex-col items-center -mt-10 pb-5 px-4">
            <div className="relative">
              <img src={avatar} alt="avatar"
                className="w-20 h-20 rounded-2xl ring-4 ring-white shadow-xl object-cover bg-gray-100" />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400
                               rounded-full ring-2 ring-white shadow-sm" />
            </div>

            {/* Name — always visible, centered on mobile */}
            <h1 className="mt-3 text-xl font-black text-gray-900 text-center leading-tight">
              {user?.fullname || 'Your Name'}
            </h1>

            <div className="flex flex-wrap justify-center items-center gap-2 mt-1.5">
              {user?.isEmailVerified && (
                <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50
                                 px-2 py-0.5 rounded-full font-semibold border border-blue-100">
                  <Shield size={10} className="fill-blue-100" /> Verified
                </span>
              )}
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold
                               px-2.5 py-1 rounded-full ${rm.bg} ${rm.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${rm.dot}`} />
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student'}
              </span>
              {joinDate && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar size={10} /> {joinDate}
                </span>
              )}
            </div>

            {/* Bio */}
            {user?.profile?.bio && (
              <p className="mt-3 text-xs text-gray-500 text-center leading-relaxed
                            bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 max-w-xs">
                {user.profile.bio}
              </p>
            )}

            {/* Chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {user?.profile?.skills?.length > 0 && (
                <span className="text-xs bg-violet-50 text-violet-700 font-semibold
                                 px-2.5 py-1 rounded-full border border-violet-100">
                  {user.profile.skills.length} Skills
                </span>
              )}
              {user?.profile?.resume && (
                <span className="text-xs bg-green-50 text-green-700 font-semibold
                                 px-2.5 py-1 rounded-full border border-green-100">
                  ✓ Resume
                </span>
              )}
              <span className="text-xs bg-blue-50 text-blue-700 font-semibold
                               px-2.5 py-1 rounded-full border border-blue-100">
                {pct}% Done
              </span>
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            HERO — DESKTOP  (≥ sm)
        ══════════════════════════════════════════════════════════════ */}
        <motion.div {...fadeUp(0)} className="hidden sm:block bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">

          {/* Banner */}
          <div className="h-44 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#5b21b6 0%,#1d4ed8 50%,#0891b2 100%)' }}>
            <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/10" />
            <div className="absolute top-10 -left-10 w-36 h-36 rounded-full bg-white/5" />
          </div>

          <div className="px-8 pb-8 pt-0">
            {/* Avatar row — avatar floats up, name sits below */}
            <div className="flex items-start justify-between -mt-14">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img src={avatar} alt="avatar"
                  className="w-28 h-28 rounded-2xl ring-4 ring-white shadow-xl object-cover bg-gray-100" />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400
                                 rounded-full ring-2 ring-white shadow-sm" />
              </div>
            </div>

            {/* Name + role — always visible below avatar */}
            <div className="mt-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                  {user?.fullname || 'Your Name'}
                </h1>
                {user?.isEmailVerified && (
                  <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50
                                   px-2 py-0.5 rounded-full font-semibold border border-blue-100">
                    <Shield size={10} className="fill-blue-100" /> Verified
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold
                                 px-2.5 py-1 rounded-full ${rm.bg} ${rm.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${rm.dot}`} />
                  {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student'}
                </span>
                {joinDate && (
                  <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                    <Calendar size={11} /> Joined {joinDate}
                  </span>
                )}
              </div>
            </div>

            {/* Bio */}
            {user?.profile?.bio && (
              <p className="mt-4 text-sm text-gray-600 leading-relaxed max-w-2xl
                            bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                {user.profile.bio}
              </p>
            )}

            {/* Stat chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {user?.profile?.skills?.length > 0 && (
                <span className="flex items-center gap-1.5 text-xs bg-violet-50 text-violet-700
                                 font-semibold px-3 py-1.5 rounded-full border border-violet-100">
                  <Award size={11} /> {user.profile.skills.length} Skills
                </span>
              )}
              {user?.profile?.resume && (
                <span className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700
                                 font-semibold px-3 py-1.5 rounded-full border border-green-100">
                  <CheckCircle size={11} /> Resume Ready
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700
                               font-semibold px-3 py-1.5 rounded-full border border-blue-100">
                <TrendingUp size={11} /> {pct}% Complete
              </span>
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            CONTENT GRID (shared mobile + desktop)
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left column ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Contact Info */}
            <motion.div {...fadeUp(0.1)}>
              <Card title="Contact Information" icon={User}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoRow icon={Mail}      label="Email"  value={user?.email}       grad="from-blue-500 to-cyan-500"     bg="bg-blue-50"   tc="text-blue-700" />
                  <InfoRow icon={Phone}     label="Phone"  value={user?.phoneNumber} grad="from-violet-500 to-purple-500" bg="bg-violet-50" tc="text-violet-700" />
                  <InfoRow icon={User}      label="Name"   value={user?.fullname}    grad="from-indigo-500 to-blue-500"   bg="bg-indigo-50" tc="text-indigo-700" />
                  <InfoRow icon={Briefcase} label="Role"   value={user?.role}        grad="from-orange-500 to-amber-500"  bg="bg-orange-50" tc="text-orange-700" />
                </div>
              </Card>
            </motion.div>

            {/* Skills */}
            <motion.div {...fadeUp(0.18)}>
              <Card title="Skills" icon={Sparkles}>
                {user?.profile?.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.profile.skills.map((skill, i) => (
                      <motion.span key={i}
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.04 * i }}
                        className="px-3 py-1.5 text-sm font-semibold rounded-xl cursor-default
                                   bg-gradient-to-r from-violet-50 to-blue-50 text-violet-700
                                   border border-violet-100 hover:border-violet-300 transition-colors">
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                ) : (
                  <Empty icon={Award} text="No skills added yet" />
                )}
              </Card>
            </motion.div>
          </div>

          {/* ── Right column ────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Resume */}
            <motion.div {...fadeUp(0.22)}>
              <Card title="Resume" icon={FileText}>
                {user?.profile?.resume ? (
                  <a href={user.profile.resume} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-4 rounded-2xl
                               bg-gradient-to-r from-green-50 to-emerald-50
                               border border-green-200 hover:border-green-400 transition-all">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                                    bg-gradient-to-br from-green-500 to-emerald-500 shadow-md">
                      <FileText size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Resume</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.profile.resumeOriginalName || 'View Resume'}
                      </p>
                    </div>
                    <ExternalLink size={15} className="text-green-400 group-hover:text-green-600 transition-colors shrink-0" />
                  </a>
                ) : (
                  <Empty icon={FileText} text="No resume uploaded" />
                )}
              </Card>
            </motion.div>

            {/* Profile Completion */}
            <motion.div {...fadeUp(0.28)}>
              <Card title="Profile Completion" icon={TrendingUp}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Progress</span>
                  <span className={`text-sm font-black ${pct === 100 ? 'text-green-600' : 'text-violet-600'}`}>{pct}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-5">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full ${pct === 100
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                      : 'bg-gradient-to-r from-violet-500 to-blue-500'}`} />
                </div>
                <div className="space-y-2.5">
                  {checks.map((c, i) => (
                    <motion.div key={c.label}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.05 }}
                      className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0
                                      ${c.done ? 'bg-green-500' : 'bg-gray-200'}`}>
                        {c.done
                          ? <CheckCircle size={11} className="text-white" />
                          : <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />}
                      </div>
                      <span className={`text-xs font-medium flex-1 ${c.done ? 'text-gray-700' : 'text-gray-400'}`}>
                        {c.label}
                      </span>
                      {!c.done && (
            <button onClick={() => setEditMode(true)}
                          className="text-xs text-violet-500 hover:text-violet-700 font-bold transition-colors">
                          Add →
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Card({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600
                        flex items-center justify-center shadow-sm shrink-0">
          <Icon size={14} className="text-white" />
        </div>
        <h3 className="font-black text-gray-800 text-sm sm:text-base">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, grad, bg, tc }) {
  return (
    <div className={`flex items-center gap-3 p-3.5 rounded-2xl border ${bg}/60 border-gray-100
                     hover:border-gray-200 transition-colors`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                       bg-gradient-to-br ${grad}`}>
        <Icon size={16} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-bold uppercase tracking-wider ${tc}`}>{label}</p>
        <p className="text-sm font-semibold text-gray-800 truncate">
          {value || <span className="text-gray-400 font-normal italic text-xs">Not provided</span>}
        </p>
      </div>
    </div>
  );
}

function Empty({ icon: Icon, text, onAdd, label = '+ Add' }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-3
                      border-2 border-dashed border-gray-200">
        <Icon size={22} className="text-gray-300" />
      </div>
      <p className="text-gray-400 text-sm mb-2">{text}</p>
      <button onClick={onAdd}
        className="text-violet-600 hover:text-violet-800 text-xs font-bold
                   bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors">
        {label}
      </button>
    </div>
  );
}