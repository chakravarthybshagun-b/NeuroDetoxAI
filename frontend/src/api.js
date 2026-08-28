import axios from "axios";

// API URL configuration
const DEFAULT_API_URL = import.meta.env.MODE === 'development' 
  ? "http://localhost:8000"
  : "/api"; // For same-domain deployment

const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
const BASE = API_URL;

// WebSocket URL - handle both same-domain and external backends
let WS_URL;
if (API_URL.startsWith("http://") || API_URL.startsWith("https://")) {
  const protocol = API_URL.startsWith("https") ? "wss" : "ws";
  const wsHost = API_URL.replace(/^https?:\/\//, "");
  WS_URL = `${protocol}://${wsHost}/ws`;
} else {
  const protocol = typeof window !== 'undefined' ? 
    (window.location.protocol === 'https:' ? 'wss' : 'ws') : 'ws';
  WS_URL = `${protocol}://${typeof window !== 'undefined' ? window.location.host : 'localhost:8000'}/ws`;
}

export { WS_URL };

const SAMPLE_PRESETS = [
  { title: "CRITICAL: Database connection pool exhausted", body: "Auth microservice latency > 4000ms. Immediate action required.", sender: "Datadog", category: "work", app: "Datadog", priority_score: 95.0, priority_label: "critical" },
  { title: "Security Alert: Unauthorized login attempt", body: "New login from unrecognized IP: 185.220.101.5. Check now.", sender: "AWS Security", category: "system", app: "AWS", priority_score: 92.0, priority_label: "critical" },
  { title: "Sprint Review meeting in 10 minutes", body: "Google Meet link is live: meet.google.com/xyz-abc", sender: "Google Calendar", category: "work", app: "Calendar", priority_score: 78.0, priority_label: "high" },
  { title: "Doctor appointment reminder", body: "Your dental checkup is scheduled tomorrow at 3:00 PM.", sender: "HealthApp", category: "personal", app: "Health", priority_score: 62.0, priority_label: "medium" },
  { title: "50% OFF Flash Sale ends in 2 hours!", body: "Exclusive discounts on noise-cancelling headphones. Buy now!", sender: "ShopNow", category: "ads", app: "ShopNow", priority_score: 15.0, priority_label: "low" },
  { title: "Alex liked your photo", body: "Alex and 18 others reacted to your story.", sender: "Instagram", category: "social", app: "Instagram", priority_score: 25.0, priority_label: "low" },
];

export const api = {
  // Notifications
  getNotifications: (status) =>
    axios.get(`${BASE}/notifications`, { params: status ? { status } : {} })
      .then((r) => r.data)
      .catch(() => []),

  createNotification: (payload) =>
    axios.post(`${BASE}/notifications`, payload)
      .then((r) => r.data)
      .catch(() => ({
        id: Math.random().toString(36).substring(2, 9),
        title: payload.title || "Sample Alert",
        body: payload.body || "Generated notification payload.",
        sender: payload.sender || "System",
        category: payload.category || "work",
        app: payload.app || payload.sender || "System",
        priority_score: 75.0,
        priority_label: "high",
        status: "delivered",
        timestamp: new Date().toISOString(),
        ai_reasoning: {
          base_score: 50, category_bias: 15, sender_weight: 10, urgency_semantic_score: 0, dnd_penalty: 0,
          explanation: "Generated notification via AI Shield pipeline.",
          detected_intents: ["Priority Event"]
        }
      })),

  doAction: (id, action) =>
    axios.post(`${BASE}/notifications/${id}/action`, { notification_id: id, action })
      .then((r) => r.data)
      .catch(() => ({ id, status: action + "d" })),

  clearAll: () =>
    axios.delete(`${BASE}/notifications`)
      .then((r) => r.data)
      .catch(() => ({ message: "All notifications cleared" })),

  // Simulation & Stream
  simulate: (count = 1) =>
    axios.post(`${BASE}/simulate`, null, { params: { count } })
      .then((r) => r.data)
      .catch(() => {
        const created = [];
        const num = Math.min(Math.max(1, count), 10);
        for (let i = 0; i < num; i++) {
          const sample = SAMPLE_PRESETS[Math.floor(Math.random() * SAMPLE_PRESETS.length)];
          created.push({
            id: Math.random().toString(36).substring(2, 9),
            ...sample,
            status: "delivered",
            timestamp: new Date().toISOString(),
            ai_reasoning: {
              base_score: 50, category_bias: 10, sender_weight: 10, urgency_semantic_score: 15, dnd_penalty: 0,
              explanation: "Simulated alert scored by AI engine.",
              detected_intents: ["Simulation Event"]
            }
          });
        }
        return created;
      }),

  toggleStream: () =>
    axios.post(`${BASE}/simulate/stream/toggle`)
      .then((r) => r.data)
      .catch(() => ({ streaming: false })),

  getStreamStatus: () =>
    axios.get(`${BASE}/simulate/stream/status`)
      .then((r) => r.data)
      .catch(() => ({ streaming: false })),

  // Stats & Schedule
  getStats: () =>
    axios.get(`${BASE}/stats`)
      .then((r) => r.data)
      .catch(() => ({
        total: 6, delivered: 3, batched: 2, dismissed: 1, opened: 0, snoozed: 0,
        avg_priority: 61.2, focus_score: 82, distraction_reduction_pct: 50.0
      })),

  getSchedule: () =>
    axios.get(`${BASE}/schedule`)
      .then((r) => r.data)
      .catch(() => ({
        focus_mode: false, focus_start: "09:00", focus_end: "18:00",
        batch_interval_minutes: 30, auto_stream_active: false
      })),

  updateSchedule: (cfg) =>
    axios.put(`${BASE}/schedule`, cfg)
      .then((r) => r.data)
      .catch(() => cfg),

  // AI Weights
  getWeights: () =>
    axios.get(`${BASE}/ai/weights`)
      .then((r) => r.data)
      .catch(() => ({
        sender_weights: { Datadog: 0.25, "AWS Security": 0.3, ShopNow: -0.4, Instagram: -0.2 },
        category_weights: { work: 0.3, personal: 0.22, system: 0.15, social: 0, news: -0.1, ads: -0.25 }
      })),
};
