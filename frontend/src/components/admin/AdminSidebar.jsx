import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Brain, Briefcase, Settings, LogOut, Menu, X,
  Home, BarChart2, Crown, ChevronRight,
  Edit3, Users, BookOpen, TrendingUp, Building2,
  Plus, FileText, ClipboardList, UserCheck, PlusCircle, FilePlus, ListChecks, Send, GraduationCap, FileSearch, MessageSquare,
  Video, Calendar, FileQuestion, BarChart, Code, Tags, ArrowLeft, ExternalLink,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API } from '@/config/api';

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

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);

  const menuGroups = [
    {
      label: 'Overview',
      items: [
        { icon: Home,          label: 'Dashboard',     path: '/admin/dashboard',        color: '#60a5fa', glow: 'rgba(96,165,250,0.35)' },
        { icon: BarChart2,    label: 'Analytics',     path: '/admin/analytics',        color: '#38bdf8', glow: 'rgba(56,189,248,0.35)' },
        { icon: Users,        label: 'Users',         path: '/admin/users',            color: '#f472b6', glow: 'rgba(244,114,182,0.35)' },
      ],
    },
    {
      label: 'Jobs',
      items: [
        { icon: PlusCircle,   label: 'Create Job',       path: '/admin/jobs/create',        color: '#4ade80', glow: 'rgba(74,222,128,0.35)' },
        { icon: Briefcase,     label: 'All Jobs',          path: '/admin/all-jobs',           color: '#34d399', glow: 'rgba(52,211,153,0.35)' },
        { icon: Send,          label: 'Applications',       path: '/admin/job-applications',   color: '#2dd4bf', glow: 'rgba(45,212,191,0.35)' },
      ],
    },
    {
      label: 'Quizzes',
      items: [
        { icon: BookOpen,    label: 'All Quizzes',    path: '/admin/all-quizzes',      color: '#a78bfa', glow: 'rgba(167,139,250,0.35)' },
        { icon: ListChecks,  label: 'Quiz Access',    path: '/admin/quiz-access',      color: '#f0abfc', glow: 'rgba(240,171,252,0.35)' },
        { icon: Brain,       label: 'Create Quiz',    path: '/admin/quizzes/create',   color: '#c084fc', glow: 'rgba(192,132,252,0.35)' },
      ],
    },
    {
      label: 'Resumes & ATS',
      items: [
        { icon: FileText,    label: 'All Resumes',    path: '/admin/resumes',          color: '#67e8f9', glow: 'rgba(103,232,249,0.35)' },
        { icon: FileSearch,  label: 'ATS Checker',    path: '/admin/ats',             color: '#818cf8', glow: 'rgba(129,140,248,0.35)' },
      ],
    },
    {
      label: 'Internships',
      items: [
        { icon: GraduationCap,label: 'Applications',   path: '/admin/internships',      color: '#38bdf8', glow: 'rgba(56,189,248,0.35)' },
        { icon: Tags,        label: 'Categories',       path: '/admin/categories',       color: '#f59e0b', glow: 'rgba(245,158,11,0.35)' },
        { icon: BookOpen,   label: 'View Internships', path: '/category',               color: '#10b981', glow: 'rgba(16,185,129,0.35)', external: true },
      ],
    },
    {
      label: 'AI Assistant',
      items: [
        { icon: MessageSquare,label: 'Chat History', path: '/admin/ai-chat',          color: '#f59e0b', glow: 'rgba(245,158,11,0.35)' },
        { icon: BarChart2,   label: 'Analytics',     path: '/admin/analytics',        color: '#60a5fa', glow: 'rgba(96,165,250,0.35)' },
      ],
    },
    {
      label: 'Company',
      items: [
        { icon: Building2,   label: 'Companies',      path: '/admin/companies',       color: '#fb923c', glow: 'rgba(251,146,60,0.35)' },
        { icon: PlusCircle,  label: 'Add Company',   path: '/admin/companies/create',color: '#fdba74', glow: 'rgba(253,186,116,0.35)' },
      ],
    },
    {
      label: 'Account',
      items: [
        { icon: Settings,   label: 'Settings',       path: '/admin/settings',        color: '#94a3b8', glow: 'rgba(148,163,184,0.35)' },
      ],
    },
  ];
  const menuItems = menuGroups.flatMap(g => g.items);

  const isItemActive = (item) => {
    const p = location.pathname;
    if (item.path === '/admin/jobs')      return p === '/admin/jobs';
    if (item.path === '/admin/quizzes')   return p === '/admin/quizzes';
    if (item.path === '/admin/companies') return p === '/admin/companies';
    return p === item.path || p.startsWith(item.path + '/');
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${API.user}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate('/');
        toast.success(res.data.message);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Logout failed');
    }
  };

  const NavItem = ({ item, onClick }) => {
    const isActive = isItemActive(item);
    
    const handleClick = () => {
      if (item.external) {
        window.open(item.path, '_blank');
      } else {
        navigate(item.path);
      }
      onClick?.();
    };
    
    return (
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={handleClick}
        title={collapsed ? item.label : undefined}
        className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 group"
        style={{
          background: isActive ? `linear-gradient(135deg, ${item.color}22, ${item.color}11)` : 'transparent',
          border: isActive ? `1px solid ${item.color}33` : '1px solid transparent',
        }}
      >
        {/* Active left bar */}
        {isActive && (
          <motion.div layoutId="activeBar"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
            style={{ background: item.color, boxShadow: `0 0 8px ${item.glow}` }}
          />
        )}

        {/* Icon */}
        <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
          style={{
            background: isActive ? `${item.color}22` : 'rgba(255,255,255,0.04)',
            boxShadow: isActive ? `0 0 12px ${item.glow}` : 'none',
          }}>
          <item.icon size={17}
            style={{ color: isActive ? item.color : '#ffffff' }}
            className="group-hover:scale-110 transition-transform duration-200"
          />
        </span>

        {/* Label */}
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }}
              className="flex-1 text-left text-sm font-semibold truncate"
              style={{ color: isActive ? item.color : '#ffffff' }}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Chevron */}
        {!collapsed && isActive && (
          <ChevronRight size={13} style={{ color: item.color }} className="flex-shrink-0" />
        )}
      </motion.button>
    );
  };

  const SidebarContent = ({ onNav }) => (
    <div className="flex flex-col h-full"
      style={{ background: `linear-gradient(180deg, ${C.obsidian} 0%, ${C.charcoal} 50%, ${C.obsidian} 100%)` }}>

      {/* ── Top: Brand + Collapse ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 pt-5 pb-4">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div key="brand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, boxShadow: `0 0 16px ${C.goldDim}` }}>
                <Crown size={14} style={{ color: C.obsidian }} />
              </div>
              <div>
                <p className="text-sm font-black text-white leading-tight">GrowX</p>
                <p className="text-[10px] font-medium" style={{ color: C.muted }}>Admin Panel</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto"
              style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, boxShadow: `0 0 16px ${C.goldDim}` }}>
              <Crown size={14} style={{ color: C.obsidian }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle — desktop only */}
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCollapsed(p => !p)}
          className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center transition-colors flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronRight size={14} />
          </motion.div>
        </motion.button>
      </div>

      {/* ── Profile Card ── */}
      <div className={`flex-shrink-0 mx-3 mb-4 ${collapsed ? 'px-0' : ''}`}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => { navigate('/admin/settings'); onNav?.(); }}
          className="relative cursor-pointer rounded-2xl overflow-hidden p-3 transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>

          {/* Glow blob */}
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-xl opacity-30"
            style={{ background: `radial-gradient(circle, ${C.gold}, transparent)` }} />

          <div className={`relative flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="relative flex-shrink-0">
              <Avatar className="w-10 h-10 ring-2" style={{ ringColor: C.goldBorder }}>
                <AvatarImage src={user?.profile?.profilePhoto} className="object-cover" />
                <AvatarFallback className="text-white font-black text-base"
                  style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` }}>
                  {user?.fullname?.charAt(0)?.toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2"
                style={{ borderColor: '#0f172a' }} />
            </div>

            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }} className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate leading-tight">
                    {user?.fullname || 'Admin User'}
                  </p>
                  <p className="text-xs truncate mt-0.5 text-white/50">
                    {user?.email || 'admin@growx.com'}
                  </p>

                </motion.div>
              )}
            </AnimatePresence>

            {!collapsed && (
              <div className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.08)' }}>
                <Edit3 size={11} className="text-white/50" />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Back Button ── */}
      <div className="px-3 mb-3">
        <motion.button whileTap={{ scale: 0.96 }}
          onClick={() => { window.open('/', '_blank'); onNav?.(); }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 group border"
          style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}>
          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all"
            style={{ background: 'rgba(16,185,129,0.15)' }}>
            <ExternalLink size={14} style={{ color: '#10b981' }} />
          </span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="text-sm font-semibold" style={{ color: '#10b981' }}>
                View Site
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 mb-3 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* ── Nav Items ── */}
      <div className="flex-1 overflow-y-auto px-2 space-y-3 scrollbar-none py-1">
        {menuGroups.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-bold uppercase tracking-widest px-3 pb-1.5 pt-1 text-white/40">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item, idx) => (
                <NavItem key={`${item.path}-${idx}`} item={item} onClick={onNav} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 mt-3 mb-3 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* ── Logout ── */}
      <div className="flex-shrink-0 px-2 pb-5">
        <motion.button whileTap={{ scale: 0.96 }} onClick={handleLogout}
          title={collapsed ? 'Sign Out' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 group"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-all"
            style={{ background: 'rgba(239,68,68,0.12)' }}>
            <LogOut size={16} className="text-red-400 group-hover:scale-110 transition-transform" />
          </span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="text-sm font-semibold text-red-400">
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

    </div>
  );

  return (
    <>

      {/* ── Desktop Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 70 : 256 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex lg:flex-col flex-shrink-0 h-screen sticky top-0 overflow-hidden"
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <SidebarContent />
      </motion.aside>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden backdrop-blur-sm"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 left-0 h-full w-64 z-50 lg:hidden shadow-2xl">
              <SidebarContent onNav={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
