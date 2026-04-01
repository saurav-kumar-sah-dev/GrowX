import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles, CheckCircle } from "lucide-react";

const T = {
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
  accentGlow: "rgba(212,168,83,0.12)",
  gradient1: "#667eea",
  gradient2: "#764ba2",
};

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeIn}
      className={className}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
      whileHover={{ scale: 1.05 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 20px",
        borderRadius: 50,
        background: "rgba(212,168,83,0.08)",
        border: "1px solid rgba(212,168,83,0.25)",
        color: T.gold,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <HelpCircle size={14} />
      {children}
    </motion.span>
  );
}

const faqData = [
  {
    question: "What is this quiz platform about?",
    answer: "Our platform offers a variety of interactive quizzes designed to help users test their knowledge, learn new concepts, and have fun while practicing across different subjects and skill levels."
  },
  {
    question: "How do I start a quiz?",
    answer: "Simply sign up or log in, browse the available quizzes, and click 'Start Quiz' on your chosen topic. Your progress will be tracked automatically."
  },
  {
    question: "Are there any prerequisites to take quizzes?",
    answer: "No prior knowledge is required for most quizzes. Some advanced quizzes may require basic familiarity with the topic, which will be indicated in the quiz description."
  },
  {
    question: "Can I take quizzes at my own pace?",
    answer: "Absolutely! You can start, pause, and resume quizzes at any time. This allows you to learn at your own pace and revisit questions as needed."
  },
  {
    question: "Do you provide certificates or rewards?",
    answer: "Yes! Upon completing certain quizzes or challenges, you can earn badges or digital certificates to showcase your achievements and track your progress."
  },
  {
    question: "How are the quiz results calculated?",
    answer: "Quiz results are calculated based on correct answers. Each question has a designated mark value, and your total score is the sum of all correct answers divided by the total possible marks."
  }
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section
      style={{
        background: T.charcoal,
        padding: "clamp(80px, 12vw, 140px) 24px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(48px, 8vw, 80px)" }}>
          <FadeIn>
            <SectionLabel>FAQ</SectionLabel>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px, 6vw, 56px)",
                fontWeight: 700,
                color: T.ivory,
                lineHeight: 1.1,
                margin: "20px 0",
              }}
            >
              Frequently Asked{" "}
              <span style={{ color: T.gold }}>Questions</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.25}>
            <p
              style={{
                fontSize: "clamp(15px, 1.8vw, 18px)",
                color: T.ivoryMuted,
                fontFamily: "'DM Sans', sans-serif",
                marginTop: 12,
              }}
            >
              Everything you need to know about our quiz platform
            </p>
          </FadeIn>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <FadeIn key={index} delay={index * 0.08}>
              <motion.div
                className="rounded-2xl overflow-hidden"
                style={{ 
                  background: T.surface, 
                  border: `1px solid rgba(212,168,83,0.1)`,
                  borderColor: activeIndex === index ? "rgba(212,168,83,0.3)" : "rgba(212,168,83,0.1)"
                }}
                whileHover={{ borderColor: "rgba(212,168,83,0.2)" }}
              >
                <motion.button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left cursor-pointer"
                  whileHover={{ backgroundColor: "rgba(212,168,83,0.05)" }}
                >
                  <span className="text-base font-semibold pr-4" style={{ color: T.ivory, fontFamily: "'DM Sans', sans-serif" }}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: activeIndex === index ? T.gold : "rgba(212,168,83,0.1)" }}
                  >
                    <ChevronDown size={18} color={activeIndex === index ? T.obsidian : T.gold} />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="px-6 pb-5 border-t" style={{ borderColor: "rgba(212,168,83,0.1)" }}>
                        <div className="flex items-start gap-3 pt-4">
                          <CheckCircle size={18} color={T.gold} className="shrink-0 mt-0.5" />
                          <p className="text-sm" style={{ color: T.ivoryMuted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.8 }}>
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.5}>
          <motion.div
            className="mt-12 text-center p-6 rounded-2xl"
            style={{ background: "rgba(212,168,83,0.05)", border: "1px solid rgba(212,168,83,0.15)" }}
          >
            <p className="text-sm mb-3" style={{ color: T.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
              Still have questions?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl font-bold text-sm"
              style={{
                background: `linear-gradient(135deg, ${T.gold}, ${T.accent})`,
                color: T.obsidian,
                fontFamily: "'DM Sans', sans-serif",
                border: "none",
                cursor: "pointer",
              }}
            >
              Contact Support
            </motion.button>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
};

export default FAQSection;
