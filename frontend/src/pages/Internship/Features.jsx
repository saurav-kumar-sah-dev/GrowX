import { motion } from 'framer-motion';
import { Code, Briefcase, Video, FileText, Users, Trophy, Clock, Target, Zap, Award, Sparkles, GraduationCap } from 'lucide-react';
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

export default function Features() {
  const navigate = useNavigate();
  
  const features = [
    { icon: Briefcase, title: 'Real Projects', desc: 'Work on live industry projects and build your portfolio' },
    { icon: Users, title: 'Expert Mentorship', desc: 'Get guidance from experienced professionals' },
    { icon: Trophy, title: 'Certificates', desc: 'Earn industry-recognized completion certificates' },
    { icon: Code, title: 'Hands-On Learning', desc: 'Practice with real-world tools and technologies' },
    { icon: Video, title: 'Live Sessions', desc: 'Attend interactive workshops and training' },
    { icon: FileText, title: 'Learning Resources', desc: 'Access comprehensive study materials' },
    { icon: Clock, title: 'Flexible Schedule', desc: 'Work at your own pace with remote options' },
    { icon: Target, title: 'Career Support', desc: 'Get job placement assistance and guidance' },
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden" style={{ background: C.charcoal }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)",
        backgroundSize: "50px 50px"
      }} />

      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: C.gold }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: C.accent }} />

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
            <Sparkles size={14} color={C.gold} />
            <span className="text-xs font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
              FEATURES
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>
            Everything You Need to <span style={{ color: C.gold }}>Succeed</span>
          </h2>

          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: C.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
            Our comprehensive internship program provides all the tools and resources you need to excel
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative rounded-2xl p-6 overflow-hidden group"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle at center, rgba(212,168,83,0.08) 0%, transparent 70%)" }}
              />

              <motion.div
                className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4"
                style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <feature.icon size={28} color={C.gold} />
              </motion.div>

              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>{feature.title}</h3>
              <p className="text-sm" style={{ color: C.ivoryMuted }}>{feature.desc}</p>

              <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ background: C.gold }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
