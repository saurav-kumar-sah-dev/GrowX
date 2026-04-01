import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle, Star, Zap, Users, Trophy, Sparkles } from "lucide-react";

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#0D1017",
  surface: "#151820",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
  goldBorderHover: "rgba(212,168,83,0.3)",
  violet: "#818CF8",
  violetDim: "rgba(129,140,248,0.1)",
  green: "#34D399",
  greenDim: "rgba(52,211,153,0.1)",
  cyan: "#38BDF8",
  amber: "#FBBF24",
  rose: "#FB7185",
  roseDim: "rgba(251,113,133,0.1)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
  dim: "#2A2E3A",
};

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const WhyChooseUs = () => {
  const reasons = [
    { icon: Star, title: "Expert-Crafted Content", desc: "Quizzes designed by subject experts and educators", stats: "500+ Expert Contributors", color: C.gold },
    { icon: Zap, title: "Instant Feedback", desc: "Get immediate results with detailed explanations", stats: "Real-time Scoring", color: C.amber },
    { icon: Users, title: "Global Community", desc: "Join thousands of learners worldwide", stats: "25K+ Active Users", color: C.cyan },
    { icon: Trophy, title: "Gamified Learning", desc: "Earn badges, compete on leaderboards, and track progress", stats: "100+ Achievements", color: C.violet },
  ];

  return (
    <section className="py-20 lg:py-32 px-4" style={{ background: C.charcoal }}>
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
            >
              <Sparkles size={14} color={C.gold} />
              <span className="text-xs font-bold" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>WHY CHOOSE US</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.white }}>
              Why Choose Our{" "}
              <span style={{ color: C.gold }}>Quiz Platform</span>?
            </h2>
            <p className="text-base lg:text-lg max-w-3xl mx-auto" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
              We make learning fun, interactive, and rewarding
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {reasons.map((reason, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <motion.div
                className="p-6 lg:p-8 rounded-2xl cursor-pointer"
                style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                whileHover={{ y: -6, borderColor: C.goldBorderHover, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
              >
                <div className="flex items-start gap-5">
                  <motion.div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${reason.color}15`, border: `1px solid ${reason.color}30` }}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <reason.icon size={26} color={reason.color} />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: C.white, fontFamily: "'Playfair Display', serif" }}>
                      {reason.title}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                      {reason.desc}
                    </p>
                    <div 
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ background: C.goldDim, color: C.gold, fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <CheckCircle size={14} /> {reason.stats}
                    </div>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <motion.div
            className="relative rounded-3xl p-8 lg:p-12 overflow-hidden"
            style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl" style={{ background: `${C.gold}10` }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ background: `${C.violet}10` }} />
            
            <div className="relative z-10 grid sm:grid-cols-3 gap-8 text-center">
              {[
                { value: "Free", label: "Forever Access", color: C.green },
                { value: "24/7", label: "Available Anytime", color: C.cyan },
                { value: "40+", label: "Quiz Categories", color: C.gold },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl lg:text-5xl font-black mb-2" style={{ color: item.color, fontFamily: "'Playfair Display', serif" }}>
                    {item.value}
                  </div>
                  <div className="text-sm" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
};

export default WhyChooseUs;
