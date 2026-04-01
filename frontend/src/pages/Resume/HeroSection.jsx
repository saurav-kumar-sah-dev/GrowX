import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { FileText, Download, Sparkles, Shield, Clock, Users, Award, MapPin, Mail, Phone, Star, Edit3, CheckCircle, Rocket, ChevronDown, Globe, TrendingUp } from "lucide-react";
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
  white: "#FAFAF8",
  gradient1: "#667eea",
  gradient2: "#764ba2",
};

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
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

function AnimatedText({ text, className = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  
  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: delay + i * 0.03, duration: 0.4 } }
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

function ParticleBackground() {
  const particles = useRef(
    Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))
  );
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.current.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgba(212, 168, 83, ${Math.random() * 0.3 + 0.1})`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function FloatingShape({ className, delay = 0 }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function GlowingOrb({ className, color = T.gold, size = 400 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
    />
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

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.95]);
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        background: `
          radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,168,83,0.12) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 20%, rgba(102,126,234,0.08) 0%, transparent 50%),
          linear-gradient(180deg, ${T.obsidian} 0%, ${T.charcoal} 100%)
        `,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ParticleBackground />
      
      <FloatingShape className="top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent" delay={0} />
      <FloatingShape className="top-40 right-20 w-48 h-48 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent" delay={2} />
      <FloatingShape className="bottom-40 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-amber-500/5 to-transparent" delay={4} />
      
      <GlowingOrb className="top-[-200px] left-1/2 -translate-x-1/2" size={600} />
      <GlowingOrb className="bottom-[-100px] right-[-100px]" size={400} color="rgba(102,126,234,0.15)" />
      
      <motion.div style={{ y, opacity, scale }} className="relative z-10">
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "40px 40px 80px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 580px), 1fr))",
            gap: "clamp(40px, 8vw, 100px)",
            alignItems: "center",
            minHeight: "calc(100vh - 200px)",
          }}
        >
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={stagger}
            className="space-y-8"
          >
            <motion.div variants={fadeIn} custom={0.1}>
              <SectionLabel>AI-Powered Resume Builder</SectionLabel>
            </motion.div>
            
            <motion.h1
              variants={fadeIn}
              custom={0.2}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(48px, 8vw, 88px)",
                fontWeight: 800,
                lineHeight: 1,
                color: T.ivory,
                margin: 0,
              }}
            >
              <span className="block mb-2">Build Your</span>
              <span 
                className="block"
                style={{
                  background: `linear-gradient(135deg, ${T.gold} 0%, ${T.goldLight} 50%, ${T.accent} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                <AnimatedText text="Dream Career!" delay={0.3} />
              </span>
            </motion.h1>
            
            <motion.p
              variants={fadeIn}
              custom={0.4}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(16px, 2vw, 20px)",
                color: T.ivoryMuted,
                lineHeight: 1.8,
                maxWidth: 520,
                margin: 0,
              }}
            >
              Create stunning, ATS-optimized resumes that get you noticed. 
              Join <span style={{ color: T.gold, fontWeight: 600 }}>10,000+</span> professionals 
              who landed their dream jobs.
            </motion.p>
            
            <motion.div variants={fadeIn} custom={0.5} className="flex flex-wrap gap-4 pt-2">
              <Link to="/resume-builder">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(212,168,83,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 rounded-xl font-bold text-base flex items-center gap-3 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${T.gold} 0%, ${T.accent} 100%)`,
                    color: T.obsidian,
                    fontFamily: "'DM Sans', sans-serif",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Build Resume <Rocket size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>
              </Link>
              
              <Link to="/resume-templates">
                <motion.button
                  whileHover={{ scale: 1.05, borderColor: T.gold }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl font-semibold text-base flex items-center gap-3 backdrop-blur-sm"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    color: T.ivory,
                    fontFamily: "'DM Sans', sans-serif",
                    border: "1.5px solid rgba(212,168,83,0.3)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    <FileText size={16} fill={T.gold} color={T.gold} />
                  </span>
                  View Templates
                </motion.button>
              </Link>
            </motion.div>
            
            <motion.div variants={fadeIn} custom={0.6}>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex -space-x-3">
                  {["1", "2", "3", "4", "5"].map((i) => (
                    <motion.img
                      key={i}
                      src={`https://i.pravatar.cc/48?img=${i}`}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2"
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                      style={{ borderColor: T.obsidian }}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={T.gold} color={T.gold} />
                    ))}
                  </div>
                  <p className="text-sm" style={{ color: T.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
                    4.9 rating from 10,000+ users
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative mx-auto max-w-lg"
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl"
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="relative rounded-3xl overflow-hidden border"
                  style={{
                    background: `linear-gradient(145deg, ${T.surface} 0%, ${T.surfaceLight} 100%)`,
                    borderColor: "rgba(212,168,83,0.2)",
                    boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
                  }}
                >
                  <div 
                    className="h-2"
                    style={{
                      background: `linear-gradient(90deg, ${T.gold}, ${T.accent}, ${T.gradient1}, ${T.gradient2}, ${T.gold})`,
                      backgroundSize: "200% 100%",
                    }}
                  />
                  
                  <div className="relative p-6">
                    <div className="absolute inset-0 overflow-hidden">
                      <motion.div
                        className="absolute w-96 h-96 rounded-full"
                        style={{
                          background: `radial-gradient(circle, rgba(212,168,83,0.1) 0%, transparent 70%)`,
                          top: "-50%",
                          left: "-50%",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-4">
                          <motion.div 
                            className="w-20 h-20 rounded-xl overflow-hidden"
                            style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.accent})` }}
                            whileHover={{ scale: 1.05, rotate: 2 }}
                          >
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-3xl font-black" style={{ color: T.obsidian }}>JD</span>
                            </div>
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-bold mb-1" style={{ color: T.ivory, fontFamily: "'Playfair Display', serif" }}>
                              John Doe
                            </h3>
                            <p className="text-sm font-medium" style={{ color: T.gold }}>
                              Senior Software Engineer
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: T.ivoryMuted }}>
                              <span className="flex items-center gap-1"><MapPin size={12} /> San Francisco</span>
                              <span className="flex items-center gap-1"><Mail size={12} /> john@email.com</span>
                            </div>
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                          AVAILABLE
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-3 mb-6">
                        {[
                          { icon: Award, label: "Experience", value: "6+ Years" },
                          { icon: Rocket, label: "Projects", value: "50+" },
                          { icon: Star, label: "Rating", value: "4.9" },
                          { icon: TrendingUp, label: "Growth", value: "85%" },
                        ].map(({ icon: Icon, label, value }, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ y: -4 }}
                            className="p-3 rounded-xl text-center"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,168,83,0.1)" }}
                          >
                            <Icon size={20} color={T.gold} className="mx-auto mb-2" />
                            <div className="font-bold text-base" style={{ color: T.gold, fontFamily: "'Playfair Display', serif" }}>{value}</div>
                            <div className="text-xs" style={{ color: T.ivoryMuted }}>{label}</div>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          <span style={{ color: T.ivoryMuted }}>Profile Strength</span>
                          <span style={{ color: T.gold, fontWeight: 600 }}>95%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "95%" }}
                            transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                            style={{ background: `linear-gradient(90deg, ${T.gold}, ${T.accent})` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {[8, 9, 10].map((i) => (
                              <img key={i} src={`https://i.pravatar.cc/32?img=${i}`} alt="" className="w-8 h-8 rounded-full border-2" style={{ borderColor: T.surface }} />
                            ))}
                          </div>
                          <span className="text-sm" style={{ color: T.ivoryMuted }}>+2.5k views</span>
                        </div>
                        <Link to="/resume-builder">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2"
                            style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.accent})`, color: T.obsidian }}
                          >
                            <Edit3 size={14} /> Edit Resume
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: -10 }}
                  transition={{ delay: 1.2, type: "spring", bounce: 0.5 }}
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  className="absolute -top-4 -right-4 p-4 rounded-2xl"
                  style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.accent})`, boxShadow: "0 20px 40px rgba(212,168,83,0.3)" }}
                >
                  <div className="flex items-center gap-2">
                    <Shield size={24} color={T.obsidian} />
                    <div>
                      <div className="font-bold text-lg" style={{ color: T.obsidian, fontFamily: "'Playfair Display', serif" }}>ATS</div>
                      <div className="text-xs font-semibold" style={{ color: T.obsidian, opacity: 0.8 }}>Optimized</div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0, rotate: 15 }}
                  animate={{ scale: 1, rotate: 10 }}
                  transition={{ delay: 1.4, type: "spring", bounce: 0.5 }}
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  className="absolute -bottom-3 -left-3 p-3 rounded-xl backdrop-blur-md"
                  style={{ background: "rgba(26,26,36,0.9)", border: "1px solid rgba(212,168,83,0.2)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={T.gold} color={T.gold} />
                      ))}
                    </div>
                    <span className="font-bold" style={{ color: T.gold }}>4.9</span>
                  </div>
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-1/2 -right-6 -translate-y-1/2 p-3 rounded-xl backdrop-blur-md"
                  style={{ background: "rgba(26,26,36,0.9)", border: "1px solid rgba(212,168,83,0.2)" }}
                >
                  <CheckCircle size={24} color={T.gold} />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="flex justify-center pb-12"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          >
            <span className="text-sm font-medium" style={{ color: T.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>Scroll to explore</span>
            <ChevronDown size={20} color={T.gold} />
          </motion.div>
        </motion.div>
      </motion.div>
      
      <div 
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: `linear-gradient(to top, ${T.charcoal}, transparent)`,
          pointerEvents: "none"
        }}
      />
    </section>
  );
};

export default HeroSection;
