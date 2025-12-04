export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  FOCUS = 'FOCUS',
  JOURNAL = 'JOURNAL'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface DailyMood {
  date: string;
  moodScore: number; // 1-5
  notes: string;
}

export interface UserProfile {
  name: string;
  streak: number;
  totalFocusMinutes: number;
}