import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  PlayCircle, Search, CheckCircle2, BookOpen, 
  Code2, Smartphone, Server, Database, Terminal, Wrench, Rocket,
  Layers, Sparkles, Trophy, ArrowLeft, TrendingUp, Target, CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#0D1017",
  surface: "#151820",
  surfaceLight: "#1C1F28",
  card: "#1A1D26",
  cardHover: "#22252F",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
  goldBorderHover: "rgba(212,168,83,0.3)",
  sky: "#38BDF8",
  skyDim: "rgba(56,189,248,0.1)",
  violet: "#818CF8",
  violetDim: "rgba(129,140,248,0.1)",
  green: "#34D399",
  greenDim: "rgba(52,211,153,0.1)",
  amber: "#FBBF24",
  rose: "#FB7185",
  roseDim: "rgba(251,113,133,0.1)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
  dim: "#2A2E3A",
};

const ROADMAP = {
  fundamentals: [
    { title: "HTML Tutorial", url: "https://youtu.be/rklidcZ-aLU", tag: "HTML", img: "https://img.youtube.com/vi/rklidcZ-aLU/hqdefault.jpg" },
    { title: "CSS Tutorial", url: "https://youtu.be/ESnrn1kAD4E", tag: "CSS", img: "https://img.youtube.com/vi/ESnrn1kAD4E/hqdefault.jpg" },
  ],
  frontend: [
    { title: "React.js Tutorial", url: "https://youtu.be/eILUmCJhl64", tag: "React", img: "https://img.youtube.com/vi/eILUmCJhl64/hqdefault.jpg" },
    { title: "Angular Tutorial", url: "https://youtu.be/44b90hAMMIo", tag: "Angular", img: "https://img.youtube.com/vi/44b90hAMMIo/hqdefault.jpg" },
    { title: "Bootstrap Tutorial", url: "https://youtu.be/fB00t4At0rk", tag: "Bootstrap", img: "https://img.youtube.com/vi/fB00t4At0rk/hqdefault.jpg" },
    { title: "Tailwind CSS Tutorial", url: "https://youtu.be/lT5SkATRWGQ", tag: "Tailwind", img: "https://img.youtube.com/vi/lT5SkATRWGQ/hqdefault.jpg" },
  ],
  backend: [
    { title: "Node.js Tutorial", url: "https://youtu.be/gxHXPmePnvo", tag: "Node.js", img: "https://img.youtube.com/vi/gxHXPmePnvo/hqdefault.jpg" },
    { title: "Spring Boot Tutorial", url: "https://youtu.be/fmX84zu-5gs", tag: "Spring Boot", img: "https://img.youtube.com/vi/fmX84zu-5gs/hqdefault.jpg" },
    { title: "Django Tutorial", url: "https://youtu.be/6tdfhlIoxOw", tag: "Django", img: "https://img.youtube.com/vi/6tdfhlIoxOw/hqdefault.jpg" },
  ],
  databases: [
    { title: "MongoDB Tutorial", url: "https://youtu.be/tww-gbNPOcA", tag: "MongoDB", img: "https://img.youtube.com/vi/tww-gbNPOcA/hqdefault.jpg" },
    { title: "Firebase Tutorial", url: "https://youtu.be/SOoGd4Ult1o", tag: "Firebase", img: "https://img.youtube.com/vi/SOoGd4Ult1o/hqdefault.jpg" },
    { title: "MySQL Tutorial", url: "https://youtu.be/hlGoQC332VM", tag: "MySQL", img: "https://img.youtube.com/vi/hlGoQC332VM/hqdefault.jpg" },
  ],
  languages: [
    { title: "C Tutorial", url: "https://youtu.be/irqbmMNs2Bo", tag: "C", img: "https://img.youtube.com/vi/irqbmMNs2Bo/hqdefault.jpg" },
    { title: "C++ Tutorial", url: "https://youtu.be/e7sAf4SbS_g", tag: "C++", img: "https://img.youtube.com/vi/e7sAf4SbS_g/hqdefault.jpg" },
    { title: "Java Tutorial", url: "https://youtu.be/yRpLlJmRo2w", tag: "Java", img: "https://img.youtube.com/vi/yRpLlJmRo2w/hqdefault.jpg" },
    { title: "Python Tutorial", url: "https://youtu.be/ERCMXc8x7mc", tag: "Python", img: "https://img.youtube.com/vi/ERCMXc8x7mc/hqdefault.jpg" },
    { title: "JavaScript Tutorial", url: "https://youtu.be/cPoXLj24BDY", tag: "JavaScript", img: "https://img.youtube.com/vi/cPoXLj24BDY/hqdefault.jpg" },
  ],
  tools: [
    { title: "GitHub Tutorial", url: "https://youtu.be/Ez8F0nW6S-w", tag: "GitHub", img: "https://img.youtube.com/vi/Ez8F0nW6S-w/hqdefault.jpg" },
    { title: "Docker Tutorial", url: "https://youtu.be/exmSJpJvIPs", tag: "Docker", img: "https://img.youtube.com/vi/exmSJpJvIPs/hqdefault.jpg" },
  ],
};

const TAB_META = {
  fundamentals: { label: "Fundamentals", Icon: Layers, hint: "Start here", color: "#38BDF8", bg: "rgba(56,189,248,0.1)" },
  frontend: { label: "Frontend", Icon: Code2, hint: "UI & Frameworks", color: "#818CF8", bg: "rgba(129,140,248,0.1)" },
  backend: { label: "Backend", Icon: Server, hint: "APIs & Servers", color: "#FBBF24", bg: "rgba(251,191,36,0.1)" },
  databases: { label: "Databases", Icon: Database, hint: "Data Layer", color: "#FB7185", bg: "rgba(251,113,133,0.1)" },
  languages: { label: "Languages", Icon: Terminal, hint: "Core Languages", color: "#A78BFA", bg: "rgba(167,139,250,0.1)" },
  tools: { label: "Tools", Icon: Wrench, hint: "DevOps", color: "#22D3EE", bg: "rgba(34,211,238,0.1)" },
};

const TAG_COLOR = {
  HTML: "#E34C26", CSS: "#264de4", React: "#61DAFB", Angular: "#DD0031",
  Bootstrap: "#7952B3", Tailwind: "#38BDF8", "Node.js": "#68A063",
  "Spring Boot": "#6DB33F", Django: "#0C4B33", MongoDB: "#47A248",
  Firebase: "#FFCA28", MySQL: "#00758F", C: "#A8B9CC", "C++": "#00599C",
  Java: "#F89820", Python: "#3776AB", JavaScript: "#F7DF1E",
  TypeScript: "#3178C6", GitHub: "#C9D1D9", Docker: "#2496ED",
};

const STORAGE_KEY = "growx-learning-progress";

function useProgress() {
  const [progress, setProgress] = useState({});
  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE_KEY); if (r) setProgress(JSON.parse(r)); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch {}
  }, [progress]);
  const toggle = (url) => setProgress(p => ({ ...p, [url]: !p[url] }));
  const reset = () => { if (confirm("Reset all progress?")) setProgress({}); };
  const stats = useMemo(() => {
    const all = Object.values(ROADMAP).flat();
    const done = all.filter(i => progress[i.url]).length;
    return { done, total: all.length, pct: all.length ? Math.round(100 * done / all.length) : 0 };
  }, [progress]);
  return { progress, toggle, reset, stats };
}

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay }}>
      {children}
    </motion.div>
  );
}

function CourseCard({ item, isDone, onToggle, idx }) {
  const tagColor = TAG_COLOR[item.tag] || C.gold;
  const tagTextColor = ["JavaScript", "Firebase", "MySQL", "GitHub"].includes(item.tag) ? "#111" : "#fff";
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div className="relative rounded-xl overflow-hidden cursor-pointer w-full"
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04, duration: 0.3 }}
      whileHover={{ y: -3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: C.card,
        border: `1px solid ${isDone ? C.green + "40" : isHovered ? C.goldBorderHover : C.goldBorder}`,
        boxShadow: isHovered ? "0 8px 30px rgba(0,0,0,0.3)" : "none",
        transition: "all 0.2s ease",
      }}>
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <motion.img src={item.img} alt={item.title} loading="lazy" className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }} transition={{ duration: 0.3 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        
        <motion.div className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: isHovered ? 1 : 0 }}>
          <motion.a href={item.url} target="_blank" rel="noreferrer" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
            style={{ boxShadow: "0 0 0 6px rgba(212,168,83,0.2), 0 6px 20px rgba(0,0,0,0.4)" }}>
            <PlayCircle size={22} color="#0A0A0F" fill="#0A0A0F" />
          </motion.a>
        </motion.div>
        
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-sm"
            style={{ background: tagColor, color: tagTextColor }}>
            {item.tag}
          </span>
        </div>
        
        {isDone && (
          <motion.div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1"
            style={{ background: C.green, color: C.obsidian }}
            initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <CheckCircle2 size={10} /> DONE
          </motion.div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2" style={{ color: isHovered ? C.gold : C.white, transition: "color 0.2s" }}>
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: C.goldBorder }}>
          <motion.button className="flex items-center gap-1.5 text-[11px]"
            style={{ color: isDone ? C.green : C.muted }}
            whileHover={{ color: C.gold }}
            onClick={() => onToggle(item.url)}>
            <div className="w-3.5 h-3.5 rounded border flex items-center justify-center"
              style={{ background: isDone ? C.green : "transparent", borderColor: isDone ? C.green : C.dim }}>
              {isDone && <CheckCircle2 size={10} color={C.obsidian} />}
            </div>
            {isDone ? "Completed" : "Mark done"}
          </motion.button>
          
          <motion.a className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium"
            href={item.url} target="_blank" rel="noreferrer"
            style={{ background: C.goldDim, color: C.gold }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <PlayCircle size={11} /> Watch
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

export default function LearningPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("fundamentals");
  const [query, setQuery] = useState("");
  const { progress, toggle, stats } = useProgress();
  
  const filteredItems = useMemo(() => {
    const items = ROADMAP[activeTab] || [];
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(i => [i.title, i.tag].join(" ").toLowerCase().includes(q));
  }, [activeTab, query]);
  
  const tabStats = useMemo(() => {
    const result = {};
    Object.entries(ROADMAP).forEach(([key, items]) => {
      result[key] = { total: items.length, done: items.filter(i => progress[i.url]).length };
    });
    return result;
  }, [progress]);
  
  const activeColor = TAB_META[activeTab]?.color || C.gold;
  const ActiveIcon = TAB_META[activeTab]?.Icon;

  const chartData = useMemo(() => {
    return Object.entries(TAB_META).map(([key, meta]) => ({
      name: meta.label,
      completed: tabStats[key]?.done || 0,
      remaining: (tabStats[key]?.total || 0) - (tabStats[key]?.done || 0),
      fill: meta.color,
    }));
  }, [tabStats]);

  return (
    <div className="min-h-screen p-5 sm:p-8" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } }}
          className="relative rounded-3xl overflow-hidden p-6 sm:p-8"
          style={{ background: 'linear-gradient(135deg,rgba(212,168,83,0.2) 0%,rgba(30,41,59,0.95) 100%)', border: '1px solid rgba(212,168,83,0.2)' }}>
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(212,168,83,0.4),transparent 70%)' }} />
          <div className="absolute -bottom-8 left-1/4 w-32 h-32 rounded-full"
            style={{ background: 'radial-gradient(circle,rgba(52,211,153,0.3),transparent 70%)' }} />
          
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                style={{ background: 'rgba(212,168,83,0.2)', border: '1px solid rgba(212,168,83,0.3)' }}>
                <BookOpen size={12} style={{ color: '#D4A853' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#D4A853', letterSpacing: '0.1em' }}>LEARNING</span>
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Learning <span style={{ background: 'linear-gradient(135deg, #D4A853, #E8C17A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard</span>
              </h1>
              <p className="text-white/50 text-sm mt-2 max-w-md">
                Track your learning progress and complete courses.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-black text-white">{stats.pct}%</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{stats.done}/{stats.total} Completed</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { title: 'Total Courses', value: stats.total, icon: BookOpen, color: '#6366F1' },
            { title: 'Completed', value: stats.done, icon: CheckCircle, color: '#10B981' },
            { title: 'In Progress', value: stats.total - stats.done, icon: TrendingUp, color: '#F59E0B' },
            { title: 'Progress', value: stats.pct + '%', icon: Target, color: '#EC4899' },
          ].map((stat, i) => (
            <motion.div key={stat.title} {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.08 + i * 0.04 } }}
              className="rounded-2xl p-4"
              style={{ background: `${stat.color}10`, border: `1px solid ${stat.color}30` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${stat.color}20` }}>
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: stat.color }}>{stat.title}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.1 } }}
            className="rounded-2xl p-5"
            style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">Learning Progress</h3>
              <TrendingUp size={16} style={{ color: '#D4A853' }} />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <rect key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.12 } }}
            className="rounded-2xl p-5"
            style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">Completion Rate</h3>
              <CheckCircle size={16} style={{ color: '#10B981' }} />
            </div>
            <div className="flex items-center justify-center h-40">
              <div className="relative">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle cx="72" cy="72" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                  <circle cx="72" cy="72" r="60" fill="none" stroke="#10B981" strokeWidth="12"
                    strokeDasharray={`${stats.pct * 3.77} 377`}
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.5))' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">{stats.pct}%</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Complete</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#10B981' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Completed ({stats.done})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#D4A853' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Remaining ({stats.total - stats.done})</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div {...{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.2 } }}
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="p-4 border-b flex items-center gap-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${activeColor}20` }}>
              {ActiveIcon && <ActiveIcon size={18} style={{ color: activeColor }} />}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">{TAB_META[activeTab]?.label}</h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{TAB_META[activeTab]?.hint}</p>
            </div>
            <div className="flex items-center gap-2">
              <Search size={16} style={{ color: '#7A7F8A' }} />
              <input
                className="bg-transparent text-sm outline-none w-40"
                style={{ color: '#fff' }}
                placeholder="Search..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="p-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Search size={40} style={{ color: '#2A2E3A' }} className="mx-auto mb-3" />
                <p style={{ color: '#7A7F8A' }}>No courses found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item, i) => (
                  <CourseCard key={item.url} item={item} idx={i} isDone={!!progress[item.url]} onToggle={toggle} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
