import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, MessageSquare, Send, MapPin, Phone, Clock, Sparkles } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import ContactImage from "../../assets/Contact.jpg";

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
  surface: "#1A1A24",
  surfaceLight: "#252532",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDark: "#B8923F",
  ivory: "#F5F0E6",
  ivoryMuted: "#A8A099",
  accent: "#C8884A",
  goldBorder: "rgba(212,168,83,0.15)",
  goldDim: "rgba(212,168,83,0.08)",
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        import.meta.env.VITE_CONTACT_API,
        formData
      );

      toast.success(res.data.message || "Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden" style={{ background: C.charcoal }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)",
        backgroundSize: "50px 50px"
      }} />

      <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: C.gold }} />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: C.accent }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
          >
            <Mail size={14} color={C.gold} />
            <span className="text-xs font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
              CONTACT US
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>
            Get in <span style={{ color: C.gold }}>Touch</span>
          </h2>

          <p className="text-base md:text-lg" style={{ color: C.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
            Have questions? We'd love to hear from you
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group order-2 lg:order-1"
          >
            <motion.div
              className="absolute -inset-4 rounded-3xl opacity-30"
              style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, filter: 'blur(30px)' }}
              animate={{ scale: [1, 1.03, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ border: `1px solid ${C.goldBorder}` }}>
              <motion.img
                src={ContactImage}
                alt="Contact us"
                className="w-full h-[500px] object-cover"
                whileHover={{ scale: 1.05 }}
              />
            </div>

            <motion.div 
              className="absolute -bottom-6 -right-6 p-5 rounded-2xl shadow-xl"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <Clock size={20} color={C.gold} />
                <span className="text-sm font-medium" style={{ color: C.ivory }}>24/7 Support</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <motion.div 
              className="rounded-3xl p-8 md:p-12"
              style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
              whileHover={{ y: -5 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <User className="absolute left-4 top-4 w-5 h-5" style={{ color: C.gold }} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl focus:outline-none transition-all"
                    style={{ 
                      background: C.charcoal, 
                      border: `1.5px solid ${C.goldBorder}`, 
                      color: C.ivory,
                    }}
                    required
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="relative"
                >
                  <Mail className="absolute left-4 top-4 w-5 h-5" style={{ color: C.gold }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl focus:outline-none transition-all"
                    style={{ 
                      background: C.charcoal, 
                      border: `1.5px solid ${C.goldBorder}`, 
                      color: C.ivory,
                    }}
                    required
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5" style={{ color: C.gold }} />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows="5"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl focus:outline-none transition-all resize-none"
                    style={{ 
                      background: C.charcoal, 
                      border: `1.5px solid ${C.goldBorder}`, 
                      color: C.ivory,
                    }}
                    required
                  ></textarea>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(212,168,83,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold shadow-lg transition-all"
                  style={{ background: `linear-gradient(135deg,${C.gold},${C.accent})`, color: C.obsidian }}
                >
                  {loading ? "Sending..." : "Send Message"}
                  {!loading && <Send className="w-5 h-5" />}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
