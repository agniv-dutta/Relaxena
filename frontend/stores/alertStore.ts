import { create } from 'zustand';
import { Alert } from '@/types/api';

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  addAlert: (alert: Alert) => void;
  markRead: (alertId: string) => void;
  setAlerts: (alerts: Alert[]) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  unreadCount: 0,
  addAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts],
    unreadCount: state.unreadCount + 1
  })),
  markRead: (alertId) => set((state) => {
    const alerts = state.alerts.map((a) => a.id === alertId ? { ...a, is_read: true } : a);
    const unreadCount = alerts.filter(a => !a.is_read).length;
    return { alerts, unreadCount };
  }),
  setAlerts: (alerts) => set({ 
    alerts, 
    unreadCount: alerts.filter(a => !a.is_read).length 
  }),
}));
