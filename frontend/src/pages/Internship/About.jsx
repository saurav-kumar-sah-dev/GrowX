import { motion } from 'framer-motion';
import { Target, Users, Award, Zap, BookOpen, CheckCircle, TrendingUp, Briefcase } from 'lucide-react';

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

  const features = [
  { icon: Target, title: 'Goal-Oriented', desc: 'Structured internship paths designed to achieve your career goals' },
  { icon: Users, title: 'Expert Mentors', desc: 'Learn from industry professionals with real-world experience' },
  { icon: Award, title: 'Certified Program', desc: 'Earn recognized certificates upon internship completion' },
  { icon: Zap, title: 'Fast-Track Career', desc: 'Accelerated programs to quickly gain practical experience' },
  { icon: Briefcase, title: 'Real Projects', desc: 'Work on live industry projects and build your portfolio' },
  { icon: TrendingUp, title: 'Career Growth', desc: 'Accelerate your professional development with us' },
];

export default function About() {
  return (
    <section id="about" className="py-20 px-4 relative overflow-hidden" style={{ background: C.charcoal }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)",
        backgroundSize: "50px 50px"
      }} />

      <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full blur-3xl opacity-15" style={{ background: C.gold }} />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full blur-3xl opacity-15" style={{ background: C.accent }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
            >
              <Award size={14} color={C.gold} />
              <span className="text-xs font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
                ABOUT US
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>
              Build Your Career with <span style={{ color: C.gold }}>Real Experience</span>
            </h2>

            <p className="text-base md:text-lg mb-8 leading-relaxed" style={{ color: C.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
              GrowX Internship is your gateway to professional success. Our program combines hands-on projects, 
              personalized mentorship, and industry exposure to accelerate your career growth.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: idx * 0.08 }}
                  className="flex items-start gap-4 p-4 rounded-xl"
                  style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                >
                  <motion.div 
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <feature.icon size={20} color={C.gold} />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: C.ivory }}>{feature.title}</h3>
                    <p className="text-sm" style={{ color: C.ivoryMuted }}>{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-4 rounded-3xl opacity-30"
                style={{
                  background: `linear-gradient(135deg, ${C.gold} 0%, ${C.accent} 100%)`,
                  filter: 'blur(30px)'
                }}
                animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.35, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=700&fit=crop" 
                alt="Internship Experience" 
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />

              <motion.div 
                className="absolute -bottom-6 -left-6 p-6 rounded-2xl shadow-xl"
                style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})` }}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: C.obsidian }}>50+</div>
                <div className="text-sm font-medium" style={{ color: C.obsidian }}>Interns Onboarded</div>
              </motion.div>

              <motion.div 
                className="absolute -top-6 -right-6 p-5 rounded-2xl shadow-xl"
                style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: C.gold }}>95%</div>
                <div className="text-sm font-medium" style={{ color: C.ivoryMuted }}>Success Rate</div>
              </motion.div>

              <motion.div 
                className="absolute top-1/2 -right-8 p-4 rounded-xl shadow-xl"
                style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} color={C.gold} />
                  <span className="text-sm font-medium" style={{ color: C.ivory }}>Verified</span>
                </div>
              </motion.div>
            </div>

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl opacity-30" style={{ background: C.gold }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
