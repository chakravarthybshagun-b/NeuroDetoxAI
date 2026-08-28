import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { api } from "../api";

const COLORS = {
  critical: "#ff4d6d",
  high:     "#ff9f1c",
  medium:   "#ffe66d",
  low:      "#06d6a0",
};

const CAT_COLORS = ["#6c63ff", "#06d6a0", "#ff9f1c", "#ff4d6d", "#818cf8", "#38bdf8"];

export default function PatternInsights({ notifications = [] }) {
  const [weights, setWeights] = useState(null);

  useEffect(() => {
    api.getWeights().then((res) => {
      if (res) setWeights(res);
    }).catch(() => {});
  }, [notifications]);

  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  if (safeNotifications.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📈</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
          No AI Pattern Data Yet
        </div>
        <p style={{ fontSize: 13, color: "var(--muted)", maxWidth: 400, margin: "0 auto" }}>
          Head to the <strong>Simulate & Stream</strong> tab to generate sample notifications and visualize real-time priority distribution and sender weighting!
        </p>
      </div>
    );
  }

  // Priority distribution
  const priorityCount = { critical: 0, high: 0, medium: 0, low: 0 };
  safeNotifications.forEach((n) => {
    const lbl = (n?.priority_label || "low").toLowerCase();
    if (priorityCount[lbl] !== undefined) priorityCount[lbl]++;
  });
  const priorityData = Object.entries(priorityCount).map(([k, v]) => ({
    name: k.charAt(0).toUpperCase() + k.slice(1),
    count: v,
    fill: COLORS[k] || "#06d6a0",
  }));

  // Category distribution
  const catCount = {};
  safeNotifications.forEach((n) => {
    const cat = n?.category || "uncategorized";
    catCount[cat] = (catCount[cat] || 0) + 1;
  });
  const catData = Object.entries(catCount).map(([k, v]) => ({ name: k, value: v }));

  // Status distribution
  const statusCount = {};
  safeNotifications.forEach((n) => {
    const st = n?.status || "pending";
    statusCount[st] = (statusCount[st] || 0) + 1;
  });
  const statusData = Object.entries(statusCount).map(([k, v]) => ({ name: k, count: v }));

  // Top learned senders
  const senderWeights = weights?.sender_weights && typeof weights.sender_weights === "object" ? weights.sender_weights : {};
  const senderData = Object.entries(senderWeights)
    .sort((a, b) => (Number(b[1]) || 0) - (Number(a[1]) || 0))
    .slice(0, 8)
    .map(([sender, w]) => {
      const numW = typeof w === "number" ? w : parseFloat(w) || 0;
      return {
        sender: String(sender || "").split(" ")[0] || "Sender",
        weight: parseFloat(numW.toFixed(3)),
      };
    });

  return (
    <div>
      <h2 style={{ marginBottom: 16, fontSize: 18, fontWeight: 700 }}>📈 AI Pattern Insights</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 16 }}>
        {/* Priority Bar Chart */}
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Priority Distribution</div>
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#8892b0" }} />
                <YAxis tick={{ fontSize: 11, fill: "#8892b0" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8 }}
                  labelStyle={{ color: "var(--text)" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie */}
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Category Mix</div>
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catData} dataKey="value" nameKey="name" outerRadius={65} paddingAngle={3}>
                  {catData.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8 }}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Notification Status Breakdown</div>
        <div style={{ width: "100%", height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: "#8892b0" }} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#8892b0" }} width={80} />
              <Tooltip
                contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8 }}
              />
              <Bar dataKey="count" fill="var(--cyan)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Learned Sender Weights */}
      {senderData.length > 0 && (
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>🧠 Learned Sender Weights</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>
            Positive = AI boosts sender priority based on user engagement. Negative = AI suppresses low-value senders.
          </div>
          {senderData.map(({ sender, weight }) => (
            <div key={sender} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ width: 100, fontSize: 12, color: "var(--text)", flexShrink: 0 }}>{sender}</span>
              <div style={{ flex: 1, background: "var(--surface2)", borderRadius: 4, height: 8, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.min(100, Math.abs(weight) * 100)}%`,
                    height: "100%",
                    background: weight >= 0 ? "var(--low)" : "var(--critical)",
                    marginLeft: weight >= 0 ? "50%" : `${Math.max(0, 50 - Math.abs(weight) * 100)}%`,
                    borderRadius: 4,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <span style={{ width: 50, fontSize: 11, color: weight >= 0 ? "var(--low)" : "var(--critical)", textAlign: "right" }}>
                {weight > 0 ? "+" : ""}{weight}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
