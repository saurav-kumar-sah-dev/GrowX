import React, { useState, useEffect } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Loader2, Briefcase, MapPin, DollarSign, Users, Clock, Building2, 
  FileText, Sparkles, AlertCircle, Zap, Star, Calendar, Award, Target,
  Plus, X, Globe, Trash2, Edit, Eye, EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';
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
  ivory: "#F5F0E6",
  muted: "#A8A099",
  success: "#10b981",
  error: "#ef4444",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
};

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const EXPERIENCE_LEVELS = ["Fresher", "0-2 Years", "2-5 Years", "5-10 Years", "10+ Years"];
const WORK_MODES = ["On-site", "Remote", "Hybrid"];
const STATUS_OPTIONS = ["active", "closed", "paused", "draft"];

const Field = ({ label, icon: Icon, iconColor, required, children }) => (
  <div className="space-y-2">
    <Label className="text-[#F5F0E6] font-bold text-sm flex items-center gap-2">
      <span className={`w-5 h-5 rounded-md flex items-center justify-center`} style={{ background: `${iconColor}18` }}>
        <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} />
      </span>
      {label}
      {required && <span className="text-red-500 text-xs">*</span>}
    </Label>
    {children}
  </div>
);

const TagInput = ({ value, onChange, placeholder }) => {
  const [tag, setTag] = useState('');

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
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          placeholder={placeholder}
          className="h-12 border-2 border-[#252532] focus:border-[#D4A853] rounded-xl bg-[#0A0A0F] text-[#F5F0E6] placeholder:text-[#A8A099]"
        />
        <Button type="button" onClick={addTag} className="h-12 px-4 rounded-xl" style={{ background: C.gold, color: C.obsidian }}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium" 
              style={{ background: `${C.gold}20`, color: C.gold, border: `1px solid ${C.goldBorder}` }}>
              {t}
              <button type="button" onClick={() => removeTag(t)} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [input, setInput] = useState({
    title: '', description: '', requirements: [], skills: [], salary: '',
    salaryMin: '', salaryMax: '', experienceLevel: '', experienceYears: '',
    location: '', city: '', state: '', jobType: '', workMode: 'On-site',
    position: '', positionsOpen: '', companyId: '', benefits: [], responsibilities: [],
    qualifications: [], urgent: false, featured: false, status: 'active', applicationDeadline: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`${API.job}/get/${id}`, { withCredentials: true });
      const job = res.data.job;
      
      setInput({
        title: job.title || '',
        description: job.description || '',
        requirements: job.requirements || [],
        skills: job.skills || [],
        salary: job.salary || '',
        salaryMin: job.salaryMin || '',
        salaryMax: job.salaryMax || '',
        experienceLevel: job.experienceLevel || '',
        experienceYears: job.experienceYears || '',
        location: job.location || '',
        city: job.city || '',
        state: job.state || '',
        jobType: job.jobType || '',
        workMode: job.workMode || 'On-site',
        position: job.position || '',
        positionsOpen: job.positionsOpen || '',
        companyId: job.company?._id || '',
        benefits: job.benefits || [],
        responsibilities: job.responsibilities || [],
        qualifications: job.qualifications || [],
        urgent: job.urgent || false,
        featured: job.featured || false,
        status: job.status || 'active',
        applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : ''
      });
    } catch (err) {
      toast.error('Failed to load job details');
      navigate('/admin/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.title || !input.description || !input.salary || !input.location || !input.jobType || !input.experienceLevel || !input.position) {
      return toast.error('Please complete all required fields.');
    }

    const payload = {
      title: input.title.trim(),
      description: input.description.trim(),
      requirements: input.requirements,
      skills: input.skills,
      salary: input.salary,
      salaryMin: Number(input.salaryMin) || 0,
      salaryMax: Number(input.salaryMax) || 0,
      experienceLevel: input.experienceLevel,
      experienceYears: Number(input.experienceYears) || 0,
      location: input.location.trim(),
      city: input.city.trim(),
      state: input.state.trim(),
      jobType: input.jobType,
      workMode: input.workMode,
      position: Number(input.position),
      positionsOpen: Number(input.positionsOpen) || Number(input.position),
      benefits: input.benefits,
      responsibilities: input.responsibilities,
      qualifications: input.qualifications,
      urgent: input.urgent,
      featured: input.featured,
      status: input.status,
      applicationDeadline: input.applicationDeadline || null
    };

    try {
      setSaving(true);
      const res = await axios.put(`${API.job}/update/${id}`, payload, { 
        headers: { 'Content-Type': 'application/json' }, 
        withCredentials: true 
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/admin/jobs');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error updating job');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;

    try {
      setDeleting(true);
      const res = await axios.delete(`${API.job}/delete/${id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/admin/jobs');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error deleting job');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (newStatus) => {
    try {
      const res = await axios.patch(`${API.job}/update/${id}`, { status: newStatus }, { withCredentials: true });
      if (res.data.success) {
        handleInputChange('status', newStatus);
        toast.success(`Job ${newStatus === 'active' ? 'activated' : newStatus}`);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleToggleUrgent = async () => {
    try {
      const res = await axios.patch(`${API.job}/toggle-urgent/${id}`, {}, { withCredentials: true });
      if (res.data.success) {
        handleInputChange('urgent', !input.urgent);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to toggle urgent');
    }
  };

  const handleToggleFeatured = async () => {
    try {
      const res = await axios.patch(`${API.job}/toggle-featured/${id}`, {}, { withCredentials: true });
      if (res.data.success) {
        handleInputChange('featured', !input.featured);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to toggle featured');
    }
  };

  const handleDuplicate = async () => {
    try {
      const res = await axios.post(`${API.job}/duplicate/${id}`, {}, { withCredentials: true });
      if (res.data.success) {
        toast.success('Job duplicated successfully');
        navigate('/admin/jobs');
      }
    } catch (err) {
      toast.error('Failed to duplicate job');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-16 h-16 animate-spin" style={{ color: C.gold }} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})` }}>
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(30%,-30%)' }} />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                  <Edit className="h-9 w-9 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white mb-1">Edit Job</h1>
                  <p className="text-white/80 text-sm">Update job details and settings</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleDuplicate} variant="ghost" className="text-white hover:bg-white/20">
                  <Sparkles className="w-4 h-4 mr-2" /> Duplicate
                </Button>
                <Button onClick={() => navigate('/admin/jobs')} variant="ghost" className="text-white hover:bg-white/20">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8 p-4 rounded-2xl" style={{ background: C.charcoal, border: `1px solid ${C.goldBorder}` }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-semibold" style={{ color: C.ivory }}>Quick Actions:</span>
              
              <Button onClick={handleToggleUrgent} size="sm" variant="outline"
                className="h-9 rounded-lg" style={{ borderColor: input.urgent ? C.error : C.goldBorder, color: input.urgent ? C.error : C.ivory }}>
                {input.urgent ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {input.urgent ? 'Remove Urgent' : 'Mark Urgent'}
              </Button>

              <Button onClick={handleToggleFeatured} size="sm" variant="outline"
                className="h-9 rounded-lg" style={{ borderColor: input.featured ? C.gold : C.goldBorder, color: input.featured ? C.gold : C.ivory }}>
                <Star className={`w-4 h-4 mr-1 ${input.featured ? 'fill-current' : ''}`} />
                {input.featured ? 'Remove Featured' : 'Mark Featured'}
              </Button>

              <Select value={input.status} onValueChange={handleToggleStatus}>
                <SelectTrigger className="h-9 w-32 rounded-lg" style={{ borderColor: C.goldBorder, color: input.status === 'active' ? C.success : C.ivory }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent style={{ background: C.charcoal, borderColor: C.goldBorder }}>
                  {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleDelete} size="sm" variant="outline"
              className="h-9 rounded-lg" style={{ borderColor: C.error, color: C.error }}>
              <Trash2 className="w-4 h-4 mr-1" />
              {deleting ? 'Deleting...' : 'Delete Job'}
            </Button>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          onSubmit={handleSubmit} className="rounded-3xl shadow-xl overflow-hidden" style={{ background: C.charcoal, border: `1px solid ${C.goldBorder}` }}>

          {/* Basic Info */}
          <div className="px-8 py-5 border-b" style={{ background: C.obsidian, borderColor: C.goldBorder }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg,${C.gold},${C.accent})` }}>
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg" style={{ color: C.ivory }}>Basic Information</p>
                <p className="text-sm" style={{ color: C.muted }}>Update the core job details</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Field label="Job Title" icon={Briefcase} iconColor="#D4A853" required>
                  <Input value={input.title} onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Senior Frontend Developer" required
                    className="h-12 border-2 rounded-xl bg-[#0A0A0F] text-[#F5F0E6] placeholder:text-[#A8A099]"
                    style={{ borderColor: C.goldBorder }} />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Select Company" icon={Building2} iconColor="#D4A853" required>
                  <CompanySelect
                    value={input.companyId}
                    onChange={(id) => handleInputChange('companyId', id)}
                    placeholder="Choose a company"
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Job Description" icon={FileText} iconColor="#D4A853" required>
                  <Textarea value={input.description} onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                    rows={4} required
                    className="border-2 rounded-xl bg-[#0A0A0F] text-[#F5F0E6] placeholder:text-[#A8A099] resize-none"
                    style={{ borderColor: C.goldBorder }} />
                </Field>
              </div>

              <Field label="Requirements" icon={Sparkles} iconColor="#C8884A">
                <TagInput value={input.requirements} onChange={(val) => handleInputChange('requirements', val)}
                  placeholder="Add requirement and press Enter" />
              </Field>

              <Field label="Skills" icon={Award} iconColor="#E8C17A">
                <TagInput value={input.skills} onChange={(val) => handleInputChange('skills', val)}
                  placeholder="Add skill and press Enter" />
              </Field>

              <Field label="Benefits" icon={Star} iconColor="#D4A853">
                <TagInput value={input.benefits} onChange={(val) => handleInputChange('benefits', val)}
                  placeholder="Add benefit and press Enter" />
              </Field>

              <Field label="Responsibilities" icon={Target} iconColor="#C8884A">
                <TagInput value={input.responsibilities} onChange={(val) => handleInputChange('responsibilities', val)}
                  placeholder="Add responsibility and press Enter" />
              </Field>
            </div>
          </div>

          {/* Job Details */}
          <div className="px-8 py-5 border-t border-b" style={{ background: C.obsidian, borderColor: C.goldBorder }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg,${C.gold},${C.accent})` }}>
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg" style={{ color: C.ivory }}>Job Details</p>
                <p className="text-sm" style={{ color: C.muted }}>Update location, type, and employment details</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field label="Job Type" icon={Clock} iconColor="#D4A853" required>
                <Select value={input.jobType} onValueChange={(val) => handleInputChange('jobType', val)}>
                  <SelectTrigger className="h-12 border-2 rounded-xl bg-[#0A0A0F] text-[#F5F0E6]" style={{ borderColor: C.goldBorder }}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent style={{ background: C.charcoal, borderColor: C.goldBorder }}>
                    {JOB_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Work Mode" icon={Globe} iconColor="#C8884A">
                <Select value={input.workMode} onValueChange={(val) => handleInputChange('workMode', val)}>
                  <SelectTrigger className="h-12 border-2 rounded-xl bg-[#0A0A0F] text-[#F5F0E6]" style={{ borderColor: C.goldBorder }}>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent style={{ background: C.charcoal, borderColor: C.goldBorder }}>
                    {WORK_MODES.map(mode => <SelectItem key={mode} value={mode}>{mode}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Experience Level" icon={Award} iconColor="#E8C17A" required>
                <Select value={input.experienceLevel} onValueChange={(val) => handleInputChange('experienceLevel', val)}>
                  <SelectTrigger className="h-12 border-2 rounded-xl bg-[#0A0A0F] text-[#F5F0E6]" style={{ borderColor: C.goldBorder }}>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent style={{ background: C.charcoal, borderColor: C.goldBorder }}>
                    {EXPERIENCE_LEVELS.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="City" icon={Building2} iconColor="#D4A853">
                <Input value={input.city} onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="e.g. Bangalore"
                  className="h-12 border-2 rounded-xl bg-[#0A0A0F] text-[#F5F0E6] placeholder:text-[#A8A099]"
                  style={{ borderColor: C.goldBorder }} />
              </Field>

              <Field label="State" icon={MapPin} iconColor="#C8884A">
                <Input value={input.state} onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="e.g. Karnataka"
                  className="h-12 border-2 rounded-xl bg-[#0A0A0F] text-[#F5F0E6] placeholder:text-[#A8A099]"
                  style={{ borderColor: C.goldBorder }} />
              </Field>

              <Field label="Location" icon={MapPin} iconColor="#D4A853" required>
                <Input value={input.location} onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g. Bangalore, Karnataka"
                  className="h-12 border-2 rounded-xl bg-[#0A0A0F] text-[#F5F0E6] placeholder:text-[#A8A099]"
                  style={{ borderColor: C.goldBorder }} />
              </Field>

              <Field label="No. of Positions" icon={Users} iconColor="#E8C17A" required>
                <Input type="number" min="1" value={input.position} onChange={(e) => handleInputChange('position', e.target.value)}
                  className="h-12 border-2 rounded-xl bg-[#0A0A0F] text-[#F5F0E6]"
                  style={{ borderColor: C.goldBorder }} />
              </Field>

              <Field label="Open Positions" icon={Users} iconColor="#C8884A">
                <Input type="number" min="1" value={input.positionsOpen} onChange={(e) => handleInputChange('positionsOpen', e.target.value)}
                  className="h-12 border-2 rounded-xl bg-[#0A0A0F] text-[#F5F0E6]"
                  style={{ borderColor: C.goldBorder }} />
              </Field>

              <Field label="Application Deadline" icon={Calendar} iconColor="#D4A853">
                <Input type="date" value={input.applicationDeadline} onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                  className="h-12 border-2 rounded-xl bg-[#0A0A0F] text-[#F5F0E6]"
                  style={{ borderColor: C.goldBorder }} />
              </Field>
            </div>
          </div>

          {/* Salary */}
          <div className="px-8 py-5 border-t border-b" style={{ background: C.obsidian, borderColor: C.goldBorder }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg,${C.gold},${C.accent})` }}>
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg" style={{ color: C.ivory }}>Compensation</p>
                <p className="text-sm" style={{ color: C.muted }}>Update salary details</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <Field label="Salary Display (e.g. ₹8-15 LPA)" icon={DollarSign} iconColor="#D4A853" required>
                  <Input value={input.salary} onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="e.g. ₹8-15 LPA"
                    className="h-12 border-2 rounded-xl bg-[#0A0A0F] text-[#F5F0E6] placeholder:text-[#A8A099]"
                    style={{ borderColor: C.goldBorder }} />
                </Field>
              </div>

              <Field label="Min Salary (₹)" icon={DollarSign} iconColor="#C8884A">
                <Input type="number" value={input.salaryMin} onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                  className="h-12 border-2 rounded-xl bg-[#0A0A0F] text-[#F5F0E6]"
                  style={{ borderColor: C.goldBorder }} />
              </Field>

              <Field label="Max Salary (₹)" icon={DollarSign} iconColor="#E8C17A">
                <Input type="number" value={input.salaryMax} onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                  className="h-12 border-2 rounded-xl bg-[#0A0A0F] text-[#F5F0E6]"
                  style={{ borderColor: C.goldBorder }} />
              </Field>
            </div>
          </div>

          {/* Submit */}
          <div className="px-8 py-6 border-t" style={{ background: C.obsidian, borderColor: C.goldBorder }}>
            <div className="flex gap-4">
              <Button type="button" onClick={() => navigate('/admin/jobs')} variant="outline"
                className="flex-1 h-14 rounded-xl font-bold" style={{ borderColor: C.goldBorder, color: C.ivory }}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}
                className="flex-1 h-14 rounded-xl font-bold shadow-xl" style={{ background: `linear-gradient(135deg,${C.gold},${C.accent})`, color: C.obsidian }}>
                {saving ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Saving...</> : <><Edit className="mr-2 h-5 w-5" />Save Changes</>}
              </Button>
            </div>
          </div>
        </motion.form>
      </div>
    </AdminLayout>
  );
};

export default EditJob;
