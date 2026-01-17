import React, { useState } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './views/Dashboard';
import Messages from './views/Messages';
import AiAssistant from './views/AiAssistant';
import Projects from './views/Projects';
import Settings from './views/Settings';
import { User, ViewState, WorkSession, UserStatus, Project, ProjectFile } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  // Dashboard State
  const [currentSession, setCurrentSession] = useState<WorkSession | null>(null);
  const [workSessions, setWorkSessions] = useState<WorkSession[]>([
    // Mock History Data
    { id: '1', startTime: Date.now() - 86400000 * 2, endTime: Date.now() - 86400000 * 2 + 14400000, date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0] },
    { id: '2', startTime: Date.now() - 86400000, endTime: Date.now() - 86400000 + 28800000, date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
  ]);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'p1',
      name: 'Alpha Protocol',
      description: 'Core system architecture for the new defense grid.',
      files: [
        { id: 'f1', name: 'main.py', type: 'file', content: 'def init_system():\n    print("System Online")\n    security.enable_firewall()' },
        { id: 'f2', name: 'docs', type: 'folder' }
      ],
      comments: [
        { id: 'c1', author: 'Admin', text: 'Please review the security module.', timestamp: Date.now() - 100000 }
      ]
    }
  ]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleStartWork = () => {
    setCurrentSession({
      id: Date.now().toString(),
      startTime: Date.now(),
      date: new Date().toISOString().split('T')[0]
    });
    if (user) handleUpdateStatus('Active');
  };

  const handleStopWork = () => {
    if (currentSession) {
      const completedSession = { ...currentSession, endTime: Date.now() };
      setWorkSessions([...workSessions, completedSession]);
      setCurrentSession(null);
      if (user) handleUpdateStatus('Offline');
    }
  };

  const handleUpdateStatus = (status: UserStatus) => {
    if (user) {
      setUser({ ...user, status });
    }
  };

  const handleUpdateUser = (updates: Partial<User>) => {
      if (user) {
          setUser({ ...user, ...updates });
      }
  };

  const handleUpdateProject = (updatedProject: Project) => {
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  // Helper to add files/folders to the first project (Default Workspace)
  const addToFileSystem = (item: ProjectFile) => {
      const defaultProject = projects[0];
      const updatedProject = {
          ...defaultProject,
          files: [...defaultProject.files, item]
      };
      handleUpdateProject(updatedProject);
  };

  const handleCreateFile = (name: string) => {
      addToFileSystem({
          id: Date.now().toString(),
          name,
          type: 'file',
          content: ''
      });
  };

  const handleCreateFolder = (name: string) => {
      addToFileSystem({
          id: Date.now().toString(),
          name,
          type: 'folder'
      });
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const content = event.target?.result as string;
        addToFileSystem({
          id: Date.now().toString(),
          name: file.name,
          type: 'file',
          content: content.slice(0, 500) // Simple truncation for demo
        });
      };
      
      reader.readAsText(file);
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout currentView={currentView} setView={setCurrentView} onLogout={handleLogout}>
      {currentView === 'dashboard' && (
        <Dashboard 
          user={user} 
          onUpdateStatus={handleUpdateStatus}
          workSessions={workSessions}
          currentSession={currentSession}
          onStartWork={handleStartWork}
          onStopWork={handleStopWork}
          onNavigate={setCurrentView}
          onCreateFile={handleCreateFile}
          onCreateFolder={handleCreateFolder}
          onUploadFile={handleUploadFile}
        />
      )}
      {currentView === 'messages' && <Messages currentUser={user} />}
      {currentView === 'ai-assistant' && <AiAssistant />}
      {currentView === 'projects' && (
        <Projects 
          currentUser={user} 
          projects={projects}
          onUpdateProject={handleUpdateProject}
          onCreateFile={handleCreateFile}
          onCreateFolder={handleCreateFolder}
          onUploadFile={handleUploadFile}
        />
      )}
      {currentView === 'settings' && <Settings user={user} onUpdateUser={handleUpdateUser} />}
    </Layout>
  );
};

export default App;