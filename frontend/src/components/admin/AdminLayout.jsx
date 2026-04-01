import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import AdminSidebar from './AdminSidebar';
import GrowXLogo from '../shared/GrowXLogo';
import AIChatAssistant from '../shared/AIChatAssistant';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#0D1017",
  surface: "#151820",
  card: "#1A1D26",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldBorder: "rgba(212,168,83,0.15)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
};

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector(s => s.auth);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: C.charcoal }}>

      {/* ── Top Navbar ── */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-5 h-14 border-b"
        style={{ background: C.obsidian, borderColor: C.goldBorder }}>

        {/* Logo */}
        <GrowXLogo size={32} />

        <div className="flex items-center gap-3">
          {/* Profile — tablet & desktop only */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Avatar className="w-8 h-8 ring-2" style={{ ringColor: C.goldBorder }}>
              <AvatarImage src={user?.profile?.profilePhoto} className="object-cover" />
              <AvatarFallback className="text-white text-xs font-black"
                style={{ background: `linear-gradient(135deg,${C.gold},${C.goldLight})` }}>
                {user?.fullname?.charAt(0)?.toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
           
            </div>
          </div>

          {/* Menu icon — mobile only */}
          <motion.button whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(p => !p)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: C.goldBorder }}>
            <AnimatePresence mode="wait">
              {mobileOpen
                ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={18} style={{ color: C.white }} /></motion.span>
                : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Menu size={18} style={{ color: C.white }} /></motion.span>
              }
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0">
        <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <main className="flex-1 min-w-0 px-4 sm:px-5 md:px-6 py-4 md:py-6 overflow-auto">
          {children}
        </main>
      </div>

      <AIChatAssistant />
    </div>
  );
};

export default AdminLayout;

