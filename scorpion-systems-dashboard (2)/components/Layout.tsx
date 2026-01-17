import React from 'react';
import Sidebar from './Sidebar';
import { ViewState } from '../types';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-black text-zinc-200 flex">
      <Sidebar currentView={currentView} setView={setView} onLogout={onLogout} />
      
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-900 border-b border-zinc-800 z-20 flex items-center px-4 justify-between">
         <span className="font-bold text-white">Scorpion Systems</span>
         <button 
           onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
           className="text-white p-2"
           aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
           aria-expanded={mobileMenuOpen}
         >
           {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/90 z-30 md:hidden pt-20 px-6 animate-fade-in" role="dialog" aria-modal="true">
          <div className="flex flex-col space-y-2">
            <button onClick={() => { setView('dashboard'); setMobileMenuOpen(false); }} className="w-full text-left py-4 text-xl font-medium text-white border-b border-zinc-800">Dashboard</button>
            <button onClick={() => { setView('messages'); setMobileMenuOpen(false); }} className="w-full text-left py-4 text-xl font-medium text-white border-b border-zinc-800">Messages</button>
            <button onClick={() => { setView('ai-assistant'); setMobileMenuOpen(false); }} className="w-full text-left py-4 text-xl font-medium text-white border-b border-zinc-800">AI Assistant</button>
            <button onClick={() => { setView('projects'); setMobileMenuOpen(false); }} className="w-full text-left py-4 text-xl font-medium text-white border-b border-zinc-800">Projects</button>
            <button onClick={() => { setView('settings'); setMobileMenuOpen(false); }} className="w-full text-left py-4 text-xl font-medium text-white border-b border-zinc-800">Settings</button>
            <button onClick={onLogout} className="w-full text-left py-4 text-xl font-medium text-red-400 mt-4">Sign Out</button>
          </div>
        </div>
      )}

      <main className="flex-1 md:ml-64 p-6 pt-20 md:pt-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;