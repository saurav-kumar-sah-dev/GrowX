import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Brain, Trophy, TrendingUp, Star, Zap, CheckCircle, Award } from "lucide-react";

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

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeIn}
      className={className}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
      whileHover={{ scale: 1.05 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 20px",
        borderRadius: 50,
        background: "rgba(212,168,83,0.08)",
        border: "1px solid rgba(212,168,83,0.25)",
        color: T.gold,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <Zap size={14} />
      {children}
    </motion.span>
  );
}

export default function StatsSection() {
  const items = [
    { icon: Brain, value: "40+", label: "Quiz Topics" },
    { icon: Trophy, value: "1000+", label: "Questions" },
    { icon: Users, value: "10K+", label: "Active Users" },
    { icon: TrendingUp, value: "95%", label: "Success Rate" },
  ];
  
  return (
    <section
      style={{
        background: `linear-gradient(180deg, ${T.charcoal} 0%, ${T.surface} 100%)`,
        borderTop: "1px solid rgba(212,168,83,0.1)",
        borderBottom: "1px solid rgba(212,168,83,0.1)",
        padding: "clamp(32px, 6vw, 56px) 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "clamp(24px, 4vw, 48px)",
        }}
      >
        {items.map(({ icon: Icon, value, label }, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              style={{ textAlign: "center" }}
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: T.accentGlow,
                  border: "1px solid rgba(212,168,83,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 0 30px rgba(212,168,83,0.1)",
                }}
              >
                <Icon size={24} color={T.gold} />
              </motion.div>
              <div
                style={{
                  fontSize: "clamp(28px, 5vw, 36px)",
                  fontWeight: 800,
                  color: T.gold,
                  fontFamily: "'Playfair Display', serif",
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: T.ivoryMuted,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {label}
              </div>
            </motion.div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.4}>
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
            style={{ background: T.surface, border: "1px solid rgba(212,168,83,0.15)" }}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={T.gold} color={T.gold} />
              ))}
            </div>
            <span className="font-semibold" style={{ color: T.ivory, fontFamily: "'DM Sans', sans-serif" }}>
              4.9/5 average rating from 10,000+ reviews
            </span>
          </div>
        </motion.div>
      </FadeIn>
    </section>
  );
}
