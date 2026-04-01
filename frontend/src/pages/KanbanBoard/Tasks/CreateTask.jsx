import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const API_URL = import.meta.env.VITE_KANBAN_BOARD_API;

const statusOptions = [
  { value: "todo", label: "To Do", gradient: "from-[#D4A853] to-[#C8884A]", icon: "📋", color: "amber" },
  { value: "thisweek", label: "This Week", gradient: "from-[#C8884A] to-[#E8C17A]", icon: "📅", color: "orange" },
  { value: "inprocess", label: "In Process", gradient: "from-[#E8C17A] to-[#D4A853]", icon: "⚡", color: "yellow" },
  { value: "done", label: "Done", gradient: "from-[#D4A853] to-[#C8884A]", icon: "✅", color: "amber" },
];

export default function CreateTask() {
  const [formData, setFormData] = useState({ title: "", description: "", status: "todo", date: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return toast.error("Title and date are required!");

    try {
      const { data } = await axios.post(`${API_URL}/add`, formData);
      toast.success("🎉 Task created successfully!");
      setFormData({ title: "", description: "", status: "todo", date: "" });
      navigate(`/getTask/${data._id}`);
    } catch (error) {
      toast.error("Failed to create task 😢");
    }
  };

  const selectedStatus = statusOptions.find(s => s.value === formData.status);

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-10">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 bg-[#121218] text-[#F5F0E6] px-4 py-2 rounded-xl font-bold hover:bg-[#252532] transition-all border border-[#252532]"
      >
        <IoMdArrowRoundBack size={24} />
        Back
      </motion.button>

      <div className="flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <div className="relative bg-[#121218] rounded-3xl shadow-2xl border border-[#252532] overflow-hidden">
            <div className={`relative bg-gradient-to-r ${selectedStatus.gradient} p-8 text-[#0A0A0F]`}>
              <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="flex items-center gap-4">
                <div className="text-5xl">{selectedStatus.icon}</div>
                <div>
                  <h2 className="text-4xl font-black">Create New Task</h2>
                  <p className="text-[#0A0A0F]/80 mt-1">Add a task to your board</p>
                </div>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit} className="relative p-8 space-y-6">
              <div>
                <label className="block text-[#F5F0E6] font-bold mb-2 text-sm uppercase tracking-wide">Task Title</label>
                <input
                  type="text"
                  placeholder="Enter your task title..."
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-4 rounded-xl bg-[#0A0A0F] border-2 border-[#252532] text-[#F5F0E6] placeholder-[#A8A099] focus:border-[#D4A853] focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[#F5F0E6] font-bold mb-2 text-sm uppercase tracking-wide">Description</label>
                <textarea
                  placeholder="Describe your task..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-4 rounded-xl bg-[#0A0A0F] border-2 border-[#252532] text-[#F5F0E6] placeholder-[#A8A099] focus:border-[#D4A853] focus:outline-none transition-all resize-none h-32"
                />
              </div>

              <div>
                <label className="block text-[#F5F0E6] font-bold mb-3 text-sm uppercase tracking-wide">Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {statusOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({...formData, status: option.value})}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative p-4 rounded-xl font-bold transition-all overflow-hidden ${
                        formData.status === option.value
                          ? `bg-gradient-to-r ${option.gradient} text-[#0A0A0F] shadow-lg`
                          : "bg-[#0A0A0F] text-[#F5F0E6] hover:bg-[#252532] border-2 border-[#252532]"
                      }`}
                    >
                      <span className="text-2xl mr-2">{option.icon}</span>
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#F5F0E6] font-bold mb-2 text-sm uppercase tracking-wide">Due Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-4 rounded-xl bg-[#0A0A0F] border-2 border-[#252532] text-[#F5F0E6] focus:border-[#D4A853] focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 bg-gradient-to-r ${selectedStatus.gradient} text-[#0A0A0F] py-4 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all`}
                >
                  🚀 Create Task
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => navigate("/Taskkanbanboard")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 bg-[#0A0A0F] text-[#F5F0E6] py-4 rounded-xl font-bold hover:bg-[#252532] transition-all border-2 border-[#252532]"
                >
                  📊 Board
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
