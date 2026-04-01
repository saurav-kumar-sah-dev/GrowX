import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';

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

export default function FAQSection() {
  const [open, setOpen] = useState(0);
  const faqs = [
    { q: 'What is the duration of the internship?', a: 'The internship usually lasts for 8–12 weeks, depending on the role and project requirements.' },
    { q: 'Is the internship paid?', a: 'Yes, all selected interns receive a stipend along with performance-based perks.' },
    { q: 'Can I do the internship remotely?', a: 'Absolutely! We offer both remote and on-site internship opportunities.' },
    { q: 'Will I receive a certificate?', a: 'Yes! Upon successful completion, every intern will be awarded a certificate of completion.' },
    { q: 'Do I need prior experience?', a: 'Not necessarily! We have internships for various skill levels, from beginners to advanced.' }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden" style={{ background: C.charcoal }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)",
        backgroundSize: "50px 50px"
      }} />

      <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full blur-3xl opacity-15" style={{ background: C.gold }} />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full blur-3xl opacity-15" style={{ background: C.accent }} />

      <div className="max-w-4xl mx-auto relative z-10">
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
            <HelpCircle size={14} color={C.gold} />
            <span className="text-xs font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
              FAQ
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>
            Frequently Asked <span style={{ color: C.gold }}>Questions</span>
          </h2>

          <p className="text-base md:text-lg" style={{ color: C.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
            Everything you need to know about GrowX Internship
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
              whileHover={{ borderColor: "rgba(212,168,83,0.3)" }}
            >
              <button 
                onClick={() => setOpen(open === idx ? -1 : idx)} 
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-lg pr-4" style={{ color: C.ivory }}>{faq.q}</span>
                <motion.div
                  animate={{ rotate: open === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: C.goldDim }}
                >
                  <ChevronDown size={20} color={C.gold} />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 leading-relaxed" style={{ color: C.ivoryMuted }}>{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
