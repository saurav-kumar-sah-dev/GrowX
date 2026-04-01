import axios from 'axios';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, GraduationCap, Briefcase,
  Linkedin, Github, MessageSquare, Send, CheckCircle,
  Clock, Award, X, Globe, Upload, FileText,
  Sparkles, ArrowRight, Zap, Users, Star, Trophy, Target, Calendar
} from 'lucide-react';
import { API } from '../../config/api';
import { toast } from 'sonner';

const CATEGORIES = [
  "Software Development", "Web Development", "Android Development", "Cybersecurity",
  "UI/UX Design", "Cloud Computing", "Data Science", "Machine Learning",
  "Java Full Stack Developer", "Python Full Stack Developer", "JS Full Stack Developer",
  "DevOps", "AI/ML with Python", "Blockchain Developer", "Game Development",
];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate", "Post Graduate"];
const COURSES = ["B.Tech", "BCA", "MCA", "B.Sc", "M.Tech", "MBA", "BBA", "Other"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const DURATIONS = ["1 Month", "2 Months", "3 Months", "4 Months", "5 Months", "6 Months"];

const INIT = {
  fullName: '',
  email: '',
  phone: '',
  gender: '',
  college: '',
  course: '',
  year: '',
  city: '',
  state: '',
  category: '',
  experience: '',
  duration: '',
  linkedin: '',
  github: '',
  portfolio: '',
  message: '',
};

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
  surface: "#1A1A24",
  surfaceLight: "#252532",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDark: "#B8923F",
  accent: "#C8884A",
  ivory: "#F5F0E6",
  ivoryMuted: "#A8A099",
  goldBorder: "rgba(212,168,83,0.15)",
  goldDim: "rgba(212,168,83,0.08)",
  goldGlow: "rgba(212,168,83,0.2)",
  green: "#34D399",
  rose: "#F472B6",
  amber: "#FBBF24",
};

const testimonials = [
  { name: "Rohit Sharma", role: "Software Developer", company: "TechCorp", text: "Got placed within 2 months of completing my internship!", rating: 5 },
  { name: "Priya Patel", role: "Web Developer", company: "StartupXYZ", text: "The mentorship was exceptional. Best decision of my career!", rating: 5 },
  { name: "Amit Kumar", role: "Data Analyst", company: "DataFlow Inc", text: "Real projects, real learning. Highly recommended!", rating: 5 },
];

const stats = [
  { icon: Users, value: "500+", label: "Interns Placed" },
  { icon: Trophy, value: "98%", label: "Success Rate" },
  { icon: Award, value: "50+", label: "Hiring Partners" },
  { icon: Calendar, value: "8-12", label: "Weeks Program" },
];

const process = [
  { step: "01", title: "Submit Application", desc: "Fill out the form with your details" },
  { step: "02", title: "Review Process", desc: "Our team reviews your application" },
  { step: "03", title: "Get Selected", desc: "Receive confirmation within 48 hours" },
  { step: "04", title: "Start Learning", desc: "Begin your internship journey" },
];

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,700;12..96,800&family=DM+Mono:wght@300;400;500&display=swap');
    .ap-root { font-family: 'Bricolage Grotesque', sans-serif; }
    .ap-root *, .ap-root *::before, .ap-root *::after { box-sizing: border-box; }
    .ap-root ::selection { background: ${C.gold}; color: ${C.obsidian}; }

    .ap-inp {
      width: 100%;
      background: ${C.charcoal};
      border: 1.5px solid ${C.goldBorder};
      border-radius: 10px;
      padding: 11px 16px;
      font-size: 13.5px;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 500;
      color: ${C.ivory};
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .ap-inp::placeholder { color: ${C.ivoryMuted}; }
    .ap-inp:focus {
      border-color: ${C.gold};
      box-shadow: 0 0 0 3px ${C.goldDim};
    }
    .ap-inp.err { border-color: ${C.rose}; }
    .ap-inp option { background: ${C.surface}; color: ${C.ivory}; }

    .ap-scroll::-webkit-scrollbar { width: 4px; }
    .ap-scroll::-webkit-scrollbar-track { background: transparent; }
    .ap-scroll::-webkit-scrollbar-thumb { background: ${C.surfaceLight}; border-radius: 2px; }

    .ap-pill {
      display: flex; align-items: center; justify-content: center;
      padding: 9px 18px; border-radius: 8px;
      border: 1.5px solid ${C.goldBorder};
      cursor: pointer; font-size: 13px; font-weight: 700;
      color: ${C.ivoryMuted}; background: ${C.charcoal};
      transition: all 0.18s; user-select: none; white-space: nowrap;
    }
    .ap-pill:hover { border-color: ${C.gold}; color: ${C.ivory}; }
    .ap-pill.active {
      border-color: ${C.gold};
      background: ${C.goldDim};
      color: ${C.gold};
      box-shadow: 0 0 0 2px ${C.goldDim};
    }

    @keyframes ap-shimmer {
      0% { transform: translateX(-100%) skewX(-12deg); }
      100% { transform: translateX(200%) skewX(-12deg); }
    }
    .ap-shimmer::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
      animation: ap-shimmer 3s ease-in-out infinite;
      pointer-events: none;
    }

    .ap-step-num {
      width: 22px; height: 22px; border-radius: 6px;
      background: ${C.goldDim};
      border: 1px solid ${C.goldBorder};
      display: flex; align-items: center; justify-content: center;
      font-family: 'DM Mono', monospace;
      font-size: 10px; font-weight: 500; color: ${C.gold};
      flex-shrink: 0;
    }

    .ap-submit {
      width: 100%;
      background: linear-gradient(135deg, ${C.gold} 0%, ${C.accent} 100%);
      color: ${C.obsidian};
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      font-size: 15px;
      padding: 15px 32px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .ap-submit:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 32px rgba(212,168,83,0.35);
    }
    .ap-submit:disabled { opacity: 0.55; cursor: not-allowed; }

    @media (max-width: 640px) {
      .ap-grid-2 { grid-template-columns: 1fr !important; }
    }
    
    @media (max-width: 768px) {
      .ap-card-pad { padding: 32px 20px !important; }
      .ap-grid-2 { grid-template-columns: 1fr !important; }
      .ap-full-span { grid-column: span 1 !important; }
      .ap-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
      .ap-process-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
      .ap-testi-grid { grid-template-columns: 1fr !important; }
      .ap-modal-pad { padding: 20px 16px !important; }
      .ap-btn-resp { width: 100% !important; padding: 16px 24px !important; font-size: 16px !important; }
      .ap-pills-wrap { flex-wrap: wrap !important; }
      .ap-font-xl { font-size: 28px !important; }
      .ap-font-lg { font-size: 16px !important; }
      .ap-font-md { font-size: 14px !important; }
      .ap-gap-sm { gap: 10px !important; }
      .ap-justify-center { justify-content: center !important; }
    }

    @media (max-width: 480px) {
      .ap-card-pad { padding: 24px 14px !important; }
      .ap-stats-grid { grid-template-columns: 1fr !important; }
      .ap-process-grid { grid-template-columns: 1fr !important; }
      .ap-icon-sm { width: 40px !important; height: 40px !important; }
      .ap-font-xl { font-size: 24px !important; }
      .ap-hero-pad { padding: 0 12px !important; }
      .ap-grid-gap { gap: 8px !important; }
      .ap-modal-resp { border-radius: 16px 16px 0 0 !important; max-height: 95vh !important; }
    }
    
    @media (max-width: 380px) {
      .ap-font-xl { font-size: 20px !important; }
      .ap-font-lg { font-size: 13px !important; }
      .ap-btn-resp { padding: 14px 20px !important; font-size: 14px !important; }
      .ap-modal-pad { padding: 16px 12px !important; }
    }
  `}</style>
);

function Label({ children, required, step }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 7,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: C.ivoryMuted, marginBottom: 7,
      fontFamily: "'DM Mono', monospace",
    }}>
      {step && <span className="ap-step-num">{step}</span>}
      {children}
      {required && <span style={{ color: C.rose, fontSize: 10 }}>✦</span>}
    </label>
  );
}

function SectionHead({ icon: Icon, title, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: `${accent}18`,
        border: `1px solid ${accent}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={14} style={{ color: accent }} />
      </div>
      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500, color: C.ivoryMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 1 }}>Section</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: C.ivory, letterSpacing: '-0.01em' }}>{title}</div>
      </div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}25, transparent)`, marginLeft: 8 }} />
    </div>
  );
}

function Err({ msg }) {
  if (!msg) return null;
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      style={{ fontSize: 11, color: C.rose, marginTop: 5, fontFamily: "'DM Mono', monospace", display: 'flex', alignItems: 'center', gap: 4 }}>
      <span>⚠</span> {msg}
    </motion.p>
  );
}

export default function Apply() {
  const { user } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(INIT);
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const REQUIRED = [
    'fullName','email','phone','gender',
    'college','course','year','city','state',
    'category','experience','duration',
    'linkedin','github','message',
  ];

  const validate = () => {
    const errs = {};
    REQUIRED.forEach(k => { if (!form[k]?.trim()) errs[k] = 'This field is required'; });
    if (!resume) errs.resume = 'Please upload your resume';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async e => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }
    if (!validate()) { toast.error('Please fill all required fields'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('resume', resume);
      await axios.post(`${API.internship}/apply`, fd, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });
      setDone(true);
      toast.success('Application submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const close = () => { setOpen(false); setTimeout(() => { setDone(false); setForm(INIT); setResume(null); setErrors({}); }, 300); };
  const inp = k => `ap-inp${errors[k] ? ' err' : ''}`;

  return (
    <div className="ap-root" style={{ background: `linear-gradient(135deg,${C.obsidian} 0%,${C.charcoal} 50%,${C.obsidian} 100%)`, minHeight: '100vh' }}>
      <Styles />
      
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)`, filter: 'blur(40px)' }}
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, rgba(200,136,74,0.06) 0%, transparent 70%)`, filter: 'blur(60px)' }}
        />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
      </div>

      <motion.div
        id="apply"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: 1200, margin: '0 auto 40px', padding: '0 20px', position: 'relative', zIndex: 1 }}
      >
          <motion.div 
          className="ap-shimmer ap-card-pad" 
          style={{
            background: `linear-gradient(135deg, ${C.surface} 0%, ${C.charcoal} 100%)`,
            border: `1px solid ${C.goldBorder}`,
            borderRadius: 32,
            padding: '60px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', border: `1px solid ${C.goldBorder}20`, pointerEvents: 'none' }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', bottom: -150, left: -150, width: 500, height: 500, borderRadius: '50%', border: `1px solid ${C.goldBorder}15`, pointerEvents: 'none' }}
          />

          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.3, backgroundImage: `linear-gradient(rgba(212,168,83,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.03) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 20px', background: `linear-gradient(135deg, ${C.goldDim} 0%, ${C.surface} 100%)`, border: `1px solid ${C.goldBorder}`, borderRadius: 100, marginBottom: 28 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: C.green, boxShadow: `0 0 12px ${C.green}` }}
              />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, color: C.gold, letterSpacing: '0.1em' }}>APPLICATIONS OPEN</span>
            </motion.div>

            <div className="text-center mb-16 ap-hero-pad" style={{ padding: '0 20px' }}>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="ap-font-xl"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: C.ivory, marginBottom: 12 }}
              >
                Start Your <span style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Internship</span> Journey
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="ap-font-lg"
                style={{ fontSize: 18, color: C.ivoryMuted, maxWidth: 650, margin: '0 auto', lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}
              >
                Transform your career with hands-on experience, expert mentorship, and industry-recognized certification. Join 500+ successful interns.
              </motion.p>
            </div>

            <div className="ap-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 60 }}>
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.03, boxShadow: `0 20px 40px rgba(0,0,0,0.3)` }}
                  className="text-center p-8 rounded-2xl relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${C.charcoal} 0%, ${C.surface} 100%)`, border: `1px solid ${C.goldBorder}` }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at center, rgba(212,168,83,0.1) 0%, transparent 70%)` }}
                  />
                  <div className="relative z-10">
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 mx-auto"
                      style={{ background: `linear-gradient(135deg, ${C.goldDim} 0%, ${C.surface} 100%)`, border: `1px solid ${C.goldBorder}` }}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <stat.icon size={28} color={C.gold} />
                    </motion.div>
                    <div className="text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{stat.value}</div>
                    <div className="text-sm font-medium" style={{ color: C.ivoryMuted }}>{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="ap-process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 60 }}>
              {process.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative p-6 rounded-2xl text-center overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${C.charcoal} 0%, ${C.surfaceLight}20 100%)`, border: `1px solid ${C.goldBorder}` }}
                >
                  <div className="absolute top-3 right-3 text-5xl font-bold opacity-10" style={{ fontFamily: "'Playfair Display', serif", color: C.gold }}>{p.step}</div>
                  <div className="font-bold text-base mb-2 relative z-10" style={{ color: C.ivory }}>{p.title}</div>
                  <div className="text-xs relative z-10" style={{ color: C.ivoryMuted }}>{p.desc}</div>
                </motion.div>
              ))}
            </div>

            <div className="ap-justify-center" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 56 }}>
              {[
                { icon: Zap, label: 'Quick Application', color: C.amber },
                { icon: Clock, label: 'Reply in 48 hrs', color: C.gold },
                { icon: Award, label: 'Verified Certificate', color: C.green },
                { icon: Target, label: 'Placement Support', color: C.rose },
              ].map(({ icon: Icon, label, color }, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.2 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: C.charcoal, border: `1px solid ${C.goldBorder}`, borderRadius: 100 }}
                >
                  <Icon size={15} style={{ color }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.ivory }}>{label}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => setOpen(true)}
              whileHover={{ scale: 1.05, boxShadow: `0 20px 60px rgba(212,168,83,0.4)` }}
              whileTap={{ scale: 0.98 }}
              className="ap-btn-resp"
              style={{
                display: 'block', margin: '0 auto',
                background: `linear-gradient(135deg, ${C.gold} 0%, ${C.accent} 50%, ${C.goldDark} 100%)`,
                color: C.obsidian, padding: '18px 56px', borderRadius: 16,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 800, fontSize: 20, border: 'none', cursor: 'pointer',
                boxShadow: `0 10px 40px rgba(212,168,83,0.3)`,
              }}
            >
              <span className="flex items-center gap-3">
                <Sparkles size={22} />
                Apply Now
                <ArrowRight size={22} />
              </span>
            </motion.button>

            <motion.div 
              className="mt-16 pt-10"
              style={{ borderTop: `1px solid ${C.goldBorder}` }}
            >
              <div className="text-center mb-8" style={{ color: C.ivoryMuted, fontSize: 15, fontWeight: 600 }}>What our interns say</div>
              <div className="ap-testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                {testimonials.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    whileHover={{ y: -8, boxShadow: `0 20px 40px rgba(0,0,0,0.3)` }}
                    className="p-6 rounded-2xl relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${C.charcoal} 0%, ${C.surface} 100%)`, border: `1px solid ${C.goldBorder}` }}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 opacity-5" style={{ background: `radial-gradient(circle, ${C.gold} 0%, transparent 70%)` }} />
                    <div className="flex gap-1 mb-4">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill={C.gold} color={C.gold} />)}
                    </div>
                    <p className="text-sm mb-5" style={{ color: C.ivoryMuted, lineHeight: 1.7 }}>"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: C.obsidian }}>
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm" style={{ color: C.ivory }}>{t.name}</div>
                        <div className="text-xs" style={{ color: C.gold }}>{t.role} at {t.company}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(4,6,12,0.8)', backdropFilter: 'blur(20px)' }}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={ev => ev.stopPropagation()}
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}`, borderRadius: 22, width: '100%', maxWidth: 720, maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: `0 32px 80px rgba(0,0,0,0.7)` }}
              className="ap-modal-resp"
            >
              <div style={{ padding: '20px 28px', borderBottom: `1px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.charcoal, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase size={16} style={{ color: C.obsidian }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.ivory }}>Internship Application</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.ivoryMuted }}>All fields marked ✦ are required</div>
                  </div>
                </div>
                <button onClick={close} style={{ width: 34, height: 34, borderRadius: 9, background: C.surfaceLight, border: `1px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={15} style={{ color: C.ivory }} />
                </button>
              </div>

              <div className="ap-scroll ap-modal-pad" style={{ overflowY: 'auto', flex: 1, padding: '28px' }}>
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.div key="done" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 250, damping: 18, delay: 0.1 }} style={{ width: 88, height: 88, borderRadius: '50%', background: `rgba(52,211,153,0.12)`, border: `2px solid rgba(52,211,153,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                        <CheckCircle size={40} style={{ color: C.green }} />
                      </motion.div>
                      <h4 style={{ fontSize: 26, fontWeight: 800, color: C.ivory, marginBottom: 8 }}>Application Received!</h4>
                      <p style={{ fontSize: 14, color: C.ivoryMuted, maxWidth: 300, lineHeight: 1.7, marginBottom: 8 }}>Your application has been submitted successfully. We'll get back to you within 48 hours.</p>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.green, marginBottom: 32 }}>✓ Confirmation sent to {form.email || 'your email'}</div>
                      <motion.button onClick={close} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ padding: '12px 36px', background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: C.obsidian, borderRadius: 10, fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                        Close
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                      <div>
                        <SectionHead icon={User} title="Personal Information" accent={C.gold} />
                        <div className="ap-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <div><Label required>Full Name</Label><input name="fullName" value={form.fullName} onChange={set} placeholder="John Doe" className={inp('fullName')} /><Err msg={errors.fullName} /></div>
                          <div><Label required>Email Address</Label><input name="email" type="email" value={form.email} onChange={set} placeholder="john@example.com" className={inp('email')} /><Err msg={errors.email} /></div>
                          <div><Label required>Phone Number</Label><input name="phone" value={form.phone} onChange={set} placeholder="+91 9876543210" className={inp('phone')} /><Err msg={errors.phone} /></div>
                          <div><Label required>Gender</Label>
                            <div className="ap-pills-wrap" style={{ display: 'flex', gap: 8 }}>
                              {['Male', 'Female', 'Other'].map(g => (<label key={g} className={`ap-pill${form.gender === g ? ' active' : ''}`} style={{ flex: 1, cursor: 'pointer' }}><input type="radio" name="gender" value={g} checked={form.gender === g} onChange={set} style={{ display: 'none' }} />{g}</label>))}
                            </div><Err msg={errors.gender} />
                          </div>
                        </div>
                      </div>

                      <div className="ap-divider" style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.goldBorder}, transparent)`, margin: '20px 0' }} />

                      <div>
                        <SectionHead icon={GraduationCap} title="Academic Information" accent={C.accent} />
                        <div className="ap-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <div className="ap-full-span" style={{ gridColumn: 'span 2' }}><Label required>College / University</Label><input name="college" value={form.college} onChange={set} placeholder="Your institution name" className={inp('college')} /><Err msg={errors.college} /></div>
                          <div><Label required>Course</Label><select name="course" value={form.course} onChange={set} className={inp('course')}><option value="">Select course</option>{COURSES.map(c => <option key={c}>{c}</option>)}</select><Err msg={errors.course} /></div>
                          <div><Label required>Year of Study</Label><select name="year" value={form.year} onChange={set} className={inp('year')}><option value="">Select year</option>{YEARS.map(y => <option key={y}>{y}</option>)}</select><Err msg={errors.year} /></div>
                          <div><Label required>City</Label><input name="city" value={form.city} onChange={set} placeholder="Your city" className={inp('city')} /><Err msg={errors.city} /></div>
                          <div><Label required>State</Label><input name="state" value={form.state} onChange={set} placeholder="Your state" className={inp('state')} /><Err msg={errors.state} /></div>
                        </div>
                      </div>

                      <div className="ap-divider" style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.goldBorder}, transparent)`, margin: '20px 0' }} />

                      <div>
                        <SectionHead icon={Briefcase} title="Internship Preferences" accent={C.amber} />
                        <div className="ap-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                          <div><Label required>Category</Label><select name="category" value={form.category} onChange={set} className={inp('category')}><option value="">Select track</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select><Err msg={errors.category} /></div>
                          <div><Label required>Experience Level</Label><select name="experience" value={form.experience} onChange={set} className={inp('experience')}><option value="">Select level</option>{LEVELS.map(l => <option key={l}>{l}</option>)}</select><Err msg={errors.experience} /></div>
                        </div>
                        <div><Label required>Preferred Duration</Label>
                          <div className="ap-pills-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {DURATIONS.map(d => (<label key={d} className={`ap-pill${form.duration === d ? ' active' : ''}`} style={{ cursor: 'pointer' }}><input type="radio" name="duration" value={d} checked={form.duration === d} onChange={set} style={{ display: 'none' }} />{d}</label>))}
                          </div><Err msg={errors.duration} />
                        </div>
                      </div>

                      <div className="ap-divider" style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.goldBorder}, transparent)`, margin: '20px 0' }} />

                      <div>
                        <SectionHead icon={Globe} title="Profiles & Resume" accent={C.green} />
                        <div className="ap-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                          <div><Label required>LinkedIn</Label><input name="linkedin" value={form.linkedin} onChange={set} placeholder="linkedin.com/in/you" className={inp('linkedin')} /><Err msg={errors.linkedin} /></div>
                          <div><Label required>GitHub</Label><input name="github" value={form.github} onChange={set} placeholder="github.com/you" className={inp('github')} /><Err msg={errors.github} /></div>
                          <div className="ap-full-span" style={{ gridColumn: 'span 2' }}><Label>Portfolio / Website <span style={{ color: C.ivoryMuted, fontSize: 10 }}>(optional)</span></Label><input name="portfolio" value={form.portfolio} onChange={set} placeholder="yoursite.com" className="ap-inp" /></div>
                        </div>
                        <div style={{ marginBottom: 14 }}>
                          <Label required>Resume</Label>
                          <div onClick={() => fileRef.current.click()} style={{ width: '100%', border: `1.5px dashed ${errors.resume ? C.rose : resume ? C.green : C.goldBorder}`, borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: resume ? `rgba(52,211,153,0.04)` : errors.resume ? `rgba(244,114,182,0.04)` : C.charcoal, transition: 'all 0.2s', gap: 8 }}>
                            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => { setResume(e.target.files[0]); setErrors(p => ({ ...p, resume: '' })); }} />
                            {resume ? (<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(52,211,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={15} style={{ color: C.green }} /></div><div><div style={{ fontSize: 13, fontWeight: 700, color: C.green, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resume.name}</div><div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.ivoryMuted }}>Ready to submit</div></div><button type="button" onClick={ev => { ev.stopPropagation(); setResume(null); }} style={{ marginLeft: 8, background: 'rgba(244,114,182,0.12)', border: 'none', borderRadius: 5, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={11} style={{ color: C.rose }} /></button></div>) : (<><div style={{ width: 40, height: 40, borderRadius: 10, background: C.goldDim, border: `1px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Upload size={18} style={{ color: C.gold }} /></div><div style={{ textAlign: 'center' }}><div style={{ fontSize: 13, fontWeight: 700, color: C.ivory }}>Drop your resume here or click to browse</div><div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.ivoryMuted, marginTop: 3 }}>PDF · DOC · DOCX — max 5MB</div></div></>)}
                          </div><Err msg={errors.resume} />
                        </div>
                        <div><Label required>Why do you want this internship?</Label><textarea name="message" value={form.message} onChange={set} rows={4} placeholder="Tell us about your motivation, goals, and what you hope to achieve…" className={inp('message')} style={{ resize: 'none' }} /><Err msg={errors.message} /></div>
                      </div>

                      <motion.button type="submit" disabled={loading} whileHover={!loading ? { scale: 1.015 } : {}} whileTap={!loading ? { scale: 0.985 } : {}} className="ap-submit">
                        {loading ? (<><div style={{ width: 18, height: 18, border: `2px solid rgba(10,10,15,0.3)`, borderTopColor: C.obsidian, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Submitting Application…</>) : (<><Send size={16} />Submit Application<ArrowRight size={16} /></>)}
                      </motion.button>
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
