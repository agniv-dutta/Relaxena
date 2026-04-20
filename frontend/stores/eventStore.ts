import { create } from 'zustand';
import { LiveScore } from '@/types/api';

interface EventState {
  event: any | null; // Detailed event info
  score: LiveScore | null;
  period: string | null;
  recentGoals: any[];
  setEvent: (event: any) => void;
  updateScore: (score: LiveScore) => void;
  addGoal: (goal: any) => void;
}

export const useEventStore = create<EventState>((set) => ({
  event: null,
  score: null,
  period: null,
  recentGoals: [],
  setEvent: (event) => set({ event }),
  updateScore: (score) => set({ score, period: score.period }),
  addGoal: (goal) => set((state) => ({ recentGoals: [goal, ...state.recentGoals].slice(0, 5) })),
}));
