import { motion } from "framer-motion";
import { Star, Quote, Sparkles } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

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

const feedbackData = [
  {
    id: 1,
    name: "Rohit Sharma",
    role: "Software Engineer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    feedback: "The resume builder is incredibly intuitive! Created my professional resume in just 5 minutes.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sneha Patel",
    role: "Product Manager",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    feedback: "Love the modern templates and smooth interface. It really helped me land my dream job!",
    rating: 5,
  },
  {
    id: 3,
    name: "Aditya Verma",
    role: "Data Analyst",
    image: "https://randomuser.me/api/portraits/men/50.jpg",
    feedback: "The ATS-friendly templates are a game changer. Highly recommend for job seekers!",
    rating: 4,
  },
  {
    id: 4,
    name: "Priya Sharma",
    role: "UX Designer",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    feedback: "Amazing attention to detail! The export quality is perfect for professional applications.",
    rating: 5,
  },
  {
    id: 5,
    name: "Raghav Joshi",
    role: "Marketing Manager",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    feedback: "Very clean design and excellent customization options. My resume looks outstanding!",
    rating: 4,
  },
  {
    id: 6,
    name: "Anika Sen",
    role: "HR Specialist",
    image: "https://randomuser.me/api/portraits/women/29.jpg",
    feedback: "As an HR professional, I can confirm these templates are recruiter-approved. Excellent work!",
    rating: 5,
  },
];

const FeedbackSection = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden" style={{ background: C.charcoal }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)",
        backgroundSize: "50px 50px"
      }} />

      <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full blur-3xl opacity-15" style={{ background: C.gold }} />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full blur-3xl opacity-15" style={{ background: C.accent }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
          >
            <Sparkles size={14} color={C.gold} />
            <span className="text-xs font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
              TESTIMONIALS
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>
            What Our <span style={{ color: C.gold }}>Users Say</span>
          </h2>

          <p className="text-base md:text-lg" style={{ color: C.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
            Real feedback from real professionals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbackData.map((fb, i) => (
            <motion.div
              key={fb.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative rounded-2xl p-6 overflow-hidden group"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle at center, rgba(212,168,83,0.08) 0%, transparent 70%)" }}
              />

              <Quote className="mb-4" size={32} color={C.gold} />

              <div className="flex items-center gap-4 mb-4">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                  <Avatar className="w-14 h-14" style={{ border: `2px solid ${C.gold}` }}>
                    <AvatarImage src={fb.image} alt={fb.name} />
                    <AvatarFallback className="font-bold" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: C.obsidian }}>
                      {fb.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div>
                  <h4 className="text-lg font-bold" style={{ color: C.ivory }}>{fb.name}</h4>
                  <p className="text-sm font-medium" style={{ color: C.gold }}>{fb.role}</p>
                </div>
              </div>

              <p className="mb-4 leading-relaxed" style={{ color: C.ivoryMuted }}>
                "{fb.feedback}"
              </p>

              <div className="flex space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.3, rotate: 15 }}
                  >
                    <Star
                      size={18}
                      className={i < fb.rating ? "" : ""}
                      fill={i < fb.rating ? C.gold : "transparent"}
                      color={i < fb.rating ? C.gold : C.ivoryMuted}
                    />
                  </motion.div>
                ))}
              </div>

              <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ background: C.gold }} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
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
              4.9/5 average rating
            </span>
            <span className="w-px h-6 mx-2" style={{ background: C.goldBorder }} />
            <span className="text-base" style={{ color: C.ivoryMuted }}>from 500+ users</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeedbackSection;
