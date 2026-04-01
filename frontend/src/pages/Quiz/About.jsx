import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Target, Brain, Award, Zap, Trophy, Star, Sparkles, CheckCircle, BookOpen, TrendingUp } from "lucide-react";
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
  goldBorder: "rgba(212,168,83,0.15)",
  goldDim: "rgba(212,168,83,0.08)",
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
        background: T.goldDim,
        border: `1px solid ${T.goldBorder}`,
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

const AboutPage = () => {
  const feats = [
    { icon: Target, t: "Topic-Based Quizzes", d: "Comprehensive coverage of all major topics and concepts" },
    { icon: Brain, t: "Instant Feedback", d: "Learn from mistakes with detailed explanations" },
    { icon: Award, t: "Achievement System", d: "Earn badges and certificates as you progress" },
    { icon: Zap, t: "Real-Time Scoring", d: "Track your performance with live score updates" },
  ];
  
  return (
    <section
      style={{
        background: T.charcoal,
        padding: "clamp(80px, 12vw, 140px) 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
          gap: "clamp(48px, 8vw, 96px)",
          alignItems: "center",
        }}
      >
        <FadeIn delay={0.1}>
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=500&fit=crop" 
                alt="Quiz Arena" 
                className="w-full h-auto object-cover"
                style={{ borderRadius: '24px' }}
              />
              
              <motion.div 
                className="absolute -bottom-6 -left-6 p-5 rounded-2xl shadow-xl"
                style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.accent})` }}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="font-bold text-3xl" style={{ color: T.obsidian, fontFamily: "'Playfair Display', serif" }}>10K+</div>
                <div className="text-sm font-medium" style={{ color: T.obsidian }}>Active Learners</div>
              </motion.div>

              <motion.div 
                className="absolute -top-4 -right-4 p-4 rounded-xl shadow-xl"
                style={{ background: T.surface, border: `1px solid ${T.goldBorder}` }}
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <Trophy size={20} color={T.gold} />
                  <span className="font-semibold" style={{ color: T.ivory }}>4.9★</span>
                </div>
              </motion.div>

              <motion.div 
                className="absolute bottom-6 right-6 p-3 rounded-xl shadow-xl"
                style={{ background: T.surface, border: `1px solid ${T.goldBorder}` }}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} color={T.gold} />
                  <span className="text-sm font-medium" style={{ color: T.ivory }}>Verified</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </FadeIn>
        
        <div className="space-y-8">
          <FadeIn delay={0.15}>
            <SectionLabel>About Quiz Arena</SectionLabel>
          </FadeIn>
          
          <FadeIn delay={0.25}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(36px, 6vw, 56px)",
                fontWeight: 700,
                color: T.ivory,
                lineHeight: 1.1,
                margin: "16px 0 24px",
              }}
            >
              Challenge Your{" "}
              <span style={{ color: T.gold }}>Mind.</span>
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.35}>
            <p
              style={{
                fontSize: "clamp(15px, 1.8vw, 18px)",
                color: T.ivoryMuted,
                lineHeight: 1.8,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Quiz Arena offers interactive quizzes designed to test and expand your knowledge. 
              Track your progress, compete with others, and master new skills through engaging challenges.
            </p>
          </FadeIn>
          
          <div className="space-y-4">
            {feats.map(({ icon: Icon, t, d }, i) => (
              <FadeIn key={i} delay={0.45 + i * 0.1}>
                <motion.div
                  whileHover={{ x: 8, borderColor: "rgba(212,168,83,0.3)" }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    padding: "16px 20px",
                    borderRadius: 14,
                    background: T.surface,
                    border: `1px solid ${T.goldBorder}`,
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: T.goldDim,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      border: `1px solid ${T.goldBorder}`,
                    }}
                  >
                    <Icon size={22} color={T.gold} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: T.ivory,
                        fontSize: 16,
                        fontFamily: "'DM Sans', sans-serif",
                        marginBottom: 4,
                      }}
                    >
                      {t}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: T.ivoryMuted,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {d}
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.7}>
            <Link to="/quizCategory">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212,168,83,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3.5 rounded-xl font-bold text-sm"
                style={{
                  background: `linear-gradient(135deg, ${T.gold}, ${T.accent})`,
                  color: T.obsidian,
                  fontFamily: "'DM Sans', sans-serif",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Explore Quiz Categories
              </motion.button>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
