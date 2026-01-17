export type UserRole = 'Admin' | 'Employee';
export type UserStatus = 'Active' | 'Offline' | 'Busy' | 'Away';

export interface User {
  username: string;
  fullName: string;
  role: UserRole;
  memberSince: string; // ISO Date or UUID string as requested
  accountId: string;
  status: UserStatus;
  password?: string; // Only for mock auth logic
}

export interface WorkSession {
  id: string;
  startTime: number; // timestamp
  endTime?: number; // timestamp
  date: string; // ISO date string YYYY-MM-DD
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  isMe: boolean;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string; // For text files
  language?: string;
  parentId?: string; // For nesting
}

export interface ProjectComment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  files: ProjectFile[];
  comments: ProjectComment[];
}

export type ViewState = 'dashboard' | 'messages' | 'ai-assistant' | 'projects' | 'settings';
