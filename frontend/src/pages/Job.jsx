import HeroSection from './Job/HeroSection';
import About from './Job/About';
import StatsSection from './Job/StatsSection';
import Companies from './Job/Companies';
import CategoryCarousel from './Job/CategoryCarousel';
import LatestJobs from './Job/LatestJobs';
import Feedback from './Job/Feedback';

const Job = () => {
    return (
        <div>
            <HeroSection />
            <About />
            <StatsSection />
            <Companies />
            <CategoryCarousel />
            <LatestJobs />
            <Feedback />
        </div>
    );
}

export default Job;
