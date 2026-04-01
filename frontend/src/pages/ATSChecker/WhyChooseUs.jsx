import { motion } from 'framer-motion';
import { CheckCircle, Star, Zap, Shield } from 'lucide-react';

export default function WhyChooseUs() {
  const reasons = [
    { icon: Star, title: 'Industry Standard', desc: 'Used by top recruiters and HR professionals', stats: '95% Accuracy Rate' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Get your ATS score in seconds, not hours', stats: 'Instant Analysis' },
    { icon: CheckCircle, title: 'Actionable Insights', desc: 'Detailed recommendations to improve your score', stats: '10+ Suggestions' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and never shared', stats: '100% Confidential' }
  ];

  return (
    <section className="py-20 px-4 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#F5F0E6]">
            Why Choose <span className="text-[#D4A853]">Our ATS Checker</span>?
          </h2>
          <p className="text-xl text-[#A8A099] max-w-3xl mx-auto">
            We're not just another resume checker. Here's what makes us different.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {reasons.map((reason, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-[#121218] p-8 rounded-3xl border border-[#252532] hover:border-[#D4A853]/50 transition-all hover:shadow-xl hover:shadow-[#D4A853]/10">
              <div className="flex items-start gap-6">
                <div className="bg-gradient-to-br from-[#D4A853] to-[#C8884A] p-4 rounded-2xl">
                  <reason.icon className="text-[#0A0A0F]" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-[#F5F0E6]">{reason.title}</h3>
                  <p className="text-[#A8A099] mb-4">{reason.desc}</p>
                  <div className="inline-flex items-center gap-2 bg-[#121218] px-4 py-2 rounded-full text-sm font-semibold text-[#D4A853] border border-[#D4A853]/30">
                    <CheckCircle size={16} />
                    {reason.stats}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#121218] text-[#F5F0E6] rounded-3xl p-12 relative overflow-hidden border border-[#252532]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A853] rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C8884A] rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative z-10 grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2 text-[#D4A853]">Free</div>
              <div className="text-lg text-[#A8A099]">Forever</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 text-[#E8C17A]">24/7</div>
              <div className="text-lg text-[#A8A099]">Available</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 text-[#C8884A]">Instant</div>
              <div className="text-lg text-[#A8A099]">Results</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
