import { create } from 'zustand';

type RexiTone = 'concise' | 'detailed' | 'emoji';

interface UIState {
  reduceMotion: boolean;
  compactMode: boolean;
  accentColor: string;
  rexiiTone: RexiTone;
  toggles: {
    queueReady: boolean;
    crowdSurge: boolean;
    broadcasts: boolean;
    proactiveTips: boolean;
  };
  setReduceMotion: (value: boolean) => void;
  setCompactMode: (value: boolean) => void;
  setAccentColor: (value: string) => void;
  setRexiTone: (value: RexiTone) => void;
  setToggle: (key: keyof UIState['toggles'], value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  reduceMotion: false,
  compactMode: false,
  accentColor: '#3b82f6',
  rexiiTone: 'concise',
  toggles: {
    queueReady: true,
    crowdSurge: true,
    broadcasts: true,
    proactiveTips: true,
  },
  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
  setCompactMode: (compactMode) => set({ compactMode }),
  setAccentColor: (accentColor) => set({ accentColor }),
  setRexiTone: (rexiiTone) => set({ rexiiTone }),
  setToggle: (key, value) =>
    set((state) => ({
      toggles: {
        ...state.toggles,
        [key]: value,
      },
    })),
}));
