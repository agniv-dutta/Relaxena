import { create } from 'zustand';
import { Alert } from '@/types/api';

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  addAlert: (alert: Alert) => void;
  markRead: (alertId: string) => void;
  setAlerts: (alerts: Alert[]) => void;
}

const seedAlerts: Alert[] = [
  {
    id: 'a1',
    venue_id: 'arena-1',
    severity: 'critical',
    type: 'urgent',
    title: 'Gate 5 Congestion',
    message: 'Crowd density at 94%. Redirect to Gate 6.',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    is_read: false,
  },
  {
    id: 'a2',
    venue_id: 'arena-1',
    severity: 'high',
    type: 'warning',
    title: 'Stand 3 Wait Spike',
    message: 'Queue jumped to 22 min. Consider opening additional service window.',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    is_read: false,
  },
  {
    id: 'a3',
    venue_id: 'arena-1',
    severity: 'medium',
    type: 'info',
    title: 'Weather Update',
    message: 'Temperature 28C, clear sky. No weather disruptions expected.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    is_read: false,
  },
  {
    id: 'a4',
    venue_id: 'arena-1',
    severity: 'low',
    type: 'staff',
    title: 'North Exit Cleared',
    message: 'Previous congestion resolved. Flow restored to normal.',
    timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    is_read: true,
  },
];

export const useAlertStore = create<AlertState>((set) => ({
  alerts: seedAlerts,
  unreadCount: seedAlerts.filter((a) => !a.is_read).length,
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
