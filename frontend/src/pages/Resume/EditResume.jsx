import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaSave, FaPlus, FaTimes } from "react-icons/fa";
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
};

export default function EditResume() {
  const { id } = useParams();
  const navigate = useNavigate();

  const sections = [
    { name: "Personal Info", icon: "👤" },
    { name: "Education", icon: "🎓" },
    { name: "Technical Skills", icon: "💻" },
    { name: "Experience", icon: "💼" },
    { name: "Projects", icon: "🚀" },
    { name: "Achievements", icon: "🏆" },
    { name: "Certifications", icon: "📜" },
  ];

  const [activeSection, setActiveSection] = useState("Personal Info");
  const [resumeLoaded, setResumeLoaded] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    title: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    portfolio: "",
  });

  const [education, setEducation] = useState([]);
  const [technicalSkills, setTechnicalSkills] = useState({
    Languages: [],
    "Libraries / Frameworks": [],
    Databases: [],
    "Cloud Platforms": [],
    Tools: [],
    CsFundamentals: [],
  });
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const resumeRef = useRef();

  // ---------------- FETCH EXISTING RESUME ----------------
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get(`${API.resume}/${id}`, { withCredentials: true });
        const data = res.data.data;

        setPersonalInfo(data.personalInfo || personalInfo);
        setEducation(data.education || []);
        setTechnicalSkills(data.technicalSkills || technicalSkills);
        setExperience(data.experience || []);
        setProjects(data.projects || []);
        setAchievements(data.achievements || []);
        setCertifications(data.certifications || []);

        setResumeLoaded(true);
        toast.success("✅ Resume loaded successfully!");
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load resume data.");
      }
    };
    fetchResume();
  }, [id]);

  // ---------------- SKILL HANDLERS ----------------
  const handleSkillAdd = (category) => {
    if (!skillInput.trim()) return;
    setTechnicalSkills({
      ...technicalSkills,
      [category]: [...technicalSkills[category], skillInput.trim()],
    });
    toast.success(`Skill added to ${category} ✅`);
    setSkillInput("");
  };

  const handleSkillRemove = (category, idx) => {
    const newSkills = [...technicalSkills[category]];
    const removed = newSkills.splice(idx, 1);
    setTechnicalSkills({ ...technicalSkills, [category]: newSkills });
    toast.info(`Removed skill: ${removed[0]}`);
  };

  // ---------------- SAVE RESUME ----------------
  const handleSaveResume = async () => {
    try {
      const updatedResume = {
        personalInfo,
        education,
        technicalSkills,
        experience,
        projects,
        achievements,
        certifications,
      };
      await axios.put(`${API.resume}/update/${id}`, updatedResume, { withCredentials: true });
      toast.success("✅ Resume updated successfully!");
      navigate(`/resume/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update resume.");
    }
  };

  const currentIndex = sections.findIndex(s => s.name === activeSection);

  if (!resumeLoaded)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(135deg,${T.obsidian} 0%,${T.charcoal} 50%,${T.obsidian} 100%)` }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: T.gold, borderTopColor: 'transparent' }}></div>
          <p style={{ color: T.ivoryMuted }} className="text-lg font-medium">Loading resume...</p>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: `linear-gradient(135deg,${T.obsidian} 0%,${T.charcoal} 50%,${T.obsidian} 100%)` }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#F5F0E6' }}>
            Edit <span style={{ color: '#D4A853' }}>Resume</span>
          </h1>
          <p style={{ color: '#A8A099' }}>Update your professional resume</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveResume}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg"
          style={{ background: `linear-gradient(135deg,${T.gold},${T.accent})`, color: T.obsidian }}
        >
          <FaSave /> Save Changes
        </motion.button>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        <div className="lg:w-64 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {sections.map((section, idx) => (
            <motion.div
              key={section.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-4 cursor-pointer transition-all flex-shrink-0`}
                style={activeSection === section.name 
                  ? { background: `linear-gradient(135deg,${T.gold},${T.accent})` }
                  : { background: T.surface, border: '1px solid rgba(212,168,83,0.15)' }
                }
                onClick={() => setActiveSection(section.name)}
              >
                <div className="flex items-center gap-2 font-bold">
                  <span className="text-xl">{section.icon}</span>
                  <span className="text-sm lg:text-base" style={activeSection === section.name ? { color: T.obsidian } : { color: '#F5F0E6' }}>{section.name}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 rounded-2xl shadow-xl p-6 lg:p-8"
          style={{ background: T.surface, border: '1px solid rgba(212,168,83,0.15)' }}
          ref={resumeRef}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{sections.find(s => s.name === activeSection)?.icon}</span>
            <h2 className="text-2xl font-bold" style={{ color: '#F5F0E6' }}>{activeSection}</h2>
          </div>

          {activeSection === "Personal Info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(personalInfo).map((key) => (
                <Input
                  key={key}
                  placeholder={key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                  value={personalInfo[key]}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, [key]: e.target.value })}
                  style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }}
                />
              ))}
            </div>
          )}

          {activeSection === "Education" && (
            <>
              {education.map((edu, idx) => (
                <div key={idx} className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(212,168,83,0.05)', border: '1px solid rgba(212,168,83,0.15)' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Institution" value={edu.institution} onChange={(e) => { const newEd = [...education]; newEd[idx].institution = e.target.value; setEducation(newEd); }} style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }} />
                    <Input placeholder="Degree" value={edu.degree} onChange={(e) => { const newEd = [...education]; newEd[idx].degree = e.target.value; setEducation(newEd); }} style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }} />
                    <Input placeholder="CGPA" value={edu.cgpa} onChange={(e) => { const newEd = [...education]; newEd[idx].cgpa = e.target.value; setEducation(newEd); }} style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }} />
                    <Input placeholder="City" value={edu.city} onChange={(e) => { const newEd = [...education]; newEd[idx].city = e.target.value; setEducation(newEd); }} style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }} />
                    <DatePicker selected={edu.startDate ? new Date(edu.startDate) : null} onChange={(date) => { const newEd = [...education]; newEd[idx].startDate = date; setEducation(newEd); }} dateFormat="MMM yyyy" showMonthYearPicker placeholderText="Start Date" className="rounded-lg p-3 w-full" style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }} />
                    <DatePicker selected={edu.endDate ? new Date(edu.endDate) : null} onChange={(date) => { const newEd = [...education]; newEd[idx].endDate = date; setEducation(newEd); }} dateFormat="MMM yyyy" showMonthYearPicker placeholderText="End Date" className="rounded-lg p-3 w-full" style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }} />
                  </div>
                </div>
              ))}
              <Button onClick={() => setEducation([...education, { level: "", institution: "", degree: "", cgpa: "", startDate: null, endDate: null, city: "", description: "" }])}
                style={{ background: `linear-gradient(135deg,${T.gold},${T.accent})`, color: T.obsidian }}>
                <FaPlus className="mr-2" /> Add Education
              </Button>
            </>
          )}

          {activeSection === "Technical Skills" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(technicalSkills).map((key) => (
                <div key={key} className="p-4 rounded-xl" style={{ background: 'rgba(212,168,83,0.05)', border: '1px solid rgba(212,168,83,0.15)' }}>
                  <label className="font-bold mb-3 block" style={{ color: '#D4A853' }}>{key}</label>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {technicalSkills[key].map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full text-sm flex items-center gap-2" style={{ background: T.gold, color: T.obsidian }}>
                        {skill}
                        <button onClick={() => handleSkillRemove(key, idx)} className="hover:text-red-300">
                          <FaTimes size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Add skill" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} className="flex-1" style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }} />
                    <Button onClick={() => handleSkillAdd(key)} style={{ background: T.gold, color: T.obsidian }}>Add</Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === "Experience" && (
            <>
              {experience.map((exp, idx) => (
                <div key={idx} className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(212,168,83,0.05)', border: '1px solid rgba(212,168,83,0.15)' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Company" value={exp.company} onChange={(e) => { const newExp = [...experience]; newExp[idx].company = e.target.value; setExperience(newExp); }} style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }} />
                    <Input placeholder="Role" value={exp.role} onChange={(e) => { const newExp = [...experience]; newExp[idx].role = e.target.value; setExperience(newExp); }} style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }} />
                    <DatePicker selected={exp.startDate ? new Date(exp.startDate) : null} onChange={(date) => { const newExp = [...experience]; newExp[idx].startDate = date; setExperience(newExp); }} dateFormat="MMM yyyy" showMonthYearPicker placeholderText="Start Date" className="rounded-lg p-3 w-full" style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }} />
                    <DatePicker selected={exp.endDate ? new Date(exp.endDate) : null} onChange={(date) => { const newExp = [...experience]; newExp[idx].endDate = date; setExperience(newExp); }} dateFormat="MMM yyyy" showMonthYearPicker placeholderText="End Date" className="rounded-lg p-3 w-full" style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }} />
                    <Textarea placeholder="Description" value={exp.description || ""} onChange={(e) => { const newExp = [...experience]; newExp[idx].description = e.target.value; setExperience(newExp); }} className="col-span-1 md:col-span-2" style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }} />
                  </div>
                </div>
              ))}
              <Button onClick={() => setExperience([...experience, { company: "", role: "", startDate: null, endDate: null, description: "" }])} style={{ background: `linear-gradient(135deg,${T.gold},${T.accent})`, color: T.obsidian }}>
                <FaPlus className="mr-2" /> Add Experience
              </Button>
            </>
          )}

          {activeSection === "Projects" && (
            <>
              {projects.map((proj, idx) => (
                <div key={idx} className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(212,168,83,0.05)', border: '1px solid rgba(212,168,83,0.15)' }}>
                  <div className="grid grid-cols-1 gap-4">
                    <Input placeholder="Project Name" value={proj.name || ""} onChange={(e) => { const newProj = [...projects]; newProj[idx].name = e.target.value; setProjects(newProj); }} style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }} />
                    <Textarea placeholder="Description" value={proj.description || ""} onChange={(e) => { const newProj = [...projects]; newProj[idx].description = e.target.value; setProjects(newProj); }} style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }} />
                  </div>
                </div>
              ))}
              <Button onClick={() => setProjects([...projects, { name: "", description: "" }])} style={{ background: `linear-gradient(135deg,${T.gold},${T.accent})`, color: T.obsidian }}>
                <FaPlus className="mr-2" /> Add Project
              </Button>
            </>
          )}

          {activeSection === "Achievements" && (
            <>
              {achievements.map((ach, idx) => (
                <div key={idx} className="flex items-center gap-3 mb-3">
                  <Input placeholder={`Achievement ${idx + 1}`} value={ach} onChange={(e) => { const newAch = [...achievements]; newAch[idx] = e.target.value; setAchievements(newAch); }} className="flex-1" style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }} />
                  <button onClick={() => setAchievements(achievements.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600">
                    <FaTimes size={20} />
                  </button>
                </div>
              ))}
              <Button onClick={() => setAchievements([...achievements, ""])} style={{ background: `linear-gradient(135deg,${T.gold},${T.accent})`, color: T.obsidian }}>
                <FaPlus className="mr-2" /> Add Achievement
              </Button>
            </>
          )}

          {activeSection === "Certifications" && (
            <>
              {certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-3 mb-3">
                  <Input placeholder={`Certification ${idx + 1}`} value={cert} onChange={(e) => { const newCert = [...certifications]; newCert[idx] = e.target.value; setCertifications(newCert); }} className="flex-1" style={{ background: T.surfaceLight, border: '1px solid rgba(212,168,83,0.2)', color: '#F5F0E6' }} />
                  <button onClick={() => setCertifications(certifications.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600">
                    <FaTimes size={20} />
                  </button>
                </div>
              ))}
              <Button onClick={() => setCertifications([...certifications, ""])} style={{ background: `linear-gradient(135deg,${T.gold},${T.accent})`, color: T.obsidian }}>
                <FaPlus className="mr-2" /> Add Certification
              </Button>
            </>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: 'rgba(212,168,83,0.2)' }}>
            <Button
              onClick={() => currentIndex > 0 && setActiveSection(sections[currentIndex - 1].name)}
              disabled={currentIndex === 0}
              style={{ background: 'rgba(212,168,83,0.1)', color: '#F5F0E6' }}
            >
              Previous
            </Button>
            <Button
              onClick={() => currentIndex < sections.length - 1 && setActiveSection(sections[currentIndex + 1].name)}
              disabled={currentIndex === sections.length - 1}
              style={{ background: `linear-gradient(135deg,${T.gold},${T.accent})`, color: T.obsidian }}
            >
              Next
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
