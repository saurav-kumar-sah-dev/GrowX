import React from "react";
import { motion } from "framer-motion";
import { Award, Download, Sparkles, CheckCircle } from "lucide-react";
import CertificateImage from "../../assets/Certificate.png";

const C = {
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
  goldBorder: "rgba(212,168,83,0.15)",
  goldDim: "rgba(212,168,83,0.08)",
};

const Certificate = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden" style={{ background: C.charcoal }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)",
        backgroundSize: "50px 50px"
      }} />

      <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: C.gold }} />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: C.accent }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
          >
            <Award size={14} color={C.gold} />
            <span className="text-xs font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
              RECOGNITION
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>
            Earn Your <span style={{ color: C.gold }}>Certificate</span>
          </h2>

          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: C.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
            Complete your internship and receive an official certificate to showcase your achievements
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5 }}
          className="relative group"
        >
          <motion.div
            className="absolute -inset-4 rounded-3xl opacity-30"
            style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, filter: 'blur(30px)' }}
            animate={{ scale: [1, 1.03, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="relative rounded-3xl p-8 overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}>
            <motion.img 
              src={CertificateImage} 
              alt="Internship Certificate" 
              className="w-full h-auto object-contain rounded-2xl shadow-lg"
              whileHover={{ scale: 1.02 }}
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center justify-center">
            <motion.div 
              className="flex items-center gap-2 px-5 py-3 rounded-full"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
              whileHover={{ scale: 1.05 }}
            >
              <Award size={18} color={C.gold} />
              <span className="font-medium" style={{ color: C.ivory }}>Industry-Recognized</span>
            </motion.div>
            
            <div className="hidden sm:block w-1 h-1 rounded-full" style={{ background: C.goldBorder }} />
            
            <motion.div 
              className="flex items-center gap-2 px-5 py-3 rounded-full"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
              whileHover={{ scale: 1.05 }}
            >
              <Download size={18} color={C.gold} />
              <span className="font-medium" style={{ color: C.ivory }}>Digital & Printable</span>
            </motion.div>

            <div className="hidden sm:block w-1 h-1 rounded-full" style={{ background: C.goldBorder }} />
            
            <motion.div 
              className="flex items-center gap-2 px-5 py-3 rounded-full"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle size={18} color={C.gold} />
              <span className="font-medium" style={{ color: C.ivory }}>Verified</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Certificate;
