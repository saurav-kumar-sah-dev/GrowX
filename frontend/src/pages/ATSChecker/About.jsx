import { motion } from 'framer-motion';
import { CheckCircle, Target, Users, Award } from 'lucide-react';

export default function About() {
  return (
    <section className="py-20 px-4 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#F5F0E6]">
            Why Choose Our <span className="text-[#D4A853]">ATS Checker?</span>
          </h2>
          <p className="text-xl text-[#A8A099] max-w-3xl mx-auto">
            Our AI-powered resume checker helps you optimize your resume to pass Applicant Tracking Systems and land more interviews.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img 
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop" 
              alt="Resume Analysis" 
              className="rounded-2xl shadow-2xl border border-[#252532]"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#D4A853]/20 p-3 rounded-lg border border-[#D4A853]/30">
                <CheckCircle className="w-6 h-6 text-[#D4A853]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#F5F0E6]">Instant Analysis</h3>
                <p className="text-[#A8A099]">Get your resume score in seconds with our advanced AI technology that analyzes 20+ key criteria.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#C8884A]/20 p-3 rounded-lg border border-[#C8884A]/30">
                <Target className="w-6 h-6 text-[#C8884A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#F5F0E6]">ATS Optimization</h3>
                <p className="text-[#A8A099]">Ensure your resume passes Applicant Tracking Systems used by 75% of companies worldwide.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#E8C17A]/20 p-3 rounded-lg border border-[#E8C17A]/30">
                <Users className="w-6 h-6 text-[#E8C17A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#F5F0E6]">Expert Insights</h3>
                <p className="text-[#A8A099]">Get feedback curated by hiring managers from top companies like Google, McKinsey, and Goldman Sachs.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#D4A853]/20 p-3 rounded-lg border border-[#D4A853]/30">
                <Award className="w-6 h-6 text-[#D4A853]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#F5F0E6]">Proven Results</h3>
                <p className="text-[#A8A099]">Our users get 3x more interviews and callbacks with their improved resumes.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#121218] rounded-3xl p-12 text-center border border-[#252532]">
          <h3 className="text-3xl font-bold mb-4 text-[#F5F0E6]">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="bg-[#D4A853] text-[#0A0A0F] w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h4 className="text-xl font-bold mb-2 text-[#F5F0E6]">Upload Resume</h4>
              <p className="text-[#A8A099]">Upload your resume in PDF, DOCX, or TXT format</p>
            </div>
            <div>
              <div className="bg-[#C8884A] text-[#0A0A0F] w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h4 className="text-xl font-bold mb-2 text-[#F5F0E6]">AI Analysis</h4>
              <p className="text-[#A8A099]">Our AI runs 20+ checks on formatting, content, and keywords</p>
            </div>
            <div>
              <div className="bg-[#E8C17A] text-[#0A0A0F] w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h4 className="text-xl font-bold mb-2 text-[#F5F0E6]">Get Results</h4>
              <p className="text-[#A8A099]">Receive detailed feedback and actionable improvement tips</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
