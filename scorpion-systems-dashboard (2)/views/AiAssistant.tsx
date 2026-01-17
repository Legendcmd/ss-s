import React, { useState, useRef, useEffect } from 'react';
import { generateAIResponse } from '../services/gemini';
import { Bot, Send, Sparkles, Loader2 } from 'lucide-react';

interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

const AiAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatTurn[]>([
    { role: 'model', text: 'Hello! I am the Scorpion Systems AI Assistant. How can I help you optimize your workflow today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setHistory(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    // Prepare history for API (convert strictly to API format)
    const apiHistory = history.map(turn => ({
      role: turn.role,
      parts: [{ text: turn.text }]
    }));

    const responseText = await generateAIResponse(userText, apiHistory);

    setHistory(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden relative">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-emerald-600/5 rounded-full blur-[80px]"></div>
      </div>

      <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur z-10 flex items-center gap-3">
        <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg shadow-lg">
          <Bot className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Scorpion AI</h2>
          <p className="text-xs text-indigo-300 flex items-center gap-1">
            <Sparkles size={10} /> Powered by Gemini
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 z-10 scroll-smooth">
        {history.map((turn, idx) => (
          <div key={idx} className={`flex ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                turn.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/10' 
                  : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700'
              }`}
            >
              {turn.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-none border border-zinc-700 flex items-center gap-2">
              <Loader2 className="animate-spin text-indigo-400" size={18} />
              <span className="text-zinc-400 text-xs">Processing...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-zinc-950/50 border-t border-zinc-800 z-10">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl py-4 pl-5 pr-14 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AiAssistant;
