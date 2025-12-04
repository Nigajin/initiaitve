import React, { useState, useEffect } from 'react';
import { Task, UserProfile } from '../types';
import { generateDailyTasks } from '../services/geminiService';
import { CheckCircle2, Circle, RefreshCw, Trophy, Target, Battery } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '여행자',
    streak: 3,
    totalFocusMinutes: 120
  });

  const [currentMood, setCurrentMood] = useState<string>('무기력함');

  useEffect(() => {
    // Load initial tasks or generate if empty
    if (tasks.length === 0) {
      handleGenerateTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateTasks = async () => {
    setLoadingTasks(true);
    const newTasks = await generateDailyTasks(currentMood);
    setTasks(newTasks);
    setLoadingTasks(false);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const isCompleted = !t.isCompleted;
        // Simple gamification feedback could go here
        return { ...t, isCompleted };
      }
      return t;
    }));
  };

  const completedCount = tasks.filter(t => t.isCompleted).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header / Welcome */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">안녕하세요, {profile.name}님</h2>
          <p className="text-stone-500">오늘도 작은 발걸음을 내디뎌 볼까요?</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full text-orange-700 text-sm font-medium">
          <Trophy size={16} />
          <span>{profile.streak}일 연속 달성 중</span>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex flex-col items-center justify-center text-center gap-2">
            <Target className="text-blue-500" size={24} />
            <div className="text-2xl font-bold text-stone-800">{Math.round(progress)}%</div>
            <div className="text-xs text-stone-500">오늘의 달성률</div>
         </div>
         <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex flex-col items-center justify-center text-center gap-2">
            <Battery className="text-green-500" size={24} />
            <div className="text-2xl font-bold text-stone-800">충전 중</div>
            <div className="text-xs text-stone-500">현재 상태</div>
         </div>
         <div className="col-span-2 bg-gradient-to-r from-orange-400 to-pink-500 p-4 rounded-xl shadow-md text-white flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">작은 성공이 모여<br/>큰 변화를 만듭니다</div>
            </div>
            <div className="text-4xl opacity-50">🌱</div>
         </div>
      </div>

      {/* Daily Missions */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <h3 className="font-bold text-lg text-stone-800 flex items-center gap-2">
            <span>오늘의 작은 미션</span>
            <span className="text-xs font-normal text-stone-500 bg-white px-2 py-1 rounded-md border border-stone-200">
              {currentMood} 상태 맞춤
            </span>
          </h3>
          <button 
            onClick={handleGenerateTasks} 
            disabled={loadingTasks}
            className="text-stone-400 hover:text-orange-500 transition-colors"
            title="새로운 미션 받기"
          >
            <RefreshCw size={20} className={loadingTasks ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {loadingTasks ? (
            <div className="text-center py-10 text-stone-400">
              AI가 당신을 위한 부담 없는 미션을 고민 중입니다...
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`group flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  task.isCompleted 
                    ? 'bg-stone-50 border-stone-200 opacity-60' 
                    : 'bg-white border-stone-200 hover:border-orange-300 hover:shadow-md'
                }`}
              >
                <div className={`mt-1 transition-colors ${task.isCompleted ? 'text-green-500' : 'text-stone-300 group-hover:text-orange-400'}`}>
                  {task.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </div>
                <div>
                  <h4 className={`font-medium text-lg ${task.isCompleted ? 'text-stone-500 line-through' : 'text-stone-800'}`}>
                    {task.title}
                  </h4>
                  <p className="text-sm text-stone-500 mt-1">{task.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mood Selector for next gen */}
      <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
        <p className="text-sm text-stone-600 mb-3 font-medium">지금 기분은 어떤가요? 기분에 따라 미션이 달라져요.</p>
        <div className="flex flex-wrap gap-2">
          {['무기력함', '불안함', '평범함', '의욕 조금 있음', '상쾌함'].map((mood) => (
            <button
              key={mood}
              onClick={() => setCurrentMood(mood)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                currentMood === mood 
                  ? 'bg-stone-700 text-white' 
                  : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;