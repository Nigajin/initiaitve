import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '안녕하세요. 오늘 기분은 좀 어떠신가요? 억지로 힘낼 필요는 없어요. 그냥 이야기하고 싶은 게 있다면 들어드릴게요.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-100">
      <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-800">오름 멘토</h2>
          <p className="text-xs text-stone-500">당신의 속도에 맞춰 함께 걷습니다.</p>
        </div>
        <Bot className="text-orange-400" size={24} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] md:max-w-[70%] p-3 rounded-2xl text-sm md:text-base leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white rounded-tr-none'
                  : 'bg-stone-100 text-stone-800 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-stone-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-stone-500 text-sm">
              <Loader2 className="animate-spin" size={16} />
              생각하고 있어요...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-stone-50 border-t border-stone-200">
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-stone-300 focus-within:border-orange-400 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="하고 싶은 말이 있나요?"
            className="flex-1 outline-none text-stone-700 placeholder-stone-400 text-sm md:text-base"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`p-2 rounded-lg transition-colors ${
              input.trim() && !isLoading ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-stone-200 text-stone-400'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;