import React, { useState, useRef } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Building2, Sparkles, Loader2, Upload, X, Image, Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import AdminLayout from './AdminLayout';
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
};

const CompanyCreate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    logo: ''
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadLogo(file);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await uploadLogo(file);
    }
  };

  const uploadLogo = async (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setLogoPreview(reader.result);
    };

    reader.onerror = () => {
      toast.error('Failed to read file');
      setUploading(false);
      return;
    };

    try {
      handleChange('logo', reader.result);
      toast.success('Logo added successfully');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to add logo');
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    handleChange('logo', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const registerNewCompany = async () => {
    if (!formData.companyName.trim()) {
      return toast.error('Please enter a company name');
    }

    try {
      setLoading(true);
      const payload = {
        companyName: formData.companyName.trim(),
        logo: formData.logo || undefined
      };

      const res = await axios.post(`${API.company}/register`, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (res?.data?.success) {
        toast.success(res.data.message);
        navigate('/admin/jobs/create');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        {/* Hero Banner */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, border: `1px solid ${C.goldBorder}` }}>
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(30%,-30%)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-2xl opacity-10"
              style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(-30%,30%)' }} />
            <div className="relative flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
                style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">New Company</span>
                </div>
                <h1 className="text-4xl font-black text-white mb-1">Create Company</h1>
                <p className="text-white/80 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Add your company to start posting jobs
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-3xl shadow-2xl border overflow-hidden" style={{ background: C.charcoal, borderColor: C.goldBorder }}>

          {/* Logo Upload Section */}
          <div className="p-8 border-b" style={{ borderColor: C.goldBorder }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})` }}>
                <Image className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg" style={{ color: C.ivory }}>Company Logo</p>
                <p className="text-sm" style={{ color: C.muted }}>Upload your company logo (optional)</p>
              </div>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`relative rounded-3xl border-2 border-dashed transition-all ${
                dragging ? 'scale-[1.02]' : ''
              }`}
              style={{
                borderColor: dragging ? C.gold : C.goldBorder,
                background: dragging ? `${C.gold}08` : 'transparent'
              }}
            >
              {logoPreview ? (
                <div className="relative p-8 flex flex-col items-center">
                  <div className="relative group">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-32 h-32 rounded-2xl object-cover shadow-2xl border-4"
                      style={{ borderColor: C.gold }}
                    />
                    <button
                      onClick={removeLogo}
                      className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    {uploading && (
                      <div className="absolute inset-0 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
                        <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.gold }} />
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-sm" style={{ color: C.muted }}>Click or drag to change</p>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-12 flex flex-col items-center cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${C.gold}15` }}>
                    {uploading ? (
                      <Loader2 className="w-10 h-10 animate-spin" style={{ color: C.gold }} />
                    ) : (
                      <Upload className="w-10 h-10" style={{ color: C.gold }} />
                    )}
                  </div>
                  <p className="font-bold text-lg mb-1" style={{ color: C.ivory }}>
                    {uploading ? 'Uploading...' : 'Drop your logo here'}
                  </p>
                  <p className="text-sm mb-4" style={{ color: C.muted }}>
                    or click to browse (max 5MB)
                  </p>
                  <div className="flex items-center gap-2 text-xs px-4 py-2 rounded-full" style={{ background: C.surface }}>
                    <Image className="w-4 h-4" style={{ color: C.muted }} />
                    <span style={{ color: C.muted }}>PNG, JPG, WEBP supported</span>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-8 space-y-6">
            {/* Company Name */}
            <div>
              <Label className="font-bold text-sm flex items-center gap-2 mb-3" style={{ color: C.ivory }}>
                <Building2 className="w-5 h-5" style={{ color: C.gold }} />
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="e.g. Microsoft, Google, Amazon"
                className="h-14 px-5 rounded-2xl border-2 text-base font-semibold"
                style={{ borderColor: C.goldBorder, background: C.obsidian, color: C.ivory }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 py-6 border-t flex items-center gap-4" style={{ background: C.obsidian, borderColor: C.goldBorder }}>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/companies')}
              className="flex-1 h-14 rounded-2xl border-2 font-bold"
              style={{ borderColor: C.goldBorder, color: C.muted }}
            >
              Cancel
            </Button>
            <Button
              onClick={registerNewCompany}
              disabled={loading || !formData.companyName.trim()}
              className="flex-1 h-14 rounded-2xl font-bold shadow-lg transition-all"
              style={{
                background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`,
                color: C.obsidian,
                opacity: loading || !formData.companyName.trim() ? 0.5 : 1
              }}
            >
              {loading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Creating...</>
              ) : (
                <><Check className="mr-2 h-5 w-5" />Create Company</>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default CompanyCreate;
