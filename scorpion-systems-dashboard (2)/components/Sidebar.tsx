import React from 'react';
import { LayoutDashboard, MessageSquare, Bot, FolderKanban, Settings, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout }) => {
  const menuItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
    { id: 'ai-assistant', label: 'AI Assistant', icon: <Bot size={20} /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full fixed left-0 top-0 hidden md:flex z-10">
      <div className="p-6 flex items-center gap-3 border-b border-zinc-800">
        <div className="bg-indigo-600/20 p-2 rounded-xl border border-indigo-500/30">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-500">
            <path d="M18 12C18 12 20 10 20 8C20 5.79086 18.2091 4 16 4C13.7909 4 12 5.79086 12 8V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 12C6 12 4 10 4 8C4 5.79086 5.79086 4 8 4C10.2091 4 12 5.79086 12 8V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 11V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16C9 16 7 17 7 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16C15 16 17 17 17 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16L12 21L14 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="11" r="2" fill="currentColor" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-none tracking-wider font-mono">SCORPION</h1>
          <p className="text-[10px] text-indigo-400 font-medium tracking-[0.2em] mt-1">OS V1.0</p>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              currentView === item.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 translate-x-1'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;