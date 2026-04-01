import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaEdit, FaPrint, FaShare, FaArrowLeft, FaCheck, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Resumeviews from "./Resumeviews";
import { API } from "@/config/api";

const T = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
  surface: "#1A1A24",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  accent: "#C8884A",
  ivory: "#F5F0E6",
  ivoryMuted: "#A8A099",
};

export default function ResumeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const resumeRef = useRef();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get(`${API.resume}/${id}`, { withCredentials: true });
        setResume(res.data.data);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } catch (err) {
        console.error("Failed to load resume:", err);
        toast.error("Failed to load resume");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const element = resumeRef.current;
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`${resume?.personalInfo?.fullName || "resume"}.pdf`);

      toast.success("Resume downloaded successfully!");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download resume");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: `linear-gradient(135deg,${T.obsidian} 0%,${T.charcoal} 50%,${T.obsidian} 100%)` }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <div 
            className="w-20 h-20 rounded-full border-4 border-t-transparent flex items-center justify-center"
            style={{ borderColor: `${T.gold}30`, borderTopColor: 'transparent' }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.accent})` }}
            />
          </div>
        </motion.div>
        <div className="text-center">
          <p className="text-lg font-semibold mb-1" style={{ color: T.ivory }}>Loading Resume</p>
          <p className="text-sm" style={{ color: T.ivoryMuted }}>Please wait...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: `linear-gradient(135deg,${T.obsidian} 0%,${T.charcoal} 50%,${T.obsidian} 100%)` }}
      >
        <div 
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{ background: `${T.gold}15` }}
        >
          <span className="text-5xl">📄</span>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold mb-2" style={{ color: T.ivory }}>Resume Not Found</p>
          <p className="text-sm mb-6" style={{ color: T.ivoryMuted }}>The resume you're looking for doesn't exist</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.accent})`, color: T.obsidian }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ background: `linear-gradient(135deg,${T.obsidian} 0%,${T.charcoal} 50%,${T.obsidian} 100%)` }}
    >
      {/* Floating Nav Bar */}
      <div className="sticky top-0 z-50 px-4 py-4">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-5xl mx-auto"
        >
          <div 
            className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 rounded-2xl backdrop-blur-xl"
            style={{ background: 'rgba(26,26,36,0.85)', border: `1px solid ${T.gold}30` }}
          >
            {/* Left - Back Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all w-full md:w-auto justify-center"
              style={{ background: `${T.gold}15`, color: T.ivory, border: `1px solid ${T.gold}30` }}
            >
              <FaArrowLeft />
              <span>Back</span>
            </motion.button>

            {/* Center - Title */}
            <div className="text-center hidden md:block">
              <p className="font-bold text-lg" style={{ color: T.ivory }}>
                {resume?.personalInfo?.fullName || "Resume Preview"}
              </p>
            </div>

            {/* Right - Actions */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {!isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/edit-resume/${id}`)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all"
                  style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.accent})`, color: T.obsidian }}
                >
                  <FaEdit />
                  <span className="hidden sm:inline">Edit</span>
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all"
                style={{ background: 'rgba(102,126,234,0.2)', color: '#667eea' }}
              >
                <FaPrint />
                <span className="hidden sm:inline">Print</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50"
                style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}
              >
                {downloading ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                <span className="hidden sm:inline">{downloading ? "Saving..." : "Download"}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all"
                style={{ background: `${T.gold}15`, color: T.gold, border: `1px solid ${T.gold}30` }}
              >
                <FaShare />
                <span className="hidden sm:inline">Share</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Toast Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div 
              className="flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.accent})` }}
            >
              <FaCheck className="text-lg" style={{ color: T.obsidian }} />
              <span className="font-bold" style={{ color: T.obsidian }}>Resume loaded successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume Content */}
      <div className="px-4 pb-12">
        <div ref={resumeRef}>
          <Resumeviews resume={resume} />
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #resume-view, #resume-view * { visibility: visible; }
          #resume-view { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          .sticky { display: none !important; }
        }
        
        @page {
          size: A4;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
