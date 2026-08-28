import React, { useState } from "react";
import { Shield, Clock, Save } from "lucide-react";
import { api } from "../api";

export default function ScheduleManager({ config, onUpdate }) {
  const [cfg, setCfg] = useState(config || {
    focus_mode: false,
    focus_start: "09:00",
    focus_end: "12:00",
    batch_interval_minutes: 30,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await api.updateSchedule(cfg);
    onUpdate(cfg);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>⚙️ Focus & Schedule Settings</h2>
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Focus Mode Toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
              <Shield size={16} color="var(--accent)" /> Focus Mode
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
              Low & medium notifications will be batched during focus hours
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={cfg.focus_mode}
              onChange={(e) => setCfg({ ...cfg, focus_mode: e.target.checked })}
            />
            <span className="slider" />
          </label>
        </div>

        {/* Focus Hours */}
        <div
          style={{
            opacity: cfg.focus_mode ? 1 : 0.4,
            pointerEvents: cfg.focus_mode ? "auto" : "none",
            transition: "opacity 0.3s",
          }}
        >
          <div style={{ marginBottom: 8, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={14} /> Focus Window
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ fontSize: 13, color: "var(--muted)" }}>
              From
              <input
                type="time"
                value={cfg.focus_start}
                onChange={(e) => setCfg({ ...cfg, focus_start: e.target.value })}
                style={inputStyle}
              />
            </label>
            <label style={{ fontSize: 13, color: "var(--muted)" }}>
              To
              <input
                type="time"
                value={cfg.focus_end}
                onChange={(e) => setCfg({ ...cfg, focus_end: e.target.value })}
                style={inputStyle}
              />
            </label>
          </div>
        </div>

        {/* Batch Interval */}
        <div
          style={{
            opacity: cfg.focus_mode ? 1 : 0.4,
            pointerEvents: cfg.focus_mode ? "auto" : "none",
            transition: "opacity 0.3s",
          }}
        >
          <div style={{ marginBottom: 8, fontWeight: 500 }}>
            Batch Delivery Interval
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="range"
              min={5}
              max={120}
              step={5}
              value={cfg.batch_interval_minutes}
              onChange={(e) => setCfg({ ...cfg, batch_interval_minutes: +e.target.value })}
              style={{ flex: 1, accentColor: "var(--accent)" }}
            />
            <span style={{ minWidth: 80, fontSize: 13 }}>
              {cfg.batch_interval_minutes} minutes
            </span>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
            Batched notifications will be grouped and delivered after this interval
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSave} style={{ alignSelf: "flex-start" }}>
          <Save size={14} />
          {saved ? "Saved ✓" : "Save Settings"}
        </button>
      </div>

      {/* Focus Mode Status Card */}
      {cfg.focus_mode && (
        <div
          className="card"
          style={{ marginTop: 12, borderColor: "var(--accent)", background: "rgba(108,99,255,.08)" }}
        >
          <div style={{ fontWeight: 600, color: "var(--accent)", marginBottom: 6 }}>
            🛡️ Focus Mode Active
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            During {cfg.focus_start}–{cfg.focus_end}, low and medium priority notifications
            will be batched and delivered every {cfg.batch_interval_minutes} minutes.
            Only <strong>critical</strong> and <strong>high</strong> priority alerts will break through.
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  display: "block",
  marginTop: 4,
  background: "var(--surface2)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  color: "var(--text)",
  padding: "6px 10px",
  fontSize: 13,
};
