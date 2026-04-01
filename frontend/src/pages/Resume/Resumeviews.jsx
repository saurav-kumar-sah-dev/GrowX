import React from "react";
import { Mail, Phone, Linkedin, Github, Globe, Award, Briefcase, GraduationCap, Code, FolderGit2, Trophy } from "lucide-react";

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
};

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${T.gold}, ${T.accent})` }}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h3 className="text-xl font-bold tracking-tight" style={{ color: T.obsidian }}>
      {title}
    </h3>
  </div>
);

const SkillBadge = ({ children, color = T.gold }) => (
  <span 
    className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium mr-2 mb-2"
    style={{ background: `${color}15`, color: color, border: `1px solid ${color}30` }}
  >
    {children}
  </span>
);

export default function Resumeviews({ resume }) {
  if (!resume) return null;

  const {
    personalInfo = {},
    education = [],
    technicalSkills = {},
    experience = [],
    projects = [],
    achievements = [],
    certifications = [],
  } = resume;

  return (
    <div
      id="resume-view"
      className="max-w-5xl mx-auto overflow-hidden"
      style={{ background: '#ffffff', boxShadow: '0 25px 80px rgba(0,0,0,0.4)', borderRadius: '16px' }}
    >
      {/* Header Section */}
      <div 
        className="relative px-8 py-10"
        style={{ background: `linear-gradient(135deg, ${T.gold} 0%, ${T.accent} 50%, ${T.goldDark} 100%)` }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: T.obsidian, transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: T.obsidian, transform: 'translate(-30%, 30%)' }} />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div 
            className="w-28 h-28 rounded-2xl flex items-center justify-center shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${T.obsidian}, ${T.charcoal})` }}
          >
            <span className="text-5xl font-black" style={{ color: T.gold }}>
              {personalInfo.fullName?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-black tracking-tight mb-2" style={{ color: T.obsidian }}>
              {personalInfo.fullName || "Your Name"}
            </h1>
            <p className="text-xl font-semibold mb-4" style={{ color: `${T.obsidian}cc` }}>
              {personalInfo.title || "Full Stack Developer"}
            </p>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-3">
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105" style={{ background: 'rgba(10,10,15,0.15)', color: T.obsidian }}>
                  <Mail size={16} />
                  <span className="truncate max-w-[200px]">{personalInfo.email}</span>
                </a>
              )}
              {personalInfo.phone && (
                <a href={`tel:${personalInfo.phone}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105" style={{ background: 'rgba(10,10,15,0.15)', color: T.obsidian }}>
                  <Phone size={16} />
                  {personalInfo.phone}
                </a>
              )}
              {personalInfo.address && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'rgba(10,10,15,0.15)', color: T.obsidian }}>
                  <Globe size={16} />
                  {personalInfo.address}
                </span>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-2 mt-4">
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110" style={{ background: 'rgba(10,10,15,0.15)', color: T.obsidian }}>
                  <Linkedin size={18} />
                </a>
              )}
              {personalInfo.github && (
                <a href={personalInfo.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110" style={{ background: 'rgba(10,10,15,0.15)', color: T.obsidian }}>
                  <Github size={18} />
                </a>
              )}
              {personalInfo.portfolio && (
                <a href={personalInfo.portfolio} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110" style={{ background: 'rgba(10,10,15,0.15)', color: T.obsidian }}>
                  <Globe size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body Section */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Skills & Education */}
          <div className="space-y-8">
            
            {/* Skills Section */}
            {Object.keys(technicalSkills).length > 0 && (
              <div>
                <SectionHeader icon={Code} title="Technical Skills" />
                {Object.entries(technicalSkills).map(([key, val]) => (
                  val.length > 0 && (
                    <div key={key} className="mb-4">
                      <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: T.obsidian }}>
                        {key}
                      </p>
                      <div className="flex flex-wrap">
                        {val.map((skill, i) => (
                          <SkillBadge key={i}>{skill}</SkillBadge>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Education Section */}
            {education.length > 0 && (
              <div>
                <SectionHeader icon={GraduationCap} title="Education" />
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <div 
                      key={i} 
                      className="p-4 rounded-xl border-2 transition-all hover:scale-[1.02]"
                      style={{ background: `${T.gold}08`, borderColor: `${T.gold}20` }}
                    >
                      <h4 className="font-bold text-base mb-1" style={{ color: T.obsidian }}>
                        {edu.degree || "Degree"}
                      </h4>
                      <p className="text-sm font-semibold mb-1" style={{ color: T.gold }}>
                        {edu.institution || "Institution"}
                      </p>
                      <div className="flex items-center justify-between text-xs" style={{ color: `${T.obsidian}99` }}>
                        {edu.cgpa && <span>CGPA: {edu.cgpa}</span>}
                        {edu.startDate && (
                          <span>{new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications Section */}
            {certifications.length > 0 && (
              <div>
                <SectionHeader icon={Award} title="Certifications" />
                <div className="space-y-3">
                  {certifications.map((cert, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: `${T.gold}08` }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${T.gold}20` }}>
                        <Award size={14} style={{ color: T.gold }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: T.obsidian }}>{cert.name}</p>
                        {cert.provider && <p className="text-xs" style={{ color: `${T.obsidian}88` }}>{cert.provider}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Section */}
            {achievements.length > 0 && (
              <div>
                <SectionHeader icon={Trophy} title="Achievements" />
                <ul className="space-y-2">
                  {achievements.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: T.obsidian }}>
                      <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: T.gold }} />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Experience & Projects */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Experience Section */}
            {experience.length > 0 && (
              <div>
                <SectionHeader icon={Briefcase} title="Work Experience" />
                <div className="space-y-6">
                  {experience.map((exp, i) => (
                    <div key={i} className="relative pl-8 pb-6 border-l-2" style={{ borderColor: `${T.gold}30` }}>
                      {/* Timeline dot */}
                      <div 
                        className="absolute w-4 h-4 rounded-full -left-[9px] top-0"
                        style={{ background: T.gold, boxShadow: `0 0 0 4px ${T.gold}20` }}
                      />
                      
                      <div className="p-5 rounded-xl border-2" style={{ background: '#FAFAFA', borderColor: `${T.gold}15` }}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-bold" style={{ color: T.obsidian }}>{exp.role}</h4>
                            <p className="font-semibold" style={{ color: T.gold }}>{exp.company}</p>
                          </div>
                          <div className="text-sm mt-2 sm:mt-0 px-3 py-1 rounded-full" style={{ background: `${T.gold}15`, color: T.gold }}>
                            {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} - {exp.currentlyWorking ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                          </div>
                        </div>
                        
                        {exp.location && (
                          <p className="text-sm mb-3" style={{ color: `${T.obsidian}88` }}>{exp.location}</p>
                        )}
                        
                        {exp.descriptions?.length > 0 && (
                          <ul className="space-y-2">
                            {exp.descriptions.map((desc, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm" style={{ color: `${T.obsidian}bb` }}>
                                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: `${T.gold}88` }} />
                                {desc}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {projects.length > 0 && (
              <div>
                <SectionHeader icon={FolderGit2} title="Projects" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((proj, i) => (
                    <div 
                      key={i} 
                      className="p-5 rounded-xl border-2 transition-all hover:scale-[1.02]"
                      style={{ background: '#FAFAFA', borderColor: `${T.gold}15` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold" style={{ color: T.obsidian }}>{proj.title}</h4>
                        {proj.link && (
                          <a 
                            href={proj.link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs font-medium px-2 py-1 rounded-lg transition-all hover:scale-105"
                            style={{ background: `${T.gold}15`, color: T.gold }}
                          >
                            View
                          </a>
                        )}
                      </div>
                      
                      {proj.createdDate && (
                        <p className="text-xs mb-2" style={{ color: `${T.obsidian}88` }}>
                          {new Date(proj.createdDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      )}
                      
                      {proj.descriptions?.length > 0 && (
                        <ul className="space-y-1.5">
                          {proj.descriptions.map((desc, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm" style={{ color: `${T.obsidian}bb` }}>
                              <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: T.gold }} />
                              {desc}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!experience.length && !projects.length && (
              <div className="text-center py-16 rounded-xl" style={{ background: `${T.gold}08` }}>
                <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ background: `${T.gold}15` }}>
                  <Briefcase size={32} style={{ color: T.gold }} />
                </div>
                <p className="font-semibold" style={{ color: T.obsidian }}>No experience or projects added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
