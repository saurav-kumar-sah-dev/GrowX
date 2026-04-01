import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function Feedback() {
  const testimonials = [
    { name: 'Sarah Johnson', role: 'Software Engineer', company: 'Tech Corp', rating: 5, text: 'This tool helped me optimize my resume and I got 3 interview calls in one week!', img: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Michael Chen', role: 'Marketing Manager', company: 'Digital Inc', rating: 5, text: 'The ATS score and suggestions were spot-on. Landed my dream job thanks to this!', img: 'https://i.pravatar.cc/150?img=13' },
    { name: 'Emily Rodriguez', role: 'Data Analyst', company: 'Analytics Co', rating: 5, text: 'Free, fast, and incredibly helpful. Every job seeker should use this tool!', img: 'https://i.pravatar.cc/150?img=5' }
  ];

  return (
    <section className="py-20 px-4 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#F5F0E6]">Success <span className="text-[#D4A853]">Stories</span></h2>
          <p className="text-xl text-[#A8A099]">Hear from job seekers who optimized their resumes</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-[#121218] p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-[#252532] hover:border-[#D4A853]/50">
              <Quote className="text-[#D4A853] mb-4" size={32} />
              <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, i) => <Star key={i} className="text-[#D4A853] fill-[#D4A853]" size={20} />)}</div>
              <p className="text-[#A8A099] mb-6 leading-relaxed">{t.text}</p>
              <div className="flex items-center gap-4">
                <img src={t.img} alt={t.name} className="w-14 h-14 rounded-full border-2 border-[#D4A853]/50" />
                <div>
                  <div className="font-bold text-[#F5F0E6]">{t.name}</div>
                  <div className="text-sm text-[#A8A099]">{t.role} at {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
