import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut, Home, ChevronRight,
  Edit3, FileText, GraduationCap,
  UserCircle, Sparkles, Briefcase,
  Video, BookOpen, Settings, Bell, HelpCircle,
  Brain, ScanLine, Zap,
  ListChecks, FolderKanban, Bookmark
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API } from '@/config/api';

// ── Nav groups config (outside component — never recreated) ───────────────────
const menuGroups = [
  {
    label: 'Overview',
    items: [
      { icon: Home,          label: 'Home',         path: '/',                          color: '#60a5fa', glow: 'rgba(96,165,250,0.35)'   },
      { icon: Sparkles,     label: 'Dashboard',    path: '/user/dashboard',            color: '#a78bfa', glow: 'rgba(167,139,250,0.35)'  },
    ],
  },
  {
    label: 'Career',
    items: [
      { icon: Briefcase,     label: 'Jobs',          path: '/user/jobs',                color: '#2dd4bf', glow: 'rgba(45,212,191,0.35)'   },
      { icon: Bookmark,      label: 'Saved Jobs',    path: '/user/saved-jobs',          color: '#fbbf24', glow: 'rgba(251,191,36,0.35)'  },
      { icon: Brain,        label: 'Quizzes',        path: '/user/quiz',                color: '#34d399', glow: 'rgba(52,211,153,0.35)'   },
      { icon: FileText,     label: 'Resume',        path: '/user/resume',              color: '#67e8f9', glow: 'rgba(103,232,249,0.35)'  },
      { icon: GraduationCap,label: 'Internships',   path: '/user/internship',          color: '#f59e0b', glow: 'rgba(245,158,11,0.35)'   },
      { icon: ScanLine,     label: 'ATS Checker',   path: '/user/ats',                 color: '#818cf8', glow: 'rgba(129,140,248,0.35)'  },
    ],
  },
  {
    label: 'Learning',
    items: [
      { icon: BookOpen,     label: 'Courses',        path: '/user/learning',           color: '#f97316', glow: 'rgba(249,115,22,0.35)'   },
      { icon: ListChecks,   label: 'Quiz Results',   path: '/user/quiz',               color: '#8b5cf6', glow: 'rgba(139,92,246,0.35)'  },
    ],
  },
  {
    label: 'Tools',
    items: [
      { icon: FolderKanban,label: 'Kanban Board',   path: '/user/kanban',              color: '#14b8a6', glow: 'rgba(20,184,166,0.35)'  },
    ],
  },
  {
    label: 'Account',
    items: [
      { icon: UserCircle,   label: 'Profile',       path: '/user/profile',            color: '#f472b6', glow: 'rgba(244,114,182,0.35)' },
      { icon: Edit3,       label: 'Edit Profile',  path: '/user/profile/edit',      color: '#a78bfa', glow: 'rgba(167,139,250,0.35)' },
    ],
  },
];

// ── NavItem — outside component so it is never redefined on render ────────────
function NavItem({ item, collapsed, isActive, onNavigate }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onNavigate(item.path)}
      title={collapsed ? item.label : undefined}
      className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl
                 transition-all duration-200 group"
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${item.color}22, ${item.color}11)`
          : 'transparent',
        border: isActive
          ? `1px solid ${item.color}33`
          : '1px solid transparent',
      }}
    >
      {/* Active left bar */}
      {isActive && (
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
          style={{ background: item.color, boxShadow: `0 0 8px ${item.glow}` }}
        />
      )}

      {/* Icon */}
      <span
        className="flex-shrink-0 w-9 h-9 flex items-center justify-center
                   rounded-xl transition-all duration-200"
        style={{
          background: isActive ? `${item.color}22` : 'rgba(255,255,255,0.04)',
          boxShadow:  isActive ? `0 0 12px ${item.glow}` : 'none',
        }}
      >
        <item.icon
          size={17}
          style={{ color: isActive ? item.color : '#ffffff' }}
          className="group-hover:scale-110 transition-transform duration-200"
        />
      </span>

      {/* Label */}
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
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
}

// ── Main component ─────────────────────────────────────────────────────────────
const UserSidebar = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);

  const checkActive = (path) => {
    const p = location.pathname;
    if (path === '/') return p === '/';
    return p === path || p.startsWith(path + '/');
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${API.user}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate('/');
        toast.success(res.data.message);
      }
    } catch {
      dispatch(setUser(null));
      navigate('/login');
    }
  };

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  // ── Shared inner content ─────────────────────────────────────────────────────
  const content = (
    <div
      className="flex flex-col h-full"
      style={{ background: 'linear-gradient(180deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)' }}
    >

      {/* Brand + collapse */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 pt-5 pb-4">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="full"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2.5"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow: '0 0 16px rgba(124,58,237,0.5)' }}
              >
                <Sparkles size={14} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-black text-white leading-tight">GrowX</p>
                <p className="text-[10px] font-medium text-white/50">Student Panel</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow: '0 0 16px rgba(124,58,237,0.5)' }}
            >
              <Sparkles size={14} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle — desktop only */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setCollapsed(p => !p)}
          className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center
                     transition-colors flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b' }}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronRight size={14} />
          </motion.div>
        </motion.button>
      </div>

      {/* Profile card */}
      <div className="flex-shrink-0 mx-3 mb-4">
        <motion.div
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => handleNav('/user/profile')}
          className="relative cursor-pointer rounded-2xl overflow-hidden p-3 transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div
            className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-xl opacity-30"
            style={{ background: 'radial-gradient(circle,#7c3aed,transparent)' }}
          />

          <div className={`relative flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="relative flex-shrink-0">
              <Avatar className="w-10 h-10 ring-2 ring-purple-500/30">
                <AvatarImage src={user?.profile?.profilePhoto} className="object-cover" />
                <AvatarFallback
                  className="text-white font-black text-base"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
                >
                  {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2"
                style={{ borderColor: '#0f172a' }}
              />
            </div>

            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-bold text-white truncate leading-tight">
                    {user?.fullname || 'User'}
                  </p>
                  <p className="text-xs truncate mt-0.5 text-white/50">
                    {user?.email || ''}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!collapsed && (
              <div
                className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <Edit3 size={11} className="text-white/50" />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-3 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-2 space-y-3 scrollbar-none py-1">
        {menuGroups.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-bold uppercase tracking-widest px-3 pb-1.5 pt-1 text-white/40">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavItem
                  key={item.path}
                  item={item}
                  collapsed={collapsed}
                  isActive={checkActive(item.path)}
                  onNavigate={handleNav}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-4 mt-3 mb-3 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Logout */}
      <div className="flex-shrink-0 px-2 pb-5">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleLogout}
          title={collapsed ? 'Sign Out' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl
                     transition-all duration-200 group"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
        >
          <span
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-all"
            style={{ background: 'rgba(239,68,68,0.12)' }}
          >
            <LogOut size={16} className="text-red-400 group-hover:scale-110 transition-transform" />
          </span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="text-sm font-semibold text-red-400"
              >
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
      {/* Desktop — sticky, collapsible */}
      <motion.aside
        animate={{ width: collapsed ? 70 : 256 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex lg:flex-col flex-shrink-0 h-screen sticky top-0 overflow-hidden"
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        {content}
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden backdrop-blur-sm"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 left-0 h-full w-64 z-50 lg:hidden shadow-2xl"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserSidebar;