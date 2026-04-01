import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage } from '../ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import GrowXLogo from './GrowXLogo';
import {
  GraduationCap, Brain, Trello, FileText, Briefcase,
  Search, LayoutDashboard, LogOut, Sparkles,
  Building2, ChevronDown, X, Menu, ScanLine, Code2,
} from 'lucide-react';
import { API } from '@/config/api';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
  surface: "#1A1A24",
  surfaceLight: "#252532",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDark: "#B8923F",
  ivory: "#F5F0E6",
  accent: "#C8884A",
  goldBorder: "rgba(212,168,83,0.15)",
  goldDim: "rgba(212,168,83,0.08)",
  white: "#FAFAF8",
};

const MAIN_NAV = [
  { path: '/',                    label: 'Learning',   icon: GraduationCap },
  { path: '/quiz',                label: 'Quiz',       icon: Brain         },
  { path: '/resume',              label: 'Resume',     icon: FileText      },
  { path: '/internship',          label: 'Internship', icon: Briefcase     },
  { path: '/atschecker',         label: 'ATS',        icon: ScanLine      },
  { path: '/KanbanBoard',        label: 'Kanban',     icon: Trello        },
];

const JOB_NAV = [
  { path: '/job',    label: 'Job Portal', icon: Briefcase, sub: 'Browse open positions' },
  { path: '/joball', label: 'All Jobs',   icon: Building2, sub: 'View every listing'    },
];

function JobDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        style={{
          background: open ? C.goldDim : 'transparent',
          border: `1px solid ${open ? C.gold : 'transparent'}`,
        }}
        className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl
                    transition-all duration-200 ${open ? 'text-amber-400' : 'text-gray-300'} hover:text-amber-400`}>
        <Search className="w-4 h-4" style={{ color: open ? C.gold : 'currentColor' }} />
        Jobs
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: open ? C.gold : 'currentColor' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              background: C.surface,
              border: `1px solid ${C.goldBorder}`,
              boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${C.goldDim}`,
            }}
            className="absolute top-full left-0 mt-2 w-56 rounded-2xl overflow-hidden z-50">
            {JOB_NAV.map(item => (
              <NavLink key={item.path} to={item.path} onClick={() => setOpen(false)}
                style={({ isActive }) => ({
                  background: isActive ? C.goldDim : 'transparent',
                  borderLeft: isActive ? `3px solid ${C.gold}` : '3px solid transparent',
                })}
                className={`flex items-start gap-3 px-4 py-3 transition-all duration-200
                           text-gray-300 hover:text-amber-400`}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: C.goldDim }}>
                  <item.icon className="w-4 h-4" style={{ color: C.gold }} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs" style={{ color: C.ivoryMuted }}>{item.sub}</p>
                </div>
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        style={{ border: `2px solid ${C.goldBorder}` }}
        className="flex items-center rounded-xl transition-all duration-200 hover:border-amber-400/50 p-1">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.profile?.profilePhoto || '/default-avatar.png'} alt={user?.fullname} />
        </Avatar>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              background: C.surface,
              border: `1px solid ${C.goldBorder}`,
              boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 20px ${C.goldDim}`,
            }}
            className="absolute top-full right-0 mt-2 w-64 rounded-2xl overflow-hidden z-50">

            <div className="px-4 py-3"
              style={{
                borderBottom: `1px solid ${C.goldBorder}`,
                background: `linear-gradient(135deg, ${C.goldDim} 0%, ${C.surface} 100%)`,
              }}>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 ring-2" style={{ ringColor: C.goldBorder }}>
                  <AvatarImage src={user?.profile?.profilePhoto || '/default-avatar.png'} />
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-100 truncate">{user?.fullname}</p>
                  <p className="text-xs truncate capitalize" style={{ color: C.gold }}>{user?.role}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              {user?.role !== 'admin' && user?.role !== 'recruiter' && (
                <>
                  <Link to="/user/dashboard" onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold
                               text-gray-300 hover:text-amber-400 transition-all duration-200"
                    style={{}}
                    onMouseEnter={(e) => e.currentTarget.style.background = C.goldDim}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <LayoutDashboard className="w-4 h-4" style={{ color: C.gold }} />
                    My Dashboard
                  </Link>
                </>
              )}
              {(user?.role === 'admin' || user?.role === 'recruiter') && (
                <Link to="/admin/dashboard" onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold
                             text-gray-300 hover:text-amber-400 transition-all duration-200"
                  onMouseEnter={(e) => e.currentTarget.style.background = C.goldDim}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <LayoutDashboard className="w-4 h-4" style={{ color: C.gold }} />
                  Admin Dashboard
                </Link>
              )}
              <button onClick={() => { onLogout(); setOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold
                           text-gray-300 hover:text-red-400 transition-all duration-200"
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const { user }  = useSelector(s => s.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${API.user}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate('/');
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Logout failed');
    }
  };

  useEffect(() => { setOpen(false); }, [navigate]);

  return (
    <>
      <nav style={{
        background: `linear-gradient(180deg, ${C.charcoal} 0%, ${C.obsidian} 100%)`,
        borderBottom: `1px solid ${C.goldBorder}`,
        boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 30px ${C.goldDim}`,
      }}
        className="backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16
                        flex items-center justify-between gap-4">

          <Link to="/" className="shrink-0">
            <GrowXLogo size={36} />
          </Link>

          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {user && user?.role !== 'admin' && user?.role !== 'recruiter' && (
              <>
                {MAIN_NAV.map(item => (
                  <NavLink key={item.path} to={item.path}
                    style={({ isActive }) => ({
                      background: isActive ? C.goldDim : 'transparent',
                      border: isActive ? `1px solid ${C.gold}` : '1px solid transparent',
                      color: isActive ? C.gold : 'rgb(209,213,219)',
                    })}
                    className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl
                               transition-all duration-200 hover:text-amber-400">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </NavLink>
                ))}
                <JobDropdown />
              </>
            )}
            {(user?.role === 'admin' || user?.role === 'recruiter') && (
              <Link to="/admin/dashboard"
                className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
                  color: C.obsidian,
                }}>
                <LayoutDashboard className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {!user ? (
              <>
                <Link to="/login">
                  <button
                    className="rounded-full px-5 font-semibold text-sm h-9 transition-all duration-200"
                    style={{
                      border: `2px solid ${C.gold}`,
                      color: C.gold,
                      background: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.goldDim;
                      e.currentTarget.style.borderColor = C.goldLight;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = C.gold;
                    }}>
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button
                    className="rounded-full px-5 h-9 text-sm font-semibold text-gray-900 transition-all duration-200"
                    style={{
                      background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldLight} 100%)`,
                      boxShadow: `0 4px 15px ${C.goldDim}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 6px 20px ${C.goldBorder}`;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 4px 15px ${C.goldDim}`;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <ProfileDropdown user={user} onLogout={handleLogout} />
            )}
          </div>

          <div className="flex lg:hidden">
            <button onClick={() => setOpen(o => !o)}
              className="p-2 rounded-xl transition-all duration-200"
              style={{ color: C.gold }}
              onMouseEnter={(e) => e.currentTarget.style.background = C.goldDim}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 z-40 top-16"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-x-0 top-16 z-50 rounded-b-2xl
                         max-h-[calc(100vh-4rem)] overflow-y-auto"
              style={{
                background: `linear-gradient(180deg, ${C.surface} 0%, ${C.charcoal} 100%)`,
                borderBottom: `1px solid ${C.goldBorder}`,
                boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 30px ${C.goldDim}`,
              }}>

              <div className="p-4 space-y-1">

                {user && (
                  <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${C.goldDim} 0%, ${C.surface} 100%)`,
                      border: `1px solid ${C.goldBorder}`,
                    }}>
                    <Avatar className="w-10 h-10 shrink-0" style={{ border: `2px solid ${C.goldBorder}` }}>
                      <AvatarImage src={user?.profile?.profilePhoto || '/default-avatar.png'} />
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-100 truncate">{user?.fullname}</p>
                      <p className="text-xs truncate capitalize" style={{ color: C.gold }}>
                        {user?.role} · {user?.email}
                      </p>
                    </div>
                  </div>
                )}

                {user && user?.role !== 'admin' && user?.role !== 'recruiter' && (
                  <>
                    <p className="text-xs font-bold uppercase tracking-widest px-3 pt-2 pb-1"
                      style={{ color: C.gold }}>Main</p>
                    {MAIN_NAV.map(item => (
                      <NavLink key={item.path} to={item.path}
                        onClick={() => setOpen(false)}
                        style={({ isActive }) => ({
                          background: isActive ? C.goldDim : 'transparent',
                          borderLeft: isActive ? `3px solid ${C.gold}` : '3px solid transparent',
                        })}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                                   transition-all duration-200 text-gray-300 hover:text-amber-400">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: C.surfaceLight }}>
                          <item.icon className="w-4 h-4" style={{ color: C.gold }} />
                        </div>
                        {item.label}
                      </NavLink>
                    ))}

                    <p className="text-xs font-bold uppercase tracking-widest px-3 pt-3 pb-1"
                      style={{ color: C.gold }}>Job Portal</p>
                    {JOB_NAV.map(item => (
                      <NavLink key={item.path} to={item.path}
                        onClick={() => setOpen(false)}
                        style={({ isActive }) => ({
                          background: isActive ? C.goldDim : 'transparent',
                          borderLeft: isActive ? `3px solid ${C.gold}` : '3px solid transparent',
                        })}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                                   transition-all duration-200 text-gray-300 hover:text-amber-400">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: C.surfaceLight }}>
                          <item.icon className="w-4 h-4" style={{ color: C.gold }} />
                        </div>
                        <div>
                          <p>{item.label}</p>
                          <p className="text-xs font-normal" style={{ color: C.ivoryMuted }}>{item.sub}</p>
                        </div>
                      </NavLink>
                    ))}
                  </>
                )}

                {(user?.role === 'admin' || user?.role === 'recruiter') && (
                  <Link to="/admin/dashboard" onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
                    style={{
                      background: `linear-gradient(135deg, ${C.goldDim} 0%, ${C.surface} 100%)`,
                      border: `1px solid ${C.goldBorder}`,
                      color: C.gold,
                    }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: C.surfaceLight }}>
                      <LayoutDashboard className="w-4 h-4 text-amber-400" />
                    </div>
                    Admin Dashboard
                  </Link>
                )}

                {user && (
                  <>
                    <p className="text-xs font-bold uppercase tracking-widest px-3 pt-3 pb-1"
                      style={{ color: C.gold }}>Account</p>
                    {user?.role !== 'admin' && user?.role !== 'recruiter' && (
                      <Link to="/user/dashboard" onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                                   text-gray-300 hover:text-amber-400 transition-all duration-200"
                        onMouseEnter={(e) => e.currentTarget.style.background = C.goldDim}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: C.surfaceLight }}>
                          <LayoutDashboard className="w-4 h-4" style={{ color: C.gold }} />
                        </div>
                        My Dashboard
                      </Link>
                    )}
                    <button onClick={() => { handleLogout(); setOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold
                                 text-gray-300 hover:text-red-400 transition-all duration-200"
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(239,68,68,0.1)' }}>
                        <LogOut className="w-4 h-4" />
                      </div>
                      Logout
                    </button>
                  </>
                )}
              </div>

              {!user && (
                <div className="p-4 pt-2 grid grid-cols-2 gap-3" style={{ borderTop: `1px solid ${C.goldBorder}` }}>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <button
                      className="w-full h-11 rounded-2xl font-semibold transition-all duration-200"
                      style={{
                        border: `2px solid ${C.gold}`,
                        color: C.gold,
                        background: 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = C.goldDim;
                        e.currentTarget.style.borderColor = C.goldLight;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = C.gold;
                      }}>
                      Login
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    <button
                      className="w-full h-11 rounded-2xl font-semibold text-gray-900 transition-all duration-200"
                      style={{
                        background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldLight} 100%)`,
                        boxShadow: `0 4px 15px ${C.goldDim}`,
                      }}>
                      <Sparkles className="w-4 h-4 mr-1.5 inline" />
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
