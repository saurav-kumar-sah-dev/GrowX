// MainLayout.jsx
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import AIChatAssistant from '../components/shared/AIChatAssistant';
import { Outlet } from 'react-router-dom';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
};

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.obsidian }}>
      <Navbar />
      <main className="flex-1 mt-0">
        <Outlet />
      </main>
      <AIChatAssistant />
      <Footer /> 
    </div>
  );
};

export default MainLayout;
