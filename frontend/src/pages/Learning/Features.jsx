import { motion } from 'framer-motion';
import { Code, Briefcase, Video, FileText, Users, Trophy, Clock, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Features() {
  const features = [
    { icon: Code, title: 'Interactive Coding', desc: 'Practice with live code editors and instant feedback', color: 'bg-blue-500' },
    { icon: Video, title: 'HD Video Lessons', desc: 'Crystal-clear video content from industry experts', color: 'bg-purple-500' },
    { icon: Briefcase, title: 'Real Projects', desc: 'Build portfolio-worthy projects as you learn', color: 'bg-green-500' },
    { icon: FileText, title: 'Downloadable Resources', desc: 'Access notes, cheat sheets, and templates', color: 'bg-orange-500' },
    { icon: Users, title: 'Community Support', desc: 'Connect with peers and mentors 24/7', color: 'bg-pink-500' },
    { icon: Trophy, title: 'Certificates', desc: 'Earn industry-recognized certificates', color: 'bg-yellow-500' },
    { icon: Clock, title: 'Lifetime Access', desc: 'Learn at your own pace, anytime, anywhere', color: 'bg-indigo-500' },
    { icon: Smartphone, title: 'Mobile Learning', desc: 'Continue learning on iOS and Android apps', color: 'bg-teal-500' }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Everything You Need to <span className="text-blue-600">Succeed</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive learning platform provides all the tools and resources you need to master new skills
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Your Learning Journey?</h3>
          <p className="text-xl mb-8 text-blue-100">Join thousands of learners already transforming their careers</p>
          <Link to="/learningVideo">
            <button className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 hover:text-blue-700 transition-all shadow-lg">
              Get Started Free
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
