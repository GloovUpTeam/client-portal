import React, { useState, useEffect, useRef } from 'react';
import { MOCK_CHAT, USERS } from '../services/mockData';
import { Button } from '../components/atoms/Button';
import { Send, Paperclip, MoreVertical } from 'lucide-react';
import { ChatMessage } from '../types';

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'u1', // Me
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  const getUser = (id: string) => USERS.find(u => u.id === id);

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-brand-surface rounded-xl border border-neutral-800 overflow-hidden">
      {/* Sidebar List */}
      <div className="w-80 border-r border-neutral-800 hidden md:flex flex-col">
        <div className="p-4 border-b border-neutral-800">
          <input 
            type="text" 
            placeholder="Search messages..." 
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {['Website Redesign', 'General', 'Billing'].map((channel, i) => (
            <div key={i} className={`p-4 cursor-pointer hover:bg-neutral-800 transition-colors ${i === 0 ? 'bg-brand/5 border-l-2 border-brand' : ''}`}>
              <div className="flex justify-between mb-1">
                <span className={`font-medium ${i === 0 ? 'text-white' : 'text-neutral-400'}`}># {channel}</span>
                <span className="text-xs text-neutral-500">10:42 AM</span>
              </div>
              <p className="text-xs text-neutral-500 truncate">Alice: We are deploying updates...</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-brand-surface">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-white"># Website Redesign</h2>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-xs text-neutral-400">3 online</span>
          </div>
          <MoreVertical className="w-5 h-5 text-neutral-400 cursor-pointer" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20">
          {messages.map((msg) => {
            const isMe = msg.senderId === 'u1';
            const user = getUser(msg.senderId);
            return (
              <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full self-end mb-1" />
                <div className={`max-w-[70%]`}>
                  <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm font-bold text-white">{user?.name}</span>
                    <span className="text-xs text-neutral-500">{msg.timestamp}</span>
                  </div>
                  <div className={`p-3 rounded-2xl ${
                    isMe 
                    ? 'bg-brand text-black rounded-br-none' 
                    : 'bg-neutral-800 text-neutral-200 rounded-bl-none'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-brand-surface border-t border-neutral-800">
          <div className="flex items-center gap-2 bg-neutral-900 rounded-lg p-2 border border-neutral-700 focus-within:border-brand transition-colors">
            <button className="p-2 text-neutral-400 hover:text-white transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-neutral-500"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="p-2 bg-brand text-black rounded-md hover:bg-brand-dark transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};