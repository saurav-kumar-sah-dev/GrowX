import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Loader2, Plus, Search, Edit, Trash2, X, Check, Eye, EyeOff,
  Code, Globe, Smartphone, Shield, Palette, Cloud, Database, Brain,
  Coffee, Cpu, Layers, Wrench, Zap, Sparkles, ArrowRight, ArrowLeft,
  ChevronDown, GripVertical, Tags, Star, LayoutGrid, FileText,
  BookOpen, Briefcase, Award, TrendingUp, Copy, RotateCcw, CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from './AdminLayout';
import { API } from '@/config/api';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
  surface: "#1A1A24",
  surfaceLight: "#252532",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDark: "#C8884A",
  accent: "#C8884A",
  green: "#10b981",
  greenDark: "#059669",
  greenDim: "rgba(16,185,129,0.08)",
  greenBorder: "rgba(16,185,129,0.15)",
  ivory: "#F5F0E6",
  muted: "#A8A099",
  success: "#10b981",
  danger: "#ef4444",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
};

const ICON_OPTIONS = [
  { value: "Code", label: "Code", icon: Code },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Smartphone", label: "Mobile", icon: Smartphone },
  { value: "Shield", label: "Security", icon: Shield },
  { value: "Palette", label: "Design", icon: Palette },
  { value: "Cloud", label: "Cloud", icon: Cloud },
  { value: "Database", label: "Data", icon: Database },
  { value: "Brain", label: "AI/ML", icon: Brain },
  { value: "Coffee", label: "Java", icon: Coffee },
  { value: "Cpu", label: "Python", icon: Cpu },
  { value: "Layers", label: "Full Stack", icon: Layers },
  { value: "Wrench", label: "DevOps", icon: Wrench },
  { value: "Zap", label: "Fast", icon: Zap },
  { value: "Star", label: "Featured", icon: Star },
  { value: "Tags", label: "Tags", icon: Tags },
  { value: "BookOpen", label: "Learning", icon: BookOpen },
  { value: "Briefcase", label: "Business", icon: Briefcase },
  { value: "Award", label: "Certificate", icon: Award },
  { value: "TrendingUp", label: "Growth", icon: TrendingUp },
  { value: "FileText", label: "Document", icon: FileText },
];

const COLOR_OPTIONS = [
  { value: "#D4A853", label: "Gold" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#10b981", label: "Green" },
  { value: "#ef4444", label: "Red" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#ec4899", label: "Pink" },
  { value: "#f97316", label: "Orange" },
  { value: "#84cc16", label: "Lime" },
  { value: "#14b8a6", label: "Teal" },
  { value: "#a855f7", label: "Violet" },
  { value: "#6366f1", label: "Indigo" },
  { value: "#22c55e", label: "Emerald" },
  { value: "#eab308", label: "Yellow" },
];

const DEFAULT_FORM = {
  name: '',
  icon: 'Code',
  color: '#D4A853',
  topics: [],
  projects: [],
  description: '',
  order: 0,
  isActive: true
};

const TagInput = ({ value, onChange, placeholder, icon: Icon, color, maxTags = 20 }) => {
  const [tag, setTag] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const addTag = () => {
    if (tag.trim() && !value.includes(tag.trim()) && value.length < maxTags) {
      onChange([...value, tag.trim()]);
      setTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !tag && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative flex flex-wrap items-center gap-2 p-3 rounded-xl transition-all duration-200 border-2 cursor-text ${
          focused ? 'border-[#D4A853]' : 'border-[#252532] hover:border-[#D4A853]/50'
        }`}
        style={{ background: '#0A0A0F', minHeight: 52 }}
        onClick={() => inputRef.current?.focus()}
      >
        {Icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
        )}
        {value.map((t, i) => (
          <motion.span
            key={`${t}-${i}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium animate-in"
            style={{ background: `${color}15`, color: color, border: `1px solid ${color}30` }}
          >
            {t}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(t); }}
              className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </motion.span>
        ))}
        <input
          ref={inputRef}
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent text-[#F5F0E6] placeholder:text-[#A8A099] outline-none text-sm py-1"
        />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); addTag(); }}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${color}, ${C.accent})` }}
        >
          <Plus className="w-4 h-4 text-[#0A0A0F]" />
        </button>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs" style={{ color: C.muted }}>{value.length}/{maxTags} items</span>
        <span className="text-xs" style={{ color: C.muted }}>Press Enter to add</span>
      </div>
    </div>
  );
};

const ColorPicker = ({ value, onChange }) => {
  const [customColor, setCustomColor] = useState(value);
  const [showCustom, setShowCustom] = useState(false);

  const handleCustomChange = (e) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
  };

  const applyCustomColor = () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(customColor)) {
      onChange(customColor);
    }
    setShowCustom(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 p-3 rounded-xl border-2 border-[#252532]" style={{ background: '#0A0A0F' }}>
        {COLOR_OPTIONS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className="relative w-9 h-9 rounded-lg transition-all hover:scale-110"
            style={{ background: color.value, border: value === color.value ? '3px solid white' : 'none' }}
            title={color.label}
          >
            {value === color.value && (
              <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-lg" />
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="w-9 h-9 rounded-lg border-2 border-dashed flex items-center justify-center hover:border-[#D4A853] transition-colors"
          style={{ borderColor: C.muted }}
          title="Custom color"
        >
          <Plus className="w-4 h-4" style={{ color: C.muted }} />
        </button>
      </div>
      <AnimatePresence>
        {showCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2"
          >
            <input
              type="color"
              value={customColor}
              onChange={handleCustomChange}
              className="w-12 h-10 rounded-lg cursor-pointer"
              style={{ background: 'transparent' }}
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              placeholder="#D4A853"
              className="flex-1 h-10 px-3 rounded-lg bg-[#1A1A24] border border-[#252532] text-[#F5F0E6] text-sm"
            />
            <Button type="button" size="sm" onClick={applyCustomColor} className="h-10 px-4">
              Apply
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const IconPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = ICON_OPTIONS.find(o => o.value === value) || ICON_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-14 px-4 rounded-xl flex items-center gap-3 transition-all duration-200 border-2 hover:border-[#D4A853]/50"
        style={{ background: '#0A0A0F', borderColor: open ? '#D4A853' : '#252532' }}
      >
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${form.color}20` }}>
          <selected.icon className="w-5 h-5" style={{ color: form.color }} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-[#F5F0E6]">{selected.label}</p>
          <p className="text-xs" style={{ color: C.muted }}>Click to change</p>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: C.muted }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 p-2 rounded-xl shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto"
            style={{ background: '#1A1A24', border: `1px solid ${C.goldBorder}` }}
          >
            <div className="grid grid-cols-5 gap-1">
              {ICON_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => { onChange(option.value); setOpen(false); }}
                  className={`p-3 rounded-lg flex flex-col items-center gap-1.5 hover:bg-[#252532] transition-colors ${
                    value === option.value ? 'bg-[#252532]' : ''
                  }`}
                >
                  <option.icon className="w-6 h-6" style={{ color: form.color }} />
                  <span className="text-[10px] text-[#A8A099]">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

let form = { color: C.gold };

const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmText, isDanger }) => {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
        style={{ background: C.charcoal, border: `1px solid ${C.goldBorder}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDanger ? 'bg-red-500/20' : 'bg-[#D4A853]/20'}`}>
            {isDanger ? <Trash2 className="w-8 h-8 text-red-500" /> : <CheckCircle2 className="w-8 h-8 text-[#D4A853]" />}
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: C.ivory }}>{title}</h3>
          <p className="mb-6" style={{ color: C.muted }}>{message}</p>
          <div className="flex gap-3">
            <Button onClick={onClose} className="flex-1 h-12 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.goldBorder}`, color: C.ivory }}>
              Cancel
            </Button>
            <Button onClick={onConfirm} className="flex-1 h-12 rounded-xl font-bold" style={{ background: isDanger ? C.danger : `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`, color: isDanger ? 'white' : C.obsidian }}>
              {confirmText}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CategoryCard = ({ category, onEdit, onDelete, onToggle, onDuplicate, index }) => {
  const IconComponent = ICON_OPTIONS.find(o => o.value === category.icon)?.icon || Code;
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl overflow-hidden"
      style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${category.color}, ${category.color}80)` }} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${category.color}20` }}>
              <IconComponent className="w-6 h-6" style={{ color: category.color }} />
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: C.ivory }}>{category.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: category.isActive ? `${C.green}20` : `${C.danger}20`, color: category.isActive ? C.green : C.danger }}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showActions ? 1 : 0 }}
            className="flex gap-1"
          >
            <button onClick={() => onDuplicate(category)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#252532] transition-colors" title="Duplicate">
              <Copy className="w-4 h-4" style={{ color: C.muted }} />
            </button>
            <button onClick={() => onToggle(category._id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#252532] transition-colors" title={category.isActive ? 'Deactivate' : 'Activate'}>
              {category.isActive ? <EyeOff className="w-4 h-4" style={{ color: C.muted }} /> : <Eye className="w-4 h-4" style={{ color: C.green }} />}
            </button>
          </motion.div>
        </div>

        {category.description && (
          <p className="text-sm mb-3 line-clamp-2" style={{ color: C.muted }}>{category.description}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          {(category.topics || []).slice(0, 3).map((topic, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: `${category.color}15`, color: category.color }}>
              {topic}
            </span>
          ))}
          {(category.topics || []).length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: C.surfaceLight, color: C.muted }}>
              +{category.topics.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: C.goldBorder }}>
          <div className="flex gap-3 text-xs" style={{ color: C.muted }}>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> {category.topics?.length || 0}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> {category.projects?.length || 0}
            </span>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => onEdit(category)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-[#252532]"
              style={{ color: C.gold, border: `1px solid ${C.goldBorder}` }}
            >
              <Edit className="w-3 h-3 inline mr-1" />
              Edit
            </button>
            <button
              onClick={() => onDelete(category._id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-red-500/10"
              style={{ color: C.danger }}
            >
              <Trash2 className="w-3 h-3 inline" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [confirmSeed, setConfirmSeed] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedingInternships, setSeedingInternships] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API.category}/all`, { withCredentials: true });
      setCategories(res.data.categories || []);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(cat =>
    cat.name?.toLowerCase().includes(search.toLowerCase()) ||
    cat.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const stats = {
    total: categories.length,
    active: categories.filter(c => c.isActive).length,
    inactive: categories.filter(c => !c.isActive).length,
    totalTopics: categories.reduce((sum, c) => sum + (c.topics?.length || 0), 0),
    totalProjects: categories.reduce((sum, c) => sum + (c.projects?.length || 0), 0),
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ ...DEFAULT_FORM });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      icon: category.icon || 'Code',
      color: category.color || '#D4A853',
      topics: category.topics || [],
      projects: category.projects || [],
      description: category.description || '',
      order: category.order || 0,
      isActive: category.isActive ?? true,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDuplicate = (category) => {
    setEditingCategory(null);
    setFormData({
      name: `${category.name} (Copy)`,
      icon: category.icon || 'Code',
      color: category.color || '#D4A853',
      topics: [...(category.topics || [])],
      projects: [...(category.projects || [])],
      description: category.description || '',
      order: (category.order || 0) + 1,
      isActive: true,
    });
    setErrors({});
    setShowModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    if (formData.topics.length === 0) newErrors.topics = 'Add at least one topic';
    if (formData.projects.length === 0) newErrors.projects = 'Add at least one project';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setSaving(true);
      if (editingCategory) {
        const res = await axios.put(`${API.category}/update/${editingCategory._id}`, formData, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
        if (res.data.success) {
          toast.success('Category updated successfully');
          fetchCategories();
          setShowModal(false);
        }
      } else {
        const res = await axios.post(`${API.category}/create`, formData, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
        if (res.data.success) {
          toast.success('Category created successfully');
          fetchCategories();
          setShowModal(false);
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${API.category}/delete/${confirmDelete.id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success('Category deleted successfully');
        fetchCategories();
      }
    } catch (err) {
      toast.error('Error deleting category');
    }
    setConfirmDelete({ open: false, id: null });
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.patch(`${API.category}/toggle/${id}`, {}, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchCategories();
      }
    } catch (err) {
      toast.error('Error toggling category status');
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await axios.post(`${API.category}/seed`, {}, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchCategories();
      }
    } catch (err) {
      toast.error('Error seeding categories');
    }
    setSeeding(false);
    setConfirmSeed(false);
  };

  const handleSeedInternships = async () => {
    setSeedingInternships(true);
    try {
      const res = await axios.post(`${API.job}/seed-internships`, {}, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || 'Error seeding internships');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error seeding internships');
    }
    setSeedingInternships(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center animate-pulse"
              style={{ background: `linear-gradient(135deg,${C.gold},${C.goldLight})` }}>
              <Tags size={32} style={{ color: C.obsidian }} />
            </div>
            <p style={{ color: C.muted }}>Loading categories...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})` }}>
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(40%,-40%)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${C.obsidian}, transparent)`, transform: 'translate(-30%,30%)' }} />
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                    <Tags className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-white mb-1">Category Management</h1>
                    <p className="text-white/80 text-lg">Manage internship categories & tracks</p>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button onClick={() => setConfirmSeed(true)} variant="ghost" className="h-12 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Seed Defaults
                  </Button>
                  <Button onClick={handleSeedInternships} variant="ghost" className="h-12 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    {seedingInternships ? 'Creating...' : 'Create Internships'}
                  </Button>
                  <Button onClick={() => navigate('/category')} variant="ghost" className="h-12 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white">
                    <Eye className="w-5 h-5 mr-2" />
                    View Public
                  </Button>
                  <Button onClick={openCreateModal} className="h-12 px-6 rounded-xl font-bold shadow-xl" style={{ background: C.obsidian, color: C.gold }}>
                    <Plus className="w-5 h-5 mr-2" />
                    Add Category
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 mt-6 flex-wrap">
                <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
                  <span className="text-white/60 text-xs">Total</span>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
                  <span className="text-white/60 text-xs">Active</span>
                  <p className="text-2xl font-bold text-white">{stats.active}</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
                  <span className="text-white/60 text-xs">Topics</span>
                  <p className="text-2xl font-bold text-white">{stats.totalTopics}</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
                  <span className="text-white/60 text-xs">Projects</span>
                  <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: C.muted }} />
            <Input className="pl-12 h-12 border-2 rounded-xl transition-all"
              style={{ background: C.surface, borderColor: C.goldBorder, color: C.ivory }}
              placeholder="Search categories..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-12 px-4 rounded-xl" style={{ borderColor: C.goldBorder, color: C.ivory }}
              onClick={() => setSearch('')}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedCategories.map((category, index) => (
            <CategoryCard
              key={category._id}
              category={category}
              index={index}
              onEdit={openEditModal}
              onDelete={(id) => setConfirmDelete({ open: true, id })}
              onToggle={handleToggleStatus}
              onDuplicate={handleDuplicate}
            />
          ))}
        </motion.div>

        {totalPages > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}`, color: C.ivory }}
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
            {getPageNumbers().map((page, i) => (
              <button
                key={i}
                onClick={() => page !== '...' && setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-all ${
                  currentPage === page ? '' : 'hover:opacity-70'
                }`}
                style={{
                  background: currentPage === page ? `linear-gradient(135deg, ${C.gold}, ${C.goldDark})` : C.surface,
                  color: currentPage === page ? C.obsidian : C.ivory,
                  border: `1px solid ${currentPage === page ? 'transparent' : C.goldBorder}`
                }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}`, color: C.ivory }}
            >
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </button>
          </motion.div>
        )}

        <div className="text-center mt-4" style={{ color: C.muted }}>
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCategories.length)} of {filteredCategories.length} categories
        </div>

        {filteredCategories.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-28 h-28 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-xl"
              style={{ background: C.goldDim }}>
              <Tags size={56} style={{ color: C.gold }} />
            </div>
            <h3 className="text-2xl font-black mb-2" style={{ color: C.ivory }}>
              {search ? 'No categories found' : 'No categories yet'}
            </h3>
            <p style={{ color: C.muted }}>
              {search ? 'Try a different search term' : 'Create your first category to get started'}
            </p>
            {!search && (
              <Button onClick={openCreateModal} className="mt-6 h-12 px-8 rounded-xl font-bold" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`, color: C.obsidian }}>
                <Plus className="w-5 h-5 mr-2" />
                Create Category
              </Button>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
              style={{ background: C.charcoal, border: `1px solid ${C.goldBorder}` }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 p-5 border-b" style={{ borderColor: C.goldBorder, background: C.charcoal }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${formData.color}20` }}>
                      {React.createElement(ICON_OPTIONS.find(o => o.value === formData.icon)?.icon || Code, { className: "w-6 h-6", style: { color: formData.color } })}
                    </div>
                    <div>
                      <h2 className="text-xl font-black" style={{ color: C.ivory }}>
                        {editingCategory ? 'Edit Category' : 'Create New Category'}
                      </h2>
                      <p className="text-sm" style={{ color: C.muted }}>
                        {editingCategory ? 'Update category details' : 'Fill in the details below'}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl" onClick={() => setShowModal(false)}>
                    <X className="w-5 h-5" style={{ color: C.muted }} />
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: C.ivory }}>
                    Category Name <span style={{ color: C.danger }}>*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Web Development"
                    className={`h-12 border-2 rounded-xl bg-[#0A0A0F] text-[#F5F0E6] ${errors.name ? 'border-red-500' : 'border-[#252532] focus:border-[#D4A853]'}`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: C.ivory }}>Icon</label>
                    <IconPicker value={formData.icon} onChange={(v) => setFormData({ ...formData, icon: v })} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: C.ivory }}>Color</label>
                    <ColorPicker value={formData.color} onChange={(v) => setFormData({ ...formData, color: v })} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: C.ivory }}>Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this category..."
                    rows={2}
                    className="rounded-xl border-2 border-[#252532] focus:border-[#D4A853] bg-[#0A0A0F] text-[#F5F0E6] text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: C.ivory }}>
                    Topics <span style={{ color: C.danger }}>*</span>
                  </label>
                  <TagInput
                    value={formData.topics}
                    onChange={(v) => { setFormData({ ...formData, topics: v }); if (errors.topics) setErrors({ ...errors, topics: null }); }}
                    placeholder="Type topic and press Enter (e.g. React, Node.js)"
                    icon={BookOpen}
                    color={formData.color}
                    maxTags={50}
                  />
                  {errors.topics && <p className="text-xs text-red-500 mt-1">{errors.topics}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: C.ivory }}>
                    Projects <span style={{ color: C.danger }}>*</span>
                  </label>
                  <TagInput
                    value={formData.projects}
                    onChange={(v) => { setFormData({ ...formData, projects: v }); if (errors.projects) setErrors({ ...errors, projects: null }); }}
                    placeholder="Type project and press Enter (e.g. Portfolio Website)"
                    icon={Briefcase}
                    color={formData.color}
                    maxTags={10}
                  />
                  {errors.projects && <p className="text-xs text-red-500 mt-1">{errors.projects}</p>}
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${formData.color}10`, border: `1px solid ${formData.color}30` }}>
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded"
                    style={{ accentColor: formData.color }}
                  />
                  <label htmlFor="isActive" className="text-sm font-medium cursor-pointer" style={{ color: C.ivory }}>
                    Active (visible to users)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: C.goldBorder }}>
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}
                    className="h-12 px-6 rounded-xl" style={{ borderColor: C.goldBorder, color: C.ivory }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}
                    className="h-12 px-8 rounded-xl font-bold shadow-xl"
                    style={{ background: `linear-gradient(135deg, ${formData.color}, ${C.accent})`, color: C.obsidian }}>
                    {saving ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving... </>
                    ) : (
                      <><Check className="w-5 h-5 mr-2" /> {editingCategory ? 'Update' : 'Create'} Category </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        isDanger
      />

      <ConfirmDialog
        open={confirmSeed}
        onClose={() => setConfirmSeed(false)}
        onConfirm={handleSeed}
        title="Seed Default Categories"
        message="This will add 15 default internship categories. Existing categories won't be affected."
        confirmText={seeding ? "Seeding..." : "Seed Now"}
      />
    </AdminLayout>
  );
};

export default AdminCategories;
