import { motion } from 'framer-motion';
import { Award, Download, Share2, Star, Users, TrendingUp, Shield, CheckCircle, Sparkles } from 'lucide-react';
import ExploreXLogo from './ExploreXLogo';

export default function Certificate() {
  const features = [
    { icon: Shield, text: 'Verified by industry experts', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Share2, text: 'Shareable on LinkedIn & social media', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Download, text: 'Downloadable PDF format', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Star, text: 'Lifetime validity', color: 'text-orange-600', bg: 'bg-orange-50' }
  ];

  const stats = [
    { value: '50K+', label: 'Certificates Issued', icon: Award },
    { value: '95%', label: 'Career Growth', icon: TrendingUp },
    { value: '500+', label: 'Partner Companies', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg"
            >
              <Sparkles size={16} />
              Professional Certification Program
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Earn <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Industry-Recognized</span>
              <br className="hidden sm:block" />Certificates
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Complete courses and showcase your achievements with professional certificates that employers trust
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-20">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center hover:shadow-2xl transition-all border border-purple-100"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4">
                    <Icon size={24} />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8 order-2 lg:order-1"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 leading-tight">
                  Why Our Certificates <span className="text-purple-600">Matter</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Stand out in the job market with credentials that demonstrate your expertise and commitment to continuous learning.
                </p>
              </div>

              <div className="space-y-3">
                {features.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: 5 }}
                      className={`flex items-center gap-4 ${item.bg} p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100`}
                    >
                      <div className={`${item.color} p-3 rounded-xl bg-white shadow-sm`}>
                        <Icon size={24} />
                      </div>
                      <span className="text-gray-800 font-semibold">{item.text}</span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Award size={20} />
                  Get Certified Now
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-purple-600 hover:text-white transition-all"
                >
                  View Sample
                </motion.button>
              </div>
            </motion.div>

            {/* Right Content - Certificate Preview */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-1 lg:order-2"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-white to-purple-50 p-6 sm:p-10 rounded-3xl shadow-2xl border border-purple-200 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      <ExploreXLogo />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Certificate of Completion</h3>
                    <p className="text-gray-500 text-sm">This certifies that</p>
                  </div>

                  <div className="text-center mb-8 py-8 border-y-2 border-purple-100 bg-white/50 rounded-2xl">
                    <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                      John Doe
                    </div>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">has successfully completed</p>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                      Full Stack Web Development
                    </div>
                    <div className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600 bg-purple-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span><span className="font-semibold">Date:</span> Jan 15, 2024</span>
                    </div>
                    <div>
                      <span className="font-semibold">ID:</span> GX-2024-001
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="absolute -bottom-4 -right-4 flex gap-3">
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-2xl cursor-pointer"
                >
                  <Download size={22} />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-full shadow-2xl cursor-pointer"
                >
                  <Share2 size={22} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 sm:p-16 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10"></div>
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Users className="mx-auto text-white mb-6" size={56} />
              </motion.div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
                Join 50,000+ Certified Learners
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Start your learning journey today and earn certificates that boost your career
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-10 py-5 rounded-xl font-bold hover:shadow-2xl transition-all inline-flex items-center gap-3 text-lg"
              >
                <TrendingUp size={24} />
                Start Learning Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
