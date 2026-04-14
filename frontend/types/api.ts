export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  ticket_id?: number | null;
  seat_label?: string | null;
}

export interface Venue {
  id: number;
  name: string;
  city: string;
  capacity: number;
}

export interface Zone {
  id: number;
  venue_id: number;
  name: string;
}

export interface CrowdSnapshot {
  id: number;
  venue_id: number;
  zone_id: number;
  density_score: number;
  captured_at: string;
}

export interface CrowdHeatmapPoint {
  zone_id: number;
  density_score: number;
  timestamp: string;
}

export interface Alert {
  id: number;
  venue_id: number;
  zone_id?: number;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  created_at: string;
  type?: "info" | "warning" | "urgent" | "staff";
}

export interface QueueEntry {
  id: number;
  ticket_id: number;
  venue_id: number;
  queue_type: string;
  resource_id: string;
  joined_at: string;
  position?: number;
  estimated_wait_minutes?: number;
}

export interface QueueStatus {
  ticket_id: number;
  in_queue: boolean;
  queue_type?: string | null;
  resource_id?: string | null;
  position?: number | null;
  estimated_wait_minutes?: number | null;
  joined_at?: string | null;
}

export interface DashboardStats {
  active_incidents: number;
  critical_alerts_last_hour: number;
  avg_density: number;
  active_queue_entries: number;
}

export interface EventInfo {
  event_id: number;
  name: string;
  start_time: string;
  end_time: string;
}

export interface LiveScore {
  event_id: number;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  status: string;
}

export interface NavigationSuggestion {
  user_id: number;
  destination: string;
  route: string[];
  estimated_minutes: number;
}

export interface ConcessionSuggestion {
  venue_id: number;
  recommended_resource_id: string;
  estimated_wait_minutes: number;
}
