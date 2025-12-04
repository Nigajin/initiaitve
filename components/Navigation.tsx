
import React from 'react';
import { AppView } from '../types';
import { Home, MessageCircle, Timer, BookOpen, Sun, Settings } from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onOpenSettings: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, onOpenSettings }) => {
  const navItems = [
    { view: AppView.DASHBOARD, label: '홈', icon: <Home size={24} /> },
    { view: AppView.CHAT, label: 'AI 멘토', icon: <MessageCircle size={24} /> },
    { view: AppView.FOCUS, label: '집중 모드', icon: <Timer size={24} /> },
    { view: AppView.JOURNAL, label: '마음 기록', icon: <BookOpen size={24} /> },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-stone-200 p-4 flex justify-around z-50">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center gap-1 ${
              currentView === item.view ? 'text-orange-500 font-bold' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
        <button
            onClick={onOpenSettings}
            className="flex flex-col items-center gap-1 text-stone-400 hover:text-stone-600"
          >
            <Settings size={24} />
            <span className="text-xs">설정</span>
          </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 h-full p-6">
        <div className="flex items-center gap-3 mb-10 text-orange-600">
          <Sun size={32} />
          <h1 className="text-2xl font-bold tracking-tight">Oreum</h1>
        </div>
        
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                currentView === item.view 
                  ? 'bg-orange-50 text-orange-600 font-medium shadow-sm' 
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
              }`}
            >
              {item.icon}
              <span className="text-lg">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <button 
            onClick={onOpenSettings}
            className="flex items-center gap-3 p-3 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-xl w-full transition-colors"
          >
            <Settings size={20} />
            <span className="text-sm">API Key 설정</span>
          </button>

          <div className="bg-stone-100 p-4 rounded-xl">
            <p className="text-sm text-stone-500 mb-2">오늘의 응원</p>
            <p className="text-xs text-stone-800 font-medium leading-relaxed">
              "가장 큰 영광은 한 번도 실패하지 않는 것이 아니라, 실패할 때마다 다시 일어나는 데 있다."
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
