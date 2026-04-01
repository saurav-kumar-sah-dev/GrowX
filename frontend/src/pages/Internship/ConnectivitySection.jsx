import React from "react";
import { motion } from "framer-motion";
import { Globe2, MapPin, Wifi, Sparkles, Award } from "lucide-react";
import map from "../../assets/map1.png";

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

const ConnectivitySection = () => {
  const features = [
    { icon: Globe2, title: 'Global Reach', desc: 'Connect with teams across continents' },
    { icon: MapPin, title: 'Your Location', desc: 'Work from anywhere you feel comfortable' },
    { icon: Wifi, title: 'Always Connected', desc: 'Seamless collaboration tools and support' },
  ];

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
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
          >
            <Wifi size={14} color={C.gold} />
            <span className="text-xs font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
              WORK FROM ANYWHERE
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>
            <span style={{ color: C.gold }}>Remote-First</span> Internship Experience
          </h2>

          <p className="text-base md:text-lg max-w-3xl mx-auto" style={{ color: C.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
            Break free from traditional boundaries. Work from the comfort of your own space while gaining hands-on experience with global teams.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <motion.div
            className="absolute -inset-4 rounded-3xl opacity-30"
            style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, filter: 'blur(30px)' }}
            animate={{ scale: [1, 1.03, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          <div className="relative rounded-3xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}>
            <img
              src={map}
              alt="Global connectivity map"
              className="w-full h-auto object-contain rounded-2xl p-4"
            />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative rounded-2xl p-8 text-center overflow-hidden group"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle at center, rgba(212,168,83,0.08) 0%, transparent 70%)" }}
              />

              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <feature.icon size={32} color={C.gold} />
              </motion.div>

              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>{feature.title}</h3>
              <p className="text-sm" style={{ color: C.ivoryMuted }}>{feature.desc}</p>

              <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ background: C.gold }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConnectivitySection;
