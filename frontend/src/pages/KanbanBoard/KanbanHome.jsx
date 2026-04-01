import React from "react";
import HeroSection from "./HeroSection";
import AboutSection from "./About";
import StatsSection from "./StatsSection";
import FeaturesSection from "./FeaturesSection";
import FeedbackSection from "./FeedbackSection";
import FAQs from "./FAQ";
import WatchDemo from "./WatchDemo";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function KanbanHome() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <HeroSection />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center gap-4 px-4 pb-16 flex-wrap"
      >
        <Link to="/taskForm">
          <button className="bg-gradient-to-r from-[#D4A853] to-[#C8884A] text-[#0A0A0F] px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all">
            ➕ Create Task
          </button>
        </Link>
        <Link to="/Taskkanbanboard">
          <button className="bg-gradient-to-r from-[#C8884A] to-[#E8C17A] text-[#0A0A0F] px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all">
            📊 View Board
          </button>
        </Link>
        <Link to="/getTask">
          <button className="bg-gradient-to-r from-[#E8C17A] to-[#D4A853] text-[#0A0A0F] px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all">
            📋 All Tasks
          </button>
        </Link>
      </motion.div>

      <AboutSection />
      <StatsSection />
      <FeaturesSection />
      <FeedbackSection />
      <WatchDemo />
      <FAQs />
    </div>
  );
}
