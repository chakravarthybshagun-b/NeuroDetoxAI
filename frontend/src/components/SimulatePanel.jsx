import React, { useState } from "react";
import { Play, Trash2, Loader, Radio, Sparkles } from "lucide-react";
import { api } from "../api";

const CATEGORIES = ["work", "social", "news", "ads", "system", "personal"];

const PRESETS = [
  {
    title: "CRITICAL: Database connection pool exhausted",
    body: "Auth microservice latency > 4000ms. Immediate action required.",
    sender: "Datadog",
    category: "work",
    app: "Datadog",
    intent: "Security / Ops Emergency",
  },
  {
    title: "Security Alert: Unauthorized login attempt",
    body: "New login from unrecognized IP: 185.220.101.5. Check now.",
    sender: "AWS Security",
    category: "system",
    app: "AWS",
    intent: "Critical Security",
  },
  {
    title: "Sprint Review meeting in 10 minutes",
    body: "Google Meet link is live: meet.google.com/xyz-abc",
    sender: "Google Calendar",
    category: "work",
    app: "Calendar",
    intent: "Work Schedule",
  },
  {
    title: "Doctor appointment reminder",
    body: "Your dental checkup is scheduled tomorrow at 3:00 PM.",
    sender: "HealthApp",
    category: "personal",
    app: "Health",
    intent: "Personal Priority",
  },
  {
    title: "50% OFF Flash Sale ends in 2 hours!",
    body: "Exclusive discounts on noise-cancelling headphones. Buy now!",
    sender: "ShopNow",
    category: "ads",
    app: "ShopNow",
    intent: "Promotional Bait (Low)",
  },
  {
    title: "Alex liked your photo",
    body: "Alex and 18 others reacted to your story.",
    sender: "Instagram",
    category: "social",
    app: "Instagram",
    intent: "Passive Social (Low)",
  },
];

export default function SimulatePanel({ onRefresh, isStreaming, onToggleStream }) {
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [custom, setCustom] = useState({ title: "", body: "", sender: "", category: "work", app: "" });
  const [lastResult, setLastResult] = useState(null);

  const runSimulate = async () => {
    setLoading(true);
    try {
      const result = await api.simulate(count);
      setLastResult(result);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const sendPreset = async (preset) => {
    setLoading(true);
    try {
      await api.createNotification(preset);
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const sendCustom = async () => {
    if (!custom.title || !custom.sender) return;
    setLoading(true);
    try {
      await api.createNotification({ ...custom, app: custom.app || custom.sender });
      setCustom({ title: "", body: "", sender: "", category: "work", app: "" });
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const clearAll = async () => {
    await api.clearAll();
    setLastResult(null);
    onRefresh();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>🧪 Real-Time Simulation & AI Testbed</h2>
      </div>

      {/* Live Stream Ticker Card */}
      <div
        className="card"
        style={{
          marginBottom: 16,
          background: isStreaming ? "rgba(255, 77, 109, 0.08)" : "var(--surface)",
          borderColor: isStreaming ? "var(--critical)" : "var(--border)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15 }}>
              <Radio size={18} color={isStreaming ? "var(--critical)" : "var(--muted)"} />
              Real-Time Continuous Notification Stream
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              Pushes random real-world notifications every 4-6 seconds over WebSockets to demo live interception and prioritization.
            </div>
          </div>
          <button
            className="btn"
            style={{
              background: isStreaming ? "var(--critical)" : "var(--accent)",
              color: "#fff",
              fontWeight: 600,
            }}
            onClick={onToggleStream}
          >
            {isStreaming ? "⏹ Stop Live Stream" : "▶ Start Live Stream"}
          </button>
        </div>
      </div>

      {/* Manual Batch Simulate */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>Generate Quick Batch</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>Count:</span>
            <input
              type="number"
              min={1}
              max={10}
              value={count}
              onChange={(e) => setCount(Math.min(10, Math.max(1, +e.target.value)))}
              style={{ ...inputStyle, width: 60 }}
            />
          </div>
          <button className="btn btn-primary" onClick={runSimulate} disabled={loading}>
            {loading ? <Loader size={14} className="spin" /> : <Play size={14} />}
            Push {count} Notification{count > 1 ? "s" : ""}
          </button>
          <button className="btn btn-danger" onClick={clearAll}>
            <Trash2 size={14} /> Clear All State
          </button>
        </div>
      </div>

      {/* Intent-Based Preset Triggers */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Intent & Urgency Presets</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
          Click to test how the multi-stage AI classifies various linguistic triggers and intent categories.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {PRESETS.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "10px 12px",
                background: "var(--surface2)",
                borderRadius: 8,
                border: "1px solid var(--border)",
                gap: 8,
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{p.title}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                  {p.sender} · {p.category}
                </div>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 6,
                    fontSize: 10,
                    fontWeight: 600,
                    background: "rgba(108,99,255,0.15)",
                    color: "var(--accent)",
                    padding: "1px 6px",
                    borderRadius: 4,
                  }}
                >
                  Intent: {p.intent}
                </span>
              </div>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 12, alignSelf: "flex-end" }}
                onClick={() => sendPreset(p)}
                disabled={loading}
              >
                Send Now ➔
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Notification Form */}
      <div className="card">
        <div style={{ fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={16} color="var(--accent)" />
          Test Custom Notification with Real-Time AI Scoring
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <label style={labelStyle}>
            Title *
            <input
              style={inputStyle}
              placeholder="e.g. Critical Bug in Production Login"
              value={custom.title}
              onChange={(e) => setCustom({ ...custom, title: e.target.value })}
            />
          </label>
          <label style={labelStyle}>
            Sender *
            <input
              style={inputStyle}
              placeholder="e.g. Sentry / GitHub"
              value={custom.sender}
              onChange={(e) => setCustom({ ...custom, sender: e.target.value })}
            />
          </label>
          <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
            Body / Message Content
            <input
              style={inputStyle}
              placeholder="e.g. 500 internal server error impacting 40% of users. Urgent fix needed."
              value={custom.body}
              onChange={(e) => setCustom({ ...custom, body: e.target.value })}
            />
          </label>
          <label style={labelStyle}>
            Category Context
            <select
              style={{ ...inputStyle, width: "100%" }}
              value={custom.category}
              onChange={(e) => setCustom({ ...custom, category: e.target.value })}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label style={labelStyle}>
            App Name
            <input
              style={inputStyle}
              placeholder="e.g. Slack / Gmail / Jira"
              value={custom.app}
              onChange={(e) => setCustom({ ...custom, app: e.target.value })}
            />
          </label>
        </div>
        <button
          className="btn btn-primary"
          style={{ marginTop: 14 }}
          onClick={sendCustom}
          disabled={!custom.title || !custom.sender || loading}
        >
          <Play size={14} /> Send & Score with AI
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  marginTop: 4,
  background: "var(--surface2)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  color: "var(--text)",
  padding: "8px 10px",
  fontSize: 13,
  outline: "none",
};

const labelStyle = { fontSize: 12, color: "var(--muted)", fontWeight: 500 };
