import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, GraduationCap, Briefcase,
  Linkedin, Github, MessageSquare, Send, CheckCircle,
  Clock, Award, X, Globe, Upload, FileText,
  Sparkles, ArrowRight, Zap, Users, Star, Trophy, Target, Calendar,
  MapPin, DollarSign, BookOpen, Clock3, CheckCircle2, ChevronDown, Filter
} from 'lucide-react';
import { API } from '../../config/api';
import { toast } from 'sonner';

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
  experience: '',
  duration: '',
  linkedin: '',
  github: '',
  portfolio: '',
  message: '',
};

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,700;12..96,800&family=DM+Mono:wght@300;400;500&display=swap');
    .ia-root { font-family: 'Bricolage Grotesque', sans-serif; }
    .ia-root *, .ia-root *::before, .ia-root *::after { box-sizing: border-box; }
    .ia-root ::selection { background: ${C.gold}; color: ${C.obsidian}; }
    .ia-inp {
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
    .ia-inp::placeholder { color: ${C.ivoryMuted}; }
    .ia-inp:focus {
      border-color: ${C.gold};
      box-shadow: 0 0 0 3px ${C.goldDim};
    }
    .ia-inp.err { border-color: ${C.rose}; }
    .ia-inp option { background: ${C.surface}; color: ${C.ivory}; }
    .ia-scroll::-webkit-scrollbar { width: 4px; }
    .ia-scroll::-webkit-scrollbar-track { background: transparent; }
    .ia-scroll::-webkit-scrollbar-thumb { background: ${C.surfaceLight}; border-radius: 2px; }
    .ia-pill {
      display: flex; align-items: center; justify-content: center;
      padding: 9px 18px; border-radius: 8px;
      border: 1.5px solid ${C.goldBorder};
      cursor: pointer; font-size: 13px; font-weight: 700;
      color: ${C.ivoryMuted}; background: ${C.charcoal};
      transition: all 0.18s; user-select: none; white-space: nowrap;
    }
    .ia-pill:hover { border-color: ${C.gold}; color: ${C.ivory}; }
    .ia-pill.active {
      border-color: ${C.gold};
      background: ${C.goldDim};
      color: ${C.gold};
      box-shadow: 0 0 0 2px ${C.goldDim};
    }
    .ia-submit {
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
    .ia-submit:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 32px rgba(212,168,83,0.35);
    }
    .ia-submit:disabled { opacity: 0.55; cursor: not-allowed; }
    @media (max-width: 768px) {
      .ia-grid-2 { grid-template-columns: 1fr !important; }
      .ia-full-span { grid-column: span 1 !important; }
    }
  `}</style>
);

function Label({ children, required }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 7,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: C.ivoryMuted, marginBottom: 7,
      fontFamily: "'DM Mono', monospace",
    }}>
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

export default function InternshipApply() {
  const { user } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryName = searchParams.get('category') || '';
  
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ ...INIT, category: categoryName });
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [category, setCategory] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const fileRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryName) {
        setLoadingData(false);
        return;
      }
      try {
        const [catRes, intRes] = await Promise.all([
          axios.get(`${API.category}/name/${encodeURIComponent(categoryName)}`),
          axios.get(`${API.job}/internships?category=${encodeURIComponent(categoryName)}`)
        ]);
        setCategory(catRes.data);
        setInternships(intRes.data.jobs || []);
      } catch (err) {
        console.error('Failed to fetch category/internships', err);
        try {
          const intRes = await axios.get(`${API.job}/internships?category=${encodeURIComponent(categoryName)}`);
          setInternships(intRes.data.jobs || []);
        } catch (e) {
          console.error('Failed to fetch internships', e);
        }
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [categoryName]);

  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const REQUIRED = [
    'fullName', 'email', 'phone', 'gender',
    'college', 'course', 'year', 'city', 'state',
    'experience', 'duration', 'linkedin', 'message',
  ];

  const validate = () => {
    const errs = {};
    REQUIRED.forEach(k => { if (!form[k]?.trim()) errs[k] = 'This field is required'; });
    if (!resume) errs.resume = 'Please upload your resume';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setForm(INIT);
    setResume(null);
    setErrors({});
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
      setTimeout(() => {
        resetForm();
        setDone(false);
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const close = () => { setOpen(false); setTimeout(() => { setDone(false); setForm({ ...INIT, category: categoryName }); setResume(null); setErrors({}); }, 300); };
  const inp = k => `ia-inp${errors[k] ? ' err' : ''}`;

  const getAccentColor = () => category?.color || C.green;

  if (loadingData) {
    return (
      <div className="ia-root" style={{ background: `linear-gradient(135deg,${C.obsidian} 0%,${C.charcoal} 50%,${C.obsidian} 100%)`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, border: `3px solid ${C.goldBorder}`, borderTopColor: C.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: C.ivoryMuted, fontFamily: "'DM Mono', monospace" }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!categoryName) {
    return (
      <div className="ia-root" style={{ background: `linear-gradient(135deg,${C.obsidian} 0%,${C.charcoal} 50%,${C.obsidian} 100%)`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <h2 style={{ color: C.ivory, fontSize: 24, marginBottom: 16 }}>No Category Selected</h2>
          <button onClick={() => navigate('/internships')} style={{ background: C.gold, color: C.obsidian, padding: '12px 24px', borderRadius: 10, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            Browse Internships
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ia-root" style={{ background: `linear-gradient(135deg,${C.obsidian} 0%,${C.charcoal} 50%,${C.obsidian} 100%)`, minHeight: '100vh' }}>
      <Styles />

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${getAccentColor()}15 0%, transparent 70%)`, filter: 'blur(40px)' }}
        />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)`, backgroundSize: '60px 60px' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
        <motion.button
          onClick={() => navigate('/internships')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: `1px solid ${C.goldBorder}`, padding: '8px 16px', borderRadius: 8, color: C.ivoryMuted, cursor: 'pointer', marginBottom: 24, fontSize: 13, fontWeight: 600 }}
        >
          <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} />
          Back to All Internships
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: `linear-gradient(135deg, ${C.surface} 0%, ${C.charcoal} 100%)`,
            border: `1px solid ${getAccentColor()}30`,
            borderRadius: 24,
            padding: 40,
            marginBottom: 32,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            {category?.icon && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  width: 80, height: 80, borderRadius: 20,
                  background: `linear-gradient(135deg, ${getAccentColor()}30, ${getAccentColor()}10)`,
                  border: `2px solid ${getAccentColor()}50`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36,
                  flexShrink: 0,
                }}
              >
                {category.icon}
              </motion.div>
            )}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ padding: '4px 12px', borderRadius: 100, background: `${getAccentColor()}20`, border: `1px solid ${getAccentColor()}40`, color: getAccentColor(), fontSize: 11, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>
                  INTERNSHIP PROGRAM
                </span>
              </div>
              <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: C.ivory, marginBottom: 12, letterSpacing: '-0.02em' }}>
                {categoryName}
              </h1>
              {category?.description && (
                <p style={{ color: C.ivoryMuted, lineHeight: 1.7, marginBottom: 16, maxWidth: 600 }}>
                  {category.description}
                </p>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.ivoryMuted, fontSize: 13 }}>
                  <BookOpen size={14} style={{ color: getAccentColor() }} />
                  <span>{category?.topics?.length || 0} Topics</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.ivoryMuted, fontSize: 13 }}>
                  <Briefcase size={14} style={{ color: getAccentColor() }} />
                  <span>{category?.projects?.length || 0} Projects</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.ivoryMuted, fontSize: 13 }}>
                  <Briefcase size={14} style={{ color: getAccentColor() }} />
                  <span>{internships.length} Open Positions</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {category?.topics?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: `linear-gradient(135deg, ${C.surface} 0%, ${C.charcoal} 100%)`,
              border: `1px solid ${C.goldBorder}`,
              borderRadius: 20,
              padding: 28,
              marginBottom: 32,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 800, color: C.ivory, marginBottom: 16 }}>What You'll Learn</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {category.topics.map((topic, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    padding: '8px 16px',
                    background: `${getAccentColor()}15`,
                    border: `1px solid ${getAccentColor()}30`,
                    borderRadius: 8,
                    color: getAccentColor(),
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {topic}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {category?.projects?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: `linear-gradient(135deg, ${C.surface} 0%, ${C.charcoal} 100%)`,
              border: `1px solid ${C.goldBorder}`,
              borderRadius: 20,
              padding: 28,
              marginBottom: 32,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 800, color: C.ivory, marginBottom: 16 }}>Hands-on Projects</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {category.projects.map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${getAccentColor()}20`, border: `1px solid ${getAccentColor()}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle2 size={14} style={{ color: getAccentColor() }} />
                  </div>
                  <span style={{ color: C.ivory, fontSize: 14 }}>{project}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {internships.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: `linear-gradient(135deg, ${C.surface} 0%, ${C.charcoal} 100%)`,
              border: `1px solid ${C.goldBorder}`,
              borderRadius: 20,
              padding: 28,
              marginBottom: 32,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 800, color: C.ivory, marginBottom: 20 }}>Available Internship Positions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {internships.slice(0, 5).map((job) => (
                <div
                  key={job._id}
                  style={{
                    padding: 16,
                    background: C.charcoal,
                    border: `1px solid ${C.goldBorder}`,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div>
                    <h4 style={{ color: C.ivory, fontWeight: 700, marginBottom: 4 }}>{job.title}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, color: C.ivoryMuted, fontSize: 12 }}>
                      {job.companyId?.name && <span>{job.companyId.name}</span>}
                      {job.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {job.location}</span>}
                      {job.stipendAmount && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={12} /> {job.stipendAmount}/month</span>}
                      {job.duration && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock3 size={12} /> {job.duration}</span>}
                    </div>
                  </div>
                  <div style={{ padding: '8px 16px', background: `${getAccentColor()}20`, border: `1px solid ${getAccentColor()}40`, borderRadius: 8, color: getAccentColor(), fontSize: 12, fontWeight: 700 }}>
                    {job.status === 'open' ? 'Open' : 'Closed'}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: `linear-gradient(135deg, ${C.surface} 0%, ${C.charcoal} 100%)`,
            border: `1px solid ${C.goldBorder}`,
            borderRadius: 24,
            padding: 40,
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.ivory, marginBottom: 8 }}>
              Apply for <span style={{ color: getAccentColor() }}>{categoryName}</span>
            </h2>
            <p style={{ color: C.ivoryMuted }}>Fill in your details to start your internship journey</p>
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <SectionHead icon={User} title="Personal Information" accent={C.gold} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="ia-grid-2">
                <div><Label required>Full Name</Label><input name="fullName" value={form.fullName} onChange={set} placeholder="John Doe" className={inp('fullName')} /><Err msg={errors.fullName} /></div>
                <div><Label required>Email Address</Label><input name="email" type="email" value={form.email} onChange={set} placeholder="john@example.com" className={inp('email')} /><Err msg={errors.email} /></div>
                <div><Label required>Phone Number</Label><input name="phone" value={form.phone} onChange={set} placeholder="+91 9876543210" className={inp('phone')} /><Err msg={errors.phone} /></div>
                <div><Label required>Gender</Label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['Male', 'Female', 'Other'].map(g => (
                      <label key={g} className={`ia-pill${form.gender === g ? ' active' : ''}`} style={{ flex: 1, cursor: 'pointer', minWidth: 80 }}>
                        <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={set} style={{ display: 'none' }} />{g}
                      </label>
                    ))}
                  </div><Err msg={errors.gender} />
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.goldBorder}, transparent)` }} />

            <div>
              <SectionHead icon={GraduationCap} title="Academic Information" accent={C.accent} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="ia-grid-2">
                <div style={{ gridColumn: 'span 2' }}><Label required>College / University</Label><input name="college" value={form.college} onChange={set} placeholder="Your institution name" className={inp('college')} /><Err msg={errors.college} /></div>
                <div><Label required>Course</Label><select name="course" value={form.course} onChange={set} className={inp('course')}><option value="">Select course</option>{COURSES.map(c => <option key={c}>{c}</option>)}</select><Err msg={errors.course} /></div>
                <div><Label required>Year of Study</Label><select name="year" value={form.year} onChange={set} className={inp('year')}><option value="">Select year</option>{YEARS.map(y => <option key={y}>{y}</option>)}</select><Err msg={errors.year} /></div>
                <div><Label required>City</Label><input name="city" value={form.city} onChange={set} placeholder="Your city" className={inp('city')} /><Err msg={errors.city} /></div>
                <div><Label required>State</Label><input name="state" value={form.state} onChange={set} placeholder="Your state" className={inp('state')} /><Err msg={errors.state} /></div>
              </div>
            </div>

            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.goldBorder}, transparent)` }} />

            <div>
              <SectionHead icon={Briefcase} title="Internship Preferences" accent={C.amber} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="ia-grid-2">
                <div>
                  <div style={{ padding: '12px 16px', background: `${getAccentColor()}15`, border: `1px solid ${getAccentColor()}30`, borderRadius: 10, color: getAccentColor(), fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Briefcase size={14} />
                    {categoryName}
                  </div>
                </div>
                <div><Label required>Experience Level</Label><select name="experience" value={form.experience} onChange={set} className={inp('experience')}><option value="">Select level</option>{LEVELS.map(l => <option key={l}>{l}</option>)}</select><Err msg={errors.experience} /></div>
              </div>
              <div style={{ marginTop: 14 }}><Label required>Preferred Duration</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {DURATIONS.map(d => (
                    <label key={d} className={`ia-pill${form.duration === d ? ' active' : ''}`} style={{ cursor: 'pointer' }}>
                      <input type="radio" name="duration" value={d} checked={form.duration === d} onChange={set} style={{ display: 'none' }} />{d}
                    </label>
                  ))}
                </div><Err msg={errors.duration} />
              </div>
            </div>

            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.goldBorder}, transparent)` }} />

            <div>
              <SectionHead icon={Globe} title="Profiles & Resume" accent={C.green} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="ia-grid-2">
                <div><Label required>LinkedIn</Label><input name="linkedin" value={form.linkedin} onChange={set} placeholder="linkedin.com/in/you" className={inp('linkedin')} /><Err msg={errors.linkedin} /></div>
                <div><Label>GitHub <span style={{ color: C.ivoryMuted, fontSize: 10 }}>(optional)</span></Label><input name="github" value={form.github} onChange={set} placeholder="github.com/you" className={inp('github')} /><Err msg={errors.github} /></div>
                <div style={{ gridColumn: 'span 2' }}><Label>Portfolio / Website <span style={{ color: C.ivoryMuted, fontSize: 10 }}>(optional)</span></Label><input name="portfolio" value={form.portfolio} onChange={set} placeholder="yoursite.com" className="ia-inp" /></div>
              </div>
              <div style={{ marginTop: 14, marginBottom: 14 }}>
                <Label required>Resume</Label>
                <div onClick={() => fileRef.current.click()} style={{ width: '100%', border: `1.5px dashed ${errors.resume ? C.rose : resume ? C.green : C.goldBorder}`, borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: resume ? `rgba(52,211,153,0.04)` : errors.resume ? `rgba(244,114,182,0.04)` : C.charcoal, transition: 'all 0.2s', gap: 8 }}>
                  <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => { setResume(e.target.files[0]); setErrors(p => ({ ...p, resume: '' })); }} />
                  {resume ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(52,211,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={15} style={{ color: C.green }} /></div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.green, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resume.name}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.ivoryMuted }}>Ready to submit</div>
                      </div>
                      <button type="button" onClick={ev => { ev.stopPropagation(); setResume(null); }} style={{ marginLeft: 8, background: 'rgba(244,114,182,0.12)', border: 'none', borderRadius: 5, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={11} style={{ color: C.rose }} /></button>
                    </div>
                  ) : (
                    <>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: C.goldDim, border: `1px solid ${C.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Upload size={18} style={{ color: C.gold }} /></div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.ivory }}>Drop your resume here or click to browse</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.ivoryMuted, marginTop: 3 }}>PDF · DOC · DOCX — max 5MB</div>
                      </div>
                    </>
                  )}
                </div><Err msg={errors.resume} />
              </div>
              <div><Label required>Why do you want this internship?</Label><textarea name="message" value={form.message} onChange={set} rows={4} placeholder="Tell us about your motivation, goals, and what you hope to achieve…" className={inp('message')} style={{ resize: 'none' }} /><Err msg={errors.message} /></div>
            </div>

            <motion.button type="submit" disabled={loading} whileHover={!loading ? { scale: 1.015 } : {}} whileTap={!loading ? { scale: 0.985 } : {}} className="ia-submit">
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: `2px solid rgba(10,10,15,0.3)`, borderTopColor: C.obsidian, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Submitting Application…
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Application
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
