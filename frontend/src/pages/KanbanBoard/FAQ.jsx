import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is this Kanban Board?",
    answer:
      "This Kanban Board is a visual task management tool that helps you organize, track, and manage tasks across different stages such as To Do, In Progress, and Done.",
  },
  {
    question: "How do I add a new task?",
    answer:
      "Click on the 'Add Task' button, fill in the title, description, status, and position, then submit. The task will appear in the corresponding column instantly.",
  },
  {
    question: "Can I move tasks between columns?",
    answer:
      "Yes! Simply drag and drop tasks to change their status or order. The updates are reflected in real-time for all team members.",
  },
  {
    question: "Can I assign priorities or due dates?",
    answer:
      "Absolutely. You can set priorities, due dates, and labels for tasks to help you stay organized and ensure important tasks are completed on time.",
  },
  {
    question: "Can I collaborate with my team?",
    answer:
      "Yes, this Kanban Board supports real-time collaboration. Team members can view updates instantly and stay aligned on project progress.",
  },
  {
    question: "Can I customize columns or workflows?",
    answer:
      "Yes, you can create, rename, or reorder columns to match your personal workflow or team project requirements, making task management flexible and tailored.",
  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-20 px-4 bg-[#0A0A0F]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-[#F5F0E6] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#A8A099] text-lg">Everything you need to know</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-[#121218] rounded-2xl shadow-md hover:shadow-lg transition-all border border-[#252532] overflow-hidden hover:border-[#D4A853]/50"
            >
              <div
                className="flex justify-between items-center cursor-pointer p-6"
                onClick={() => toggleAnswer(index)}
              >
                <h3 className="text-lg font-bold text-[#F5F0E6] pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="text-[#D4A853]" size={24} />
                </motion.div>
              </div>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t border-[#252532]">
                      <p className="text-[#A8A099] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;
