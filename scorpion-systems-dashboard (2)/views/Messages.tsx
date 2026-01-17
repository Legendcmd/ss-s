import React, { useState } from 'react';
import { Message, User } from '../types';
import { Send, Search, UserCircle } from 'lucide-react';

interface MessagesProps {
  currentUser: User;
}

const MOCK_CONTACTS = [
  { id: '1', name: 'Sarah Connor', role: 'DevOps Lead', status: 'online' },
  { id: '2', name: 'John Reese', role: 'Security', status: 'busy' },
  { id: '3', name: 'Harold Finch', role: 'System Architect', status: 'offline' },
];

const Messages: React.FC<MessagesProps> = ({ currentUser }) => {
  const [selectedContact, setSelectedContact] = useState<string | null>(MOCK_CONTACTS[0].id);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      { id: 'm1', sender: 'Sarah Connor', content: 'Hey, did you push the latest updates to the Scorpion repo?', timestamp: Date.now() - 1000000, isMe: false },
      { id: 'm2', sender: currentUser.username, content: 'Yes, just waiting for the CI/CD pipeline to clear.', timestamp: Date.now() - 500000, isMe: true },
    ]
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: currentUser.username,
      content: inputText,
      timestamp: Date.now(),
      isMe: true,
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact]: [...(prev[selectedContact] || []), newMessage]
    }));
    setInputText('');
  };

  const activeMessages = selectedContact ? (messages[selectedContact] || []) : [];
  const contact = MOCK_CONTACTS.find(c => c.id === selectedContact);

  return (
    <div className="h-[calc(100vh-8rem)] bg-zinc-900 rounded-2xl border border-zinc-800 flex overflow-hidden shadow-2xl">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search colleagues..." 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {MOCK_CONTACTS.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedContact(c.id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-zinc-800 transition-colors ${selectedContact === c.id ? 'bg-zinc-800/80 border-l-2 border-indigo-500' : ''}`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300">
                  <UserCircle size={24} />
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${
                  c.status === 'online' ? 'bg-emerald-500' : c.status === 'busy' ? 'bg-red-500' : 'bg-zinc-500'
                }`}></div>
              </div>
              <div className="text-left">
                <p className="font-medium text-white text-sm">{c.name}</p>
                <p className="text-xs text-zinc-500">{c.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-950/30">
        {contact ? (
          <>
            <div className="p-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900/50">
               <h3 className="font-semibold text-white">{contact.name}</h3>
               <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{contact.role}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.length === 0 && (
                <div className="text-center text-zinc-500 mt-10">Start the conversation with {contact.name}...</div>
              )}
              {activeMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                    msg.isMe 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-zinc-800 text-zinc-200 rounded-bl-none'
                  }`}>
                    <p>{msg.content}</p>
                    <span className={`text-[10px] block mt-1 ${msg.isMe ? 'text-indigo-200' : 'text-zinc-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-zinc-900 border-t border-zinc-800 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!inputText.trim()}
              >
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500">
            Select a contact to message
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
