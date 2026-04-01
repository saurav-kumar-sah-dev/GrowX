import React from 'react';
import AboutPage from './Quiz/About';
import Features from './Quiz/Features';
import FeedbackSection from './Quiz/Feedback';
import WhyChooseUs from './Quiz/WhyChooseUs';
import HeroSection from './Quiz/HeroSection';
import StatsSection from './Quiz/StatsSection';
import FAQSection from './Quiz/FAQSection';

const QuizHome = () => {
    return (
        <div>
            <HeroSection />
            <AboutPage />
            <StatsSection />
            <Features />
            <WhyChooseUs />
            <FeedbackSection />
            <FAQSection />


        </div>
    );
}

export default QuizHome;
