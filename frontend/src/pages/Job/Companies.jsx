import { motion } from 'framer-motion';
import { Building2, MapPin, ArrowRight, Users } from 'lucide-react';

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

const companies = [
  { 
    name: "Google", 
    tagline: "Build the future with us",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    cover: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&h=200&fit=crop",
    jobs: 45, 
    location: "Bangalore, Karnataka", 
    color: "#4285F4",
    employees: "10,000+"
  },
  { 
    name: "Microsoft", 
    tagline: "Empowering every person",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    cover: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=200&fit=crop",
    jobs: 38, 
    location: "Hyderabad, Telangana", 
    color: "#00A4EF",
    employees: "20,000+"
  },
  { 
    name: "Amazon", 
    tagline: "Work hard, have fun",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    cover: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&h=200&fit=crop",
    jobs: 52, 
    location: "Mumbai, Maharashtra", 
    color: "#FF9900",
    employees: "15,000+"
  },
  { 
    name: "Apple", 
    tagline: "Think Different",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    cover: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=200&fit=crop",
    jobs: 28, 
    location: "Pune, Maharashtra", 
    color: "#A2AAAD",
    employees: "5,000+"
  },
  { 
    name: "Meta", 
    tagline: "Connect with the world",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    cover: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop",
    jobs: 32, 
    location: "Delhi NCR", 
    color: "#0081FB",
    employees: "8,000+"
  },
  { 
    name: "Netflix", 
    tagline: "See what's next",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    cover: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=200&fit=crop",
    jobs: 18, 
    location: "Chennai, Tamil Nadu", 
    color: "#E50914",
    employees: "2,500+"
  },
  { 
    name: "Adobe", 
    tagline: "Change the world through digital",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg",
    cover: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=200&fit=crop",
    jobs: 25, 
    location: "Bangalore, Karnataka", 
    color: "#FF0000",
    employees: "3,000+"
  },
  { 
    name: "Salesforce", 
    tagline: "Together is better",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce_logo.svg",
    cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    jobs: 22, 
    location: "Pune, Maharashtra", 
    color: "#00A1E0",
    employees: "4,000+"
  },
];

import React, { useState } from 'react';

function CompanyCard({ company, index }) {
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative rounded-2xl overflow-hidden group"
      style={{ 
        background: C.surface, 
        border: `1px solid ${C.goldBorder}`,
        boxShadow: `0 4px 20px rgba(0,0,0,0.3)`
      }}
    >
      <div className="relative h-28 overflow-hidden">
        {!imageError ? (
          <img 
            src={company.cover} 
            alt={`${company.name} office`}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div 
            className="w-full h-full"
            style={{ background: `linear-gradient(135deg, ${company.color}40, ${C.surface})` }}
          />
        )}
        
        <div 
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${C.surface}, transparent)` }}
        />
        
        <div className="absolute top-3 right-3">
          <span 
            className="px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md"
            style={{ 
              background: `${company.color}90`,
              color: '#fff',
              boxShadow: `0 2px 10px ${company.color}50`
            }}
          >
            {company.jobs} Open Jobs
          </span>
        </div>
      </div>

      <div className="p-5 -mt-12 relative z-10">
        <div className="flex items-end gap-3 mb-4">
          <div 
            className="w-16 h-16 rounded-xl bg-white p-2 flex items-center justify-center shadow-lg"
            style={{ border: `2px solid ${company.color}` }}
          >
            {!logoError ? (
              <img 
                src={company.logo} 
                alt={company.name}
                onError={() => setLogoError(true)}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-2xl font-black" style={{ color: company.color }}>
                {company.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xl mb-1" style={{ color: C.ivory }}>{company.name}</h3>
            <p className="text-xs" style={{ color: C.ivoryMuted }}>{company.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: C.ivoryMuted }}>
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {company.location}
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {company.employees}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 group/btn"
          style={{ 
            background: `linear-gradient(135deg, ${company.color}, ${company.color}dd)`,
            color: '#fff',
            boxShadow: `0 4px 15px ${company.color}40`
          }}
        >
          View Open Positions
          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      <div 
        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{ background: `linear-gradient(90deg, ${company.color}, ${C.gold})` }}
      />
    </motion.div>
  );
}

export default function Companies() {
  return (
    <section className="py-20 px-4 relative overflow-hidden" style={{ background: C.obsidian }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,168,83,0.02) 1px, transparent 0)",
        backgroundSize: "50px 50px"
      }} />

      <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: C.gold }} />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: C.accent }} />

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
            <Building2 size={14} color={C.gold} />
            <span className="text-xs font-medium" style={{ color: C.gold, fontFamily: "'DM Mono', monospace" }}>
              TOP COMPANIES
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: C.ivory }}>
            Hiring <span style={{ color: C.gold }}>Now</span>
          </h2>

          <p className="text-base md:text-lg" style={{ color: C.ivoryMuted, fontFamily: "'DM Sans', sans-serif" }}>
            Explore opportunities from world-class companies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((company, idx) => (
            <CompanyCard key={idx} company={company} index={idx} />
          ))}
        </div>


      </div>
    </section>
  );
}
