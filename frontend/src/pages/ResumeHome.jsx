import HeroSection from "./Resume/HeroSection";
import About from "./Resume/About";
import StatsSection from "./Resume/StatsSection";
import FeedbackSection from "./Resume/FeedbackSection";
import FAQSection from "./Resume/FAQSection";

const ResumeHome = () => {
    return (
        <div>
            <HeroSection/>
            <About/>
            <StatsSection/>
            <FeedbackSection/>
            <FAQSection/>
        </div>
    );
}

export default ResumeHome;
