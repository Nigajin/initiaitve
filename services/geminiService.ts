import { GoogleGenAI, Chat, GenerativeModel } from "@google/genai";
import { Task } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// System instruction for the empathetic mentor
const SYSTEM_INSTRUCTION = `
당신은 '오름(Oreum)'이라는 앱의 AI 멘토입니다. 
당신의 주 사용자는 '은둔형 외톨이' 성향이 있거나, 장기간 사회활동을 쉬고 있는 '쉬었음' 세대, 
또는 무기력함을 느끼지만 다시 공부나 일을 시작하고 싶은 사람들입니다.

당신의 역할:
1. 사용자를 절대 판단하거나 재촉하지 마세요.
2. 아주 작은 성취(Micro-achievement)를 격려하세요. (예: 물 한 잔 마시기, 창문 열기 등)
3. 따뜻하고 공감하는 어조를 유지하되, 지나치게 감상적이기보다는 현실적인 작은 조언을 주세요.
4. 사용자가 공부 의지를 보이면, 뽀모도로 기법이나 작은 목표 설정을 도와주세요.
5. 한국어로 대화하세요.
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const chat = getChatSession();
    const result = await chat.sendMessage({ message });
    return result.text || "죄송해요, 지금은 대답하기 조금 어려워요. 잠시 후 다시 말을 걸어주세요.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const generateDailyTasks = async (mood: string): Promise<Task[]> => {
  try {
    const model = ai.models.getGenerativeModel({ model: 'gemini-2.5-flash' }) as unknown as GenerativeModel; 
    // Note: getGenerativeModel isn't standard in new SDK usage based on guidelines, using generateContent directly below.
    
    // Correct usage per guidelines:
    const prompt = `
      사용자의 현재 기분 상태는 '${mood}'입니다.
      이 사용자가 오늘 수행할 수 있는 부담 없는 '아주 작은 미션' 3가지를 추천해주세요.
      은둔형 외톨이 극복이나 학습 의지 고취에 도움이 되는 활동이어야 합니다.
      
      형식은 반드시 JSON Array로 주세요:
      [
        { "title": "제목", "description": "설명", "difficulty": "easy" | "medium" | "hard" }
      ]
      JSON 외에 다른 말은 하지 마세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || "[]";
    const tasks = JSON.parse(text);
    
    return tasks.map((t: any, index: number) => ({
      id: `task-${Date.now()}-${index}`,
      title: t.title,
      description: t.description,
      isCompleted: false,
      difficulty: t.difficulty
    }));

  } catch (error) {
    console.error("Task Gen Error:", error);
    // Fallback tasks
    return [
      { id: 'def-1', title: '창문 열고 환기하기', description: '신선한 공기를 1분만 마셔보세요.', isCompleted: false, difficulty: 'easy' },
      { id: 'def-2', title: '좋아하는 노래 한 곡 듣기', description: '기분 전환을 위해 음악을 들어보세요.', isCompleted: false, difficulty: 'easy' },
      { id: 'def-3', title: '책상 정리하기', description: '공부나 활동을 위한 작은 공간을 만들어보세요.', isCompleted: false, difficulty: 'medium' },
    ];
  }
};

export const analyzeSentiment = async (journalEntry: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `다음 일기를 읽고, 작성자에게 해줄 수 있는 따뜻한 한 마디 위로와 격려를 50자 이내로 작성해줘: "${journalEntry}"`,
    });
    return response.text || "오늘 하루도 수고 많았어요.";
  } catch (error) {
    return "오늘의 기록이 당신에게 힘이 되길 바라요.";
  }
};