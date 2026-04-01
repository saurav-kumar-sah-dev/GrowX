import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FAQSection() {
  const [open, setOpen] = useState(0);
  const faqs = [
    { q: 'How long do I have access to courses?', a: 'You get lifetime access to all courses you enroll in. Learn at your own pace, anytime, anywhere.' },
    { q: 'Are certificates recognized by employers?', a: 'Yes! Our certificates are industry-recognized and valued by top companies worldwide.' },
    { q: 'Can I get a refund if I\'m not satisfied?', a: 'Absolutely. We offer a 30-day money-back guarantee, no questions asked.' },
    { q: 'Do I need prior experience?', a: 'Not at all! We have courses for all levels, from complete beginners to advanced professionals.' },
    { q: 'Is there support available?', a: 'Yes! Our support team and community mentors are available 24/7 to help you succeed.' }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Frequently Asked <span className="text-blue-600">Questions</span></h2>
          <p className="text-xl text-gray-600">Everything you need to know about GrowX Learning</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className="bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-all">
              <button onClick={() => setOpen(open === idx ? -1 : idx)} className="w-full p-6 flex items-center justify-between text-left">
                <span className="font-semibold text-lg text-gray-900">{faq.q}</span>
                <ChevronDown className={`text-blue-600 transition-transform ${open === idx ? 'rotate-180' : ''}`} size={24} />
              </button>
              {open === idx && <div className="px-6 pb-6 text-gray-600 leading-relaxed">{faq.a}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
