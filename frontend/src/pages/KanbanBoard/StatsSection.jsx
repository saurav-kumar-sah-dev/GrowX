import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
    { value: "500+", label: "Tasks Managed", icon: "📋" },
    { value: "50+", label: "Projects Created", icon: "📁" },
    { value: "100%", label: "Team Collaboration", icon: "🤝" },
    { value: "24/7", label: "Real-Time Updates", icon: "⚡" },
  ];

  return (
    <section className="py-20 bg-[#0A0A0F] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#D4A853]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#C8884A]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-[#F5F0E6] mb-4">
            Trusted by Teams Worldwide
          </h2>
          <p className="text-[#A8A099] text-lg">Real results from real users</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-[#121218] border border-[#252532] rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl hover:border-[#D4A853]/50 transition-all"
            >
              <div className="text-5xl mb-4">{stat.icon}</div>
              <h3 className="text-5xl font-black text-[#D4A853] mb-2">
                {stat.value}
              </h3>
              <p className="text-[#A8A099] font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
