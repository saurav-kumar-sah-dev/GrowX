import { motion } from 'framer-motion';
import { Star, Quote, Sparkles } from 'lucide-react';

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

export default function Feedback() {
  const testimonials = [
    { name: 'Ananya Sharma', role: 'Software Development Intern', company: 'Tech Corp', rating: 5, text: 'GrowX internship transformed my career. The projects were practical and mentors were world-class.', img: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Rohan Mehta', role: 'Web Development Intern', company: 'StartupXYZ', rating: 5, text: 'Best decision ever. Gained real experience and landed my dream job within 2 months.', img: 'https://i.pravatar.cc/150?img=13' },
    { name: 'Ishita Jain', role: 'UI/UX Design Intern', company: 'Design Studio', rating: 5, text: 'The hands-on projects gave me real portfolio pieces. Highly recommend to anyone serious about growth.', img: 'https://i.pravatar.cc/150?img=5' }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden" style={{ background: C.charcoal }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)",
        backgroundSize: "50px 50px"
      }} />

      <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full blur-3xl opacity-15" style={{ background: C.gold }} />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full blur-3xl opacity-15" style={{ background: C.accent }} />

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
              TESTIMONIALS
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>
            What Our <span style={{ color: C.gold }}>Interns Say</span>
          </h2>

          <p className="text-base md:text-lg" style={{ color: C.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
            Join 50+ successful interns who transformed their careers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative rounded-3xl p-8 overflow-hidden group"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle at center, rgba(212,168,83,0.08) 0%, transparent 70%)" }}
              />

              <Quote className="mb-4" size={32} color={C.gold} />

              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={20} fill={C.gold} color={C.gold} />
                ))}
              </div>

              <p className="mb-6 leading-relaxed" style={{ color: C.ivoryMuted }}>{t.text}</p>

              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <motion.img 
                  src={t.img} 
                  alt={t.name} 
                  className="w-14 h-14 rounded-full"
                  whileHover={{ scale: 1.1 }}
                  style={{ border: `2px solid ${C.gold}` }}
                />
                <div>
                  <div className="font-bold" style={{ color: C.ivory }}>{t.name}</div>
                  <div className="text-sm" style={{ color: C.ivoryMuted }}>{t.role} at {t.company}</div>
                </div>
              </motion.div>

              <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ background: C.gold }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
