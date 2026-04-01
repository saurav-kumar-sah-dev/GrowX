import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

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
};

const FAQS = [
  { q: 'Is the resume builder really free?', a: 'Yes! You can create and download unlimited resumes completely free. No hidden charges or subscriptions required.' },
  { q: 'Are the templates ATS-friendly?', a: 'Absolutely! All our templates are optimized to pass Applicant Tracking Systems used by most companies.' },
  { q: 'Can I edit my resume after downloading?', a: 'Yes, you can come back anytime and edit your saved resumes. Your data is securely stored.' },
  { q: 'What format can I download my resume in?', a: 'You can download your resume as a high-quality PDF file, which is the most widely accepted format.' },
  { q: 'Do I need to create an account?', a: 'Yes, creating a free account helps you save and manage multiple resumes easily.' },
  { q: 'How many templates are available?', a: 'We offer 10+ professionally designed templates covering various industries and job roles.' },
];

function FAQItem({ faq, index, isOpen, onToggle }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-xl overflow-hidden"
      style={{ background: C.card, border: `1px solid ${isOpen ? C.goldBorder : C.goldBorder}` }}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between text-left transition-colors"
        style={{ background: isOpen ? C.surface : 'transparent' }}
      >
        <span className="font-medium text-sm md:text-base pr-4" style={{ fontFamily: "'DM Sans', sans-serif", color: isOpen ? C.gold : C.white }}>
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: isOpen ? C.goldDim : 'transparent' }}
        >
          <ChevronDown size={18} color={isOpen ? C.gold : C.muted} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0">
              <div className="h-px w-full mb-4" style={{ background: C.goldBorder }} />
              <p className="text-sm leading-relaxed" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-4 relative overflow-hidden" style={{ background: C.obsidian }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <div className="max-w-3xl mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
          >
            <HelpCircle size={14} color={C.gold} />
            <span className="text-xs font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
              FAQ
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.white }}>
            Frequently Asked <span style={{ color: C.gold }}>Questions</span>
          </h2>

          <p className="text-base md:text-lg" style={{ color: C.muted, fontFamily: "'DM Sans', sans-serif" }}>
            Everything you need to know about GrowX Resume Builder
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <FAQItem
              key={idx}
              faq={faq}
              index={idx}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
