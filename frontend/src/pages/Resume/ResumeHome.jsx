import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroSection from "./HeroSection";
import About from "./About";
import StatsSection from "./StatsSection";
import FeedbackSection from "./FeedbackSection";
import FAQSection from "./FAQSection";

const T = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
  surface: "#1A1A24",
  surfaceLight: "#252532",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDark: "#B8923F",
  ivory: "#F5F0E6",
  ivoryMuted: "#A8A099",
  accent: "#C8884A",
  accentGlow: "rgba(212,168,83,0.12)",
  gradient1: "#667eea",
  gradient2: "#764ba2",
};

export default function ResumeHome() {
  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg,${T.obsidian} 0%,${T.charcoal} 50%,${T.obsidian} 100%)` }}>
      <HeroSection />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center gap-4 px-4 pb-16 flex-wrap -mt-8"
      >
        <Link to="/resume-builder">
          <motion.button 
            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 40px rgba(212,168,83,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl font-bold shadow-lg transition-all"
            style={{ background: `linear-gradient(135deg,${T.gold},${T.accent})`, color: T.obsidian }}
          >
            Create Resume
          </motion.button>
        </Link>
        <Link to="/all-resumes">
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl font-bold shadow-lg transition-all"
            style={{ background: 'rgba(26,26,36,0.9)', color: '#F5F0E6', border: '1px solid rgba(212,168,83,0.3)' }}
          >
            My Resumes
          </motion.button>
        </Link>
        <Link to="/resume-templates">
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl font-bold shadow-lg transition-all"
            style={{ background: 'rgba(26,26,36,0.9)', color: '#F5F0E6', border: '1px solid rgba(212,168,83,0.3)' }}
          >
            Templates
          </motion.button>
        </Link>
      </motion.div>

      <About />
      <StatsSection />
      <FeedbackSection />
      <FAQSection />
    </div>
  );
}
