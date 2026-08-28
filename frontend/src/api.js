import axios from "axios";

const BASE = "http://localhost:8000";
export const WS_URL = "ws://localhost:8000/ws";

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
