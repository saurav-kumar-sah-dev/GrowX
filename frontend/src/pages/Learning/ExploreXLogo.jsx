import React from "react";

const ExploreXLogo = () => {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      {/* Outer circle */}
      <circle cx="60" cy="60" r="58" stroke="#00BFFF" strokeWidth="4" fill="none" />

      {/* Text on top */}
      <text
        x="50%"
        y="30%"
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
        fill="#00BFFF"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        EXPLORE-X
      </text>

      {/* Central globe / swirl */}
      <circle cx="60" cy="70" r="25" fill="#00BFFF" />
      <path
        d="M45,70 A15,15 0 1,1 75,70 A15,15 0 1,1 45,70"
        fill="white"
        opacity="0.6"
      />

      {/* Bottom text / registration */}
      <text
        x="50%"
        y="95%"
        textAnchor="middle"
        fontSize="7"
        fill="#00BFFF"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        UDYAM-HR-11-000000
      </text>
    </svg>
  );
};

export default ExploreXLogo;
