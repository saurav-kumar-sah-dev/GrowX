import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2, Building2, Globe, MapPin, Image, CheckCircle2, Sparkles, Upload } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import AdminLayout from './AdminLayout';

const COMPANY_API = import.meta.env.VITE_COMPANY_API;

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

const CompanySetup = () => {
  const params = useParams();
  const [input, setInput] = useState({ name: '', description: '', website: '', location: '', file: null });
  const [preview, setPreview] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (params.id) {
      const fetchCompany = async () => {
        try {
          const res = await axios.get(`${COMPANY_API}/${params.id}`, { withCredentials: true });
          const data = res.data?.company;
          if (data) {
            setCompany(data);
            setInput({ name: data.name || '', description: data.description || '', website: data.website || '', location: data.location || '', file: null });
            if (data.logo) setPreview(data.logo);
          }
        } catch (err) {
          console.error('Failed to fetch company:', err);
        }
      };
      fetchCompany();
    }
  }, [params.id]);

  const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value });

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', input.name);
    formData.append('description', input.description);
    formData.append('website', input.website);
    formData.append('location', input.location);
    if (input.file) formData.append('file', input.file);
    try {
      setLoading(true);
      const res = await axios.put(`${COMPANY_API}/update/${params.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/admin/companies');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error updating company');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany?.name || '',
        description: singleCompany?.description || '',
        website: singleCompany?.website || '',
        location: singleCompany?.location || '',
        file: null,
      });
      if (singleCompany?.logo) setPreview(singleCompany.logo);
    }
  }, [singleCompany]);

  const fields = [
    { label: 'Company Name', name: 'name', icon: Building2, color: '#3b82f6', placeholder: 'e.g. Google Inc.', type: 'text' },
    { label: 'Location', name: 'location', icon: MapPin, color: '#10b981', placeholder: 'e.g. San Francisco, CA', type: 'text' },
    { label: 'Website', name: 'website', icon: Globe, color: '#8b5cf6', placeholder: 'https://example.com', type: 'text' },
    { label: 'Description', name: 'description', icon: Sparkles, color: '#ec4899', placeholder: 'Brief company description', type: 'text' },
  ];

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="relative overflow-hidden rounded-3xl p-8 mb-8 shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${C.gold}, #C8884A)`, border: `1px solid ${C.goldBorder}` }}>
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20"
            style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(30%,-30%)' }} />
          <div className="relative flex items-center gap-5">
            <div className="flex-shrink-0">
              {preview ? (
                <img src={preview} alt="logo"
                  className="w-20 h-20 rounded-2xl object-cover border-4 shadow-xl" style={{ borderColor: 'rgba(255,255,255,0.4)' }} />
              ) : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <Building2 className="w-10 h-10 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">Admin Panel</span>
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">Company Setup</span>
              </div>
              <h1 className="text-3xl font-black text-white mb-1">
                {input.name || 'Company Setup'}
              </h1>
              <p className="text-white/80 text-sm">Update your company profile & branding</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <form onSubmit={submitHandler}
            className="rounded-3xl shadow-2xl border overflow-hidden" style={{ background: C.card, borderColor: C.goldBorder }}>

            <div className="px-8 py-5 border-b flex items-center gap-3" style={{ borderColor: C.goldBorder, background: C.surface }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` }}>
                <Building2 className="w-4 h-4" style={{ color: C.obsidian }} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: C.white }}>Company Information</p>
                <p className="text-xs" style={{ color: C.muted }}>Fill in the details below to update your company</p>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {fields.map(({ label, name, icon: Icon, color, placeholder, type }, i) => (
                  <motion.div key={name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.05 }}>
                    <Label className="font-semibold text-sm flex items-center gap-2 mb-2" style={{ color: C.white }}>
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color }} />
                      </span>
                      {label}
                    </Label>
                    <Input
                      type={type}
                      name={name}
                      value={input[name]}
                      onChange={changeEventHandler}
                      placeholder={placeholder}
                      className="h-12 border-2 rounded-2xl transition-all"
                      style={{ borderColor: C.goldBorder, background: C.dim, color: C.white }}
                    />
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
                className="mb-8">
                <Label className="font-semibold text-sm flex items-center gap-2 mb-2" style={{ color: C.white }}>
                  <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(244,63,94,0.15)' }}>
                    <Image className="w-3.5 h-3.5" style={{ color: '#f43f5e' }} />
                  </span>
                  Company Logo
                </Label>
                <label className="flex items-center gap-4 p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all group"
                  style={{ borderColor: C.goldBorder, background: C.dim }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0" style={{ background: C.goldDim }}>
                    <Upload className="w-5 h-5" style={{ color: C.gold }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold group-hover:transition-colors" style={{ color: C.white }}>
                      {input.file ? input.file.name : 'Click to upload logo'}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>PNG, JPG, WEBP up to 5MB</p>
                  </div>
                  {preview && (
                    <img src={preview} alt="preview"
                      className="w-12 h-12 rounded-xl object-cover border-2 shadow-md flex-shrink-0" style={{ borderColor: C.goldBorder }} />
                  )}
                  <input type="file" accept="image/*" onChange={changeFileHandler} className="hidden" />
                </label>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
                className="flex flex-wrap gap-2 mb-8">
                {fields.map(({ label, name, color }) => {
                  const filled = !!input[name];
                  return (
                    <span key={name}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                      style={{ background: filled ? `${color}15` : C.dim, color: filled ? color : C.muted }}>
                      <CheckCircle2 className={`w-3 h-3`} style={{ opacity: filled ? 1 : 0.4 }} />
                      {label}
                    </span>
                  );
                })}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
                {loading ? (
                  <Button disabled
                    className="w-full h-13 rounded-2xl font-bold text-base shadow-xl"
                    style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: C.obsidian }}>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Updating Company...
                  </Button>
                ) : (
                  <Button type="submit"
                    className="w-full h-13 rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all"
                    style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: C.obsidian }}>
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Update Company
                  </Button>
                )}
              </motion.div>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default CompanySetup;
