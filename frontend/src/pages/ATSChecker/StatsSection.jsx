import { motion } from 'framer-motion';
import { Users, FileCheck, Award, TrendingUp } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    { icon: Users, value: '10,000+', label: 'Resumes Checked', color: 'from-[#D4A853] to-[#C8884A]' },
    { icon: FileCheck, value: '95%', label: 'Pass Rate', color: 'from-[#C8884A] to-[#D4A853]' },
    { icon: Award, value: '100%', label: 'Free Forever', color: 'from-[#E8C17A] to-[#D4A853]' },
    { icon: TrendingUp, value: 'Instant', label: 'Results', color: 'from-[#D4A853] to-[#E8C17A]' }
  ];

  return (
    <section className="py-20 px-4 bg-[#0A0A0F] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#D4A853]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#C8884A]/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#F5F0E6]">
            Trusted by Job Seekers Worldwide
          </h2>
          <p className="text-xl text-[#A8A099]">
            Join thousands optimizing their resumes every day
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="text-center bg-[#121218] rounded-2xl p-6 border border-[#252532]">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${stat.color} mb-4 shadow-lg`}>
                  <Icon size={36} className="text-[#0A0A0F]" />
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2 text-[#F5F0E6]">{stat.value}</div>
                <div className="text-lg text-[#A8A099]">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-[#121218] backdrop-blur-lg px-6 py-3 rounded-full border border-[#D4A853]/30">
            <span className="text-[#D4A853] text-2xl">⭐</span>
            <span className="font-semibold text-[#F5F0E6]">4.9/5 average rating from users</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
