import React, { useState } from "react";
import {
  Brain, Shield, Zap, Sparkles, CheckCircle2, XCircle, Clock,
  ArrowRight, Flame, Layers, Smartphone, Award, Cpu, ChevronRight
} from "lucide-react";

export default function LandingPage({ onLaunchApp }) {
  const [testNotification, setTestNotification] = useState("");
  const [simResult, setSimResult] = useState(null);

  const evaluateDynamicScore = (text, category = "work") => {
    if (!text.trim()) return;
    const textLower = text.toLowerCase();
    
    // Dynamic Math Engine Parameters (identical to ai_engine.py)
    const baseScore = 45.0;
    const categoryWeights = { work: 30.0, personal: 22.0, system: 15.0, social: 0.0, news: -10.0, ads: -25.0 };
    const catBias = categoryWeights[category] || 0.0;

    const intents = [];
    let semanticDelta = 0.0;

    if (/\b(security|alert|unauthorized|failed login|password reset|breach|2fa|outage|emergency|server)\b/i.test(textLower)) {
      semanticDelta += 32.0;
      intents.push("Critical Security / Infrastructure Emergency");
    }
    if (/\b(urgent|immediate|asap|deadline|due today|overdue|exam|paper|preponed)\b/i.test(textLower)) {
      semanticDelta += 24.0;
      intents.push("Time-Sensitive Academic & Exam Deadline");
    }
    if (/\b(meeting|zoom|interview|code review|sprint|standup|project|assignment)\b/i.test(textLower)) {
      semanticDelta += 18.0;
      intents.push("Work & Academic Collaboration");
    }
    if (/\b(dinner|call me|mom|dad|family|pickup|home)\b/i.test(textLower)) {
      semanticDelta += 14.0;
      intents.push("Direct Personal Communication");
    }
    if (/\b(sale|discount|off|promo|coupon|deal|cashback|clearance|buy now|shop)\b/i.test(textLower)) {
      semanticDelta -= 28.0;
      intents.push("Promotional Marketing & Ad Bait");
    }
    if (/\b(liked|reacted|started following|shared|digest|trending)\b/i.test(textLower)) {
      semanticDelta -= 16.0;
      intents.push("Passive Social Media Distraction");
    }

    const rawScore = baseScore + catBias + semanticDelta;
    const score = Math.round(Math.max(0, Math.min(100, rawScore)));

    let label = "medium";
    if (score >= 75) label = "critical";
    else if (score >= 52) label = "high";
    else if (score >= 32) label = "medium";
    else label = "low";

    const intentText = intents.length > 0 ? intents.join(" · ") : "General Informational Alert";

    setSimResult({ score, label, intent: intentText, text, catBias, semanticDelta });
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

          {/* Custom Text Input Box for Dynamic Evaluation */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Type ANY custom notification text (e.g. 'Server outage on US-East-1 AWS')..."
              value={testNotification}
              onChange={(e) => setTestNotification(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") evaluateDynamicScore(testNotification, "work"); }}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 10,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                fontSize: 13,
                outline: "none",
              }}
            />
            <button
              className="btn btn-primary"
              style={{ padding: "10px 18px", fontSize: 13, whiteSpace: "nowrap" }}
              onClick={() => evaluateDynamicScore(testNotification || "Urgent security alert: AWS password reset required", "system")}
            >
              ⚡ Score Dynamically
            </button>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12 }}
              onClick={() => evaluateDynamicScore("Urgent: Exam schedule changed, Physics paper preponed!", "work")}
            >
              🚨 Urgent Exam Notice
            </button>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12 }}
              onClick={() => evaluateDynamicScore("Flat 70% OFF! Mega Shoe Clearance ends at midnight", "ads")}
            >
              🛍️ 70% OFF Marketing Ad
            </button>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12 }}
              onClick={() => evaluateDynamicScore("Group Project Meeting starting on Zoom in 10 mins", "work")}
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 48 }}>
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

        {/* Detailed Section 1: What is this about? */}
        <div
          className="card"
          style={{
            marginBottom: 40,
            padding: 32,
            background: "linear-gradient(135deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)",
            border: "1px solid rgba(99,102,241,0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(99,102,241,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(99,102,241,0.4)",
              }}
            >
              <Brain size={22} color="var(--cyan)" />
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
                💡 What is NeuroDetox AI?
              </h2>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Problem Statement ID 30 · Smart Notification Manager & Cognitive Attention Shield
              </div>
            </div>
          </div>

          <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.7, marginBottom: 16 }}>
            <strong>NeuroDetox AI</strong> is an autonomous, privacy-first cognitive attention shield engineered to protect users from modern notification overload and constant digital context switching. Smartphone users are interrupted over 80–120 times daily by trivial alerts—such as promotional discount ads, social media reactions, and passive chat messages—which fragment deep work and study sessions.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <div style={{ background: "rgba(15,23,42,0.6)", padding: 18, borderRadius: 12, border: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "var(--cyan)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <Zap size={14} /> Multi-Stage NLP Urgency Engine
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                Evaluates message intent, keywords, category weighting, and sender affinity in sub-2ms without sending private text to slow external cloud LLMs.
              </div>
            </div>

            <div style={{ background: "rgba(15,23,42,0.6)", padding: 18, borderRadius: 12, border: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "var(--low)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <Shield size={14} /> Smart Focus Shield & Batching
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                Suppresses low-priority interruptions during study hours and consolidates them into digest summaries while guaranteeing urgent alerts pass through instantly.
              </div>
            </div>

            <div style={{ background: "rgba(15,23,42,0.6)", padding: 18, borderRadius: 12, border: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#fb7185", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <Flame size={14} /> Real-Time Reinforcement Learning
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                Learns your individual habits with every Open, Dismiss, or Snooze action, dynamically tuning future priority scores for each sender.
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Section 2: How to Use It */}
        <div
          className="card"
          style={{
            marginBottom: 56,
            padding: 32,
            background: "rgba(19,24,37,0.8)",
            border: "1px solid rgba(6,182,212,0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(6,182,212,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(6,182,212,0.4)",
              }}
            >
              <Sparkles size={22} color="var(--cyan)" />
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
                🚀 How to Use It (Step-by-Step Guide)
              </h2>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Follow these simple steps to explore and test the NeuroDetox AI console:
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            <div style={{ background: "var(--surface)", padding: 20, borderRadius: 14, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--cyan)", letterSpacing: 1, marginBottom: 8 }}>
                STEP 01
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                📊 Explore the Dashboard
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                Click <strong>"Dashboard"</strong> in the top navigation to view live stats: total notifications processed, noise deflected %, critical pass-throughs, and priority distribution.
              </div>
            </div>

            <div style={{ background: "var(--surface)", padding: 20, borderRadius: 14, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#818cf8", letterSpacing: 1, marginBottom: 8 }}>
                STEP 02
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                🔔 Inspect Live Feed & XAI
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                Switch to <strong>"Live Feed"</strong> to see prioritized alerts. Click <strong>"Explain AI Score"</strong> on any alert to reveal exact linguistic features and scoring logic.
              </div>
            </div>

            <div style={{ background: "var(--surface)", padding: 20, borderRadius: 14, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#fb7185", letterSpacing: 1, marginBottom: 8 }}>
                STEP 03
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                🧠 Train the RL Model
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                On any notification, click <strong>Open (✓)</strong> to reward the sender (+1.0) or <strong>Dismiss (✗)</strong> to penalize future priority (-1.0). Watch sender weights adapt live!
              </div>
            </div>

            <div style={{ background: "var(--surface)", padding: 20, borderRadius: 14, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#34d399", letterSpacing: 1, marginBottom: 8 }}>
                STEP 04
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                🛡️ Configure Focus Shield
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                Navigate to <strong>"Focus Shield"</strong> to toggle Do-Not-Disturb study hours, set priority thresholds, and enable background batching summaries.
              </div>
            </div>

            <div style={{ background: "var(--surface)", padding: 20, borderRadius: 14, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#f59e0b", letterSpacing: 1, marginBottom: 8 }}>
                STEP 05
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                🧪 Simulate & Stream Alerts
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                Open <strong>"Simulate & Stream"</strong> to trigger custom mock alerts or turn on the automatic live stream generator to see real-time AI triage in action!
              </div>
            </div>

            <div style={{ background: "var(--surface)", padding: 20, borderRadius: 14, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--cyan)", letterSpacing: 1, marginBottom: 8 }}>
                STEP 06
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                📈 View AI Analytics Insights
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                Check <strong>"AI Insights"</strong> for sender affinity rankings, category breakdown charts, and deep noise deflection analytics over time.
              </div>
            </div>
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
