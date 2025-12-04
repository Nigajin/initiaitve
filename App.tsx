
import React, { useState, useEffect } from 'react';
import { AppView } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import FocusTimer from './components/FocusTimer';
import MoodTracker from './components/MoodTracker';
import ApiKeyModal from './components/ApiKeyModal';
import { loadApiKey } from './services/storage';
import { initializeGemini } from './services/geminiService';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const savedKey = loadApiKey();
    if (savedKey) {
      initializeGemini(savedKey);
      setHasApiKey(true);
    } else {
      // If no key found, prompt user to settings
      setIsSettingsOpen(true);
    }
  }, []);

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
    // Check if key exists after closing (user might have saved it)
    const savedKey = loadApiKey();
    if (savedKey) setHasApiKey(true);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.CHAT:
        return <ChatInterface />;
      case AppView.FOCUS:
        return <FocusTimer />;
      case AppView.JOURNAL:
        return <MoodTracker />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-stone-50">
      <Navigation 
        currentView={currentView} 
        setView={setCurrentView} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header Placeholder */}
        <div className="md:hidden p-4 bg-white border-b border-stone-200 flex justify-between items-center">
            <span className="font-bold text-lg text-stone-800">Oreum</span>
            {!hasApiKey && <AlertTriangle size={20} className="text-orange-500 animate-pulse" onClick={() => setIsSettingsOpen(true)}/>}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8 max-w-5xl mx-auto w-full">
           {!hasApiKey && !isSettingsOpen && (
             <div className="mb-6 bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-center justify-between animate-fade-in">
               <div className="flex items-center gap-3">
                 <AlertTriangle className="text-orange-500" />
                 <div className="text-stone-700 text-sm">
                   앱 사용을 위해 Gemini API Key 설정이 필요합니다.
                 </div>
               </div>
               <button 
                 onClick={() => setIsSettingsOpen(true)}
                 className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors"
               >
                 설정하기
               </button>
             </div>
           )}
           {renderView()}
        </div>
      </main>

      <ApiKeyModal isOpen={isSettingsOpen} onClose={handleSettingsClose} />
    </div>
  );
};

export default App;
