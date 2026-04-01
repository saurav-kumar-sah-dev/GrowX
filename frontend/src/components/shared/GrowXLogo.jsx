import React from "react";

const C = {
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDark: "#B8923F",
  obsidian: "#0A0A0F",
};

const GrowXLogo = ({ size = 40 }) => {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8923F" />
            <stop offset="50%" stopColor="#D4A853" />
            <stop offset="100%" stopColor="#E8C17A" />
          </linearGradient>
          <linearGradient id="arrowGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4A853" />
            <stop offset="100%" stopColor="#F5F0E6" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        <circle cx="50" cy="50" r="46" fill="#0A0A0F" stroke="url(#logoGradient)" strokeWidth="2" />
        
        <circle cx="50" cy="50" r="38" fill="none" stroke="url(#logoGradient)" strokeWidth="1" opacity="0.3" />
        
        <path
          d="M20 75 L35 55 L50 65 L65 35 L80 20"
          fill="none"
          stroke="url(#arrowGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />
        
        <circle cx="20" cy="75" r="4" fill="#D4A853" />
        <circle cx="35" cy="55" r="4" fill="#D4A853" opacity="0.8" />
        <circle cx="50" cy="65" r="4" fill="#D4A853" opacity="0.7" />
        <circle cx="65" cy="35" r="4" fill="#E8C17A" opacity="0.9" />
        
        <polygon
          points="80,20 95,8 88,28"
          fill="url(#logoGradient)"
          filter="url(#glow)"
        />
        
        <circle cx="80" cy="20" r="3" fill="#F5F0E6" />
      </svg>

      <span
        className="text-2xl font-bold tracking-tight"
        style={{
          background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldLight} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 800,
          letterSpacing: "-0.02em",
        }}
      >
        GrowX
      </span>
    </div>
  );
};

export default GrowXLogo;
