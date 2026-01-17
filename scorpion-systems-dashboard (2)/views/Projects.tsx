import React, { useState } from 'react';
import { FolderPlus, FileCode, Upload, MessageSquare, Send, Mail, Save, Plus, X } from 'lucide-react';
import { Project, ProjectFile, ProjectComment, User } from '../types';

interface ProjectsProps {
  currentUser: User;
  projects: Project[];
  onUpdateProject: (project: Project) => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateFile: (name: string) => void;
  onCreateFolder: (name: string) => void;
}

const Projects: React.FC<ProjectsProps> = ({ 
  currentUser, 
  projects, 
  onUpdateProject,
  onUploadFile,
  onCreateFile,
  onCreateFolder
}) => {
  const selectedProject = projects[0]; // Assuming single project for now as per previous structure
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [commentText, setCommentText] = useState('');
  const [fileContent, setFileContent] = useState(''); // Local state for editing

  // Sync editor content when file changes
  React.useEffect(() => {
    if (selectedFile) {
      setFileContent(selectedFile.content || '');
    }
  }, [selectedFile]);

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");
    if (name) onCreateFolder(name);
  };

  const handleCreateFile = () => {
    const name = prompt("Enter file name (e.g. style.css):");
    if (name) {
        onCreateFile(name);
        // Auto select the new file (it's the last one)
        // Since props update might be async, we rely on the user to click it or complex logic. 
        // For simplicity, we just add it.
    }
  };

  const handleSaveFile = () => {
    if (selectedFile) {
      const updatedFile = { ...selectedFile, content: fileContent };
      const updatedFiles = selectedProject.files.map(f => f.id === selectedFile.id ? updatedFile : f);
      const updatedProject = { ...selectedProject, files: updatedFiles };
      onUpdateProject(updatedProject);
      setSelectedFile(updatedFile); // Update local selection ref
      alert("File saved successfully.");
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: ProjectComment = {
      id: Date.now().toString(),
      author: currentUser.username,
      text: commentText,
      timestamp: Date.now()
    };

    const updatedProject = {
      ...selectedProject,
      comments: [...selectedProject.comments, newComment]
    };
    onUpdateProject(updatedProject);
    setCommentText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* File Explorer & Editor */}
      <div className="lg:col-span-2 bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
           <div>
             <h3 className="font-bold text-white text-lg flex items-center gap-2">
                 <span className="text-indigo-500">/</span> {selectedProject.name}
             </h3>
             <p className="text-zinc-500 text-xs">{selectedProject.description}</p>
           </div>
           <div className="flex gap-2">
             <button onClick={handleCreateFile} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors" title="New File">
               <Plus size={20} />
             </button>
             <button onClick={handleCreateFolder} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors" title="New Folder">
               <FolderPlus size={20} />
             </button>
             <label className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer" title="Upload File">
               <Upload size={20} />
               <input type="file" className="hidden" onChange={onUploadFile} />
             </label>
           </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* File Grid (Only visible if no file selected or if user wants to browse) */}
          {!selectedFile && (
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {selectedProject.files.map(file => (
                    <button
                        key={file.id}
                        onClick={() => file.type === 'file' && setSelectedFile(file)}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all hover:scale-105 ${
                        selectedFile?.id === file.id 
                            ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-300' 
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                    >
                        {file.type === 'folder' ? (
                        <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center">
                            <FolderPlus size={24} />
                        </div>
                        ) : (
                        <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-lg flex items-center justify-center">
                            <FileCode size={24} />
                        </div>
                        )}
                        <span className="text-xs font-medium truncate w-full text-center">{file.name}</span>
                    </button>
                    ))}
                </div>
                <div className="mt-10 text-center text-zinc-600">
                    <p>Select a file to edit or create a new one.</p>
                </div>
            </div>
          )}

          {/* Editor Area */}
          {selectedFile && (
             <div className="flex-1 flex flex-col bg-zinc-950">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
                    <span className="text-sm font-mono text-zinc-300 flex items-center gap-2">
                        <FileCode size={14}/> {selectedFile.name}
                    </span>
                    <div className="flex items-center gap-2">
                        <button onClick={handleSaveFile} className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md transition-colors">
                            <Save size={12} /> Save
                        </button>
                        <button onClick={() => setSelectedFile(null)} className="text-zinc-500 hover:text-zinc-300 p-1">
                            <X size={16} />
                        </button>
                    </div>
                </div>
                <textarea 
                    className="flex-1 w-full bg-zinc-950 text-zinc-300 font-mono text-sm p-4 focus:outline-none resize-none leading-relaxed"
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    spellCheck={false}
                />
             </div>
          )}
        </div>

        {/* Approval Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-end">
          <a 
            href={`mailto:1i.vihaandwivedi@gmail.com?subject=Approval Request: ${selectedProject.name}`}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Mail size={16} /> Request Approval
          </a>
        </div>
      </div>

      {/* Discussion Board */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900">
          <h3 className="font-bold text-white flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-400"/> Discussion
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedProject.comments.map(comment => (
            <div key={comment.id} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
               <div className="flex justify-between items-start mb-1">
                 <span className="text-xs font-bold text-indigo-400">{comment.author}</span>
                 <span className="text-[10px] text-zinc-600">{new Date(comment.timestamp).toLocaleDateString()}</span>
               </div>
               <p className="text-sm text-zinc-300">{comment.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handlePostComment} className="p-3 bg-zinc-950 border-t border-zinc-800 flex gap-2">
          <input 
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
            placeholder="Discuss updates..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-500">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Projects;