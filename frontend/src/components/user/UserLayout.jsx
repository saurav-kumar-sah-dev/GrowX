import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, Bell } from 'lucide-react';
import UserSidebar from './UserSidebar';
import AIChatAssistant from '../shared/AIChatAssistant';

export default function UserLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector(s => s.auth);

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      <UserSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-16 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white">
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <Bell size={18} className="text-gray-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{user?.fullname}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{user?.role}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black">
                {user?.fullname?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <Outlet />
        </main>
      </div>

      <AIChatAssistant />
    </div>
  );
}