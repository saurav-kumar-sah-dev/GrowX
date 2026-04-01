import { motion } from 'framer-motion';
import { FileCheck, ExternalLink, Link2Off } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0F] text-[#F5F0E6] pt-10 pb-20 px-4">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#D4A853]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#C8884A]/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E8C17A]/5 rounded-full blur-3xl"></div>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#D4A853]/60 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, `${Math.random() * 200 - 100}px`],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Beat the ATS <span className="bg-gradient-to-r from-[#D4A853] to-[#E8C17A] bg-clip-text text-transparent">System</span>
            </h1>
            <p className="text-xl mb-8 text-[#A8A099]">
              Check your resume's ATS compatibility score instantly. Get personalized suggestions and increase your chances of landing interviews.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/atschecker/review" className="scroll-smooth">
                <button className="bg-gradient-to-r from-[#D4A853] to-[#C8884A] text-[#0A0A0F] px-8 py-4 rounded-full font-semibold hover:from-[#C8884A] hover:to-[#D4A853] transition-all shadow-lg shadow-[#D4A853]/25 flex items-center gap-2">
                  <FileCheck size={20} />
                  Check My Resume
                </button>
              </Link>
              <button className="border-2 border-[#D4A853] text-[#D4A853] px-8 py-4 rounded-full font-semibold hover:bg-[#D4A853] hover:text-[#0A0A0F] transition-all flex items-center gap-2">
                <ExternalLink size={20} />
                Learn More
              </button>
            </div>
            <div className="flex gap-8 mt-10">
              <div>
                <div className="text-3xl font-bold text-[#D4A853]">95%</div>
                <div className="text-[#A8A099]">Pass Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#C8884A]">Instant</div>
                <div className="text-[#A8A099]">Results</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#E8C17A]">Free</div>
                <div className="text-[#A8A099]">Analysis</div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
            <div className="relative bg-[#121218]/80 backdrop-blur-lg rounded-3xl p-8 border border-[#252532]">
              <div className="absolute -top-4 -right-4 bg-[#D4A853] text-[#0A0A0F] px-4 py-2 rounded-full font-bold text-sm">
                ✓ Free Tool
              </div>
              <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop" alt="ATS Checker" className="rounded-2xl shadow-2xl border border-[#252532]" />
              <div className="mt-6 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A853] to-[#C8884A] border-2 border-[#252532]"></div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-[#F5F0E6]">Join 10,000+ users</div>
                  <div className="text-[#A8A099]">Check your resume today</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
