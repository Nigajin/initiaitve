
import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { checkConnection, initializeGemini } from '../services/geminiService';
import { saveApiKey, loadApiKey } from '../services/storage';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const savedKey = loadApiKey();
      if (savedKey) setApiKey(savedKey);
      setStatus('IDLE');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    if (!apiKey.trim()) {
      setErrorMessage("API Key를 입력해주세요.");
      return;
    }

    setStatus('TESTING');
    setErrorMessage('');

    const isValid = await checkConnection(apiKey);

    if (isValid) {
      saveApiKey(apiKey);
      initializeGemini(apiKey);
      setStatus('SUCCESS');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setStatus('ERROR');
      setErrorMessage("연결 실패: 유효하지 않은 API Key이거나 네트워크 문제입니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-stone-900 p-6 flex justify-between items-start text-white">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Key size={20} className="text-orange-400"/>
              API Key 설정
            </h2>
            <p className="text-stone-400 text-sm mt-1">Gemini API Key를 안전하게 저장합니다.</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 block">Google Gemini API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AI Studio에서 발급받은 키 입력"
              className="w-full p-3 border border-stone-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-mono text-sm"
            />
            <p className="text-xs text-stone-500 flex items-center gap-1">
              <ShieldCheck size={12} />
              키는 브라우저 내부(Local Storage)에 암호화되어 저장됩니다.
            </p>
          </div>

          {status === 'ERROR' && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {errorMessage}
            </div>
          )}

          {status === 'SUCCESS' && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle size={16} />
              연결 성공! 키가 저장되었습니다.
            </div>
          )}

          <div className="flex gap-3">
             <a 
               href="https://aistudio.google.com/app/apikey" 
               target="_blank" 
               rel="noreferrer"
               className="flex-1 py-3 px-4 rounded-xl border border-stone-200 text-stone-600 font-medium text-sm hover:bg-stone-50 transition-colors text-center flex items-center justify-center"
             >
               키 발급받기
             </a>
             <button
              onClick={handleTestAndSave}
              disabled={status === 'TESTING' || status === 'SUCCESS'}
              className={`flex-[2] py-3 px-4 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                status === 'SUCCESS' ? 'bg-green-600' : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {status === 'TESTING' ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  연결 테스트 중...
                </>
              ) : status === 'SUCCESS' ? (
                '저장 완료'
              ) : (
                '연결 및 저장'
              )}
            </button>
          </div>
        </div>
        
        <div className="bg-stone-50 p-4 border-t border-stone-100 text-xs text-stone-400 text-center">
          Oreum은 서버에 키를 전송하지 않습니다.
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
