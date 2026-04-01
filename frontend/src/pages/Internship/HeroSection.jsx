import { motion } from 'framer-motion';
import { Briefcase, ArrowRight, Sparkles, Users, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export default function HeroSection() {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: "50+", label: "Interns Onboarded" },
    { icon: Award, value: "10+", label: "Departments" },
    { icon: TrendingUp, value: "95%", label: "Happy Interns" },
  ];

  return (
    <section className="relative overflow-hidden py-20 px-4" style={{ background: `linear-gradient(135deg,${C.obsidian} 0%,${C.charcoal} 50%,${C.obsidian} 100%)` }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)",
        backgroundSize: "50px 50px"
      }} />

      <motion.div 
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: C.gold }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: C.accent }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, delay: 3 }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={14} color={C.gold} />
              <span className="text-xs font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
                INTERNSHIP PROGRAM
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>
              Transform Your Future <span style={{ color: C.gold }}>With Real Experience</span>
            </h1>

            <p className="text-lg md:text-xl mb-8" style={{ color: C.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
              Join industry-leading internship programs. Work on cutting-edge projects, learn from experts, and build the skills that matter.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button 
                onClick={() => navigate('/category')}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(212,168,83,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-bold flex items-center gap-2"
                style={{ background: `linear-gradient(135deg,${C.gold},${C.accent})`, color: C.obsidian }}
              >
                <Briefcase size={20} />
                Explore Internships
              </motion.button>

              <motion.button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-bold flex items-center gap-2"
                style={{ background: 'rgba(26,26,36,0.8)', color: C.ivory, border: `1px solid ${C.goldBorder}` }}
              >
                <ArrowRight size={20} />
                Learn More
              </motion.button>
            </div>

            <div className="flex gap-8 mt-10">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon size={18} color={C.gold} />
                    <div className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: C.gold }}>{stat.value}</div>
                  </div>
                  <div className="text-sm" style={{ color: C.ivoryMuted }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <motion.div 
              className="relative rounded-3xl p-8 overflow-hidden"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="absolute -top-4 -right-4 px-4 py-2 rounded-full font-bold text-sm"
                style={{ background: `linear-gradient(135deg,${C.gold},${C.accent})`, color: C.obsidian }}
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔥 Trending
              </motion.div>

              <motion.img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" 
                alt="Internship" 
                className="rounded-2xl shadow-2xl w-full"
                whileHover={{ scale: 1.02 }}
              />

              <motion.div 
                className="mt-6 flex items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div 
                      key={i} 
                      className="w-12 h-12 rounded-full border-2"
                      style={{ background: `linear-gradient(135deg,${C.gold},${C.accent})`, borderColor: C.surface }}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                    />
                  ))}
                </div>
                <div>
                  <div className="font-semibold" style={{ color: C.ivory }}>Join 50+ interns</div>
                  <div className="text-sm" style={{ color: C.ivoryMuted }}>Start your journey today</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl opacity-30"
              style={{ background: C.gold }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
