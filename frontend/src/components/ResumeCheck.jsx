import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, CheckCircle, FileCheck, Zap } from 'lucide-react';

const ResumeCheck = () => {
  const navigate = useNavigate();
  
  const features = [
    { icon: CheckCircle, text: 'ATS Compatibility Score' },
    { icon: FileCheck, text: 'Instant Feedback' },
    { icon: Zap, text: 'Actionable Suggestions' },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Content */}
            <div className="p-8 md:p-12">
              <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-6">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">Free Tool</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Get Your Resume <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">ATS-Ready</span>
              </h2>
              
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Make sure your resume beats the bots. Check your resume's ATS score and get personalized suggestions to improve your chances.
              </p>

              <div className="space-y-3 mb-8">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">{feature.text}</span>
                    </motion.div>
                  );
                })}
              </div>

              <Button 
                onClick={() => navigate('/ats-checker')}
                className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 text-lg rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                Check Resume Score
                <ArrowRight size={20} />
              </Button>
            </div>

            {/* Right Side - Visual */}
            <div className="relative h-full min-h-[400px] bg-gradient-to-br from-emerald-600 to-teal-600 p-8 md:p-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold text-white mb-2">95%</div>
                    <div className="text-emerald-100 text-lg">ATS Score</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-white" />
                      <span className="text-white text-sm font-medium">Keywords Optimized</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-white" />
                      <span className="text-white text-sm font-medium">Format Compatible</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-white" />
                      <span className="text-white text-sm font-medium">Ready to Apply</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResumeCheck;
