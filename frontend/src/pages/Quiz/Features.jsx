import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, BarChart3, Users, Zap, Trophy, Target, Sparkles, Award, Clock, BookOpen, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

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
      <Sparkles size={14} />
      {children}
    </motion.span>
  );
}

const Features = () => {
  const feats = [
    { icon: Brain, t: "Smart Questions", d: "Carefully crafted questions covering all difficulty levels" },
    { icon: Clock, t: "Timed Challenges", d: "Test your speed and accuracy with time limits" },
    { icon: Trophy, t: "Leaderboards", d: "Compete with others and climb the rankings" },
    { icon: Award, t: "Badges & Certs", d: "Earn achievements and certificates upon completion" },
    { icon: Target, t: "Topic Filters", d: "Focus on specific areas you want to improve" },
    { icon: BarChart3, t: "Analytics", d: "Detailed insights into your performance and progress" },
    { icon: BookOpen, t: "Explanations", d: "Learn from every question with comprehensive answers" },
    { icon: Users, t: "Community", d: "Join discussions and share knowledge with peers" },
  ];
  
  return (
    <section
      style={{
        background: T.obsidian,
        padding: "clamp(80px, 12vw, 140px) 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(48px, 8vw, 80px)" }}>
          <FadeIn>
            <SectionLabel>Platform Features</SectionLabel>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px, 6vw, 56px)",
                fontWeight: 700,
                color: T.ivory,
                lineHeight: 1.1,
                margin: "20px 0",
              }}
            >
              Everything You Need to{" "}
              <span style={{ color: T.gold }}>Excel</span>
            </h2>
          </FadeIn>
        </div>
        
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: 20,
          }}
        >
          {feats.map(({ icon: Icon, t, d }, i) => (
            <FadeIn key={i} delay={i * 0.07}>
              <motion.div
                whileHover={{
                  y: -8,
                  borderColor: "rgba(212,168,83,0.35)",
                  boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
                }}
                style={{
                  padding: "28px 24px",
                  background: T.surface,
                  border: "1px solid rgba(212,168,83,0.1)",
                  borderRadius: 20,
                  cursor: "default",
                  transition: "all 0.3s ease",
                }}
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: T.accentGlow,
                    border: "1px solid rgba(212,168,83,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <Icon size={26} color={T.gold} />
                </motion.div>
                <div
                  style={{
                    fontWeight: 700,
                    color: T.ivory,
                    fontSize: 17,
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: 8,
                  }}
                >
                  {t}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: T.ivoryMuted,
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: 1.6,
                  }}
                >
                  {d}
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
        
        <FadeIn delay={0.3}>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="mt-12 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{
              background: `linear-gradient(145deg, ${T.surface} 0%, ${T.surfaceLight} 100%)`,
              border: "1px solid rgba(212,168,83,0.2)",
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(22px, 4vw, 30px)",
                  fontWeight: 700,
                  color: T.ivory,
                  marginBottom: 8,
                }}
              >
                Ready to Test Your Knowledge?
              </h3>
              <p style={{ fontSize: 15, color: T.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
                Join thousands of quiz enthusiasts and start your learning journey today.
              </p>
            </div>
            <Link to="/quizCategory">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212,168,83,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-bold text-base whitespace-nowrap"
                style={{
                  background: `linear-gradient(135deg, ${T.gold}, ${T.accent})`,
                  color: T.obsidian,
                  fontFamily: "'DM Sans', sans-serif",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Start Quizzing
              </motion.button>
            </Link>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Features;
