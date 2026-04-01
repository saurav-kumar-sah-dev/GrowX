import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import {
  Target, Users, Award, Zap, Code, Briefcase, Video, FileText,
  Trophy, Clock, Smartphone, Star, ChevronDown, Shield, Share2,
  Download, TrendingUp, CheckCircle, BookOpen, ArrowRight,
  Play, Sparkles, Rocket, GraduationCap, Globe, Lightbulb, X,
} from "lucide-react";
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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const slideIn = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
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
      custom={delay}
      style={{ ...fadeIn.hidden, transitionDelay: `${delay}s` }}
      className={className}
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

function TypingEffect({ text, className = "", speed = 50 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  
  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ display: "inline-block", marginLeft: "2px" }}
        >
          |
        </motion.span>
      )}
    </span>
  );
}

function CounterAnimation({ target, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseInt(target.replace(/[^0-9]/g, ""));
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function ParticleBackground() {
  const particles = useRef(
    Array.from({ length: 50 }, () => ({
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

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.95]);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
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
      
      <FloatingShape className="top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent" delay={0} />
      <FloatingShape className="top-40 right-20 w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent" delay={2} />
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
              <SectionLabel>Next-Gen Learning Platform</SectionLabel>
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
              <span className="block mb-2">Master Skills</span>
              <span 
                className="block"
                style={{
                  background: `linear-gradient(135deg, ${T.gold} 0%, ${T.goldLight} 50%, ${T.accent} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                <AnimatedText text="That Transform." delay={0.3} />
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
              Unlock your potential with AI-powered courses, expert mentorship, and 
              real-world projects. Join <span style={{ color: T.gold, fontWeight: 600 }}>50,000+</span> learners 
              accelerating their careers.
            </motion.p>
            
            <motion.div variants={fadeIn} custom={0.5} className="flex flex-wrap gap-4 pt-2">
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
                  <Link to="/learningVideo" className="flex items-center gap-2">
                    Explore Courses <Rocket size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>

              <Link to="/watchDemo">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212,168,83,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 rounded-xl font-semibold text-base flex items-center gap-3 backdrop-blur-md"
                  style={{
                    background: "linear-gradient(135deg, rgba(212,168,83,0.15) 0%, rgba(200,136,74,0.1) 100%)",
                    color: T.goldLight,
                    fontFamily: "'DM Sans', sans-serif",
                    border: "1.5px solid rgba(212,168,83,0.4)",
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center">
                    <Play size={16} className="ml-0.5" fill={T.gold} color={T.gold} />
                  </span>
                  <span className="flex items-center gap-2">
                    Watch Demo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
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
                      alt="Student"
                      className="w-10 h-10 rounded-full border-2 border-obsidian"
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
                    <CounterAnimation target="4.9" /> rating from <CounterAnimation target="12500" />+ students
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
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold mb-1" style={{ color: T.ivory, fontFamily: "'Playfair Display', serif" }}>
                            Full Stack Development
                          </h3>
                          <p className="text-sm" style={{ color: T.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
                            Master modern web development
                          </p>
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                          TRENDING
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {[
                          { icon: Code, label: "Projects", value: "24" },
                          { icon: Clock, label: "Duration", value: "40h" },
                          { icon: Users, label: "Enrolled", value: "12k+" },
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
                          <span style={{ color: T.ivoryMuted }}>Progress</span>
                          <span style={{ color: T.gold, fontWeight: 600 }}>68%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "68%" }}
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
                          <span className="text-sm" style={{ color: T.ivoryMuted }}>+2.4k learning</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-5 py-2.5 rounded-lg font-bold text-sm"
                          style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.accent})`, color: T.obsidian }}
                        >
                          Continue
                        </motion.button>
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
                    <GraduationCap size={24} color={T.obsidian} />
                    <div>
                      <div className="font-bold text-lg" style={{ color: T.obsidian, fontFamily: "'Playfair Display', serif" }}>Free</div>
                      <div className="text-xs font-semibold" style={{ color: T.obsidian, opacity: 0.8 }}>Course Access</div>
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
                  <Lightbulb size={24} color={T.gold} />
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

      {isVideoOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsVideoOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-5xl bg-[#121218] rounded-3xl overflow-hidden shadow-2xl border border-[#252532]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 bg-[#252532] hover:bg-[#D4A853] p-3 rounded-full transition-all"
            >
              <X size={24} color="#F5F0E6" />
            </button>
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/Ez3GT8pTyCQ?si=H0hTxpIic8IuiOAj"
                title="Learning Platform Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

function StatsBar() {
  const items = [
    { icon: Users, value: "50,000+", label: "Active Students" },
    { icon: BookOpen, value: "200+", label: "Expert Courses" },
    { icon: Award, value: "35,000+", label: "Certificates Issued" },
    { icon: TrendingUp, value: "95%", label: "Career Success Rate" },
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
    </section>
  );
}

function About() {
  const feats = [
    { icon: Target, t: "Goal-Oriented", d: "Structured paths for your career goals" },
    { icon: Users, t: "Expert Mentors", d: "Learn from industry professionals" },
    { icon: Award, t: "Certified Learning", d: "Earn recognized certificates" },
    { icon: Zap, t: "Fast-Track Skills", d: "Accelerated programs for in-demand skills" },
  ];
  
  return (
    <section
      style={{
        background: T.charcoal,
        padding: "40px 24px",
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
              whileHover={{ scale: 1.03, rotate: 1 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: `linear-gradient(145deg, ${T.surface} 0%, ${T.surfaceLight} 100%)`,
                border: "1px solid rgba(212,168,83,0.15)",
                aspectRatio: "4/3",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute w-3/4 h-3/4 rounded-full border-2 border-dashed"
                  style={{ borderColor: "rgba(212,168,83,0.1)" }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute w-1/2 h-1/2 rounded-full border"
                  style={{ borderColor: "rgba(212,168,83,0.15)" }}
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="relative z-10"
                >
                  <Globe size={100} color={T.gold} strokeWidth={0.8} />
                </motion.div>
              </div>
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 right-6 p-4 rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.accent})` }}
              >
                <div className="font-bold text-2xl" style={{ color: T.obsidian, fontFamily: "'Playfair Display', serif" }}>10M+</div>
                <div className="text-xs font-semibold" style={{ color: T.obsidian }}>Learning Hours</div>
              </motion.div>
            </motion.div>
          </div>
        </FadeIn>
        
        <div className="space-y-8">
          <FadeIn delay={0.15}>
            <SectionLabel>About GrowX</SectionLabel>
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
              Transform Your{" "}
              <span style={{ color: T.gold }}>Career.</span>
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
              GrowX combines world-class content, hands-on projects, and personalized 
              mentorship to accelerate your professional growth with cutting-edge skills.
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
                    background: "rgba(26,26,36,0.6)",
                    border: "1px solid rgba(212,168,83,0.1)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: T.accentGlow,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
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
        </div>
      </div>
    </section>
  );
}

function Features() {
  const feats = [
    { icon: Code, t: "LeetCode-Style Coding", d: "Practice with 500+ problems, Monaco editor, 20 languages" },
    { icon: Trophy, t: "Coding Contests", d: "Weekly contests with leaderboards & rankings" },
    { icon: Video, t: "HD Video Lessons", d: "Crystal-clear content from industry experts" },
    { icon: Briefcase, t: "Real Projects", d: "Portfolio-worthy builds as you learn" },
    { icon: FileText, t: "Resume Builder", d: "AI-powered ATS-optimized resume creator" },
    { icon: Users, t: "Community Support", d: "Connect with peers and mentors 24/7" },
    { icon: Shield, t: "Mock Interviews", d: "AI-simulated interviews with feedback" },
    { icon: Zap, t: "Skill Assessments", d: "Quizzes & tests to validate skills" },
  ];
  
  return (
    <section
      style={{
        background: T.obsidian,
        padding: "40px 24px",
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
              <span style={{ color: T.gold }}>Succeed</span>
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
                Ready to Start Your Journey?
              </h3>
              <p style={{ fontSize: 15, color: T.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
                Join thousands of learners already transforming their careers.
              </p>
            </div>
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
              Get Started Free
            </motion.button>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const reasons = [
    {
      icon: Star,
      t: "Industry-Leading Content",
      d: "Courses by professionals from Google, Microsoft & Amazon",
      stat: "500+ Expert Instructors",
    },
    {
      icon: Zap,
      t: "Learn by Doing",
      d: "Hands-on projects, coding challenges, real-world simulations",
      stat: "1000+ Practice Exercises",
    },
    {
      icon: CheckCircle,
      t: "Career Support",
      d: "Resume reviews, interview prep & job placement assistance",
      stat: "85% Job Placement Rate",
    },
    {
      icon: Shield,
      t: "Trusted Platform",
      d: "Secure, reliable, backed by industry partnerships",
      stat: "50+ Corporate Partners",
    },
  ];
  
  return (
    <section
      style={{
        background: T.charcoal,
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(48px, 8vw, 80px)" }}>
          <FadeIn>
            <SectionLabel>Why GrowX</SectionLabel>
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
              Not Just Another{" "}
              <span style={{ color: T.gold }}>Learning Platform.</span>
            </h2>
          </FadeIn>
        </div>
        
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: 20,
            marginBottom: 48,
          }}
        >
          {reasons.map(({ icon: Icon, t, d, stat }, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -10, boxShadow: "0 30px 60px rgba(0,0,0,0.4)" }}
                style={{
                  padding: "32px 28px",
                  background: T.surface,
                  border: "1px solid rgba(212,168,83,0.12)",
                  borderRadius: 24,
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 18,
                    background: `linear-gradient(135deg, rgba(212,168,83,0.15), rgba(200,136,74,0.1))`,
                    border: "1px solid rgba(212,168,83,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  <Icon size={28} color={T.gold} />
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    color: T.ivory,
                    fontSize: 20,
                    fontFamily: "'Playfair Display', serif",
                    marginBottom: 12,
                  }}
                >
                  {t}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: T.ivoryMuted,
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: 1.7,
                    marginBottom: 20,
                  }}
                >
                  {d}
                </div>
                <div
                  style={{
                    display: "inline-block",
                    padding: "8px 16px",
                    borderRadius: 10,
                    background: T.accentGlow,
                    border: "1px solid rgba(212,168,83,0.2)",
                    color: T.gold,
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {stat}
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
        
        <FadeIn delay={0.3}>
          <div
            style={{
              display: "flex",
              gap: 20,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              ["30-Day", "Money-Back Guarantee"],
              ["24/7", "Student Support"],
              ["Lifetime", "Course Access"],
            ].map(([v, l], i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -4 }}
                style={{
                  textAlign: "center",
                  padding: "20px 32px",
                  background: T.surface,
                  borderRadius: 18,
                  border: "1px solid rgba(212,168,83,0.15)",
                  minWidth: 160,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 26,
                    fontWeight: 700,
                    color: T.gold,
                    marginBottom: 6,
                  }}
                >
                  {v}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: T.ivoryMuted,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {l}
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Certificate() {
  return (
    <section
      style={{
        background: T.obsidian,
        padding: "40px 24px",
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
        <div className="space-y-8">
          <FadeIn delay={0.1}>
            <SectionLabel>Certification Program</SectionLabel>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(36px, 6vw, 52px)",
                fontWeight: 700,
                color: T.ivory,
                lineHeight: 1.1,
                margin: "16px 0 24px",
              }}
            >
              Earn Industry-
              <br />
              <span style={{ color: T.gold }}>Recognized Certificates.</span>
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <p
              style={{
                fontSize: "clamp(15px, 1.8vw, 17px)",
                color: T.ivoryMuted,
                lineHeight: 1.8,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Stand out in the job market with credentials that demonstrate your expertise 
              and commitment to continuous learning.
            </p>
          </FadeIn>
          
          <div className="space-y-4">
            {[
              { icon: Shield, t: "Verified by industry experts" },
              { icon: Share2, t: "Shareable on LinkedIn & social media" },
              { icon: Download, t: "Downloadable PDF format" },
              { icon: Star, t: "Lifetime validity" },
            ].map(({ icon: Icon, t }, i) => (
              <FadeIn key={i} delay={0.4 + i * 0.08}>
                <motion.div
                  whileHover={{ x: 8 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: T.accentGlow,
                      border: "1px solid rgba(212,168,83,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color={T.gold} />
                  </div>
                  <span
                    style={{
                      fontSize: 15,
                      color: T.ivory,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {t}
                  </span>
                </motion.div>
              </FadeIn>
            ))}
          </div>
          
          <FadeIn delay={0.6}>
            <div className="flex gap-4 flex-wrap pt-2">
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
                Get Certified
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, borderColor: T.gold }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm"
                style={{
                  background: "transparent",
                  color: T.ivory,
                  fontFamily: "'DM Sans', sans-serif",
                  border: "1.5px solid rgba(212,168,83,0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                View Sample
              </motion.button>
            </div>
          </FadeIn>
        </div>
        
        <FadeIn delay={0.2}>
          <motion.div
            whileHover={{ y: -10, rotateY: 3 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl overflow-hidden border"
            style={{
              background: T.surface,
              borderColor: "rgba(212,168,83,0.25)",
              boxShadow: "0 50px 100px rgba(0,0,0,0.5)",
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                height: 6,
                background: `linear-gradient(90deg, ${T.gold}, ${T.accent}, ${T.gradient1}, ${T.gradient2}, ${T.gold})`,
                backgroundSize: "200% 100%",
              }}
            />
            
            <div style={{ padding: "clamp(28px, 5vw, 44px)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 32,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `linear-gradient(135deg, ${T.gold}, ${T.accent})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 900,
                    fontSize: 24,
                    color: T.obsidian,
                  }}
                >
                  G
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 15,
                      fontWeight: 700,
                      color: T.ivory,
                      letterSpacing: "0.1em",
                    }}
                  >
                    GrowX Learning
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: T.ivoryMuted,
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    Certificate of Completion
                  </div>
                </div>
              </div>
              
              <div
                style={{
                  height: 1,
                  background: `linear-gradient(90deg, ${T.gold}40, transparent)`,
                  marginBottom: 28,
                }}
              />
              
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: T.ivoryMuted,
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  This certifies that
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(24px, 5vw, 32px)",
                    fontWeight: 700,
                    color: T.gold,
                    marginBottom: 10,
                  }}
                >
                  John Doe
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: T.ivoryMuted,
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: 8,
                  }}
                >
                  has successfully completed
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: T.ivory,
                    marginBottom: 20,
                  }}
                >
                  Full Stack Web Development
                </div>
                <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 24 }}>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -30 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.08, type: "spring" }}
                    >
                      <Star size={18} fill={T.gold} color={T.gold} />
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 20,
                  borderTop: "1px solid rgba(212,168,83,0.15)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: T.ivoryMuted,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Date: Jan 15, 2024
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: T.ivoryMuted,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    ID: GX-2024-001
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {[Download, Share2].map((Icon, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.1, background: T.accentGlow }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: "rgba(212,168,83,0.08)",
                        border: "1px solid rgba(212,168,83,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Icon size={16} color={T.gold} />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      co: "Google",
      txt: "GrowX transformed my career. The courses are practical and the instructors are world-class.",
      img: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      co: "Microsoft",
      txt: "Best investment in my education. Landed my dream job within 3 months of completing the program.",
      img: "https://i.pravatar.cc/150?img=13",
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager",
      co: "Amazon",
      txt: "The hands-on projects gave me real portfolio pieces. Highly recommend to anyone serious about learning.",
      img: "https://i.pravatar.cc/150?img=5",
    },
  ];
  
  return (
    <section
      style={{
        background: T.charcoal,
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(48px, 8vw, 80px)" }}>
          <FadeIn>
            <SectionLabel>Student Voices</SectionLabel>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px, 6vw, 52px)",
                fontWeight: 700,
                color: T.ivory,
                lineHeight: 1.1,
                margin: "20px 0",
              }}
            >
              What Our Learners{" "}
              <span style={{ color: T.gold }}>Say</span>
            </h2>
          </FadeIn>
        </div>
        
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: 24,
          }}
        >
          {reviews.map((r, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -8, boxShadow: "0 30px 60px rgba(0,0,0,0.3)" }}
                style={{
                  padding: "32px 28px",
                  background: T.surface,
                  border: "1px solid rgba(212,168,83,0.12)",
                  borderRadius: 24,
                  transition: "all 0.3s ease",
                  height: "100%",
                }}
              >
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} fill={T.gold} color={T.gold} />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 15,
                    color: T.ivoryMuted,
                    lineHeight: 1.75,
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: 24,
                  }}
                >
                  "{r.txt}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <img
                    src={r.img}
                    alt={r.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: T.ivory,
                        fontSize: 15,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {r.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: T.gold,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {r.role} at {r.co}
                    </div>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "How long do I have access to courses?", a: "Once you enroll, you have lifetime access to all course materials. Learn at your own pace, revisit lessons anytime." },
    { q: "Do you offer refunds?", a: "Yes! We offer a 30-day money-back guarantee. If you're not satisfied within the first 30 days, simply contact us for a full refund." },
    { q: "Are certificates recognized by employers?", a: "Absolutely! Our certificates are recognized by industry leaders and can be shared on LinkedIn to boost your professional profile." },
    { q: "Can I learn on mobile devices?", a: "Yes, our platform is fully responsive. You can access all courses on desktop, tablet, and mobile devices with the same great experience." },
  ];
  
  return (
    <section
      style={{
        background: T.obsidian,
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(48px, 8vw, 80px)" }}>
          <FadeIn>
            <SectionLabel>FAQ</SectionLabel>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px, 6vw, 52px)",
                fontWeight: 700,
                color: T.ivory,
                lineHeight: 1.1,
                margin: "20px 0",
              }}
            >
              Frequently Asked{" "}
              <span style={{ color: T.gold }}>Questions</span>
            </h2>
          </FadeIn>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <motion.div
                style={{
                  background: T.surface,
                  border: "1px solid rgba(212,168,83,0.1)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                <motion.button
                  onClick={() => setOpen(open === i ? null : i)}
                  whileHover={{ borderColor: "rgba(212,168,83,0.2)" }}
                  style={{
                    width: "100%",
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    borderBottom: open === i ? "1px solid rgba(212,168,83,0.1)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: T.ivory,
                      fontFamily: "'DM Sans', sans-serif",
                      textAlign: "left",
                    }}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: open === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} color={T.gold} />
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "0 24px 20px" }}>
                        <p
                          style={{
                            fontSize: 14,
                            color: T.ivoryMuted,
                            lineHeight: 1.75,
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Feedback() {
  return (
    <section
      style={{
        background: T.obsidian,
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          borderRadius: 32,
          overflow: "hidden",
          background: `linear-gradient(145deg, ${T.surface} 0%, ${T.surfaceLight} 100%)`,
          border: "1px solid rgba(212,168,83,0.15)",
          padding: "clamp(40px, 8vw, 80px)",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
          <FadeIn>
            <SectionLabel>Get Started Today</SectionLabel>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px, 6vw, 52px)",
                fontWeight: 700,
                color: T.ivory,
                lineHeight: 1.1,
                margin: "20px 0 24px",
              }}
            >
              Ready to Transform{" "}
              <span style={{ color: T.gold }}>Your Future?</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.25}>
            <p
              style={{
                fontSize: "clamp(15px, 1.8vw, 18px)",
                color: T.ivoryMuted,
                lineHeight: 1.75,
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: 36,
              }}
            >
              Join over 50,000 learners who are already advancing their careers 
              with GrowX. Start your journey today — it's free to begin.
            </p>
          </FadeIn>
          <FadeIn delay={0.35}>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(212,168,83,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-bold text-base"
                style={{
                  background: `linear-gradient(135deg, ${T.gold}, ${T.accent})`,
                  color: T.obsidian,
                  fontFamily: "'DM Sans', sans-serif",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Link to="/learningVideo" className="flex items-center gap-2">
                  Start Free Trial <Rocket size={18} />
                </Link>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, borderColor: T.gold }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-semibold text-base"
                style={{
                  background: "transparent",
                  color: T.ivory,
                  fontFamily: "'DM Sans', sans-serif",
                  border: "1.5px solid rgba(212,168,83,0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Contact Sales
              </motion.button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export {
  Hero,
  StatsBar,
  About,
  Features,
  WhyChooseUs,
  Certificate,
  Testimonials,
  FAQSection,
  Feedback,
};

function HomeLearning() {
  return (
    <>
      <Hero />
      <StatsBar />
      <About />
      <Features />
      <WhyChooseUs />
      <Certificate />
      <Testimonials />
      <FAQSection />
      <Feedback />
    </>
  );
}

export default HomeLearning;
