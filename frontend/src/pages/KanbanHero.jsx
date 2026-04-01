
import About from "./KanbanBoard/About";
import FAQs from "./KanbanBoard/FAQ";
import Features from "./KanbanBoard/FeaturesSection";
import FeedbackSection from "./KanbanBoard/FeedbackSection";
import HeroSection from "./KanbanBoard/HeroSection";
import StatsSection from "./KanbanBoard/StatsSection";
import WatchDemo from "./KanbanBoard/WatchDemo";

export default function Home() {
  return (
    <>
      <HeroSection />
      <About />
      <StatsSection />
      <Features/>
      <WatchDemo />
      <FeedbackSection />
      <FAQs />
    </>
  );
}
