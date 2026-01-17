import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { ArrowRight, Loader } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  
  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Hide intro after animation finishes (3.5s total)
    const timer = setTimeout(() => setShowIntro(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock API call
    setTimeout(() => {
      // Create user object
      const newUser: User = {
        username,
        fullName: isLogin ? 'User Name' : fullName, // Mock name on login if not real
        role: 'Employee',
        status: 'Active',
        memberSince: isLogin ? '2023-01-01T12:00:00Z' : new Date().toISOString(),
        accountId: isLogin ? '7bb26027-0d15-4ce7-91be-bb9602e6f715' : crypto.randomUUID(),
        password // Storing for mock update capability
      };
      
      onLogin(newUser);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative font-sans">
      {/* Intro Animation Layer */}
      <div className={`fixed inset-0 bg-black z-50 flex items-center justify-center flex-col pointer-events-none ${showIntro ? 'scorpion-intro' : 'opacity-0'}`}>
        <div className="relative animate-pulse">
            <div className="w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white relative z-10 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
               <path d="M18 12C18 12 20 10 20 8C20 5.79086 18.2091 4 16 4C13.7909 4 12 5.79086 12 8V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M6 12C6 12 4 10 4 8C4 5.79086 5.79086 4 8 4C10.2091 4 12 5.79086 12 8V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M12 11V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M12 16C9 16 7 17 7 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M12 16C15 16 17 17 17 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M12 16L12 21L14 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               <circle cx="12" cy="11" r="2" fill="currentColor" />
            </svg>
        </div>
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-500 mt-8 tracking-[0.2em] font-mono scale-y-110">SCORPION</h1>
        <div className="flex items-center gap-4 mt-4">
           <div className="h-[1px] w-12 bg-indigo-500/50"></div>
           <p className="text-indigo-400 text-sm tracking-[0.5em] uppercase">System Initialization</p>
           <div className="h-[1px] w-12 bg-indigo-500/50"></div>
        </div>
      </div>

      {/* Main Auth Card */}
      <div className={`w-full max-w-md p-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl relative z-10 ${!showIntro ? 'slide-up' : 'opacity-0'}`}>
        <div className="text-center mb-8">
           <div className="inline-flex justify-center items-center w-16 h-16 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 mb-6 shadow-lg shadow-indigo-900/10">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-500">
                <path d="M18 12C18 12 20 10 20 8C20 5.79086 18.2091 4 16 4C13.7909 4 12 5.79086 12 8V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 12C6 12 4 10 4 8C4 5.79086 5.79086 4 8 4C10.2091 4 12 5.79086 12 8V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16L12 21L14 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="11" r="2" fill="currentColor" />
              </svg>
           </div>
           <h2 className="text-3xl font-bold text-white tracking-tight">{isLogin ? 'Welcome Back' : 'Join the Network'}</h2>
           <p className="text-zinc-500 text-sm mt-3">
             {isLogin ? 'Enter your credentials to access the mainframe.' : 'Sign up to access Scorpion Systems.'}
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">Email ID</label>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">Username</label>
            <input 
              required
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-zinc-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group mt-6"
          >
            {loading ? <Loader className="animate-spin" size={20}/> : (
              <>
                {isLogin ? 'Initialize Session' : 'Create Account'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-zinc-500">{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="ml-2 text-indigo-400 hover:text-indigo-300 font-bold tracking-wide"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;