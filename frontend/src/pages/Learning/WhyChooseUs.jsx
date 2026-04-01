import { motion } from 'framer-motion';
import { CheckCircle, Star, Zap, Shield } from 'lucide-react';

export default function WhyChooseUs() {
  const reasons = [
    { icon: Star, title: 'Industry-Leading Content', desc: 'Courses designed by top professionals from Google, Microsoft, Amazon, and more', stats: '500+ Expert Instructors' },
    { icon: Zap, title: 'Learn by Doing', desc: 'Hands-on projects, coding challenges, and real-world simulations', stats: '1000+ Practice Exercises' },
    { icon: CheckCircle, title: 'Career Support', desc: 'Resume reviews, interview prep, and job placement assistance', stats: '85% Job Placement Rate' },
    { icon: Shield, title: 'Trusted Platform', desc: 'Secure, reliable, and backed by industry partnerships', stats: '50+ Corporate Partners' }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Why Choose <span className="text-blue-600">GrowX Learning</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're not just another learning platform. Here's what makes us different.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {reasons.map((reason, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-xl">
              <div className="flex items-start gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl">
                  <reason.icon className="text-white" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{reason.title}</h3>
                  <p className="text-gray-600 mb-4">{reason.desc}</p>
                  <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-semibold text-blue-600">
                    <CheckCircle size={16} />
                    {reason.stats}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gray-900 text-white rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative z-10 grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2 text-yellow-400">30-Day</div>
              <div className="text-lg">Money-Back Guarantee</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 text-green-400">24/7</div>
              <div className="text-lg">Student Support</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 text-blue-400">Lifetime</div>
              <div className="text-lg">Course Access</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
