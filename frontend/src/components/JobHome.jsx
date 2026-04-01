import React, { useEffect } from "react";
import { motion } from "framer-motion";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import About from "./About";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Company from "./Company";
import FeedbackSection from "./FeedbackSection";
import JobPortalStats from "./JobPortalStats";

const JobHome = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <About />

      {/* Stats Section */}
      <JobPortalStats />

      {/* Companies Section */}
      <Company />

      {/* Category Carousel */}
      <CategoryCarousel />

      {/* Latest Jobs */}
      <LatestJobs />

      {/* Feedback/Testimonials */}
      <FeedbackSection />
    </div>
  );
};

export default JobHome;
