export type Severity = "low" | "medium" | "high" | "critical";
export type AlertType = "info" | "warning" | "urgent" | "staff";
export type QueueCategory = "food" | "rest" | "gates" | "merch" | "merchandise" | "drinks" | "restrooms";

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  role: "user" | "staff" | "admin";
  ticket_id?: number;
  seat_label?: string;
  gate?: string;
  entry_time?: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  capacity: number;
  image_url?: string;
}

export interface Zone {
  id: string;
  venue_id: string;
  name: string;
  density: number; // 0-100
  capacity: number;
  status: "open" | "closed" | "restricted";
}

export interface QueueEntry {
  id: string;
  user_id: number;
  venue_id: string;
  category: QueueCategory;
  location_name: string;
  joined_at: string;
  position: number;
  estimated_wait_minutes: number;
}

export interface Alert {
  id: string;
  venue_id: string;
  zone_id?: string;
  severity: Severity;
  type: AlertType;
  title: string;
  message: string;
  timestamp: string;
  is_read: boolean;
}

export interface Incident {
  id: string;
  venue_id: string;
  type: string;
  severity: Severity;
  location: string;
  status: "active" | "resolved";
  description: string;
  timestamp: string;
}

export interface LiveScore {
  event_id: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  period: string; // e.g., "1st Quarter", "Halftime"
  time_remaining: string;
  status: "live" | "scheduled" | "finished";
  recent_highlights?: string[];
}

export interface WaitTime {
  location_id: string;
  name: string;
  category: QueueCategory;
  minutes: number;
  trend: "rising" | "falling" | "stable";
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  actions?: AIAction[];
}

export interface AIAction {
  type: "queue_join" | "map_link" | "alert_info";
  label: string;
  payload: any;
}

export interface CrowdSnapshot {
  venue_id: string;
  timestamp: string;
  total_count: number;
  zone_densities: Record<string, number>;
}

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  zone_assignment?: string;
}
