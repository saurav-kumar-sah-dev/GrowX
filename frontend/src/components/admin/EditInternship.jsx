import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Loader2, MapPin, DollarSign, Users, Clock, Building2,
  FileText, Sparkles, Zap, Star, Calendar, Award, Target,
  Plus, ArrowRight, ArrowLeft, Check, GripVertical,
  Globe, Home, ChevronDown, X, GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from './AdminLayout';
import { API } from '@/config/api';
import CompanySelect from './CompanySelect';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
  surface: "#1A1A24",
  surfaceLight: "#252532",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  accent: "#C8884A",
  green: "#10b981",
  greenDark: "#059669",
  greenDim: "rgba(16,185,129,0.08)",
  greenBorder: "rgba(16,185,129,0.15)",
  ivory: "#F5F0E6",
  muted: "#A8A099",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
  success: "#10b981",
  danger: "#ef4444",
};

const DURATION_OPTIONS = [
  { value: "1", label: "1 Month", desc: "Short term" },
  { value: "2", label: "2 Months", desc: "Short term" },
  { value: "3", label: "3 Months", desc: "Standard" },
  { value: "4", label: "4 Months", desc: "Extended" },
  { value: "5", label: "5 Months", desc: "Extended" },
  { value: "6", label: "6 Months", desc: "Long term" },
];

const STIPEND_TYPES = [
  { value: "Fixed", label: "Fixed Amount", desc: "Set monthly stipend" },
  { value: "Negotiable", label: "Negotiable", desc: "Discuss with candidate" },
  { value: "Unpaid", label: "Unpaid", desc: "No stipend" },
  { value: "Performance-based", label: "Performance-based", desc: "Based on performance" },
];

const WORK_MODES = [
  { value: "On-site", label: "On-site", icon: Building2, desc: "Work from office" },
  { value: "Remote", label: "Remote", icon: Globe, desc: "Work from anywhere" },
  { value: "Hybrid", label: "Hybrid", icon: Home, desc: "Mix of both" },
];

const STEPS = [
  { id: 1, title: "Basic Info", icon: GraduationCap, description: "Internship title & company" },
  { id: 2, title: "Details", icon: Target, description: "Requirements & skills" },
  { id: 3, title: "Compensation", icon: DollarSign, description: "Stipend & benefits" },
  { id: 4, title: "Settings", icon: Sparkles, description: "Final touches" },
];

const ModernSelect = ({ value, onValueChange, options, placeholder, icon: Icon, error }) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full h-14 px-4 rounded-2xl flex items-center gap-3 transition-all duration-200 border-2 ${
          error ? 'border-red-500/50' : selected ? 'border-[#10b981]' : 'border-[#252532] hover:border-[#10b981]/50'
        }`}
        style={{ background: '#0A0A0F' }}
      >
        {selected?.icon && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.green}20` }}>
            <selected.icon className="w-5 h-5" style={{ color: C.green }} />
          </div>
        )}
        <div className="flex-1 text-left">
          <p className={`text-sm font-semibold ${selected ? 'text-[#F5F0E6]' : 'text-[#A8A099]'}`}>
            {selected ? selected.label : placeholder}
          </p>
          {selected && (
            <p className="text-xs" style={{ color: C.muted }}>{selected.desc}</p>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} style={{ color: C.muted }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 py-2 rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: '#1A1A24', border: `1px solid ${C.greenBorder}` }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => { onValueChange(option.value); setOpen(false); }}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[#252532] transition-colors ${
                  value === option.value ? 'bg-[#252532]' : ''
                }`}
              >
                {option.icon && (
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${C.green}15` }}>
                    <option.icon className="w-4 h-4" style={{ color: C.green }} />
                  </div>
                )}
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-[#F5F0E6]">{option.label}</p>
                  <p className="text-xs" style={{ color: C.muted }}>{option.desc}</p>
                </div>
                {value === option.value && (
                  <Check className="w-5 h-5" style={{ color: C.green }} />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TagInput = ({ value, onChange, placeholder, icon: Icon, color }) => {
  const [tag, setTag] = useState('');
  const [focused, setFocused] = useState(false);

  const addTag = () => {
    if (tag.trim() && !value.includes(tag.trim())) {
      onChange([...value, tag.trim()]);
      setTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter(t => t !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <div className={`relative flex gap-2 p-3 rounded-2xl transition-all duration-200 border-2 ${
        focused ? 'border-[#10b981]' : 'border-[#252532] hover:border-[#10b981]/50'
      }`} style={{ background: '#0A0A0F' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[#F5F0E6] placeholder:text-[#A8A099] outline-none text-sm"
        />
        <button
          type="button"
          onClick={addTag}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})` }}
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>
      <AnimatePresence mode="popLayout">
        {value.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2"
          >
            {value.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ background: `${color}15`, color: color, border: `1px solid ${color}30` }}
              >
                <GripVertical className="w-3 h-3 opacity-50" />
                {t}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ToggleSwitch = ({ checked, onChange, label, sublabel, icon: Icon, color }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 border-2 ${
      checked ? 'border-[#10b981]' : 'border-[#252532] hover:border-[#10b981]/30'
    }`}
    style={{ background: checked ? `${color}10` : '#1A1A24' }}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
      checked ? 'shadow-lg' : ''
    }`} style={{ background: checked ? `${color}25` : '#252532' }}>
      <Icon className="w-6 h-6" style={{ color: checked ? color : C.muted }} />
    </div>
    <div className="flex-1 text-left">
      <p className="font-bold text-sm" style={{ color: checked ? color : C.ivory }}>{label}</p>
      <p className="text-xs" style={{ color: C.muted }}>{sublabel}</p>
    </div>
    <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${
      checked ? '' : 'opacity-50'
    }`} style={{ background: checked ? color : '#252532' }}>
      <div
        className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300"
        style={{ left: checked ? 'calc(100% - 28px)' : '4px' }}
      />
    </div>
  </button>
);

const EditInternship = () => {
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [input, setInput] = useState({
    title: '', description: '', requirements: [], skills: [],
    stipendAmount: '', stipendType: 'Negotiable',
    duration: '3', workMode: 'On-site',
    location: '', positionsOpen: '1',
    companyId: '', benefits: [], responsibilities: [],
    qualifications: [], urgent: false, featured: false,
    applicationDeadline: '', whoCanApply: '', status: 'active'
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchInternship();
  }, [id]);

  const fetchInternship = async () => {
    try {
      const res = await axios.get(`${API.job}/get/${id}`, { withCredentials: true });
      const job = res.data.job;
      
      if (job.jobType !== 'Internship') {
        toast.error('This is not an internship');
        navigate('/admin/all-jobs');
        return;
      }

      setInput({
        title: job.title || '',
        description: job.description || '',
        requirements: job.requirements || [],
        skills: job.skills || [],
        stipendAmount: job.stipendAmount || '',
        stipendType: job.stipendType || 'Negotiable',
        duration: String(job.duration || '3'),
        workMode: job.workMode || 'On-site',
        location: job.location || '',
        positionsOpen: String(job.positionsOpen || 1),
        companyId: job.company?._id || '',
        benefits: job.benefits || [],
        responsibilities: job.responsibilities || [],
        qualifications: job.qualifications || [],
        urgent: job.urgent || false,
        featured: job.featured || false,
        applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
        whoCanApply: job.whoCanApply || ''
      });
    } catch (err) {
      toast.error('Failed to load internship details');
      navigate('/admin/all-jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setInput(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!input.title.trim()) newErrors.title = 'Internship title is required';
      if (!input.companyId) newErrors.companyId = 'Please select a company';
      if (!input.description.trim()) newErrors.description = 'Description is required';
    }
    if (step === 2) {
      if (!input.location.trim()) newErrors.location = 'Location is required';
      if (!input.duration) newErrors.duration = 'Duration is required';
    }
    if (step === 3) {
      if (!input.stipendType) newErrors.stipendType = 'Stipend type is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    const payload = {
      title: input.title.trim(),
      description: input.description.trim(),
      requirements: input.requirements,
      skills: input.skills,
      experienceLevel: 'Fresher',
      experienceYears: 0,
      position: Number(input.positionsOpen) || 1,
      salary: input.stipendType === 'Unpaid' ? 'Unpaid' : (input.stipendAmount ? `₹${input.stipendAmount}/month` : input.stipendType),
      salaryMin: Number(input.stipendAmount) || 0,
      salaryMax: Number(input.stipendAmount) || 0,
      jobType: 'Internship',
      workMode: input.workMode,
      location: input.location.trim(),
      city: '',
      state: '',
      positionsOpen: Number(input.positionsOpen) || 1,
      companyId: input.companyId,
      benefits: input.benefits,
      responsibilities: input.responsibilities,
      qualifications: input.qualifications,
      urgent: input.urgent,
      featured: input.featured,
      applicationDeadline: input.applicationDeadline || null,
      stipendAmount: Number(input.stipendAmount) || 0,
      stipendType: input.stipendType,
      duration: Number(input.duration),
      whoCanApply: input.whoCanApply.trim() || null,
      status: input.status
    };

    try {
      setSaving(true);
      const res = await axios.put(`${API.job}/update/${id}`, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/admin/all-jobs');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error updating internship');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
            style={{ background: `linear-gradient(135deg,${C.green},${C.greenDark})` }}>
            <GraduationCap size={24} className="text-white" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl" style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})` }}>
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(40%,-40%)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(-30%,30%)' }} />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-white mb-2">Edit Internship</h1>
                  <p className="text-white/80 text-lg">Update internship details</p>
                </div>
              </div>
              <Button onClick={() => navigate('/admin/all-jobs')} variant="ghost" className="text-white hover:bg-white/20 h-12 px-6 rounded-2xl">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Step Indicator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="flex items-center justify-between p-4 rounded-3xl" style={{ background: C.surface, border: `1px solid ${C.greenBorder}` }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <button
                  type="button"
                  onClick={() => step > s.id && setStep(s.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    step === s.id ? 'bg-[#252532]' : step > s.id ? 'cursor-pointer hover:bg-[#252532]/50' : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    step === s.id ? 'shadow-lg' : step > s.id ? '' : ''
                  }`} style={{
                    background: step === s.id ? `linear-gradient(135deg, ${C.green}, ${C.greenDark})` : step > s.id ? C.green : '#252532',
                    boxShadow: step === s.id ? `0 0 20px ${C.greenDim}` : 'none'
                  }}>
                    {step > s.id ? (
                      <Check className="w-6 h-6 text-[#0A0A0F]" />
                    ) : (
                      <s.icon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className={`font-bold text-sm ${step === s.id ? 'text-[#F5F0E6]' : 'text-[#A8A099]'}`}>{s.title}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{s.description}</p>
                  </div>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${step > s.id ? '' : ''}`} style={{
                    background: step > s.id ? `linear-gradient(90deg, ${C.green}, ${C.greenDark})` : '#252532'
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          onSubmit={handleSubmit} className="rounded-3xl shadow-2xl overflow-hidden" style={{ background: C.charcoal, border: `1px solid ${C.greenBorder}` }}>

          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})` }}>
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#F5F0E6]">Basic Information</h2>
                    <p className="text-sm" style={{ color: C.muted }}>Start with the essentials</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-[#F5F0E6] mb-3 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" style={{ color: C.green }} />
                      Internship Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={input.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g. Frontend Developer Intern"
                      className={`h-14 px-5 rounded-2xl text-[#F5F0E6] placeholder:text-[#A8A099] border-2 ${
                        errors.title ? 'border-red-500' : 'border-[#252532] focus:border-[#10b981]'
                      }`}
                      style={{ background: '#0A0A0F' }}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-2">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#F5F0E6] mb-3 flex items-center gap-2">
                      <Building2 className="w-5 h-5" style={{ color: C.green }} />
                      Select Company <span className="text-red-500">*</span>
                    </label>
                    <CompanySelect
                      value={input.companyId}
                      onChange={(id) => handleInputChange('companyId', id)}
                      placeholder="Search and select a company..."
                      error={errors.companyId}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#F5F0E6] mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" style={{ color: C.green }} />
                      Internship Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={input.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe the internship role, responsibilities, and what you're looking for..."
                      rows={6}
                      className={`rounded-2xl p-5 text-[#F5F0E6] placeholder:text-[#A8A099] resize-none border-2 ${
                        errors.description ? 'border-red-500' : 'border-[#252532] focus:border-[#10b981]'
                      }`}
                      style={{ background: '#0A0A0F' }}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-2">{errors.description}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})` }}>
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#F5F0E6]">Internship Details</h2>
                    <p className="text-sm" style={{ color: C.muted }}>Requirements, skills & more</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#F5F0E6] mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5" style={{ color: C.green }} />
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <ModernSelect
                      value={input.duration}
                      onValueChange={(v) => handleInputChange('duration', v)}
                      options={DURATION_OPTIONS}
                      placeholder="Select duration"
                      error={errors.duration}
                    />
                    {errors.duration && <p className="text-red-500 text-xs mt-2">{errors.duration}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#F5F0E6] mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5" style={{ color: C.green }} />
                      Work Mode
                    </label>
                    <ModernSelect
                      value={input.workMode}
                      onValueChange={(v) => handleInputChange('workMode', v)}
                      options={WORK_MODES}
                      placeholder="Select work mode"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#F5F0E6] mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5" style={{ color: C.green }} />
                      Location <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={input.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g. Bangalore, Karnataka"
                      className={`h-14 px-5 rounded-2xl text-[#F5F0E6] placeholder:text-[#A8A099] border-2 ${
                        errors.location ? 'border-red-500' : 'border-[#252532] focus:border-[#10b981]'
                      }`}
                      style={{ background: '#0A0A0F' }}
                    />
                    {errors.location && <p className="text-red-500 text-xs mt-2">{errors.location}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#F5F0E6] mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" style={{ color: C.green }} />
                      Positions Available
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={input.positionsOpen}
                      onChange={(e) => handleInputChange('positionsOpen', e.target.value)}
                      placeholder="e.g. 2"
                      className="h-14 px-5 rounded-2xl text-[#F5F0E6] placeholder:text-[#A8A099] border-2 border-[#252532] focus:border-[#10b981]"
                      style={{ background: '#0A0A0F' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#F5F0E6] mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5" style={{ color: C.green }} />
                      Application Deadline
                    </label>
                    <Input
                      type="date"
                      value={input.applicationDeadline}
                      onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                      className="h-14 px-5 rounded-2xl text-[#F5F0E6] border-2 border-[#252532] focus:border-[#10b981]"
                      style={{ background: '#0A0A0F', colorScheme: 'dark' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <TagInput
                    value={input.skills}
                    onChange={(val) => handleInputChange('skills', val)}
                    placeholder="Type skill and press Enter"
                    icon={Award}
                    color={C.green}
                  />
                  <TagInput
                    value={input.requirements}
                    onChange={(val) => handleInputChange('requirements', val)}
                    placeholder="Type requirement and press Enter"
                    icon={Sparkles}
                    color={C.greenDark}
                  />
                </div>

                <TagInput
                  value={input.whoCanApply ? [input.whoCanApply] : []}
                  onChange={(val) => handleInputChange('whoCanApply', val[0] || '')}
                  placeholder="Who can apply? (e.g. Students, Freshers)"
                  icon={Users}
                  color={C.green}
                />
              </motion.div>
            )}

            {/* Step 3: Compensation */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})` }}>
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#F5F0E6]">Stipend</h2>
                    <p className="text-sm" style={{ color: C.muted }}>Stipend details & benefits</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#F5F0E6] mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" style={{ color: C.green }} />
                    Stipend Type <span className="text-red-500">*</span>
                  </label>
                  <ModernSelect
                    value={input.stipendType}
                    onValueChange={(v) => handleInputChange('stipendType', v)}
                    options={STIPEND_TYPES}
                    placeholder="Select stipend type"
                    error={errors.stipendType}
                  />
                  {errors.stipendType && <p className="text-red-500 text-xs mt-2">{errors.stipendType}</p>}
                </div>

                {input.stipendType !== 'Unpaid' && (
                  <div className="p-6 rounded-3xl" style={{ background: `linear-gradient(135deg, ${C.greenDim}, transparent)`, border: `1px solid ${C.greenBorder}` }}>
                    <label className="block text-sm font-bold text-[#F5F0E6] mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5" style={{ color: C.green }} />
                      Monthly Stipend (₹)
                    </label>
                    <Input
                      type="number"
                      value={input.stipendAmount}
                      onChange={(e) => handleInputChange('stipendAmount', e.target.value)}
                      placeholder="e.g. 15000"
                      className="h-16 px-6 rounded-2xl text-lg font-bold text-[#F5F0E6] placeholder:text-[#A8A099] border-2 border-[#10b981]"
                      style={{ background: '#0A0A0F' }}
                    />
                    <p className="text-xs mt-2" style={{ color: C.muted }}>Enter 0 for Negotiable</p>
                  </div>
                )}

                <TagInput
                  value={input.benefits}
                  onChange={(val) => handleInputChange('benefits', val)}
                  placeholder="Type benefit and press Enter (e.g. Certificate, Mentorship)"
                  icon={Star}
                  color={C.green}
                />
              </motion.div>
            )}

            {/* Step 4: Settings */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})` }}>
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#F5F0E6]">Final Settings</h2>
                    <p className="text-sm" style={{ color: C.muted }}>Customize how your internship appears</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ToggleSwitch
                    checked={input.urgent}
                    onChange={(v) => handleInputChange('urgent', v)}
                    label="Urgent Hiring"
                    sublabel="Display urgent badge on this internship"
                    icon={Zap}
                    color={C.danger}
                  />
                  <ToggleSwitch
                    checked={input.featured}
                    onChange={(v) => handleInputChange('featured', v)}
                    label="Featured"
                    sublabel="Show prominently at the top"
                    icon={Star}
                    color={C.green}
                  />
                </div>

                <TagInput
                  value={input.responsibilities}
                  onChange={(val) => handleInputChange('responsibilities', val)}
                  placeholder="Type responsibility and press Enter"
                  icon={Target}
                  color={C.greenDark}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="px-8 py-6 border-t flex items-center justify-between" style={{ background: C.obsidian, borderColor: C.greenBorder }}>
            <Button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="h-14 px-8 rounded-2xl font-bold flex items-center gap-2"
              style={{ background: '#252532', color: C.ivory, border: `1px solid ${C.greenBorder}` }}
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map(s => (
                <div
                  key={s}
                  className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                  style={{ background: step === s ? C.green : step > s ? C.greenDark : '#252532' }}
                />
              ))}
            </div>

            {step < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="h-14 px-8 rounded-2xl font-bold flex items-center gap-2 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, color: 'white' }}
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={saving}
                className="h-14 px-10 rounded-2xl font-bold flex items-center gap-2 shadow-xl"
                style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, color: 'white' }}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.form>
      </div>
    </AdminLayout>
  );
};

export default EditInternship;
