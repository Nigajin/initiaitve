import React, { useState } from 'react';
import { AppView } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import FocusTimer from './components/FocusTimer';
import MoodTracker from './components/MoodTracker';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

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
      <Navigation currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header Placeholder (Navigation handles the visible header on desktop) */}
        <div className="md:hidden p-4 bg-white border-b border-stone-200 flex justify-center items-center">
            <span className="font-bold text-lg text-stone-800">Oreum</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8 max-w-5xl mx-auto w-full">
           {renderView()}
        </div>
      </main>

      {/* Optional: Simple API Key warning if env is missing (development aid) */}
      {!process.env.API_KEY && (
        <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center p-2 text-xs font-bold z-[100]">
          API_KEY is missing in environment variables.
        </div>
      )}
    </div>
  );
};

export default App;