import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  PlayCircle, Search, CheckCircle2,
  Layers, Code2, Smartphone, Server, Database, Terminal, Wrench, Rocket,
  Menu, X, Sparkles, Trophy, ListChecks,
} from "lucide-react";

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
    { title: "Material UI Tutorial", url: "https://youtu.be/GE9bRdg4NTQ", tag: "Material UI", img: "https://img.youtube.com/vi/GE9bRdg4NTQ/hqdefault.jpg" },
  ],
  "App Development": [
    { title: "React Native Tutorial", url: "https://youtu.be/LuNPCSNr-nE", tag: "React Native", img: "https://img.youtube.com/vi/LuNPCSNr-nE/hqdefault.jpg" },
    { title: "Flutter Tutorial", url: "https://youtu.be/1bQwDO88Gyw", tag: "Flutter", img: "https://img.youtube.com/vi/1bQwDO88Gyw/hqdefault.jpg" },
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
    { title: "TypeScript Tutorial", url: "https://youtu.be/oTam-6tHew4", tag: "TypeScript", img: "https://img.youtube.com/vi/oTam-6tHew4/hqdefault.jpg" },
  ],
  tools: [
    { title: "GitHub Tutorial", url: "https://youtu.be/Ez8F0nW6S-w", tag: "GitHub", img: "https://img.youtube.com/vi/Ez8F0nW6S-w/hqdefault.jpg" },
    { title: "Docker Tutorial", url: "https://youtu.be/exmSJpJvIPs", tag: "Docker", img: "https://img.youtube.com/vi/exmSJpJvIPs/hqdefault.jpg" },
  ],
  projects: [
    { title: "MERN Stack Project", url: "https://youtu.be/JMvWrx_rLw4", tag: "MERN", img: "https://img.youtube.com/vi/JMvWrx_rLw4/hqdefault.jpg" },
    { title: "Spring Boot + Java Project", url: "https://youtu.be/7SBcUjgZRoY", tag: "Spring Boot", img: "https://img.youtube.com/vi/7SBcUjgZRoY/hqdefault.jpg" },
    { title: "Django Project", url: "https://youtu.be/5n8FKv19os0", tag: "Django", img: "https://img.youtube.com/vi/5n8FKv19os0/hqdefault.jpg" },
  ],
};

const TAB_META = {
  fundamentals: { label: "Fundamentals", Icon: Layers, hint: "Start here", color: "#38BDF8", bg: "rgba(56,189,248,0.1)" },
  frontend: { label: "Frontend", Icon: Code2, hint: "UI & Frameworks", color: "#818CF8", bg: "rgba(129,140,248,0.1)" },
  "App Development": { label: "App Dev", Icon: Smartphone, hint: "iOS & Android", color: "#34D399", bg: "rgba(52,211,153,0.1)" },
  backend: { label: "Backend", Icon: Server, hint: "APIs & Servers", color: "#FBBF24", bg: "rgba(251,191,36,0.1)" },
  databases: { label: "Databases", Icon: Database, hint: "Data Layer", color: "#FB7185", bg: "rgba(251,113,133,0.1)" },
  languages: { label: "Languages", Icon: Terminal, hint: "Core Languages", color: "#A78BFA", bg: "rgba(167,139,250,0.1)" },
  tools: { label: "Tools", Icon: Wrench, hint: "DevOps", color: "#22D3EE", bg: "rgba(34,211,238,0.1)" },
  projects: { label: "Projects", Icon: Rocket, hint: "Build & Deploy", color: "#F97316", bg: "rgba(249,115,22,0.1)" },
};

const TAG_COLOR = {
  HTML: "#E34C26", CSS: "#264de4", React: "#61DAFB", Angular: "#DD0031",
  Bootstrap: "#7952B3", Tailwind: "#38BDF8", "Material UI": "#0081CB",
  "React Native": "#61DAFB", Flutter: "#54C5F8", "Node.js": "#68A063",
  "Spring Boot": "#6DB33F", Django: "#0C4B33", MongoDB: "#47A248",
  Firebase: "#FFCA28", MySQL: "#00758F", C: "#A8B9CC", "C++": "#00599C",
  Java: "#F89820", Python: "#3776AB", JavaScript: "#F7DF1E",
  TypeScript: "#3178C6", GitHub: "#C9D1D9", Docker: "#2496ED",
  MERN: "#38BDF8",
};

const STORAGE_KEY = "growx-progress-v7";

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
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
}

function CourseCard({ item, isDone, onToggle, idx }) {
  const tagColor = TAG_COLOR[item.tag] || C.gold;
  const tagTextColor = ["JavaScript", "Firebase", "MySQL", "GitHub"].includes(item.tag) ? "#111" : "#fff";
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden cursor-pointer w-full"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04, duration: 0.3 }}
      whileHover={{ y: -3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: C.card,
        border: `1px solid ${isDone ? C.green + "40" : isHovered ? C.goldBorderHover : C.goldBorder}`,
        boxShadow: isHovered ? "0 8px 30px rgba(0,0,0,0.3)" : "none",
        transition: "all 0.2s ease",
      }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <motion.img 
          src={item.img} 
          alt={item.title} 
          loading="lazy" 
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <motion.a 
            href={item.url} 
            target="_blank" 
            rel="noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
            style={{ boxShadow: "0 0 0 6px rgba(212,168,83,0.2), 0 6px 20px rgba(0,0,0,0.4)" }}
          >
            <PlayCircle size={22} color="#0A0A0F" fill="#0A0A0F" />
          </motion.a>
        </motion.div>
        
        <div className="absolute top-2 left-2">
          <span 
            className="px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-sm"
            style={{ background: tagColor, color: tagTextColor, fontFamily: "'DM Sans', sans-serif" }}
          >
            {item.tag}
          </span>
        </div>
        
        {isDone && (
          <motion.div 
            className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1"
            style={{ background: C.green, color: C.obsidian, fontFamily: "'DM Sans', sans-serif" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <CheckCircle2 size={10} /> DONE
          </motion.div>
        )}
      </div>

      <div className="p-3">
        <h3 
          className="font-semibold text-sm mb-2 line-clamp-2"
          style={{ fontFamily: "'DM Sans', sans-serif", color: isHovered ? C.gold : C.white, transition: "color 0.2s" }}
        >
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: C.goldBorder }}>
          <motion.button 
            className="flex items-center gap-1.5 text-[11px]"
            style={{ fontFamily: "'DM Mono', monospace", color: isDone ? C.green : C.muted }}
            whileHover={{ color: C.gold }}
            onClick={() => onToggle(item.url)}
          >
            <div 
              className="w-3.5 h-3.5 rounded border flex items-center justify-center"
              style={{ background: isDone ? C.green : "transparent", borderColor: isDone ? C.green : C.dim }}
            >
              {isDone && <CheckCircle2 size={10} color={C.obsidian} />}
            </div>
            {isDone ? "Completed" : "Mark done"}
          </motion.button>
          
          <motion.a 
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium"
            href={item.url} 
            target="_blank" 
            rel="noreferrer"
            style={{ background: C.goldDim, color: C.gold, fontFamily: "'DM Sans', sans-serif" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlayCircle size={11} /> Watch
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

function Sidebar({ activeTab, setActiveTab, tabStats, stats, isOpen, setIsOpen }) {
  return (
    <>
      <aside 
        className="hidden lg:flex flex-col w-64 xl:w-72 h-screen sticky top-0 flex-shrink-0"
        style={{ background: C.charcoal, borderRight: `1px solid ${C.goldBorder}` }}
      >
        <div className="p-5 border-b" style={{ borderColor: C.goldBorder }}>
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 5, scale: 1.05 }}
              style={{ boxShadow: "0 4px 15px rgba(212,168,83,0.3)" }}
            >
              <span className="font-black text-xl" style={{ color: C.obsidian, fontFamily: "'Playfair Display', serif" }}>G</span>
            </motion.div>
            <div>
              <span className="font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif", color: C.white }}>
                Grow<span style={{ color: C.gold }}>X</span>
              </span>
              <div className="text-[10px]" style={{ color: C.muted, fontFamily: "'DM Mono', monospace" }}>Learning Platform</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-b" style={{ borderColor: C.goldBorder }}>
          <div className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider" style={{ color: C.muted, fontFamily: "'DM Mono', monospace" }}>Overall Progress</span>
              <span className="font-bold" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>{stats.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.dim }}>
              <motion.div 
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.pct}%` }}
                style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px]" style={{ color: C.muted }}>{stats.done} of {stats.total}</span>
              <span className="text-[10px]" style={{ color: C.green }}>completed</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="text-[10px] uppercase tracking-wider px-3 py-2 mb-2" style={{ color: C.muted, fontFamily: "'DM Mono', monospace" }}>
            Categories
          </div>
          
          {Object.entries(TAB_META).map(([key, meta]) => {
            const { label, Icon, color, bg } = meta;
            const isActive = activeTab === key;
            const pct = tabStats[key]?.total ? Math.round(100 * (tabStats[key]?.done || 0) / tabStats[key]?.total) : 0;
            
            return (
              <motion.button
                key={key}
                className="w-full flex items-center gap-3 p-3 rounded-xl mb-1 transition-all relative"
                onClick={() => setActiveTab(key)}
                whileHover={{ x: 4 }}
                style={{
                  background: isActive ? bg : "transparent",
                  border: `1px solid ${isActive ? color + "30" : "transparent"}`
                }}
              >
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r" style={{ background: color }} />
                )}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: isActive ? color + "20" : C.surface }}>
                  <Icon size={16} color={isActive ? color : C.muted} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: isActive ? color : C.white }}>{label}</div>
                  <div className="text-[10px]" style={{ fontFamily: "'DM Mono', monospace", color: C.muted }}>
                    {tabStats[key]?.done || 0}/{tabStats[key]?.total || 0} lessons
                  </div>
                </div>
                {pct > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: C.greenDim, color: C.green, fontFamily: "'DM Mono', monospace" }}>
                    {pct}%
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </aside>
      
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.aside
            className="fixed lg:hidden top-0 left-0 h-full w-72 z-50 overflow-y-auto"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            style={{ background: C.charcoal, borderRight: `1px solid ${C.goldBorder}` }}
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: C.goldBorder }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <span className="font-black text-lg" style={{ color: C.obsidian }}>G</span>
                </div>
                <span className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif", color: C.white }}>
                  Grow<span style={{ color: C.gold }}>X</span>
                </span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg" style={{ background: C.surface }}>
                <X size={20} color={C.muted} />
              </button>
            </div>
            <div className="p-4">
              <div className="rounded-xl p-4" style={{ background: C.surface }}>
                <div className="flex justify-between mb-2">
                  <span className="text-xs" style={{ color: C.muted }}>Progress</span>
                  <span className="font-bold" style={{ color: C.gold }}>{stats.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.dim }}>
                  <div className="h-full rounded-full" style={{ width: `${stats.pct}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})` }} />
                </div>
              </div>
            </div>
            <div className="p-3">
              {Object.entries(TAB_META).map(([key, meta]) => (
                <motion.button
                  key={key}
                  className="w-full flex items-center gap-3 p-3 rounded-xl mb-1"
                  onClick={() => { setActiveTab(key); setIsOpen(false); }}
                  style={{ background: activeTab === key ? meta.bg : "transparent" }}
                >
                  <meta.Icon size={16} color={activeTab === key ? meta.color : C.muted} />
                  <span className="text-sm" style={{ color: activeTab === key ? meta.color : C.white }}>{meta.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </>
  );
}

export default function VideoDashboard() {
  const [activeTab, setActiveTab] = useState("fundamentals");
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  
  return (
    <div className="flex min-h-screen min-w-[320px]" style={{ background: C.obsidian }}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        tabStats={tabStats} 
        stats={stats} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <main className="flex-1 min-w-0">
        <header 
          className="sticky top-0 z-30 backdrop-blur-xl border-b"
          style={{ background: "rgba(10,10,15,0.9)", borderColor: C.goldBorder }}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <motion.button
                className="lg:hidden p-2 rounded-xl"
                style={{ background: C.surface }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} color={C.gold} />
              </motion.button>
              
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: C.goldDim }}>
                <Sparkles size={14} color={C.gold} />
                <span className="text-xs font-bold hidden sm:inline" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>LEARNING ROADMAP</span>
                <ListChecks size={14} color={C.gold} className="sm:hidden" />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: C.surface }}>
                <span className="text-xs" style={{ color: C.muted, fontFamily: "'DM Mono', monospace" }}>Progress</span>
                <span className="font-bold" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>{stats.pct}%</span>
              </div>
              <div className="h-6 w-px" style={{ background: C.goldBorder }} />
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <span className="font-bold text-sm" style={{ color: C.obsidian }}>U</span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
          <FadeIn>
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: C.white }}>
                Master Your <span style={{ color: C.gold }}>Skills</span>
              </h1>
              <p className="text-sm sm:text-base" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                Curated video courses for Web, Mobile & Backend development
              </p>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.05}>
            <div className="relative max-w-md mb-6">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" color={C.muted} />
              <input
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: C.surface, border: `1px solid ${C.goldBorder}`, color: C.white, fontFamily: "'DM Sans', sans-serif" }}
                placeholder="Search courses..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </FadeIn>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FadeIn delay={0.1}>
                <div className="flex items-center gap-4 mb-6 p-4 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}>
                  <motion.div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: activeColor + "15", border: `1px solid ${activeColor}30` }}
                  >
                    {ActiveIcon && <ActiveIcon size={20} color={activeColor} />}
                  </motion.div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold" style={{ fontFamily: "'DM Sans', sans-serif", color: C.white }}>
                      {TAB_META[activeTab]?.label}
                    </h2>
                    <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: C.muted }}>
                      {TAB_META[activeTab]?.hint}
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg" style={{ background: C.goldDim }}>
                    <span className="font-bold" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
                      {tabStats[activeTab]?.done || 0}
                    </span>
                    <span style={{ color: C.muted, fontFamily: "'DM Mono', monospace" }}>/{tabStats[activeTab]?.total || 0}</span>
                  </div>
                </div>
              </FadeIn>
              
              {filteredItems.length === 0 ? (
                <div className="text-center py-16">
                  <Search size={40} color={C.dim} className="mx-auto mb-3" />
                  <p style={{ color: C.muted, fontFamily: "'DM Mono', monospace" }}>No courses found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredItems.map((item, i) => (
                    <CourseCard key={item.url} item={item} idx={i} isDone={!!progress[item.url]} onToggle={toggle} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden p-4" style={{ background: "linear-gradient(to top, rgba(10,10,15,1) 60%, transparent)" }}>
          <motion.button
            className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, color: C.obsidian, fontFamily: "'DM Sans', sans-serif" }}
            whileTap={{ scale: 0.98 }}
          >
            <Trophy size={18} /> Continue Learning {stats.pct}%
          </motion.button>
        </div>
      </main>
    </div>
  );
}
