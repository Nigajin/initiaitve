import React, { useState } from 'react';
import { analyzeSentiment } from '../services/geminiService';
import { Save, Sparkles } from 'lucide-react';

const MoodTracker: React.FC = () => {
  const [entry, setEntry] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!entry.trim()) return;
    setIsAnalyzing(true);
    const feedback = await analyzeSentiment(entry);
    setAiFeedback(feedback);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-fade-in max-w-2xl mx-auto w-full">
      <div>
        <h2 className="text-2xl font-bold text-stone-800">마음 기록</h2>
        <p className="text-stone-500">오늘 느낀 감정이나 생각을 자유롭게 적어보세요. 누구도 보지 않아요.</p>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <textarea
          className="w-full flex-1 min-h-[200px] p-6 rounded-2xl bg-white border border-stone-200 resize-none focus:outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all text-stone-700 leading-relaxed placeholder-stone-300 shadow-sm"
          placeholder="오늘은 어떤 일이 있었나요? 마음이 답답하다면 그냥 '답답해'라고 적어도 좋아요."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        
        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={!entry.trim() || isAnalyzing}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all shadow-sm ${
               !entry.trim() || isAnalyzing
               ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
               : 'bg-stone-800 text-white hover:bg-stone-700 hover:scale-[1.02]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Sparkles size={18} className="animate-spin" />
                분석 중...
              </>
            ) : (
              <>
                <Save size={18} />
                기록하고 AI 위로 받기
              </>
            )}
          </button>
        </div>
      </div>

      {aiFeedback && (
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl relative animate-fade-in mt-4">
          <div className="absolute -top-3 left-6 bg-white px-2 text-orange-400">
            <Sparkles size={20} fill="currentColor" />
          </div>
          <h4 className="font-bold text-stone-800 mb-2">오름의 편지</h4>
          <p className="text-stone-700 leading-relaxed">
            {aiFeedback}
          </p>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;