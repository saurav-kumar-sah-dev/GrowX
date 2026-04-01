import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { Users, Award, Zap, TrendingUp, Shield, Star } from "lucide-react";

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

const reasons = [
  { icon: Star, title: 'Industry-Leading Program', desc: 'Internships designed by top professionals from leading companies', stats: '50+ Expert Mentors' },
  { icon: Zap, title: 'Learn by Doing', desc: 'Hands-on projects, real challenges, and practical simulations', stats: '100+ Live Projects' },
  { icon: TrendingUp, title: 'Career Support', desc: 'Resume reviews, interview prep, and job placement assistance', stats: '90% Placement Rate' },
  { icon: Shield, title: 'Trusted Platform', desc: 'Secure, reliable, and backed by industry partnerships', stats: '20+ Corporate Partners' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-4 relative overflow-hidden" style={{ background: C.charcoal }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)",
        backgroundSize: "50px 50px"
      }} />

      <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: C.gold }} />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: C.accent }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
          >
            <Award size={14} color={C.gold} />
            <span className="text-xs font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
              WHY CHOOSE US
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>
            Why Choose <span style={{ color: C.gold }}>GrowX Internship</span>?
          </h2>

          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: C.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
            We're not just another internship program. Here's what makes us different.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative rounded-2xl p-8 overflow-hidden group"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle at center, rgba(212,168,83,0.08) 0%, transparent 70%)" }}
              />

              <div className="relative z-10 flex items-start gap-6">
                <motion.div
                  className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})` }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <reason.icon size={32} color={C.obsidian} />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>{reason.title}</h3>
                  <p className="mb-4" style={{ color: C.ivoryMuted }}>{reason.desc}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ background: C.goldDim, color: C.gold, border: `1px solid ${C.goldBorder}` }}>
                    <FaCheckCircle size={16} />
                    {reason.stats}
                  </div>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ background: C.gold }} />
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="relative rounded-3xl p-12 overflow-hidden"
          style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
        >
          <div className="absolute inset-0" style={{
            background: `linear-gradient(135deg, rgba(212,168,83,0.1) 0%, transparent 50%, rgba(200,136,74,0.1) 100%)`
          }} />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { num: "8-12", label: "Weeks Duration", color: C.gold },
              { num: "24/7", label: "Mentor Support", color: C.gold },
              { num: "Remote", label: "Work Options", color: C.gold },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-5xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: item.color }}>
                  {item.num}
                </div>
                <div className="text-lg" style={{ color: C.ivoryMuted }}>{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
