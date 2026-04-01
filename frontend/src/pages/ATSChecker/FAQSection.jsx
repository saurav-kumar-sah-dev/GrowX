import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FAQSection() {
  const [open, setOpen] = useState(0);
  const faqs = [
    { q: 'What is an ATS and why does it matter?', a: 'ATS (Applicant Tracking System) is software used by companies to filter resumes. About 75% of resumes never reach human eyes because they fail ATS screening. Our tool helps ensure your resume passes these systems.' },
    { q: 'How does the resume checker work?', a: 'Our AI-powered tool analyzes your resume using machine learning algorithms that replicate how actual ATS systems work. It checks 20+ criteria including formatting, keywords, action verbs, and content structure.' },
    { q: 'Is this tool really free?', a: 'Yes! Our resume checker is completely free with no hidden charges. No credit card required. We believe everyone deserves access to tools that help them land their dream job.' },
    { q: 'What file formats are supported?', a: 'We support PDF and DOCX (Word) formats. Your file must be in English and under 2MB in size for optimal processing.' },
    { q: 'How accurate is the ATS score?', a: 'Our tool uses the same algorithms as major ATS systems used by Fortune 500 companies, providing 95%+ accuracy in compatibility scoring. The feedback is curated by hiring managers from top companies.' },
    { q: 'Will my resume data be stored or shared?', a: 'No. Your privacy is our priority. We don\'t store your resume data permanently and never share it with third parties. All uploads are processed securely and deleted after analysis.' },
    { q: 'Can I check my resume multiple times?', a: 'Absolutely! You can check your resume as many times as you want. We encourage you to make improvements based on our suggestions and re-check to see your score improve.' },
    { q: 'What makes this different from other resume checkers?', a: 'Unlike basic spell checkers, we use advanced AI to analyze impact, brevity, style, and ATS compatibility. Our feedback comes from actual hiring managers at companies like Google, McKinsey, and Goldman Sachs.' }
  ];

  return (
    <section className="py-20 px-4 bg-[#0A0A0F]">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#F5F0E6]">Frequently Asked <span className="text-[#D4A853]">Questions</span></h2>
          <p className="text-xl text-[#A8A099]">Everything you need to know about our resume checker</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className="bg-[#121218] rounded-2xl overflow-hidden border border-[#252532] hover:border-[#D4A853]/50 transition-all hover:shadow-lg hover:shadow-[#D4A853]/10">
              <button onClick={() => setOpen(open === idx ? -1 : idx)} className="w-full p-6 flex items-center justify-between text-left">
                <span className="font-semibold text-lg text-[#F5F0E6] pr-4">{faq.q}</span>
                <ChevronDown className={`text-[#D4A853] transition-transform flex-shrink-0 ${open === idx ? 'rotate-180' : ''}`} size={24} />
              </button>
              {open === idx && <div className="px-6 pb-6 text-[#A8A099] leading-relaxed border-t border-[#252532]">{faq.a}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
