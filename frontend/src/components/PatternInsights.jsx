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

const CAT_COLORS = ["#6c63ff","#06d6a0","#ff9f1c","#ff4d6d","#818cf8","#38bdf8"];

export default function PatternInsights({ notifications }) {
  const [weights, setWeights] = useState(null);

  useEffect(() => {
    api.getWeights().then(setWeights).catch(() => {});
  }, [notifications]);

  if (!notifications || notifications.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
        📈 Generate some notifications to see AI patterns!
      </div>
    );
  }

  // Priority distribution
  const priorityCount = { critical: 0, high: 0, medium: 0, low: 0 };
  notifications.forEach((n) => {
    if (priorityCount[n.priority_label] !== undefined) priorityCount[n.priority_label]++;
  });
  const priorityData = Object.entries(priorityCount).map(([k, v]) => ({
    name: k.charAt(0).toUpperCase() + k.slice(1),
    count: v,
    fill: COLORS[k],
  }));

  // Category distribution
  const catCount = {};
  notifications.forEach((n) => { catCount[n.category] = (catCount[n.category] || 0) + 1; });
  const catData = Object.entries(catCount).map(([k, v]) => ({ name: k, value: v }));

  // Status distribution
  const statusCount = {};
  notifications.forEach((n) => { statusCount[n.status] = (statusCount[n.status] || 0) + 1; });
  const statusData = Object.entries(statusCount).map(([k, v]) => ({ name: k, count: v }));

  // Top learned senders
  const senderWeights = weights?.sender_weights || {};
  const senderData = Object.entries(senderWeights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([sender, w]) => ({ sender: sender.split(" ")[0], weight: parseFloat(w.toFixed(3)) }));

  return (
    <div>
      <h2 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>📈 AI Pattern Insights</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Priority Bar Chart */}
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Priority Distribution</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={priorityData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#8892b0" }} />
              <YAxis tick={{ fontSize: 11, fill: "#8892b0" }} />
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

        {/* Category Pie */}
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Category Mix</div>
          <ResponsiveContainer width="100%" height={180}>
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

      {/* Status Bar */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Notification Status Breakdown</div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={statusData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: "#8892b0" }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#8892b0" }} width={70} />
            <Tooltip
              contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8 }}
            />
            <Bar dataKey="count" fill="var(--accent)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Learned Sender Weights */}
      {senderData.length > 0 && (
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>🧠 Learned Sender Weights</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>
            Positive = AI boosts this sender's priority. Negative = AI suppresses it.
          </div>
          {senderData.map(({ sender, weight }) => (
            <div key={sender} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ width: 90, fontSize: 12, color: "var(--text)", flexShrink: 0 }}>{sender}</span>
              <div style={{ flex: 1, background: "var(--surface2)", borderRadius: 4, height: 8, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.abs(weight) * 100}%`,
                    height: "100%",
                    background: weight >= 0 ? "var(--low)" : "var(--critical)",
                    marginLeft: weight >= 0 ? "50%" : `${50 - Math.abs(weight) * 100}%`,
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
