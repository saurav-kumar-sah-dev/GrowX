import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  PlayCircle, Search, Clock, Award, BookOpen, Trophy, Target,
  Menu, X, Sparkles, ChevronRight, Star, Zap, Brain, Code,
  Layers, Smartphone, Server, Database, Terminal, Wrench, Rocket,
} from 'lucide-react';
import axios from 'axios';
import { API } from '@/config/api';

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

const CATEGORY_META = {
  HTML: { color: "#E34C26", bg: "rgba(227,76,38,0.1)", Icon: Code },
  CSS: { color: "#264de4", bg: "rgba(38,77,228,0.1)", Icon: Layers },
  JavaScript: { color: "#F7DF1E", bg: "rgba(247,223,30,0.1)", Icon: Brain },
  TypeScript: { color: "#3178C6", bg: "rgba(49,120,198,0.1)", Icon: Code },
  React: { color: "#61DAFB", bg: "rgba(97,218,251,0.1)", Icon: Rocket },
  Angular: { color: "#DD0031", bg: "rgba(221,0,49,0.1)", Icon: Layers },
  Vue: { color: "#4FC08D", bg: "rgba(79,192,141,0.1)", Icon: Rocket },
  "Node.js": { color: "#68A063", bg: "rgba(104,160,99,0.1)", Icon: Server },
  Express: { color: "#000000", bg: "rgba(0,0,0,0.3)", Icon: Server },
  Django: { color: "#0C4B33", bg: "rgba(12,75,51,0.1)", Icon: Code },
  "Spring Boot": { color: "#6DB33F", bg: "rgba(109,179,63,0.1)", Icon: Server },
  Flask: { color: "#000000", bg: "rgba(0,0,0,0.3)", Icon: Server },
  MongoDB: { color: "#47A248", bg: "rgba(71,162,72,0.1)", Icon: Database },
  MySQL: { color: "#00758F", bg: "rgba(0,117,143,0.1)", Icon: Database },
  PostgreSQL: { color: "#336791", bg: "rgba(51,103,145,0.1)", Icon: Database },
  Firebase: { color: "#FFCA28", bg: "rgba(255,202,40,0.1)", Icon: Database },
  Python: { color: "#3776AB", bg: "rgba(55,118,171,0.1)", Icon: Terminal },
  Java: { color: "#F89820", bg: "rgba(248,152,32,0.1)", Icon: Code },
  C: { color: "#A8B9CC", bg: "rgba(168,185,204,0.1)", Icon: Terminal },
  "C++": { color: "#00599C", bg: "rgba(0,89,156,0.1)", Icon: Terminal },
  Go: { color: "#00ADD8", bg: "rgba(0,173,216,0.1)", Icon: Server },
  Rust: { color: "#DEA584", bg: "rgba(222,165,132,0.1)", Icon: Terminal },
  "React Native": { color: "#61DAFB", bg: "rgba(97,218,251,0.1)", Icon: Smartphone },
  Flutter: { color: "#54C5F8", bg: "rgba(84,197,248,0.1)", Icon: Smartphone },
  Swift: { color: "#FA7343", bg: "rgba(250,115,67,0.1)", Icon: Smartphone },
  Kotlin: { color: "#7F52FF", bg: "rgba(127,82,255,0.1)", Icon: Smartphone },
  Git: { color: "#F05032", bg: "rgba(240,80,50,0.1)", Icon: Code },
  GitHub: { color: "#C9D1D9", bg: "rgba(201,209,217,0.1)", Icon: Code },
  Docker: { color: "#2496ED", bg: "rgba(36,150,237,0.1)", Icon: Wrench },
  AWS: { color: "#FF9900", bg: "rgba(255,153,0,0.1)", Icon: Server },
  Azure: { color: "#0078D4", bg: "rgba(0,120,212,0.1)", Icon: Server },
  DSA: { color: "#9333EA", bg: "rgba(147,51,234,0.1)", Icon: Target },
  "System Design": { color: "#EC4899", bg: "rgba(236,72,153,0.1)", Icon: Layers },
  Other: { color: "#6B7280", bg: "rgba(107,114,128,0.1)", Icon: Star },
};

const LEVEL_COLORS = {
  Beginner: { color: "#34D399", bg: "rgba(52,211,153,0.1)" },
  Intermediate: { color: "#FBBF24", bg: "rgba(251,191,36,0.1)" },
  Advanced: { color: "#FB7185", bg: "rgba(251,113,133,0.1)" },
};

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

function QuizCard({ quiz, onStart }) {
  const [isHovered, setIsHovered] = useState(false);
  const categoryMeta = CATEGORY_META[quiz.category] || CATEGORY_META.Other;
  const levelMeta = LEVEL_COLORS[quiz.level] || LEVEL_COLORS.Beginner;
  const IconComponent = categoryMeta.Icon;
  
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden cursor-pointer w-full"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: C.card,
        border: `1px solid ${isHovered ? C.goldBorderHover : C.goldBorder}`,
        boxShadow: isHovered ? "0 12px 40px rgba(0,0,0,0.3)" : "none",
        transition: "all 0.2s ease",
      }}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <motion.div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: categoryMeta.bg }}
          >
            <IconComponent size={22} color={categoryMeta.color} />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 
              className="font-semibold text-sm truncate"
              style={{ fontFamily: "'DM Sans', sans-serif", color: C.white }}
            >
              {quiz.title}
            </h3>
            <p className="text-xs truncate" style={{ color: C.muted }}>{quiz.category}</p>
          </div>
        </div>
        
        <p className="text-xs mb-4 line-clamp-2" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
          {quiz.description}
        </p>
        
        <div className="flex items-center gap-3 mb-4 text-xs" style={{ color: C.muted }}>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{quiz.timeLimit} min</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={12} />
            <span>{quiz.questions?.length || 0} Q</span>
          </div>
          <div className="flex items-center gap-1">
            <Award size={12} />
            <span>{quiz.totalMarks} marks</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div 
            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold"
            style={{ background: levelMeta.bg, color: levelMeta.color, fontFamily: "'DM Sans', sans-serif" }}
          >
            {quiz.level}
          </div>
          
          <motion.button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            onClick={() => onStart(quiz._id)}
            style={{ background: C.goldDim, color: C.gold, fontFamily: "'DM Sans', sans-serif" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlayCircle size={14} /> Start
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function Sidebar({ activeCategory, setActiveCategory, categoryStats, totalQuizzes, isOpen, setIsOpen }) {
  const categories = Object.entries(CATEGORY_META).slice(0, 20);
  
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
              <div className="text-[10px]" style={{ color: C.muted, fontFamily: "'DM Mono', monospace" }}>Quiz Arena</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-b" style={{ borderColor: C.goldBorder }}>
          <div className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider" style={{ color: C.muted, fontFamily: "'DM Mono', monospace" }}>Total Quizzes</span>
              <span className="font-bold" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>{totalQuizzes}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy size={14} color={C.gold} />
              <span className="text-xs" style={{ color: C.muted }}>Test your knowledge</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="text-[10px] uppercase tracking-wider px-3 py-2 mb-2" style={{ color: C.muted, fontFamily: "'DM Mono', monospace" }}>
            Categories
          </div>
          
          <motion.button
            className="w-full flex items-center gap-3 p-3 rounded-xl mb-1 transition-all relative"
            onClick={() => setActiveCategory("all")}
            whileHover={{ x: 4 }}
            style={{
              background: activeCategory === "all" ? C.goldDim : "transparent",
              border: `1px solid ${activeCategory === "all" ? C.goldBorderHover : "transparent"}`
            }}
          >
            {activeCategory === "all" && (
              <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r" style={{ background: C.gold }} />
            )}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: activeCategory === "all" ? C.gold + "20" : C.surface }}>
              <Brain size={16} color={activeCategory === "all" ? C.gold : C.muted} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: activeCategory === "all" ? C.gold : C.white }}>All Quizzes</div>
              <div className="text-[10px]" style={{ fontFamily: "'DM Mono', monospace", color: C.muted }}>{totalQuizzes} quizzes</div>
            </div>
          </motion.button>
          
          {categories.map(([name, meta]) => {
            const isActive = activeCategory === name;
            const stats = categoryStats[name] || 0;
            
            return (
              <motion.button
                key={name}
                className="w-full flex items-center gap-3 p-3 rounded-xl mb-1 transition-all relative"
                onClick={() => setActiveCategory(name)}
                whileHover={{ x: 4 }}
                style={{
                  background: isActive ? meta.bg : "transparent",
                  border: `1px solid ${isActive ? meta.color + "30" : "transparent"}`
                }}
              >
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r" style={{ background: meta.color }} />
                )}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: isActive ? meta.color + "20" : C.surface }}>
                  <meta.Icon size={16} color={isActive ? meta.color : C.muted} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: isActive ? meta.color : C.white }}>{name}</div>
                  <div className="text-[10px]" style={{ fontFamily: "'DM Mono', monospace", color: C.muted }}>{stats} quizzes</div>
                </div>
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
                  <span className="text-xs" style={{ color: C.muted }}>Total Quizzes</span>
                  <span className="font-bold" style={{ color: C.gold }}>{totalQuizzes}</span>
                </div>
              </div>
            </div>
            
            <div className="p-3">
              {categories.map(([name, meta]) => (
                <motion.button
                  key={name}
                  className="w-full flex items-center gap-3 p-3 rounded-xl mb-1"
                  onClick={() => { setActiveCategory(name); setIsOpen(false); }}
                  style={{ background: activeCategory === name ? meta.bg : "transparent" }}
                >
                  <meta.Icon size={16} color={activeCategory === name ? meta.color : C.muted} />
                  <span className="text-sm" style={{ color: activeCategory === name ? meta.color : C.white }}>{name}</span>
                </motion.button>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </>
  );
}

export default function QuizDashboard() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    fetchQuizzes();
  }, []);
  
  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`${API.quiz}/all`);
      setQuizzes(res.data.quizzes || []);
    } catch (error) {
      console.error('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };
  
  const categoryStats = useMemo(() => {
    const stats = {};
    quizzes.forEach(q => {
      stats[q.category] = (stats[q.category] || 0) + 1;
    });
    return stats;
  }, [quizzes]);
  
  const filteredQuizzes = useMemo(() => {
    let filtered = quizzes;
    
    if (activeCategory !== "all") {
      filtered = filtered.filter(q => q.category === activeCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(query) ||
        q.description.toLowerCase().includes(query) ||
        q.category.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [quizzes, activeCategory, searchQuery]);
  
  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };
  
  return (
    <div className="flex min-h-screen min-w-[320px]" style={{ background: C.obsidian }}>
      <Sidebar 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        categoryStats={categoryStats}
        totalQuizzes={quizzes.length}
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
                <Brain size={16} color={C.gold} />
                <span className="text-xs font-bold hidden sm:inline" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>QUIZ ARENA</span>
                <Target size={16} color={C.gold} className="sm:hidden" />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: C.surface }}>
                <Sparkles size={14} color={C.gold} />
                <span className="text-xs" style={{ color: C.muted, fontFamily: "'DM Mono', monospace" }}>
                  {filteredQuizzes.length} quizzes
                </span>
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
                Quiz <span style={{ color: C.gold }}>Arena</span>
              </h1>
              <p className="text-sm sm:text-base" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                Test your knowledge and ace your interviews
              </p>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.05}>
            <div className="relative max-w-md mb-6">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" color={C.muted} />
              <input
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: C.surface, border: `1px solid ${C.goldBorder}`, color: C.white, fontFamily: "'DM Sans', sans-serif" }}
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </FadeIn>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${C.gold} transparent transparent transparent` }} />
                </div>
              ) : filteredQuizzes.length === 0 ? (
                <div className="text-center py-16">
                  <Trophy size={48} color={C.dim} className="mx-auto mb-4" />
                  <p className="text-lg mb-2" style={{ color: C.white, fontFamily: "'DM Sans', sans-serif" }}>No quizzes found</p>
                  <p className="text-sm" style={{ color: C.muted }}>Try a different category or search term</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredQuizzes.map((quiz, i) => (
                    <QuizCard key={quiz._id} quiz={quiz} onStart={handleStartQuiz} />
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
            <Zap size={18} /> Start Quiz
          </motion.button>
        </div>
      </main>
    </div>
  );
}
