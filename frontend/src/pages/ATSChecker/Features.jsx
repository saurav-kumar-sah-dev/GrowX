import { motion } from 'framer-motion';
import { FileCheck, Zap, Target, Award, TrendingUp, Shield, CheckCircle, Users, BarChart, Lightbulb, Eye, FileText } from 'lucide-react';

export default function Features() {
  const features = [
    { icon: FileCheck, title: 'ATS Compatibility Check', desc: 'Analyzes your resume template and checks whether it is compatible with ATS systems', color: 'bg-[#D4A853]' },
    { icon: FileText, title: 'Resume Length Analysis', desc: 'Brevity is key - we check your resume and bullet point length for optimal impact', color: 'bg-[#C8884A]' },
    { icon: Zap, title: 'Action Verbs Detection', desc: 'Ensures you\'ve used strong action verbs and indicators of impact-oriented achievements', color: 'bg-[#E8C17A]' },
    { icon: Target, title: 'Keyword Optimization', desc: 'Identifies missing keywords and matches them with job descriptions', color: 'bg-[#D4A853]' },
    { icon: BarChart, title: '20+ Resume Checks', desc: 'Comprehensive analysis covering formatting, content, keywords, and readability', color: 'bg-[#C8884A]' },
    { icon: Lightbulb, title: 'Personalized Advice', desc: 'Tailored recommendations with examples from top candidates at leading companies', color: 'bg-[#E8C17A]' },
    { icon: Eye, title: 'Readability Score', desc: 'Analyzes word count, sentence structure, and overall resume clarity', color: 'bg-[#D4A853]' },
    { icon: Award, title: 'Expert Insights', desc: 'Feedback curated by hiring managers from Google, McKinsey, and Goldman Sachs', color: 'bg-[#C8884A]' }
  ];

  return (
    <section className="py-20 px-4 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#F5F0E6]">
            What our resume checker <span className="text-[#D4A853]">looks for</span>
          </h2>
          <p className="text-xl text-[#A8A099] max-w-3xl mx-auto">
            Score My Resume uses AI to analyze and benchmark your resume on key evaluation criteria
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className="bg-[#121218] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-[#252532] hover:border-[#D4A853]/50">
              <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="text-[#0A0A0F]" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#F5F0E6]">{feature.title}</h3>
              <p className="text-[#A8A099] text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 text-center">
          <div className="bg-[#121218] rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border-2 border-[#D4A853]/30">
            <h3 className="text-3xl font-bold mb-4 text-[#F5F0E6]">Proven to increase your callback rate</h3>
            <p className="text-xl text-[#A8A099] mb-6">Our users get 3x more interviews and callbacks with their improved resumes</p>
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-5xl font-black text-[#D4A853] mb-2">3x</div>
                <div className="text-[#A8A099]">More Interviews</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-[#C8884A] mb-2">95%</div>
                <div className="text-[#A8A099]">Pass ATS</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-[#E8C17A] mb-2">1M+</div>
                <div className="text-[#A8A099]">Users Trust Us</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
