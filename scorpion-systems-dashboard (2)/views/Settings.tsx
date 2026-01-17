import React, { useState } from 'react';
import { User } from '../types';
import { UserCog, Lock, Save, ShieldCheck, CreditCard } from 'lucide-react';

interface SettingsProps {
  user: User;
  onUpdateUser: (updatedUser: Partial<User>) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ fullName });
    setMessage({ type: 'success', text: 'Profile updated successfully.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
        return;
    }
    // In a real app, send to API
    onUpdateUser({ password: newPassword });
    setMessage({ type: 'success', text: 'Password changed successfully.' });
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
       
       {message && (
         <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
           {message.text}
         </div>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Section */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <UserCog size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white">Profile Information</h3>
            </div>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">Username</label>
                <input 
                  type="text" 
                  value={user.username} 
                  disabled 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-500 cursor-not-allowed"
                />
                <p className="text-[10px] text-zinc-600 mt-1">Username cannot be changed.</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Security Section */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white">Security</h3>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
               <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700">
                  <ShieldCheck size={16} /> Update Password
                </button>
              </div>
            </form>
          </div>
       </div>

       {/* Metadata Footer */}
       <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-6 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">
         <div className="flex items-center gap-2 mb-2 md:mb-0">
           <CreditCard size={16} />
           <span>Account ID: <span className="font-mono text-zinc-400">{user.accountId}</span></span>
         </div>
         <div>
           Member Since: <span className="text-zinc-400">{new Date(user.memberSince).toLocaleDateString()}</span>
         </div>
       </div>
    </div>
  );
};

export default Settings;
