import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, Cloud, Database, Smartphone, Shield, Bot, Gamepad2, Braces, Cpu, Lock, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

const C = {
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
  goldBorder: "rgba(212,168,83,0.15)",
  goldDim: "rgba(212,168,83,0.08)",
};

const categories = [
  { icon: Code, name: "Software Development", jobs: 120, color: "#6366F1" },
  { icon: Globe, name: "Web Development", jobs: 95, color: "#10B981" },
  { icon: Smartphone, name: "Android Development", jobs: 65, color: "#F59E0B" },
  { icon: Shield, name: "Cybersecurity", jobs: 45, color: "#EF4444" },
  { icon: Palette, name: "UI/UX Design", jobs: 80, color: "#EC4899" },
  { icon: Cloud, name: "Cloud Computing", jobs: 70, color: "#14B8A6" },
  { icon: Database, name: "Data Science", jobs: 90, color: "#8B5CF6" },
  { icon: Bot, name: "Machine Learning", jobs: 55, color: "#F97316" },
  { icon: Braces, name: "Java Full Stack", jobs: 85, color: "#06B6D4" },
  { icon: Cpu, name: "Python Full Stack", jobs: 75, color: "#84CC16" },
  { icon: Lock, name: "DevOps", jobs: 50, color: "#FB923C" },
  { icon: Gamepad2, name: "Game Development", jobs: 35, color: "#A855F7" },
];

export default function CategoryCarousel() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="categories" className="py-20 px-4 relative overflow-hidden" style={{ background: C.charcoal }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)",
        backgroundSize: "50px 50px"
      }} />

      <div className="absolute top-0 left-1/2 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: C.gold, transform: 'translateX(-50%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
            >
              <span className="text-xs font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
                JOB CATEGORIES
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>
              Explore by <span style={{ color: C.gold }}>Category</span>
            </h2>

            <p className="text-base md:text-lg" style={{ color: C.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
              Find jobs across various tech domains
            </p>
          </div>

          <div className="hidden md:flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ 
                background: canScrollLeft ? C.surface : 'rgba(26,26,36,0.3)', 
                border: `1px solid ${C.goldBorder}`,
                color: canScrollLeft ? C.gold : C.ivoryMuted,
                cursor: canScrollLeft ? 'pointer' : 'not-allowed',
                opacity: canScrollLeft ? 1 : 0.5
              }}
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ 
                background: canScrollRight ? C.surface : 'rgba(26,26,36,0.3)', 
                border: `1px solid ${C.goldBorder}`,
                color: canScrollRight ? C.gold : C.ivoryMuted,
                cursor: canScrollRight ? 'pointer' : 'not-allowed',
                opacity: canScrollRight ? 1 : 0.5
              }}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </motion.div>

        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative rounded-2xl p-5 overflow-hidden group cursor-pointer shrink-0 w-[220px]"
              style={{ background: C.surface, border: `1px solid ${cat.color}30` }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at center, ${cat.color}15 0%, transparent 70%)` }}
              />

              <div className="relative z-10">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${cat.color}20`, border: `1px solid ${cat.color}40` }}
                >
                  <cat.icon size={24} color={cat.color} />
                </div>

                <h3 className="font-semibold mb-2 text-sm" style={{ color: C.ivory }}>{cat.name}</h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: cat.color }}>
                    {cat.jobs} Jobs
                  </span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" 
                    style={{ background: `${cat.color}20` }}>
                    <span className="text-xs font-bold" style={{ color: cat.color }}>→</span>
                  </div>
                </div>
              </div>

              <div 
                className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: cat.color }}
              />
            </motion.div>
          ))}
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}
