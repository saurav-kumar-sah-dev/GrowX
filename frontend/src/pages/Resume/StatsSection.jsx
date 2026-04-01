import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, FileText, Award, TrendingUp, Star, CheckCircle, Download, Zap } from 'lucide-react';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
  surface: "#1A1A24",
  surfaceLight: "#252532",
  card: "#1A1D26",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDark: "#B8923F",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
  goldGlow: "rgba(212,168,83,0.12)",
  ivory: "#F5F0E6",
  ivoryMuted: "#A8A099",
  accent: "#C8884A",
};

function Counter({ value, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  const prefix = value.match(/^[^0-9]*/)?.[0] || "";
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function StatCard({ icon: Icon, value, label, delay }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative rounded-2xl p-6 overflow-hidden group"
      style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(circle at center, rgba(212,168,83,0.12) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 text-center">
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
          style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Icon size={28} color={C.gold} />
        </motion.div>

        <div className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: C.gold }}>
          <Counter value={value} />
        </div>

        <div className="text-sm font-medium" style={{ color: C.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
          {label}
        </div>
      </div>

      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ background: C.gold }} />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full blur-2xl opacity-10" style={{ background: C.accent }} />
    </motion.div>
  );
}

function HighlightCard({ icon: Icon, title, description }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-4 p-4 rounded-xl"
      style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
      whileHover={{ x: 10 }}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: C.goldDim }}>
        <Icon size={24} color={C.gold} />
      </div>
      <div>
        <h4 className="font-semibold" style={{ color: C.ivory }}>{title}</h4>
        <p className="text-sm" style={{ color: C.ivoryMuted }}>{description}</p>
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const stats = [
    { icon: Users, value: "1000+", label: "Job Seekers" },
    { icon: FileText, value: "10+", label: "Templates" },
    { icon: Award, value: "500+", label: "Resumes Created" },
    { icon: TrendingUp, value: "90%", label: "Success Rate" },
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden" style={{ background: C.charcoal }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: C.gold }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: C.accent }} />

      <div className="max-w-7xl mx-auto relative z-10" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
          >
            <TrendingUp size={14} color={C.gold} />
            <span className="text-xs font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
              TRUSTED BY PROFESSIONALS
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>
            Numbers That <span style={{ color: C.gold }}>Speak</span>
          </h2>

          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: C.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
            Join thousands of professionals who have successfully landed their dream jobs
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} delay={idx * 0.1} />
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <HighlightCard icon={CheckCircle} title="Verified Quality" description="All templates reviewed by HR experts" />
          <HighlightCard icon={Download} title="Instant Download" description="Export PDF in one click" />
          <HighlightCard icon={Zap} title="Fast Processing" description="Create resume in under 5 minutes" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl"
            style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
          >
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={18} fill={C.gold} color={C.gold} />
              ))}
            </div>
            <span className="text-base font-medium" style={{ color: C.ivory, fontFamily: "'DM Sans', sans-serif" }}>
              4.8/5 average rating
            </span>
            <span className="w-px h-6 mx-2" style={{ background: C.goldBorder }} />
            <span className="text-base" style={{ color: C.ivoryMuted }}>from 500+ reviews</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
