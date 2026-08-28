import React, { useState, useEffect, useCallback, useRef } from "react";
import LandingPage from "./components/LandingPage";
import PresentationDeck from "./components/PresentationDeck";
import Dashboard from "./components/Dashboard";
import NotificationFeed from "./components/NotificationFeed";
import ScheduleManager from "./components/ScheduleManager";
import PatternInsights from "./components/PatternInsights";
import SimulatePanel from "./components/SimulatePanel";
import { api, WS_URL } from "./api";
import {
  Brain, Bell, BarChart2, Settings, FlaskConical, RefreshCw,
  Award, Sparkles, Wifi, WifiOff, Home
} from "lucide-react";

const TABS = [
  { id: "landing",     label: "Home",             icon: Home },
  { id: "dashboard",   label: "Dashboard",        icon: Brain },
  { id: "feed",        label: "Live Feed",        icon: Bell },
  { id: "insights",    label: "AI Insights",      icon: BarChart2 },
  { id: "schedule",    label: "Focus Shield",     icon: Settings },
  { id: "simulate",    label: "Simulate & Stream",icon: FlaskConical },
  { id: "deck",        label: "Presentation PPT", icon: Award },
];

export default function App() {
  const [tab, setTab] = useState("landing");
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [scheduleConfig, setScheduleConfig] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const wsRef = useRef(null);

  const showToast = (title, message, type = "info") => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const [notifs, statsData, cfg, streamInfo] = await Promise.all([
        api.getNotifications(),
        api.getStats(),
        api.getSchedule(),
        api.getStreamStatus(),
      ]);
      setNotifications(notifs);
      setStats(statsData);
      setScheduleConfig(cfg);
      setIsStreaming(streamInfo.streaming);
    } catch (e) {
      setError("Cannot reach backend server. Ensure FastAPI is running on port 8000.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  // WebSocket Connection Management
  useEffect(() => {
    let ws;
    let reconnectTimer;
    let isMounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    const connectWS = () => {
      if (retryCount >= MAX_RETRIES) {
        console.warn("Max WebSocket reconnection attempts reached. Backend may be unavailable.");
        setWsConnected(false);
        setBackendAvailable(false);
        return;
      }

      try {
        ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          setWsConnected(true);
          setBackendAvailable(true);
          setError(null);
          retryCount = 0; // Reset retry count on successful connection
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === "INITIAL_STATE") {
              setStats(msg.data.stats);
              setNotifications(msg.data.notifications);
              setScheduleConfig(msg.data.schedule);
            } else if (msg.type === "NOTIFICATION_ARRIVED") {
              const { notification, stats } = msg.data;
              setNotifications((prev) => [notification, ...prev.filter(n => n.id !== notification.id)]);
              setStats(stats);
              if (notification.priority_label === "critical") {
                showToast("🚨 Critical Alert Passed Through", notification.title, "critical");
              }
            } else if (msg.type === "ACTION_PROCESSED") {
              const { notification, stats } = msg.data;
              setNotifications((prev) => prev.map(n => n.id === notification.id ? notification : n));
              setStats(stats);
            } else if (msg.type === "CLEARED_ALL") {
              setNotifications([]);
              setStats(msg.data.stats);
            } else if (msg.type === "SCHEDULE_UPDATED") {
              setScheduleConfig(msg.data.schedule);
            } else if (msg.type === "STREAM_STATUS") {
              setIsStreaming(msg.data.streaming);
            }
          } catch (err) {
            console.error("WS Parse Error:", err);
          }
        };

        ws.onclose = () => {
          setWsConnected(false);
          retryCount++;
          if (isMounted && retryCount < MAX_RETRIES) {
            reconnectTimer = setTimeout(connectWS, 3000);
          } else if (retryCount >= MAX_RETRIES) {
            setBackendAvailable(false);
          }
        };

        ws.onerror = () => {
          setWsConnected(false);
        };
      } catch (err) {
        console.error("WebSocket connection error:", err);
        retryCount++;
        if (isMounted && retryCount < MAX_RETRIES) {
          reconnectTimer = setTimeout(connectWS, 3000);
        } else if (retryCount >= MAX_RETRIES) {
          setBackendAvailable(false);
        }
      }
    };

    connectWS();
    refreshAll();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimer);
      if (ws) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        } else if (ws.readyState === WebSocket.CONNECTING) {
          ws.onopen = () => {
            ws.close();
          };
        }
      }
    };
  }, [refreshAll]);

  const handleToggleStream = async () => {
    try {
      const res = await api.toggleStream();
      setIsStreaming(res.streaming);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: toast.type === "critical" ? "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)" : "var(--primary)",
            color: "#fff",
            padding: "14px 20px",
            borderRadius: 12,
            boxShadow: "0 15px 35px rgba(0,0,0,0.5), 0 0 20px rgba(244,63,94,0.3)",
            zIndex: 1000,
            animation: "slideIn 0.3s ease",
            maxWidth: 340,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 13 }}>{toast.title}</div>
          <div style={{ fontSize: 12, opacity: 0.95, marginTop: 3 }}>{toast.message}</div>
        </div>
      )}

      {/* Futuristic Header */}
      <header
        style={{
          background: "rgba(19, 24, 37, 0.8)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Brand Logo & Name */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
          onClick={() => setTab("landing")}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
            }}
          >
            🧠
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2, letterSpacing: "-0.3px" }}>
              <span className="text-gradient-neon">NeuroDetox</span>{" "}
              <span style={{ color: "var(--text)" }}>AI</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
              Problem 30 · Cognitive Attention Shield
            </div>
          </div>
        </div>

        {/* Header Badges & Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* WebSocket Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              padding: "5px 12px",
              borderRadius: 20,
              background: wsConnected ? "rgba(16,185,129,0.12)" : backendAvailable ? "rgba(249,115,22,0.12)" : "rgba(244,63,94,0.12)",
              color: wsConnected ? "var(--low)" : backendAvailable ? "var(--high)" : "var(--critical)",
              border: `1px solid ${wsConnected ? "rgba(16,185,129,0.3)" : backendAvailable ? "rgba(249,115,22,0.3)" : "rgba(244,63,94,0.3)"}`,
              fontWeight: 700,
            }}
          >
            {wsConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
            {wsConnected ? "Real-Time WS Active" : backendAvailable ? "Connecting..." : "Backend Offline"}
          </div>

          {/* Focus Mode Pill */}
          {scheduleConfig?.focus_mode && (
            <span
              style={{
                fontSize: 11,
                background: "rgba(99,102,241,0.18)",
                color: "#a5b4fc",
                border: "1px solid rgba(99,102,241,0.4)",
                borderRadius: 20,
                padding: "5px 12px",
                fontWeight: 700,
              }}
            >
              🛡️ Focus Shield Active
            </span>
          )}

          <button
            className="btn btn-ghost"
            style={{ padding: "8px 14px", fontSize: 12 }}
            onClick={refreshAll}
            disabled={refreshing}
            title="Sync State"
          >
            <RefreshCw size={12} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
            {refreshing ? "Syncing…" : "Sync"}
          </button>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav
        style={{
          background: "rgba(19, 24, 37, 0.5)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          gap: 4,
          padding: "0 24px",
          overflowX: "auto",
        }}
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "13px 18px",
              color: tab === id ? "var(--cyan)" : "var(--text-muted)",
              borderBottom: tab === id ? "2px solid var(--cyan)" : "2px solid transparent",
              fontWeight: tab === id ? 700 : 500,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 7,
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            <Icon size={14} color={tab === id ? "var(--cyan)" : "var(--text-dim)"} />
            {label}
            {id === "feed" && notifications.length > 0 && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: "var(--surface2)",
                  padding: "2px 7px",
                  borderRadius: 10,
                  color: "var(--text)",
                }}
              >
                {notifications.length}
              </span>
            )}
            {id === "deck" && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
                  color: "#fff",
                  padding: "1px 6px",
                  borderRadius: 4,
                  textTransform: "uppercase",
                }}
              >
                Judge PPT
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Main Container */}
      <main style={{ maxWidth: tab === "landing" ? "100%" : 980, margin: "0 auto", padding: tab === "landing" ? 0 : "28px 20px" }}>
        {error && tab !== "landing" && (
          <div
            style={{
              background: "rgba(244,63,94,0.12)",
              border: "1px solid var(--critical)",
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 20,
              fontSize: 13,
              color: "var(--critical)",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {tab === "landing"    && <LandingPage onLaunchApp={() => setTab("dashboard")} onOpenDeck={() => setTab("deck")} />}
        {tab === "deck"       && <PresentationDeck onLaunchApp={() => setTab("feed")} />}
        {tab === "dashboard"  && <Dashboard stats={stats} isStreaming={isStreaming} />}
        {tab === "feed"       && <NotificationFeed notifications={notifications} onRefresh={refreshAll} />}
        {tab === "insights"   && <PatternInsights notifications={notifications} />}
        {tab === "schedule"   && <ScheduleManager config={scheduleConfig} onUpdate={setScheduleConfig} />}
        {tab === "simulate"   && (
          <SimulatePanel
            onRefresh={refreshAll}
            isStreaming={isStreaming}
            onToggleStream={handleToggleStream}
          />
        )}
      </main>

      {/* Footer */}
      {tab !== "landing" && (
        <footer
          style={{
            textAlign: "center",
            padding: "28px",
            fontSize: 12,
            color: "var(--text-dim)",
            borderTop: "1px solid var(--border)",
            marginTop: 48,
          }}
        >
          NeuroDetox AI · Problem Statement 30 · Cognitive Attention Shield for Digital Well-Being
        </footer>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
