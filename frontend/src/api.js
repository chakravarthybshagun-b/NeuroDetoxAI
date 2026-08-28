import axios from "axios";

// API URL configuration
// 1. If VITE_API_URL env var is set (e.g., from Vercel), use it
// 2. Otherwise default to localhost for development
const DEFAULT_API_URL = import.meta.env.MODE === 'development' 
  ? "http://localhost:8000"
  : "/api"; // For same-domain deployment

const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
const BASE = API_URL;

// WebSocket URL - handle both same-domain and external backends
let WS_URL;
if (API_URL.startsWith("http://") || API_URL.startsWith("https://")) {
  // External backend (e.g., Railway)
  const protocol = API_URL.startsWith("https") ? "wss" : "ws";
  const wsHost = API_URL.replace(/^https?:\/\//, "");
  WS_URL = `${protocol}://${wsHost}/ws`;
} else {
  // Same-domain or relative backend
  const protocol = typeof window !== 'undefined' ? 
    (window.location.protocol === 'https:' ? 'wss' : 'ws') : 'ws';
  WS_URL = `${protocol}://${typeof window !== 'undefined' ? window.location.host : 'localhost:8000'}/ws`;
}

export { WS_URL };

export const api = {
  // Notifications
  getNotifications: (status) =>
    axios.get(`${BASE}/notifications`, { params: status ? { status } : {} }).then((r) => r.data),
  createNotification: (payload) =>
    axios.post(`${BASE}/notifications`, payload).then((r) => r.data),
  doAction: (id, action) =>
    axios.post(`${BASE}/notifications/${id}/action`, { notification_id: id, action }).then((r) => r.data),
  clearAll: () => axios.delete(`${BASE}/notifications`).then((r) => r.data),

  // Simulation & Stream
  simulate: (count = 1) =>
    axios.post(`${BASE}/simulate`, null, { params: { count } }).then((r) => r.data),
  toggleStream: () =>
    axios.post(`${BASE}/simulate/stream/toggle`).then((r) => r.data),
  getStreamStatus: () =>
    axios.get(`${BASE}/simulate/stream/status`).then((r) => r.data),

  // Stats & Schedule
  getStats: () => axios.get(`${BASE}/stats`).then((r) => r.data),
  getSchedule: () => axios.get(`${BASE}/schedule`).then((r) => r.data),
  updateSchedule: (cfg) => axios.put(`${BASE}/schedule`, cfg).then((r) => r.data),

  // AI Weights
  getWeights: () => axios.get(`${BASE}/ai/weights`).then((r) => r.data),
};
