import React from "react";
import {
  Brain, Bell, CheckCircle, XCircle, Clock, Zap, ShieldCheck, Activity,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, color, subtitle }) {
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: 44, height: 44, borderRadius: 10,
          background: color + "22",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>{label}</div>
        {subtitle && <div style={{ fontSize: 10, color, marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  );
}

function FocusRing({ score, reductionPct }) {
  const r = 50;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 70 ? "var(--low)" : score >= 40 ? "var(--medium)" : "var(--critical)";

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, position: "relative", overflow: "hidden" }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Digital Wellness Index</span>
        <span style={{ fontSize: 11, background: "rgba(6,214,160,0.12)", color: "var(--low)", padding: "2px 8px", borderRadius: 12 }}>
          ⚡ {reductionPct || 0}% Interruptions Deflected
        </span>
      </div>
      
      <div style={{ position: "relative", marginTop: 8 }}>
        <svg width={140} height={140} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={70} cy={70} r={r} fill="none" stroke="var(--border)" strokeWidth={12} />
          <circle
            cx={70} cy={70} r={r}
            fill="none"
            stroke={color}
            strokeWidth={12}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.5s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Score</div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "var(--text)", textAlign: "center", maxWidth: 280, fontWeight: 500 }}>
        {score >= 75
          ? "🎯 Peak Deep Work: Distractions actively minimized."
          : score >= 45
          ? "⚠️ Moderate Focus: Some non-critical alerts received."
          : "🔴 Low Detox State: High immediate interruptions."}
      </p>
    </div>
  );
}

export default function Dashboard({ stats, isStreaming }) {
  if (!stats) return <div style={{ color: "var(--muted)" }}>Loading stats…</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
          📊 Real-Time Focus Metrics
        </h2>
        {isStreaming && (
          <span style={{ fontSize: 12, color: "#ff4d6d", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff4d6d", display: "inline-block", animation: "pulse 1.5s infinite" }} />
            Live Incoming Stream Active
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <StatCard icon={Bell}        label="Total Ingested"   value={stats.total}                      color="#6c63ff" />
        <StatCard icon={Zap}         label="Immediate Pass"   value={stats.delivered}                  color="#06d6a0" subtitle="Critical alerts" />
        <StatCard icon={Clock}       label="Batched by AI"    value={stats.batched}                    color="#ffe66d" subtitle="DND protection" />
        <StatCard icon={XCircle}     label="Dismissed"        value={stats.dismissed}                  color="#ff4d6d" subtitle="Learned penalty" />
        <StatCard icon={CheckCircle} label="Opened"           value={stats.opened}                     color="#ff9f1c" subtitle="Learned boost" />
        <StatCard icon={Brain}       label="Avg AI Score"     value={stats.avg_priority}               color="#818cf8" subtitle="Dynamic priority" />
      </div>

      <FocusRing score={stats.focus_score} reductionPct={stats.distraction_reduction_pct} />

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
