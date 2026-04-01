import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Aman Gupta",
    role: "Product Manager",
    img: "https://randomuser.me/api/portraits/men/12.jpg",
    text: "The Kanban Board makes managing tasks so much easier! I can visualize everything at a glance.",
    rating: 5,
  },
  {
    name: "Rohit Kumar",
    role: "Software Engineer",
    img: "https://randomuser.me/api/portraits/men/24.jpg",
    text: "Moving tasks between columns is super smooth. It keeps our team aligned and productive.",
    rating: 4,
  },
  {
    name: "Meena Patel",
    role: "UX Designer",
    img: "https://randomuser.me/api/portraits/women/19.jpg",
    text: "Adding priorities and deadlines helps me stay on top of my work without missing anything.",
    rating: 5,
  },
  {
    name: "Aarav Singh",
    role: "Team Lead",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    text: "The real-time updates are amazing. I can see when team members complete or move tasks instantly.",
    rating: 4,
  },
  {
    name: "Priya Verma",
    role: "Project Coordinator",
    img: "https://randomuser.me/api/portraits/women/30.jpg",
    text: "Customizing columns to match our workflow has made task management much more efficient.",
    rating: 4,
  },
  {
    name: "Karan Mehta",
    role: "Startup Founder",
    img: "https://randomuser.me/api/portraits/men/52.jpg",
    text: "This Kanban Board keeps our projects organized and our team on the same page. Highly recommend!",
    rating: 5,
  },
];

export default function FeedbackSection() {
  return (
    <section className="py-20 px-6 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-[#F5F0E6] mb-4">
            What Our Users Say
          </h2>
          <p className="text-[#A8A099] text-lg">Real feedback from real users</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="bg-[#121218] rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-[#252532] hover:border-[#D4A853]/50"
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.img
                  src={t.img}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#D4A853]/50"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <div>
                  <h3 className="font-bold text-[#F5F0E6]">{t.name}</h3>
                  <p className="text-[#A8A099] text-sm">{t.role}</p>
                </div>
              </div>

              <p className="text-[#A8A099] mb-4 leading-relaxed italic">
                "{t.text}"
              </p>

              <div className="flex text-[#D4A853] text-xl">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <motion.span
                    key={idx}
                    whileHover={{ scale: 1.3, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {idx < t.rating ? "★" : "☆"}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
