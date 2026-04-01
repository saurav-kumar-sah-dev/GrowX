import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, Star, Zap, Shield, Sparkles, Download, Headphones, Gift } from 'lucide-react';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#0D1017",
  surface: "#151820",
  card: "#1A1D26",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
  green: "#34D399",
  sky: "#38BDF8",
  violet: "#818CF8",
};

const REASONS = [
  { icon: Star, title: 'Professional Templates', desc: 'Designed by HR experts and recruiters from top companies', stats: '10+ Premium Templates', color: C.gold },
  { icon: Zap, title: 'Quick & Easy', desc: 'Build your resume in minutes with our intuitive editor', stats: '5 Min Average Time', color: C.goldLight },
  { icon: CheckCircle, title: 'ATS-Optimized', desc: 'Pass Applicant Tracking Systems and reach recruiters', stats: '95% ATS Pass Rate', color: C.green },
  { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and never shared with third parties', stats: '100% Data Privacy', color: C.sky },
];

const HIGHLIGHTS = [
  { icon: Gift, value: 'Free', label: 'Forever Plan' },
  { icon: Headphones, value: '24/7', label: 'Support' },
  { icon: Download, value: 'Instant', label: 'PDF Download' },
];

function ReasonCard({ reason, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative rounded-2xl p-6 group overflow-hidden"
      style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}
      whileHover={{ y: -5, borderColor: reason.color + "40" }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at center, ${reason.color}10 0%, transparent 70%)` }}
      />

      <div className="relative z-10 flex items-start gap-5">
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: reason.color + "15", border: `1px solid ${reason.color}30` }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <reason.icon size={28} color={reason.color} />
        </motion.div>

        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: C.white }}>
            {reason.title}
          </h3>
          <p className="text-sm mb-4" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
            {reason.desc}
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
            style={{ background: reason.color + "15", color: reason.color, border: `1px solid ${reason.color}30` }}
          >
            <CheckCircle size={14} />
            {reason.stats}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HighlightCard({ icon: Icon, value, label, delay }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: C.goldDim }}>
        <Icon size={24} color={C.gold} />
      </div>
      <div className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: C.gold }}>
        {value}
      </div>
      <div className="text-sm" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </div>
    </motion.div>
  );
}

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-4 relative overflow-hidden" style={{ background: C.charcoal }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)",
        backgroundSize: "50px 50px"
      }} />

      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
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
            <Sparkles size={14} color={C.gold} />
            <span className="text-xs font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
              WHY CHOOSE US
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.white }}>
            Why Choose <span style={{ color: C.gold }}>GrowX</span> Resume Builder?
          </h2>

          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
            We're not just another resume builder. Here's what makes us different.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {REASONS.map((reason, idx) => (
            <ReasonCard key={idx} reason={reason} index={idx} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative rounded-3xl p-8 md:p-12 overflow-hidden"
          style={{ background: C.obsidian, border: `1px solid ${C.goldBorder}` }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: C.gold }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: C.violet }} />

          <div className="relative z-10 grid sm:grid-cols-3 gap-8 text-center">
            {HIGHLIGHTS.map((item, idx) => (
              <HighlightCard key={idx} {...item} delay={0.5 + idx * 0.1} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
