import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

const FocusTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');

  useEffect(() => {
    let interval: number | null = null;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or notification here
      if (mode === 'FOCUS') {
        setMode('BREAK');
        setTimeLeft(5 * 60);
      } else {
        setMode('FOCUS');
        setTimeLeft(25 * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'FOCUS' ? 25 * 60 : 5 * 60);
  };

  const setDuration = (minutes: number) => {
    setIsActive(false);
    setMode('FOCUS');
    setTimeLeft(minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-stone-800">
          {mode === 'FOCUS' ? '집중의 시간' : '잠시 쉬어가기'}
        </h2>
        <p className="text-stone-500">
          {mode === 'FOCUS' 
            ? '짧게라도 좋으니, 오롯이 나에게 집중해보세요.' 
            : '휴식도 성장의 일부입니다. 편안하게 쉬세요.'}
        </p>
      </div>

      <div className={`relative w-64 h-64 flex items-center justify-center rounded-full border-8 shadow-xl transition-colors duration-500 ${
        mode === 'FOCUS' ? 'border-orange-400 bg-orange-50' : 'border-green-400 bg-green-50'
      }`}>
        <div className="text-6xl font-mono font-bold text-stone-700 tracking-wider">
          {formatTime(timeLeft)}
        </div>
        
        <div className="absolute -bottom-4 bg-white px-4 py-1 rounded-full shadow-sm border border-stone-200 flex items-center gap-2">
           {mode === 'FOCUS' ? <Brain size={16} className="text-orange-500"/> : <Coffee size={16} className="text-green-500"/>}
           <span className="text-sm font-medium text-stone-600">
             {mode === 'FOCUS' ? 'Focus Mode' : 'Break Time'}
           </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={toggleTimer}
          className="w-16 h-16 bg-stone-800 text-white rounded-full flex items-center justify-center hover:bg-stone-700 transition-transform hover:scale-105 shadow-lg"
        >
          {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>
        <button
          onClick={resetTimer}
          className="w-12 h-12 bg-white border border-stone-300 text-stone-600 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Quick Setup */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        <button onClick={() => setDuration(10)} className="py-2 px-4 rounded-lg bg-white border border-stone-200 hover:border-orange-300 hover:text-orange-600 text-stone-500 text-sm font-medium transition-colors">
          10분 읽기
        </button>
        <button onClick={() => setDuration(25)} className="py-2 px-4 rounded-lg bg-white border border-stone-200 hover:border-orange-300 hover:text-orange-600 text-stone-500 text-sm font-medium transition-colors">
          25분 공부
        </button>
        <button onClick={() => setDuration(50)} className="py-2 px-4 rounded-lg bg-white border border-stone-200 hover:border-orange-300 hover:text-orange-600 text-stone-500 text-sm font-medium transition-colors">
          50분 집중
        </button>
      </div>
      
      <div className="bg-stone-100 p-4 rounded-lg text-sm text-stone-500 max-w-sm text-center">
        💡 "시작이 반이다"라는 말처럼, 타이머를 켜는 것만으로도 공부는 이미 시작된 것입니다.
      </div>
    </div>
  );
};

export default FocusTimer;