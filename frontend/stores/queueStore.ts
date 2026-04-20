import { create } from 'zustand';
import { QueueEntry } from '@/types/api';

interface QueueState {
  activeQueue: QueueEntry | null;
  position: number | null;
  eta: number | null;
  setActiveQueue: (queue: QueueEntry | null) => void;
  updatePosition: (position: number, eta: number) => void;
  joinQueue: (queue: QueueEntry) => void;
  leaveQueue: () => void;
}

export const useQueueStore = create<QueueState>((set) => ({
  activeQueue: null,
  position: null,
  eta: null,
  setActiveQueue: (activeQueue) => set({ activeQueue }),
  updatePosition: (position, eta) => set({ position, eta }),
  joinQueue: (activeQueue) => set({ activeQueue, position: activeQueue.position, eta: activeQueue.estimated_wait_minutes }),
  leaveQueue: () => set({ activeQueue: null, position: null, eta: null }),
}));
