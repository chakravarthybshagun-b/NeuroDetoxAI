import React, { useState } from "react";
import { CheckCheck, X, Clock, User, ChevronDown, ChevronUp, Sparkles, Tag } from "lucide-react";
import { api } from "../api";

const LABELS = {
  critical: "badge badge-critical",
  high:     "badge badge-high",
  medium:   "badge badge-medium",
  low:      "badge badge-low",
};

const EMOJI = {
  work: "💼", social: "👥", news: "📰", ads: "📢", system: "⚙️", personal: "🧑",
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

function NotificationItem({ n, onAction }) {
  const [showReasoning, setShowReasoning] = useState(false);
  const isActionable = ["delivered", "pending", "batched"].includes(n.status);

  return (
    <div
      className="card"
      style={{
        marginBottom: 10,
        borderLeft: `4px solid ${
          n.priority_label === "critical" ? "var(--critical)"
          : n.priority_label === "high"   ? "var(--high)"
          : n.priority_label === "medium" ? "var(--medium)"
          : "var(--low)"
        }`,
        opacity: ["dismissed", "opened", "snoozed"].includes(n.status) ? 0.55 : 1,
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        {/* Left Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{n.title}</span>
            <span className={LABELS[n.priority_label] || "badge"}>{n.priority_label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)" }}>
              Score: <strong style={{ color: "var(--text)" }}>{n.priority_score}</strong>/100
            </span>
          </div>

          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8, lineHeight: 1.4 }}>{n.body}</p>

          <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--muted)", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <User size={11} /> {n.sender}
            </span>
            <span>{EMOJI[n.category]} {n.category}</span>
            <span>{timeAgo(n.timestamp)}</span>
            
            {n.status === "batched" && (
              <span style={{ color: "var(--medium)", background: "rgba(255,230,109,0.1)", padding: "1px 8px", borderRadius: 10, fontWeight: 600 }}>
                ⏳ Batched for Focus Protection
              </span>
            )}

            {/* Explain AI Button */}
            {n.ai_reasoning && (
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                style={{
                  background: "rgba(108,99,255,0.12)",
                  border: "1px solid rgba(108,99,255,0.3)",
                  borderRadius: 12,
                  color: "var(--accent)",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "1px 8px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Sparkles size={11} />
                {showReasoning ? "Hide AI Reasoning" : "Explain AI Score"}
                {showReasoning ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
            )}
          </div>

          {/* AI Reasoning Drawer */}
          {showReasoning && n.ai_reasoning && (
            <div
              style={{
                marginTop: 10,
                padding: "10px 14px",
                background: "var(--surface2)",
                borderRadius: 8,
                border: "1px solid var(--border)",
                fontSize: 11,
              }}
            >
              <div style={{ fontWeight: 600, color: "var(--accent)", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <Sparkles size={12} /> AI Scoring Breakdown:
              </div>
              <div style={{ color: "var(--text)", marginBottom: 6 }}>
                {n.ai_reasoning.explanation}
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", color: "var(--muted)", paddingTop: 4, borderTop: "1px solid var(--border)" }}>
                <span>Base: <strong>{n.ai_reasoning.base_score}</strong></span>
                <span>Category Bias: <strong>{n.ai_reasoning.category_bias > 0 ? `+${n.ai_reasoning.category_bias}` : n.ai_reasoning.category_bias}</strong></span>
                <span>Semantic Urgency: <strong>{n.ai_reasoning.urgency_semantic_score > 0 ? `+${n.ai_reasoning.urgency_semantic_score}` : n.ai_reasoning.urgency_semantic_score}</strong></span>
                <span>Sender Affinity: <strong>{n.ai_reasoning.sender_weight > 0 ? `+${n.ai_reasoning.sender_weight}` : n.ai_reasoning.sender_weight}</strong></span>
                {n.ai_reasoning.dnd_penalty !== 0 && (
                  <span>DND Penalty: <strong>{n.ai_reasoning.dnd_penalty}</strong></span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        {isActionable && (
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button
              className="btn btn-ghost"
              title="Open (Reinforces sender importance)"
              onClick={() => onAction(n.id, "open")}
            >
              <CheckCheck size={13} color="var(--low)" />
            </button>
            <button
              className="btn btn-ghost"
              title="Snooze"
              onClick={() => onAction(n.id, "snooze")}
            >
              <Clock size={13} color="var(--medium)" />
            </button>
            <button
              className="btn btn-ghost"
              title="Dismiss (Penalizes sender importance)"
              onClick={() => onAction(n.id, "dismiss")}
            >
              <X size={13} color="var(--critical)" />
            </button>
          </div>
        )}
        {!isActionable && (
          <span style={{ fontSize: 11, color: "var(--muted)", textTransform: "capitalize", padding: "4px 8px", background: "var(--surface2)", borderRadius: 6 }}>
            {n.status}
          </span>
        )}
      </div>
    </div>
  );
}

export default function NotificationFeed({ notifications, onRefresh }) {
  const handleAction = async (id, action) => {
    await api.doAction(id, action);
    onRefresh();
  };

  if (!notifications || notifications.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", color: "var(--muted)", padding: 48 }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>🔔</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Feed is quiet</div>
        <p style={{ fontSize: 12, marginTop: 4 }}>
          No incoming notifications yet. Head to the <strong>Simulate</strong> tab to send sample notifications or toggle the Real-Time Live Stream!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>
          🔔 Live Notification Stream
        </h2>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>
          {notifications.length} total notifications
        </span>
      </div>
      <div style={{ maxHeight: 560, overflowY: "auto", paddingRight: 4 }}>
        {notifications.map((n) => (
          <NotificationItem key={n.id} n={n} onAction={handleAction} />
        ))}
      </div>
    </div>
  );
}
