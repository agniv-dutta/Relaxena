import axios from "axios";
import {
  ConcessionSuggestion,
  CrowdHeatmapPoint,
  EventInfo,
  LiveScore,
  NavigationSuggestion,
  QueueEntry,
  QueueStatus,
  User,
} from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle refresh token or logout
      localStorage.removeItem("token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export async function loginWithPassword(email: string, password: string): Promise<string> {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  const res = await api.post<{ access_token: string }>("/auth/token", form, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return res.data.access_token;
}

export async function fetchMe(): Promise<User> {
  const res = await api.get<User>("/users/me");
  return res.data;
}

export async function fetchEventSchedule(venueId: number): Promise<EventInfo[]> {
  const res = await api.get<EventInfo[]>(`/attendee/events/${venueId}/schedule`);
  return res.data;
}

export async function fetchLiveScore(eventId: number): Promise<LiveScore> {
  const res = await api.get<LiveScore>(`/attendee/events/${eventId}/live-score`);
  return res.data;
}

export async function fetchHeatmap(venueId: number): Promise<CrowdHeatmapPoint[]> {
  const res = await api.get<CrowdHeatmapPoint[]>(`/crowd/heatmap/${venueId}`);
  return res.data;
}

export async function fetchQueueStatus(ticketId: number): Promise<QueueStatus> {
  const res = await api.get<QueueStatus>(`/queue/status/${ticketId}`);
  return res.data;
}

export async function joinQueue(payload: {
  ticket_id: number;
  venue_id: number;
  queue_type: "concession" | "restroom" | "entry_gate";
  resource_id: string;
}): Promise<QueueEntry> {
  const res = await api.post<QueueEntry>("/queue/join", payload);
  return res.data;
}

export async function fetchNavigationSuggestion(): Promise<NavigationSuggestion> {
  const res = await api.get<NavigationSuggestion>("/attendee/navigation/seat");
  return res.data;
}

export async function fetchConcessionSuggestion(venueId: number): Promise<ConcessionSuggestion> {
  const res = await api.get<ConcessionSuggestion>(`/attendee/concession/recommendation/${venueId}`);
  return res.data;
}
