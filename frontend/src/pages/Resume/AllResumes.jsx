import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaDownload, FaPlus } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { motion } from "framer-motion";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { API } from "@/config/api";

const T = {
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
  accentGlow: "rgba(212,168,83,0.12)",
  gradient1: "#667eea",
  gradient2: "#764ba2",
};

export default function AllResumes() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await axios.get(`${API.resume}`, { withCredentials: true });
      setResumes(res.data.data || []);
      toast.success("Resumes loaded successfully");
    } catch (error) {
      console.error("Error fetching resumes:", error);
      toast.error("Failed to fetch resumes");
    } finally {
      setLoading(false);
    }
  };

 const handleDelete = async (id) => {
   try {
     await axios.delete(`${API.resume}/${id}`, { withCredentials: true });
     setResumes((prev) => prev.filter((resume) => resume._id !== id));
     toast.success("Resume deleted successfully");
   } catch (error) {
     console.error("Error deleting resume:", error);
     toast.error("Failed to delete resume");
   }
 };

  const handleDownload = async (id, name) => {
    try {
      const res = await axios.get(`${API.resume}/${id}`, { withCredentials: true });
      const resumeData = res.data.data;

      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = "800px";
      tempDiv.innerHTML = `
        <div style="padding:20px; font-family:Arial; line-height:1.5;">
          <h2 style="margin:0; color:#D4A853;">${resumeData.personalInfo?.fullName || "Unnamed Resume"}</h2>
          <p>${resumeData.personalInfo?.title || ""}</p>
          <p><b>Email:</b> ${resumeData.personalInfo?.email || "-"}</p>
          <p><b>Phone:</b> ${resumeData.personalInfo?.phone || "-"}</p>
          <hr/>
          <h3>Education</h3>
          ${(resumeData.education || [])
            .map(
              (edu) => `
              <p><b>${edu.degree}</b> - ${edu.institution} (${edu.startDate} - ${edu.endDate || "Present"})</p>
            `
            )
            .join("")}
        </div>
      `;
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${name || "resume"}.pdf`);

      document.body.removeChild(tempDiv);
      toast.success("Resume downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download resume");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center" style={{ background: `linear-gradient(135deg,${T.obsidian} 0%,${T.charcoal} 50%,${T.obsidian} 100%)` }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-20 h-20 border-4 border-amber-500/30 border-t-amber-500 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full animate-pulse" />
          </div>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen p-6" style={{ background: `linear-gradient(135deg,${T.obsidian} 0%,${T.charcoal} 50%,${T.obsidian} 100%)` }}>
      <div className="max-w-7xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-md"
          style={{ background: 'rgba(26,26,36,0.8)', backdropFilter: 'blur(10px)', color: '#F5F0E6', border: '1px solid rgba(212,168,83,0.2)' }}
        >
          <IoMdArrowRoundBack size={24} />
          Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#F5F0E6' }}>
              My <span style={{ color: '#D4A853' }}>Resumes</span>
            </h1>
            <p style={{ color: '#A8A099' }}>{resumes.length} resume{resumes.length !== 1 ? 's' : ''} found</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/resume-builder')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg"
            style={{ background: `linear-gradient(135deg,${T.gold},${T.accent})`, color: T.obsidian }}
          >
            <FaPlus /> Create New Resume
          </motion.button>
        </motion.div>

        {!resumes.length ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center items-center min-h-[50vh]"
          >
            <Card className="p-12 text-center shadow-2xl rounded-2xl max-w-md w-full" style={{ background: T.surface, border: '1px solid rgba(212,168,83,0.2)' }}>
              <div className="text-6xl mb-4">📄</div>
              <CardTitle className="text-3xl font-bold mb-4" style={{ color: '#D4A853', fontFamily: "'Playfair Display', serif" }}>
                No Resumes Found
              </CardTitle>
              <p className="mb-6" style={{ color: '#A8A099' }}>
                You haven't created any resumes yet. Start building your professional resume now!
              </p>
              <Button
                onClick={() => navigate('/resume-builder')}
                className="px-6 py-3 rounded-xl font-bold"
                style={{ background: `linear-gradient(135deg,${T.gold},${T.accent})`, color: T.obsidian }}
              >
                Create Your First Resume
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resumes.map((resume, idx) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className="h-full transition-all duration-300 overflow-hidden" style={{ background: T.surface, border: '1px solid rgba(212,168,83,0.15)' }}>
                  <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: `linear-gradient(135deg,${T.gold},${T.accent})` }}>
                        {resume.personalInfo?.fullName?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold truncate" style={{ color: '#F5F0E6' }}>
                          {resume.personalInfo?.fullName || "Unnamed Resume"}
                        </CardTitle>
                        <p className="text-sm truncate" style={{ color: '#A8A099' }}>{resume.personalInfo?.title || "No title"}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4 text-sm" style={{ color: '#A8A099' }}>
                      <p className="truncate">📧 {resume.personalInfo?.email || "-"}</p>
                      <p className="truncate">📞 {resume.personalInfo?.phone || "-"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        className="rounded-lg transition flex items-center justify-center gap-1"
                        style={{ background: 'rgba(102,126,234,0.2)', color: '#667eea' }}
                        onClick={() => navigate(`/resume/${resume._id}`)}
                      >
                        <FaEye size={14} /> View
                      </Button>

                      <Button
                        size="sm"
                        className="rounded-lg transition flex items-center justify-center gap-1"
                        style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24' }}
                        onClick={() => navigate(`/edit-resume/${resume._id}`)}
                      >
                        <FaEdit size={14} /> Edit
                      </Button>

                      <Button
                        size="sm"
                        className="rounded-lg transition flex items-center justify-center gap-1"
                        style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}
                        onClick={() => handleDownload(resume._id, resume.personalInfo?.fullName)}
                      >
                        <FaDownload size={14} /> Download
                      </Button>

                      <Button
                        size="sm"
                        className="rounded-lg transition flex items-center justify-center gap-1"
                        style={{ background: 'rgba(248,113,113,0.2)', color: '#f87171' }}
                        onClick={() => handleDelete(resume._id)}
                      >
                        <FaTrash size={14} /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
