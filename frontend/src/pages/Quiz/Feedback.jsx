import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Sparkles } from "lucide-react";

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#0D1017",
  surface: "#151820",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
  goldBorderHover: "rgba(212,168,83,0.3)",
  violet: "#818CF8",
  violetDim: "rgba(129,140,248,0.1)",
  green: "#34D399",
  greenDim: "rgba(52,211,153,0.1)",
  cyan: "#38BDF8",
  amber: "#FBBF24",
  rose: "#FB7185",
  roseDim: "rgba(251,113,133,0.1)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
  dim: "#2A2E3A",
};

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const feedbackData = [
  {
    id: 1,
    name: "Sanya Kapoor",
    gender: "Student",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    feedback: "This platform helped me land my dream internship quickly. Highly intuitive and user-friendly!",
    rating: 5,
  },
  {
    id: 2,
    name: "Aditya Verma",
    gender: "Developer",
    image: "https://randomuser.me/api/portraits/men/77.jpg",
    feedback: "Navigation is smooth and the quizzes are excellent, though filters could be improved.",
    rating: 4,
  },
  {
    id: 3,
    name: "Isha Mehta",
    gender: "Learner",
    image: "https://randomuser.me/api/portraits/women/58.jpg",
    feedback: "Support is very responsive and the practical guidance made my journey seamless.",
    rating: 5,
  },
  {
    id: 4,
    name: "Raghav Singh",
    gender: "Engineer",
    image: "https://randomuser.me/api/portraits/men/69.jpg",
    feedback: "Smooth experience and very engaging quizzes. I'd recommend it to everyone!",
    rating: 4,
  },
  {
    id: 5,
    name: "Tanya Roy",
    gender: "Student",
    image: "https://randomuser.me/api/portraits/women/72.jpg",
    feedback: "Good resources but quiz explanations can be more detailed.",
    rating: 3,
  },
  {
    id: 6,
    name: "Vivaan Malhotra",
    gender: "Professional",
    image: "https://randomuser.me/api/portraits/men/40.jpg",
    feedback: "Found my perfect job in just a week. This platform is amazing!",
    rating: 5,
  },
];

const FeedbackSection = () => {
  return (
    <section className="py-20 lg:py-32 px-4" style={{ background: C.charcoal }}>
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
            >
              <Sparkles size={14} color={C.gold} />
              <span className="text-xs font-bold" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>TESTIMONIALS</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.white }}>
              What Our <span style={{ color: C.gold }}>Users Say</span>
            </h2>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {feedbackData.map((fb, idx) => (
            <FadeIn key={fb.id} delay={idx * 0.08}>
              <motion.div
                className="p-6 rounded-2xl cursor-pointer"
                style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                whileHover={{ y: -6, borderColor: C.goldBorderHover, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <motion.img
                    src={fb.image}
                    alt={fb.name}
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ border: `2px solid ${C.gold}` }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  />
                  <div>
                    <h4 className="font-semibold" style={{ color: C.white, fontFamily: "'DM Sans', sans-serif" }}>{fb.name}</h4>
                    <p className="text-xs" style={{ color: C.muted }}>{fb.gender}</p>
                  </div>
                </div>
                
                <p className="text-sm mb-4 italic" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}>
                  "{fb.feedback}"
                </p>
                
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      color={C.gold}
                      fill={i < fb.rating ? C.gold : "transparent"}
                    />
                  ))}
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
