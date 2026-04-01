import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { 
  Code, Globe, Smartphone, Shield, Palette, Cloud, Database, Brain, Coffee, 
  Cpu, Blocks, Gamepad2, Wrench, Layers, Zap, Sparkles, ArrowRight, CheckCircle,
  Tags, Loader2
} from 'lucide-react';
import { API } from '@/config/api';

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
  green: "#10b981",
};

const DEFAULT_CATEGORIES = [
  { name: "Software Development", icon: "Code", color: "#D4A853", topics: ["Life Cycle", "CLI Apps", "GUI Apps", "Web Scraping", "Version Control", "Testing"], projects: ["Build a CLI Calculator", "Simple GUI Todo App"] },
  { name: "Web Development", icon: "Globe", color: "#3b82f6", topics: ["HTML5 & CSS3", "JavaScript", "Responsive Website", "Web Applications", "Accessibility", "SEO"], projects: ["Personal Portfolio", "Landing Page Clone"] },
  { name: "Android Development", icon: "Smartphone", color: "#10b981", topics: ["Kotlin/Java", "UI Components", "Intents", "Firebase", "Publishing", "Material Design"], projects: ["BMI Calculator App", "Notes App with Firebase"] },
  { name: "Cybersecurity", icon: "Shield", color: "#ef4444", topics: ["Network Security", "Ethical Hacking", "Cryptography", "Penetration Testing", "Incident Response", "Security Policies"], projects: ["Vulnerability Scan Report", "Basic Malware Analysis"] },
  { name: "UI/UX Design", icon: "Palette", color: "#8b5cf6", topics: ["Design Principles", "Wireframing", "Prototyping", "User Research", "Design Tools", "Usability Testing"], projects: ["Redesign a Website", "Create a Mobile App Prototype"] },
  { name: "Cloud Computing", icon: "Cloud", color: "#06b6d4", topics: ["AWS Basics", "Virtual Machines", "Containers & Kubernetes", "Serverless Architecture", "Cloud Security", "Monitoring & Logging"], projects: ["Deploy Web App on AWS", "Create Docker Container"] },
  { name: "Data Science", icon: "Database", color: "#f59e0b", topics: ["Python Basics", "Data Cleaning", "Visualization", "ML", "Deployment", "Statistics"], projects: ["Titanic Survival Prediction", "Sales Forecasting Model"] },
  { name: "Machine Learning", icon: "Brain", color: "#ec4899", topics: ["ML Algorithms", "Preprocessing", "Training", "Evaluation", "Deployment", "Model Optimization"], projects: ["Image Classification", "Sentiment Analysis App"] },
  { name: "Java Full Stack Developer", icon: "Coffee", color: "#f97316", topics: ["Core Java", "Spring Boot", "Hibernate", "REST APIs", "MySQL", "Angular Basics"], projects: ["Library Management System", "Employee Portal"] },
  { name: "Python Full Stack Developer", icon: "Cpu", color: "#84cc16", topics: ["Python", "Flask/Django", "PostgreSQL", "REST APIs", "HTML/CSS/JS", "Testing"], projects: ["Online Learning Platform", "Blogging Platform"] },
  { name: "JS Full Stack Developer", icon: "Layers", color: "#eab308", topics: ["JavaScript", "Node.js", "Express", "MongoDB", "ES6+", "API Integration"], projects: ["Weather App with API", "Real-time Chat App"] },
  { name: "DevOps", icon: "Wrench", color: "#14b8a6", topics: ["CI/CD", "Jenkins", "Docker", "Kubernetes", "Monitoring", "AWS/GCP"], projects: ["CI/CD Pipeline", "K8s Cluster Setup"] },
  { name: "AI/ML with Python", icon: "Zap", color: "#a855f7", topics: ["Numpy", "Pandas", "Scikit-learn", "Neural Networks", "TensorFlow", "Data Visualization"], projects: ["Handwritten Digit Classifier", "Chatbot using RNN"] },
  { name: "Blockchain Developer", icon: "Blocks", color: "#6366f1", topics: ["Ethereum", "Smart Contracts", "Solidity", "DApp", "Web3.js", "Cryptoeconomics"], projects: ["Voting DApp", "NFT Minting Platform"] },
  { name: "Game Development", icon: "Gamepad2", color: "#22c55e", topics: ["Unity", "C#", "2D/3D Game Physics", "Game Mechanics", "UI/UX for Games", "Multiplayer Networking"], projects: ["2D Platformer Game", "Multiplayer Shooting Game"] },
];

const getIconComponent = (iconName) => {
  const iconMap = { Code, Globe, Smartphone, Shield, Palette, Cloud, Database, Brain, Coffee, Cpu, Layers, Wrench, Zap, Sparkles, Tags, Blocks, Gamepad2 };
  return iconMap[iconName] || Code;
};

export default function Category() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API.category}/all?activeOnly=true`);
      if (res.data.categories && res.data.categories.length > 0) {
        setCategories(res.data.categories);
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }
    } catch (error) {
      console.log('Using default categories');
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(135deg,${C.obsidian} 0%,${C.charcoal} 50%,${C.obsidian} 100%)` }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: C.gold }} />
          <p style={{ color: C.ivoryMuted }}>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg,${C.obsidian} 0%,${C.charcoal} 50%,${C.obsidian} 100%)` }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.03) 1px, transparent 0)",
        backgroundSize: "50px 50px"
      }} />

      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: C.goldDim, border: `1px solid ${C.goldBorder}` }}
          >
            <Sparkles size={14} color={C.gold} />
            <span className="text-xs font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
              INTERNSHIP PROGRAMS
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>
            Internship <span style={{ color: C.gold }}>Categories</span>
          </h1>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: C.ivoryMuted }}>
            Choose from {categories.length}+ specialized internship programs designed to accelerate your career
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => {
            const Icon = getIconComponent(category.icon);
            const topics = category.topics || [];
            const projects = category.projects || [];
            const color = category.color || C.gold;

            return (
              <motion.div
                key={category._id || idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative rounded-2xl p-6 overflow-hidden group"
                style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at center, ${color}08 0%, transparent 70%)` }}
                />

                <div className="relative z-10">
                  <motion.div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5"
                    style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon size={28} color={color} />
                  </motion.div>

                  <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>
                    {category.name}
                  </h2>

                  {category.description && (
                    <p className="text-sm mb-4" style={{ color: C.ivoryMuted }}>{category.description}</p>
                  )}

                  <div className="mb-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: C.ivoryMuted }}>
                      Topics Covered
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {topics.slice(0, 6).map((topic, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1 text-xs rounded-full font-medium"
                          style={{ background: `${color}15`, color: color, border: `1px solid ${color}30` }}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {projects.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: C.ivoryMuted }}>
                        Projects
                      </h3>
                      <ul className="space-y-2">
                        {projects.slice(0, 2).map((proj, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle size={16} color={color} className="flex-shrink-0 mt-0.5" />
                            <span className="text-sm" style={{ color: C.ivoryMuted }}>{proj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <motion.button
                    onClick={() => navigate(`/internships/apply?category=${encodeURIComponent(category.name)}`)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold"
                    style={{ background: `linear-gradient(135deg,${color},${color}cc)`, color: '#fff' }}
                  >
                    Apply Now <ArrowRight size={16} />
                  </motion.button>
                </div>

                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ background: color }} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
