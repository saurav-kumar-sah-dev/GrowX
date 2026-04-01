import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Camera, User, Mail, Save, Loader2, Crown, CheckCircle2, Sparkles, Upload } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { API } from '@/config/api';

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

const AdminSettings = ({ editMode: initialEditMode = false }) => {
  const { user } = useSelector(store => store.auth);
  const dispatch  = useDispatch();
  const fileRef   = useRef(null);
  const [editMode, setEditMode] = useState(initialEditMode);

  const [loading,      setLoading]      = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user?.profile?.profilePhoto || null);
  const [photoFile,    setPhotoFile]    = useState(null);
  const [fullname,     setFullname]     = useState(user?.fullname || '');
  const [email,        setEmail]        = useState(user?.email    || '');

  useEffect(() => {
    setFullname(user?.fullname || '');
    setEmail(user?.email    || '');
    setPhotoPreview(user?.profile?.profilePhoto || null);
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!fullname.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullname', fullname);
      formData.append('email',    email);
      if (photoFile) formData.append('file', photoFile);

      const res = await axios.post(`${API.user}/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        setPhotoFile(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        toast.success('Profile updated!');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen" style={{ backgroundColor: C.bgDark }}>
        <div className="max-w-5xl mx-auto px-4 py-10">

          {/* ── Page Title ── */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(to bottom right, #D4A853, #C8884A)' }}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black" style={{ color: C.white }}>Profile Settings</h1>
                <p className="text-sm" style={{ color: C.muted }}>Manage your admin profile</p>
              </div>
            </div>
          </motion.div>

          {/* ── Main Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* ── LEFT — Avatar Card ── */}
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }} className="lg:col-span-2">
              <div className="rounded-3xl shadow-xl overflow-hidden h-full" style={{ backgroundColor: C.card, border: `1px solid ${C.goldBorder}` }}>

                {/* Gradient top strip */}
                <div className="h-28 relative" style={{ background: 'linear-gradient(to right, #C8884A, #D4A853, #E8C17A)' }}>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent)]" />
                  <div className="absolute top-2 right-4 w-16 h-16 rounded-full bg-white/10" />
                  <div className="absolute bottom-0 left-6 w-10 h-10 rounded-full bg-white/10" />
                </div>

                {/* Avatar — overlapping the strip */}
                <div className="flex flex-col items-center -mt-14 px-6 pb-8">
                  <div className="relative mb-4">
                    {/* Glow ring */}
                    <div className="absolute inset-0 rounded-full blur-md opacity-40 scale-110" style={{ background: 'linear-gradient(to bottom right, #D4A853, #E8C17A)' }} />
                    <div className="relative w-28 h-28 rounded-full shadow-2xl overflow-hidden" style={{ ringColor: C.goldBorder, backgroundColor: C.dim }}>
                      {photoPreview ? (
                        <img src={photoPreview} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl font-black" style={{ color: C.primary }}>
                            {fullname?.charAt(0)?.toUpperCase() || 'A'}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Camera FAB */}
                    <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                      onClick={() => fileRef.current?.click()}
                      className="absolute bottom-1 right-1 w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2" style={{ background: 'linear-gradient(to bottom right, #D4A853, #C8884A)', borderColor: C.card }}>
                      <Camera size={14} className="text-white" />
                    </motion.button>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </div>

                  {/* Name & email live preview */}
                  <h2 className="text-xl font-black text-center flex items-center gap-1.5" style={{ color: C.white }}>
                    {fullname || 'Admin User'}
                    <Crown size={14} style={{ color: C.gold }} />
                  </h2>
                  <p className="text-sm mt-0.5 text-center truncate max-w-full" style={{ color: C.muted }}>{email || '—'}</p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 justify-center mt-3">
                    <span className="text-xs px-3 py-1 rounded-full font-bold capitalize" style={{ backgroundColor: C.goldDim, color: C.primary }}>
                      {user?.role || 'admin'}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                      ● Online
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="w-full my-5" style={{ borderColor: C.goldBorder }} />

                  {/* Upload area */}
                  <label className="w-full flex flex-col items-center gap-2 p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all group" style={{ borderColor: C.goldBorder, backgroundColor: C.dim }}>
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: C.goldDim }}>
                      <Upload size={16} style={{ color: C.primary }} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold transition-colors" style={{ color: C.white }}>
                        {photoFile ? photoFile.name : 'Upload new photo'}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: C.muted }}>PNG · JPG · WEBP · max 5MB</p>
                    </div>
                    {photoFile && <CheckCircle2 size={16} className="text-emerald-500" />}
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>

                  {/* Joined info */}
                  {user?.createdAt && (
                    <p className="text-[11px] mt-4 font-medium" style={{ color: C.muted }}>
                      Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ── RIGHT — Edit Form ── */}
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }} className="lg:col-span-3">
              <div className="rounded-3xl shadow-xl overflow-hidden" style={{ backgroundColor: C.card, border: `1px solid ${C.goldBorder}` }}>

                {/* Card header */}
                <div className="px-8 py-5 flex items-center justify-between" style={{ borderColor: C.goldBorder, background: 'linear-gradient(to right, #1A1D26, #252532)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(to bottom right, #D4A853, #C8884A)' }}>
                      <User size={15} className="text-white" />
                    </div>
                    <div>
                      <p className="font-black text-sm" style={{ color: C.white }}>Edit Profile</p>
                      <p className="text-xs" style={{ color: C.muted }}>Name · Email · Photo</p>
                    </div>
                  </div>
                  <AnimatePresence>
                    {saved && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                        <CheckCircle2 size={13} />
                        Saved!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-8 space-y-6">

                  {/* Full Name */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <Label className="font-bold text-xs flex items-center gap-2 mb-2" style={{ color: C.white }}>
                      <span className="w-6 h-6 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.goldDim }}>
                        <User size={12} style={{ color: C.primary }} />
                      </span>
                      Full Name
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={fullname}
                        onChange={e => setFullname(e.target.value)}
                        placeholder="Enter your full name"
                        className="h-13 pl-4 pr-4 border-2 rounded-2xl transition-all text-sm font-semibold shadow-sm"
                        style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white, placeholder: { color: C.muted } }}
                      />
                      {fullname && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <CheckCircle2 size={16} style={{ color: C.primary }} />
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Label className="font-bold text-xs flex items-center gap-2 mb-2" style={{ color: C.white }}>
                      <span className="w-6 h-6 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.goldDim }}>
                        <Mail size={12} style={{ color: C.primary }} />
                      </span>
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="h-13 pl-4 pr-4 border-2 rounded-2xl transition-all text-sm font-semibold shadow-sm"
                        style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white, placeholder: { color: C.muted } }}
                      />
                      {email && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <CheckCircle2 size={16} style={{ color: C.primary }} />
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Info box */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                    className="flex items-start gap-3 p-4 rounded-2xl border" style={{ backgroundColor: C.dim, borderColor: C.goldBorder }}>
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: C.goldDim }}>
                      <Sparkles size={13} style={{ color: C.primary }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-0.5" style={{ color: C.primary }}>Profile Tip</p>
                      <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
                        Your name and photo appear in the sidebar and across the admin panel. Use a clear photo for best results.
                      </p>
                    </div>
                  </motion.div>

                  {/* Progress indicator */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold" style={{ color: C.muted }}>Profile Completion</p>
                      <p className="text-xs font-black" style={{ color: C.primary }}>
                        {[fullname, email, photoPreview].filter(Boolean).length * 33}%
                      </p>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: C.dim }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${[fullname, email, photoPreview].filter(Boolean).length * 33}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(to right, #C8884A, #D4A853)' }}
                      />
                    </div>
                    <div className="flex gap-3">
                      {[
                        { label: 'Name',  done: !!fullname },
                        { label: 'Email', done: !!email },
                        { label: 'Photo', done: !!photoPreview },
                      ].map(({ label, done }) => (
                        <span key={label} className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition-all`} style={done ? { backgroundColor: C.goldDim, color: C.primary } : { backgroundColor: C.dim, color: C.muted }}>
                          <CheckCircle2 size={9} className={done ? '' : 'opacity-30'} />
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Save Button */}
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Button onClick={handleSave} disabled={loading}
                      className="w-full h-13 rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl transition-all text-white" style={{ background: 'linear-gradient(to right, #C8884A, #D4A853)' }}>
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Saving changes...
                        </span>
                      ) : saved ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Saved Successfully!
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Save className="w-4 h-4" /> Save Changes
                        </span>
                      )}
                    </Button>
                  </motion.div>

                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
