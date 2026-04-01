import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Sparkles } from "lucide-react";
import templates from "./Templates";

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
};

export default function ResumeTemplates() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12" style={{ background: `linear-gradient(135deg,${T.obsidian} 0%,${T.charcoal} 50%,${T.obsidian} 100%)` }}>
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-md"
        style={{ background: 'rgba(26,26,36,0.8)', backdropFilter: 'blur(10px)', color: '#F5F0E6', border: '1px solid rgba(212,168,83,0.2)' }}
      >
        <IoMdArrowRoundBack size={24} />
        Back
      </motion.button>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
          style={{ background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.25)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Sparkles size={14} style={{ color: T.gold }} />
          <span className="text-xs font-bold" style={{ color: T.gold, letterSpacing: "0.1em" }}>
            Templates Gallery
          </span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#F5F0E6' }}>
          Resume <span style={{ color: '#D4A853' }}>Templates</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: '#A8A099' }}>
          Browse and preview our professionally designed resume templates
        </p>
      </motion.header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {templates.map((template, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer"
            style={{ background: T.surface, border: '1px solid rgba(212,168,83,0.15)' }}
            onClick={() => navigate('/resume-builder')}
          >
            <div className="relative overflow-hidden">
              <img
                src={template.preview}
                alt={`Resume Template ${idx + 1}`}
                className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 rounded-lg font-bold transition-all"
                    style={{ background: `linear-gradient(135deg,${T.gold},${T.accent})`, color: T.obsidian }}
                  >
                    Use Template
                  </motion.button>
                </div>
              </div>
            </div>
            <div className="p-4 text-center">
              <h3 className="font-bold" style={{ color: '#F5F0E6' }}>Template {idx + 1}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
