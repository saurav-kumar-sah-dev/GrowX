import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import {
  Play, CheckCircle, Star, Users, Award, TrendingUp,
  BookOpen, Target, ArrowRight, Zap, Shield, Clock,
  Sparkles, Rocket, ChevronDown, Volume2, VolumeX, Maximize2, Settings,
  PlayCircle, Pause, SkipForward, SkipBack, Eye, Heart, Share2, Download
} from "lucide-react";
import { Link } from "react-router-dom";

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#0F1117",
  surface: "#161921",
  surfaceLight: "#1E212B",
  card: "#1A1D26",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDim: "rgba(212,168,83,0.1)",
  goldBorder: "rgba(212,168,83,0.2)",
  cyan: "#00D4AA",
  cyanDim: "rgba(0,212,170,0.1)",
  violet: "#5B6BFF",
  violetDim: "rgba(91,107,255,0.1)",
  white: "#F5F0E6",
  muted: "#6B7280",
  dim: "#2A2E3A",
  gradient1: "#667eea",
  gradient2: "#764ba2",
};

function FadeIn({ children, delay = 0, direction = "up" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const variants = {
    hidden: { opacity: 0, y: direction === "up" ? 40 : direction === "down" ? -40 : 0, scale: direction === "scale" ? 0.9 : 1 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } }
  };
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={variants}>
      {children}
    </motion.div>
  );
}

function FloatingOrb({ className, color = C.gold, size = 400 }) {
  return (
    <motion.div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], y: [0, -30, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size, background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
    />
  );
}

function ParticleField() {
  const particles = useRef(Array.from({ length: 40 }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 3 + 1, duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  })));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.current.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: C.gold }}
          animate={{ y: [0, -25, 0], opacity: [0.1, 0.4, 0.1], scale: [1, 1.3, 1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function AnimatedCounter({ target, duration = 2000, suffix = "" }) {
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
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) setProgress(p => (p >= 100 ? 0 : p + 0.5));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  return (
    <motion.div
      className="relative rounded-3xl overflow-hidden border"
      style={{ borderColor: C.goldBorder, boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(212,168,83,0.1)` }}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying && setShowControls(true)}
    >
      <div className="relative aspect-video bg-gradient-to-br from-charcoal to-surface">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/RGOj5yH7evk?autoplay=0"
          title="GrowX Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          allowFullScreen
        />
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          animate={{ opacity: showControls ? 1 : 0 }}
        />
        
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6"
          animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        >
          <div className="mb-4">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
              <motion.div className="h-full rounded-full"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})` }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setProgress(p => Math.max(0, p - 10))}
              >
                <SkipBack size={20} color={C.gold} />
              </motion.button>
              
              <motion.button
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` }}
                whileHover={{ scale: 1.1, boxShadow: "0 0 40px rgba(212,168,83,0.5)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={24} color={C.obsidian} /> : <Play size={24} color={C.obsidian} fill={C.obsidian} className="ml-1" />}
              </motion.button>
              
              <motion.button
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setProgress(p => Math.min(100, p + 10))}
              >
                <SkipForward size={20} color={C.gold} />
              </motion.button>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.1)" }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX size={18} color={C.white} /> : <Volume2 size={18} color={C.white} />}
              </motion.button>
              
              <motion.button
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.1)" }}
                whileHover={{ scale: 1.1 }}
              >
                <Settings size={18} color={C.white} />
              </motion.button>
              
              <motion.button
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.1)" }}
                whileHover={{ scale: 1.1 }}
              >
                <Maximize2 size={18} color={C.white} />
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#EF4444" }} />
          <span className="text-xs px-2 py-1 rounded" style={{ background: "rgba(0,0,0,0.5)", color: C.white, fontFamily: "'DM Mono', monospace" }}>
            LIVE DEMO
          </span>
        </div>
        
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {[[Eye, "2.4K"], [Heart, "856"], [Share2, "Share"]].map(([Icon, label], i) => (
            <motion.div key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md"
              style={{ background: "rgba(0,0,0,0.4)" }}
              whileHover={{ scale: 1.05 }}
            >
              <Icon size={14} color={C.white} />
              <span className="text-xs" style={{ color: C.white, fontFamily: "'DM Mono', monospace" }}>{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div style={{ height: 4, background: `linear-gradient(90deg, ${C.gold}, ${C.violet}, ${C.cyan}, ${C.gold})`, backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite" }} />
    </motion.div>
  );
}

function StatCard({ value, label, icon: Icon, color, delay }) {
  return (
    <FadeIn delay={delay}>
      <motion.div
        className="relative p-6 lg:p-8 rounded-2xl overflow-hidden"
        style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
        whileHover={{ y: -8, boxShadow: `0 20px 50px rgba(0,0,0,0.3)` }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl"
          style={{ background: `${color}20` }}
        />
        
        <div className="relative z-10 text-center">
          <motion.div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: `${color}15`, border: `1px solid ${color}30` }}
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            <Icon size={24} color={color} />
          </motion.div>
          
          <div className="text-4xl lg:text-5xl font-black mb-2" style={{ fontFamily: "'Playfair Display', serif", color }}>
            <AnimatedCounter target={value} />
          </div>
          
          <div className="text-sm" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
            {label}
          </div>
        </div>
      </motion.div>
    </FadeIn>
  );
}

function FeatureCard({ icon: Icon, title, desc, color, delay }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <FadeIn delay={delay}>
      <motion.div
        className="relative p-6 lg:p-8 rounded-2xl cursor-pointer overflow-hidden"
        style={{ background: C.surface, border: `1px solid ${isHovered ? color + "40" : C.goldBorder}` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <motion.div
          className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl"
          style={{ background: `${color}10`, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="relative z-10">
          <motion.div
            className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center"
            style={{ background: `${color}15`, border: `1px solid ${color}30` }}
            whileHover={{ rotate: 15, scale: 1.1 }}
          >
            <Icon size={26} color={color} />
          </motion.div>
          
          <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: C.white }}>
            {title}
          </h3>
          
          <p className="text-sm leading-relaxed" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
            {desc}
          </p>
        </div>
      </motion.div>
    </FadeIn>
  );
}

function TestimonialCard({ name, role, company, text, avatar, delay }) {
  return (
    <FadeIn delay={delay}>
      <motion.div
        className="p-6 lg:p-8 rounded-2xl"
        style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
        whileHover={{ y: -8, boxShadow: `0 20px 50px rgba(0,0,0,0.3)` }}
      >
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill={C.gold} color={C.gold} />
          ))}
        </div>
        
        <p className="text-base mb-6 leading-relaxed" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
          "{text}"
        </p>
        
        <div className="flex items-center gap-4">
          <motion.img src={avatar} alt={name} className="w-12 h-12 rounded-full"
            whileHover={{ scale: 1.1, rotate: 5 }}
          />
          <div>
            <div className="font-bold" style={{ fontFamily: "'DM Sans', sans-serif", color: C.white }}>{name}</div>
            <div className="text-sm" style={{ color: C.gold }}>{role} at {company}</div>
          </div>
        </div>
      </motion.div>
    </FadeIn>
  );
}

export default function WatchDemo() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  
  const features = [
    { icon: CheckCircle, title: "Expert-Led Courses", desc: "Learn from industry professionals with 10+ years of real-world experience", color: C.cyan },
    { icon: Star, title: "High-Quality Content", desc: "4K video lessons with interactive coding exercises and live environments", color: C.gold },
    { icon: Users, title: "Active Community", desc: "Connect with 50,000+ learners and mentors worldwide, 24/7", color: C.violet },
    { icon: Award, title: "Certificates", desc: "Earn industry-recognized certifications that employers trust", color: C.cyan },
    { icon: Target, title: "Career Support", desc: "Personalized resume reviews and structured interview preparation", color: C.gold },
    { icon: BookOpen, title: "Lifetime Access", desc: "Learn at your own pace — no expiry, no lock-out, ever", color: C.violet },
  ];
  
  const testimonials = [
    { name: "Sarah Johnson", role: "Software Engineer", company: "Google", text: "GrowX transformed my career. The courses are practical and the instructors are world-class.", avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Michael Chen", role: "Data Scientist", company: "Microsoft", text: "Best investment in my education. Landed my dream job within 3 months.", avatar: "https://i.pravatar.cc/150?img=13" },
    { name: "Emily Rodriguez", role: "Product Manager", company: "Amazon", text: "The hands-on projects gave me real portfolio pieces. Highly recommended!", avatar: "https://i.pravatar.cc/150?img=5" },
  ];
  
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: `linear-gradient(180deg, ${C.obsidian} 0%, ${C.charcoal} 50%, ${C.obsidian} 100%)` }}>
      <div className="fixed inset-0 pointer-events-none">
        <ParticleField />
        <FloatingOrb className="top-[-200px] left-1/2 -translate-x-1/2" size={600} />
        <FloatingOrb className="bottom-[-100px] right-[-100px]" size={400} color={C.violetDim} />
        <FloatingOrb className="top-1/3 left-0" size={300} color={C.cyanDim} />
      </div>
      
      <motion.section className="relative z-10 min-h-screen flex items-center" style={{ y, opacity }}>
        <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <FadeIn>
              <motion.div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
                style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles size={16} color={C.gold} />
                <span className="text-xs font-bold" style={{ color: C.gold, fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em" }}>
                  PLATFORM DEMO
                </span>
              </motion.div>
            </FadeIn>
            
            <FadeIn delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: C.white }}>
                Experience{" "}
                <span style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  GrowX
                </span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <p className="text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                Watch how our platform empowers thousands of learners to master new skills, build real projects, and advance their careers.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/learningVideo">
                  <motion.button
                    className="px-8 py-4 rounded-xl font-bold flex items-center gap-3"
                    style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: C.obsidian, fontFamily: "'DM Sans', sans-serif" }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(212,168,83,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <TrendingUp size={20} /> Explore Courses <ArrowRight size={18} />
                  </motion.button>
                </Link>
                
                <Link to="/learning">
                  <motion.button
                    className="px-8 py-4 rounded-xl font-semibold flex items-center gap-3"
                    style={{ background: "transparent", color: C.white, border: `1.5px solid ${C.goldBorder}`, fontFamily: "'DM Sans', sans-serif" }}
                    whileHover={{ scale: 1.05, borderColor: C.gold }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BookOpen size={20} /> Learn More
                  </motion.button>
                </Link>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <motion.div
                className="mt-16 flex justify-center"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}>
                  <span className="text-xs" style={{ color: C.muted, fontFamily: "'DM Mono', monospace" }}>Scroll to explore</span>
                  <ChevronDown size={20} color={C.gold} />
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </motion.section>
      
      <section className="relative z-10 py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <VideoPlayer />
            
            <FadeIn delay={0.2}>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Zap size={16} color={C.gold} />
                <span className="text-sm" style={{ color: C.muted, fontFamily: "'DM Mono', monospace" }}>
                  2-minute platform overview — no sign-up required
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      
      <section className="relative z-10 py-20 border-t" style={{ borderColor: C.goldBorder }}>
        <div className="container mx-auto px-4 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}>
                <TrendingUp size={14} color={C.gold} />
                <span className="text-xs font-bold" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>BY THE NUMBERS</span>
              </motion.div>
              <h2 className="text-3xl lg:text-5xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: C.white }}>
                Trusted by <span style={{ color: C.gold }}>Thousands</span> Worldwide
              </h2>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <StatCard value="50K+" label="Active Students" icon={Users} color={C.cyan} delay={0.1} />
            <StatCard value="200+" label="Expert Courses" icon={BookOpen} color={C.violet} delay={0.15} />
            <StatCard value="95%" label="Success Rate" icon={Target} color={C.gold} delay={0.2} />
            <StatCard value="4.9★" label="Average Rating" icon={Star} color={C.cyan} delay={0.25} />
          </div>
        </div>
      </section>
      
      <section className="relative z-10 py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <FadeIn>
            <div className="max-w-2xl mb-12">
              <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                style={{ background: C.violetDim, border: `1px solid rgba(91,107,255,0.3)` }}>
                <Rocket size={14} color={C.violet} />
                <span className="text-xs font-bold" style={{ color: C.violet, fontFamily: "'DM Mono', monospace" }}>WHY GROWX</span>
              </motion.div>
              <h2 className="text-3xl lg:text-5xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: C.white }}>
                Everything You Need to <span style={{ color: C.violet }}>Succeed</span>
              </h2>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>
      
      <section className="relative z-10 py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: C.white }}>
                What Our Learners <span style={{ color: C.gold }}>Say</span>
              </h2>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>
      
      <section className="relative z-10 py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <FadeIn>
            <motion.div
              className="relative rounded-3xl p-8 lg:p-16 overflow-hidden"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ background: `${C.gold}10` }} />
              <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl" style={{ background: `${C.violet}10` }} />
              
              <div className="absolute top-0 left-1/4 right-1/4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.gold}, ${C.violet}, transparent)` }} />
              
              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                  style={{ background: C.cyanDim, border: `1px solid rgba(0,212,170,0.3)` }}>
                  <Users size={14} color={C.cyan} />
                  <span className="text-xs font-bold" style={{ color: C.cyan, fontFamily: "'DM Mono', monospace" }}>50,000+ CERTIFIED LEARNERS</span>
                </motion.div>
                
                <h2 className="text-3xl lg:text-5xl font-black mb-6" style={{ fontFamily: "'Playfair Display', serif", color: C.white }}>
                  Ready to Start Your <span style={{ color: C.gold }}>Journey?</span>
                </h2>
                
                <p className="text-lg mb-10" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                  Join 50,000+ learners transforming their careers with GrowX today. 30-day guarantee — no card required.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                  <Link to="/learningVideo">
                    <motion.button
                      className="px-8 py-4 rounded-xl font-bold flex items-center gap-3"
                      style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: C.obsidian, fontFamily: "'DM Sans', sans-serif" }}
                      whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(212,168,83,0.4)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <TrendingUp size={20} /> Explore All Courses
                    </motion.button>
                  </Link>
                  
                  <Link to="/learning">
                    <motion.button
                      className="px-8 py-4 rounded-xl font-semibold flex items-center gap-3"
                      style={{ background: "transparent", color: C.white, border: `1.5px solid ${C.goldBorder}`, fontFamily: "'DM Sans', sans-serif" }}
                      whileHover={{ scale: 1.05, borderColor: C.gold }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Shield size={20} /> 30-Day Guarantee
                    </motion.button>
                  </Link>
                </div>
                
                <div className="flex flex-wrap justify-center gap-6">
                  {[[Clock, "Lifetime access"], [CheckCircle, "No credit card"], [Shield, "Money-back guarantee"]].map(([Icon, text], i) => (
                    <motion.div key={i} className="flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Icon size={16} color={C.gold} />
                      <span className="text-sm" style={{ color: C.muted, fontFamily: "'DM Mono', monospace" }}>{text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>
      
      <footer className="relative z-10 py-12 border-t" style={{ borderColor: C.goldBorder }}>
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="font-black text-lg" style={{ color: C.obsidian, fontFamily: "'Playfair Display', serif" }}>G</span>
            </div>
            <span className="font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif", color: C.white }}>
              Grow<span style={{ color: C.gold }}>X</span>
            </span>
          </div>
          <p className="text-sm" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
            Empowering learners worldwide since 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
