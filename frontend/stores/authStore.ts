import { create } from 'zustand';
import { UserProfile } from '@/types/api';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, role: user.role, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, role: null, isAuthenticated: false }),
}));
