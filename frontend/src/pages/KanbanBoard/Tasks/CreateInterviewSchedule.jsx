import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Calendar, Clock, User, Mail, Briefcase, Video, Phone, MapPin, CheckCircle } from "lucide-react";
import { API } from "@/config/api";

export default function CreateInterviewSchedule() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    interviewDate: "",
    interviewTime: "",
    type: "video",
    meetingLink: "",
    location: "",
    notes: "",
    status: "todo"
  });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`${API.job}/get`, { withCredentials: true }).catch(() => ({ data: { jobs: [] } })),
      axios.get(`${API.application}/get`, { withCredentials: true }).catch(() => ({ data: { application: [] } }))
    ]).then(([jobsRes, appsRes]) => {
      setJobs(jobsRes.data?.jobs || []);
      setApplications(appsRes.data?.application || []);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.interviewDate || !formData.interviewTime) {
      return toast.error("Title, date and time are required!");
    }

    setLoading(true);
    try {
      const taskData = {
        title: formData.title,
        description: formData.description || `Interview: ${formData.type === 'video' ? 'Video' : formData.type === 'phone' ? 'Phone' : 'In-person'} Call\nDate: ${formData.interviewDate}\nTime: ${formData.interviewTime}${formData.meetingLink ? `\nLink: ${formData.meetingLink}` : ''}${formData.location ? `\nLocation: ${formData.location}` : ''}`,
        status: "todo",
        date: formData.interviewDate,
        interviewType: formData.type,
        interviewTime: formData.interviewTime,
        meetingLink: formData.meetingLink,
        location: formData.location,
        notes: formData.notes,
        jobId: selectedJob?._id,
        isInterview: true
      };

      await axios.post(`${API.kanban}/add`, taskData, { withCredentials: true });
      toast.success("Interview scheduled successfully!");
      navigate('/user/kanban');
    } catch (error) {
      toast.error("Failed to schedule interview");
    } finally {
      setLoading(false);
    }
  };

  const acceptedApps = applications.filter(a => a.status === 'accepted');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-10">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/user/kanban')}
        className="mb-6 flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-700/50 transition-all border border-slate-700/50"
      >
        <IoMdArrowRoundBack size={24} />
        Back to Kanban
      </motion.button>

      <div className="flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-3xl"
        >
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
            <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 p-8">
              <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Calendar className="text-white" size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Schedule Interview</h2>
                  <p className="text-white/80 mt-1">Set up your interview session</p>
                </div>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit} className="relative p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 font-bold mb-2 text-sm uppercase tracking-wide">Interview Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Software Engineer Interview"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-bold mb-2 text-sm uppercase tracking-wide">Interview Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'video', label: 'Video', icon: Video },
                      { value: 'phone', label: 'Phone', icon: Phone },
                      { value: 'inperson', label: 'In-person', icon: MapPin },
                    ].map(type => (
                      <motion.button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({...formData, type: type.value})}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border ${
                          formData.type === type.value
                            ? 'bg-violet-600 text-white border-violet-500'
                            : 'bg-slate-900/50 text-slate-400 border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <type.icon size={16} />
                        {type.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 font-bold mb-2 text-sm uppercase tracking-wide">Date *</label>
                  <input
                    type="date"
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({...formData, interviewDate: e.target.value})}
                    className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-600 text-white focus:border-violet-500 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-bold mb-2 text-sm uppercase tracking-wide">Time *</label>
                  <input
                    type="time"
                    value={formData.interviewTime}
                    onChange={(e) => setFormData({...formData, interviewTime: e.target.value})}
                    className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-600 text-white focus:border-violet-500 focus:outline-none transition-all"
                    required
                  />
                </div>

                {formData.type === 'video' && (
                  <div>
                    <label className="block text-white/80 font-bold mb-2 text-sm uppercase tracking-wide">Meeting Link</label>
                    <input
                      type="url"
                      placeholder="https://meet.google.com/..."
                      value={formData.meetingLink}
                      onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                      className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-all"
                    />
                  </div>
                )}

                {formData.type === 'inperson' && (
                  <div>
                    <label className="block text-white/80 font-bold mb-2 text-sm uppercase tracking-wide">Location</label>
                    <input
                      type="text"
                      placeholder="Office address or room number"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-all"
                    />
                  </div>
                )}
              </div>

              {acceptedApps.length > 0 && (
                <div>
                  <label className="block text-white/80 font-bold mb-2 text-sm uppercase tracking-wide">Link to Accepted Application</label>
                  <select
                    value={selectedJob?._id || ''}
                    onChange={(e) => {
                      const job = acceptedApps.find(a => a.job?._id === e.target.value);
                      setSelectedJob(job?.job || null);
                      if (job?.job?.title) {
                        setFormData(prev => ({ ...prev, title: `Interview: ${job.job.title}` }));
                      }
                    }}
                    className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-600 text-white focus:border-violet-500 focus:outline-none transition-all"
                  >
                    <option value="">Select a job (optional)</option>
                    {acceptedApps.map(app => (
                      <option key={app._id} value={app.job?._id}>
                        {app.job?.title || 'Unknown Position'} - {app.job?.company?.name || 'Company'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-white/80 font-bold mb-2 text-sm uppercase tracking-wide">Notes</label>
                <textarea
                  placeholder="Add any notes or preparation reminders..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-all resize-none h-24"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Calendar size={18} />
                      Schedule Interview
                    </>
                  )}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => navigate('/user/kanban')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 bg-slate-700/50 text-white py-4 rounded-xl font-bold hover:bg-slate-600/50 transition-all border border-slate-600/50"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
