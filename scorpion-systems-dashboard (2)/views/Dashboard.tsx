import React, { useState, useEffect, useRef } from 'react';
import { User, UserStatus, WorkSession, Project } from '../types';
import { Play, Square, Clock, Calendar, FileCode, FolderPlus, Upload, FilePlus, Code2 } from 'lucide-react';

interface DashboardProps {
  user: User;
  onUpdateStatus: (status: UserStatus) => void;
  workSessions: WorkSession[];
  currentSession: WorkSession | null;
  onStartWork: () => void;
  onStopWork: () => void;
  onNavigate: (view: any) => void;
  onCreateFile: (name: string) => void;
  onCreateFolder: (name: string) => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  onUpdateStatus, 
  workSessions, 
  currentSession, 
  onStartWork, 
  onStopWork,
  onNavigate,
  onCreateFile,
  onCreateFolder,
  onUploadFile
}) => {
  const [elapsed, setElapsed] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer logic
  useEffect(() => {
    let interval: number;
    if (currentSession) {
      interval = window.setInterval(() => {
        setElapsed(Date.now() - currentSession.startTime);
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [currentSession]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const statusColors: Record<UserStatus, string> = {
    Active: 'bg-emerald-500',
    Offline: 'bg-zinc-500',
    Busy: 'bg-red-500',
    Away: 'bg-amber-500',
  };

  const handleNewFileClick = () => {
    const name = prompt("Enter new file name (e.g., script.py):");
    if (name) {
        onCreateFile(name);
        onNavigate('projects');
    }
  };

  const handleNewFolderClick = () => {
      const name = prompt("Enter new folder name:");
      if (name) {
          onCreateFolder(name);
          onNavigate('projects');
      }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Welcome back, {user.fullName.split(' ')[0]}</h2>
          <p className="text-zinc-400 mt-1">System operational. Ready for input.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-zinc-900 p-2 rounded-xl border border-zinc-800">
          <span className="text-sm text-zinc-400 pl-2" id="status-label">Status:</span>
          <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800" role="group" aria-labelledby="status-label">
            {(Object.keys(statusColors) as UserStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => onUpdateStatus(s)}
                aria-pressed={user.status === s}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  user.status === s 
                    ? 'bg-zinc-800 text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${statusColors[s]}`} aria-hidden="true"></span>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timer Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
          <div className="relative z-10">
            <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-4">Current Session</h3>
            <div className="text-5xl font-mono font-bold text-white mb-6 tabular-nums tracking-tight">
              {formatTime(elapsed)}
            </div>
            
            {currentSession ? (
              <button 
                onClick={onStopWork}
                className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Square size={20} fill="currentColor" /> Stop Working
              </button>
            ) : (
              <button 
                onClick={onStartWork}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
              >
                <Play size={20} fill="currentColor" /> Start Working
              </button>
            )}
          </div>
        </div>

        {/* Quick Project Actions (Replced Weekly Activity) */}
        <div className="col-span-1 md:col-span-2 bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
           <div className="absolute inset-0 bg-grid-zinc-900/50 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none"></div>
           <div>
              <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-6 flex items-center gap-2">
                 <Code2 size={16}/> Workspace Quick Actions
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                  <button 
                    onClick={handleNewFileClick}
                    className="flex flex-col items-center justify-center p-6 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-indigo-500 hover:bg-zinc-800/50 transition-all group"
                  >
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <FilePlus size={24} />
                    </div>
                    <span className="font-semibold text-white">New Code File</span>
                    <span className="text-xs text-zinc-500 mt-1">Create from scratch</span>
                  </button>

                  <button 
                    onClick={handleNewFolderClick}
                    className="flex flex-col items-center justify-center p-6 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500 hover:bg-zinc-800/50 transition-all group"
                  >
                    <div className="p-3 bg-amber-500/10 text-amber-400 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <FolderPlus size={24} />
                    </div>
                    <span className="font-semibold text-white">New Folder</span>
                    <span className="text-xs text-zinc-500 mt-1">Organize assets</span>
                  </button>

                  <button 
                    onClick={triggerFileUpload}
                    className="flex flex-col items-center justify-center p-6 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500 hover:bg-zinc-800/50 transition-all group"
                  >
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <Upload size={24} />
                    </div>
                    <span className="font-semibold text-white">Upload File</span>
                    <span className="text-xs text-zinc-500 mt-1">Drag or click to browse</span>
                    <input 
                      ref={fileInputRef} 
                      type="file" 
                      className="hidden" 
                      onChange={onUploadFile} 
                      aria-label="Upload file"
                    />
                  </button>
              </div>
           </div>
           
           <div className="mt-6 flex items-center justify-end">
               <button onClick={() => onNavigate('projects')} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium">
                   Go to Full Project View <span className="text-lg">→</span>
               </button>
           </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Clock size={18} className="text-indigo-400"/> Work History
          </h3>
          <span className="text-xs text-zinc-500">Last 30 days</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-950/50 text-zinc-400 font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4 text-right">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {workSessions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No work sessions recorded yet.</td>
                </tr>
              )}
              {workSessions.slice().reverse().map((session) => (
                <tr key={session.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-zinc-500" />
                      {session.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">
                    {new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-6 py-4 text-zinc-300">
                    {session.endTime ? new Date(session.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Active'}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-indigo-400">
                    {session.endTime ? formatTime(session.endTime - session.startTime) : '...'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Footer */}
      <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-500">
         <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-300 font-bold border border-indigo-800">
             {user.username.charAt(0).toUpperCase()}
           </div>
           <div>
             <p className="text-zinc-300 font-medium">{user.username}</p>
             <p>{user.role}</p>
           </div>
         </div>
         <div className="text-right">
           <p>Member Since</p>
           <p className="font-mono">{user.memberSince.split('T')[0]}</p>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;