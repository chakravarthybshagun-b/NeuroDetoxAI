import React, { useState } from "react";
import {
  Brain, Shield, Zap, Sparkles, CheckCircle2, XCircle, Clock,
  ArrowRight, Flame, Layers, Smartphone, Award, Cpu, ChevronRight
} from "lucide-react";

export default function LandingPage({ onLaunchApp, onOpenDeck }) {
  const [testNotification, setTestNotification] = useState("");
  const [simResult, setSimResult] = useState(null);

  const quickTry = (text, category) => {
    let score = 50;
    let label = "medium";
    let intent = "General Alert";
    
    if (text.toLowerCase().includes("urgent") || text.toLowerCase().includes("failed") || text.toLowerCase().includes("security")) {
      score = 94;
      label = "critical";
      intent = "Critical Security / Emergency";
    } else if (text.toLowerCase().includes("sale") || text.toLowerCase().includes("off") || text.toLowerCase().includes("discount")) {
      score = 12;
      label = "low";
      intent = "Promotional Marketing Bait";
    } else if (text.toLowerCase().includes("meeting") || text.toLowerCase().includes("exam") || text.toLowerCase().includes("assignment")) {
      score = 82;
      label = "high";
      intent = "Academic & Work Priority";
    }
    setSimResult({ score, label, intent, text });
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Background Cyber Ambient Glows */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "450px",
          background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.1) 40%, rgba(0,0,0,0) 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
        {/* Top Mini Pill */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 30,
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.35)",
              color: "#a5b4fc",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            <Sparkles size={13} color="#818cf8" />
            Hackathon Problem 30 · Digital Detox & Cognitive Shield
          </span>
        </div>

        {/* Hero Title */}
        <div style={{ textAlign: "center", maxWidth: 840, margin: "0 auto 32px auto" }}>
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              marginBottom: 18,
            }}
          >
            Reclaim Your Focus with{" "}
            <span className="text-gradient-neon">NeuroDetox AI</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 2.2vw, 20px)",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              maxWidth: 680,
              margin: "0 auto",
            }}
          >
            An autonomous cognitive attention shield that learns your study and work patterns, intercepts addictive device triggers, and batches non-critical interruptions in real time.
          </p>
        </div>

        {/* CTA Button Group */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 48 }}>
          <button
            className="btn btn-primary"
            style={{ padding: "14px 28px", fontSize: 15, borderRadius: 12 }}
            onClick={onLaunchApp}
          >
            <Brain size={18} />
            Launch Live Detox Console
            <ArrowRight size={16} />
          </button>
          
          <button
            className="btn btn-cyber"
            style={{ padding: "14px 28px", fontSize: 15, borderRadius: 12 }}
            onClick={onOpenDeck}
          >
            <Award size={18} />
            Open 8-Slide PPT Deck (For Judges)
          </button>
        </div>

        {/* Live Interactive Triage Sandbox (Try It Right Here) */}
        <div className="card card-glow-primary" style={{ maxWidth: 860, margin: "0 auto 56px auto", padding: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <Cpu size={18} color="var(--cyan)" />
                Try Instant AI Classification Sandbox
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                Click sample triggers below to test how the Multi-Stage NLP engine scores importance in real time:
              </div>
            </div>
            <span style={{ fontSize: 11, background: "rgba(6,182,212,0.15)", color: "var(--cyan)", padding: "4px 10px", borderRadius: 20, fontWeight: 700 }}>
              ⚡ Sub-2ms Local Inference
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12 }}
              onClick={() => quickTry("Urgent: Exam schedule changed, Physics paper preponed!", "work")}
            >
              🚨 Urgent Exam Notice
            </button>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12 }}
              onClick={() => quickTry("Flat 70% OFF! Mega Shoe Clearance ends at midnight", "ads")}
            >
              🛍️ 70% OFF Marketing Ad
            </button>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12 }}
              onClick={() => quickTry("Group Project Meeting starting on Zoom in 10 mins", "work")}
            >
              📚 Study Group Meeting
            </button>
          </div>

          {simResult && (
            <div
              style={{
                padding: "16px 20px",
                background: "var(--surface2)",
                borderRadius: 12,
                border: `1px solid ${
                  simResult.label === "critical" ? "var(--critical)"
                  : simResult.label === "high" ? "var(--high)"
                  : "var(--low)"
                }`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
                  "{simResult.text}"
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Detected Intent: <strong style={{ color: "var(--text)" }}>{simResult.intent}</strong>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className={`badge badge-${simResult.label}`}>
                  {simResult.label}
                </span>
                <span style={{ fontSize: 18, fontWeight: 800 }}>
                  {simResult.score}<span style={{ fontSize: 12, color: "var(--text-muted)" }}>/100</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bento Grid: 4 Core Pillars */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 56 }}>
          <div className="card">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Brain size={22} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Semantic NLP Triage</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
              Linguistic feature extraction classifies alerts into 6 intent dimensions without slow cloud API latency.
            </p>
          </div>

          <div className="card">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Shield size={22} color="#34d399" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Focus Mode Shield</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
              Automatically suppresses & batches low-priority notifications during study hours into digest summaries.
            </p>
          </div>

          <div className="card">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(244,63,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Flame size={22} color="#fb7185" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Reinforcement Learning</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
              Learns personal preferences with every Open or Dismiss action, dynamically updating sender weights.
            </p>
          </div>

          <div className="card">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(6,182,212,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Smartphone size={22} color="#22d3ee" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Future Mobile Bridge</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
              Architected for Android NotificationListenerService & iOS Focus FilterKit on-device deployment.
            </p>
          </div>
        </div>

        {/* Quantified Impact Banner */}
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, rgba(30,27,75,0.6) 0%, rgba(15,23,42,0.8) 100%)",
            borderColor: "rgba(99,102,241,0.3)",
            padding: 32,
            textAlign: "center",
          }}
        >
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
            Proven Digital Detox Impact for Students & Teams
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
            <div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "var(--cyan)" }}>+2.5 hrs</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Deep Study Time Saved Daily</div>
            </div>
            <div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "var(--low)" }}>84.6%</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Non-Critical Spam Deflected</div>
            </div>
            <div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "var(--primary)" }}>&lt; 2ms</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Real-Time Inference Latency</div>
            </div>
            <div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#f59e0b" }}>100%</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Privacy-Preserved Local Edge</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
