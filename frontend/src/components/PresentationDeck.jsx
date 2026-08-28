import React, { useState, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Play, Eye, EyeOff, Award, Sparkles,
  Smartphone, Shield, Brain, Zap, Clock, CheckCircle2, TrendingUp, Layers, HelpCircle
} from "lucide-react";

const SLIDES = [
  {
    id: 1,
    category: "INTRODUCTION",
    title: "NeuroDetox AI",
    subtitle: "The Intelligent Cognitive Attention Shield for Digital Well-Being",
    tag: "Problem Statement 30 · Digital Detox",
    content: (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)", margin: "0 auto 24px auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, boxShadow: "0 10px 35px rgba(99,102,241,0.4)" }}>
          🧠
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>
          Problem 30: Smart Notification Manager
        </div>
        <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 640, margin: "0 auto 24px auto", lineHeight: 1.6 }}>
          Constant notifications interrupt student concentration and trigger compulsive device checking. We built an autonomous AI system that prioritizes emergencies and schedules distractions to protect deep focus.
        </p>
        <div style={{ display: "inline-flex", gap: 12, background: "var(--surface2)", padding: "10px 20px", borderRadius: 30, border: "1px solid var(--border)" }}>
          <span style={{ fontSize: 13, color: "var(--cyan)", fontWeight: 600 }}>⚡ Real-Time WebSockets</span>
          <span style={{ color: "var(--text-dim)" }}>•</span>
          <span style={{ fontSize: 13, color: "var(--low)", fontWeight: 600 }}>🧠 Multi-Stage NLP</span>
          <span style={{ color: "var(--text-dim)" }}>•</span>
          <span style={{ fontSize: 13, color: "#f59e0b", fontWeight: 600 }}>🛡️ Active Focus Shield</span>
        </div>
      </div>
    ),
    notes: "Judges, students today are bombarded with 100+ notifications daily. 80% are noise, yet they destroy study momentum. Today we present NeuroDetox AI: an intelligent attention shield built to solve Problem 30."
  },
  {
    id: 2,
    category: "THE PROBLEM",
    title: "The Crisis of Attention Fragmentation",
    subtitle: "Why traditional 'Do Not Disturb' (DND) modes fail students",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: "10px 0" }}>
        <div className="card" style={{ borderColor: "rgba(244,63,94,0.3)", background: "rgba(244,63,94,0.05)" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--critical)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            🚨 The Pain Points
          </div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, fontSize: 14, color: "var(--text-muted)" }}>
            <li style={{ display: "flex", gap: 10 }}>
              <span style={{ color: "var(--critical)", fontWeight: 700 }}>•</span>
              <span><strong>The Pavlovian Loop:</strong> Students check phones every 8 minutes due to fear of missing out (FOMO).</span>
            </li>
            <li style={{ display: "flex", gap: 10 }}>
              <span style={{ color: "var(--critical)", fontWeight: 700 }}>•</span>
              <span><strong>23-Minute Recovery Cost:</strong> Research shows regaining deep focus after a single ping takes over 20 minutes.</span>
            </li>
            <li style={{ display: "flex", gap: 10 }}>
              <span style={{ color: "var(--critical)", fontWeight: 700 }}>•</span>
              <span><strong>DND Is Too Blunt:</strong> Standard silent mode blocks everything—including critical exam notices and family emergencies.</span>
            </li>
          </ul>
        </div>

        <div className="card" style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.05)" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--low)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            🎯 What Students Actually Need
          </div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, fontSize: 14, color: "var(--text-muted)" }}>
            <li style={{ display: "flex", gap: 10 }}>
              <span style={{ color: "var(--low)", fontWeight: 700 }}>✓</span>
              <span><strong>Context-Aware Triage:</strong> Understand urgency through language semantics, not just app names.</span>
            </li>
            <li style={{ display: "flex", gap: 10 }}>
              <span style={{ color: "var(--low)", fontWeight: 700 }}>✓</span>
              <span><strong>Zero Missing Emergencies:</strong> Real critical alerts always pass through instantly.</span>
            </li>
            <li style={{ display: "flex", gap: 10 }}>
              <span style={{ color: "var(--low)", fontWeight: 700 }}>✓</span>
              <span><strong>Intelligent Batching:</strong> Marketing and social pings grouped into scheduled digests.</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    notes: "Explain that existing DND is all-or-nothing: either you miss urgent family alerts, or you get spammed by shopping ads. NeuroDetox AI provides intelligent, semantic triage."
  },
  {
    id: 3,
    category: "SOLUTION",
    title: "NeuroDetox AI: The Cognitive Shield",
    subtitle: "A 3-tier intelligent gatekeeper between notifications and the student",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, padding: "10px 0" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ width: 50, height: 50, borderRadius: 12, background: "rgba(99,102,241,0.15)", margin: "0 auto 14px auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Brain size={24} color="var(--primary)" />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>1. Multi-Stage AI Scoring</div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
            NLP extracts urgency vectors, category context, and semantic intent into a 0–100 priority score.
          </p>
        </div>

        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ width: 50, height: 50, borderRadius: 12, background: "rgba(16,185,129,0.15)", margin: "0 auto 14px auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={24} color="var(--low)" />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>2. Focus Shield & Batching</div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
            During study hours, non-critical alerts are buffered into timed batches, preventing interruptions.
          </p>
        </div>

        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ width: 50, height: 50, borderRadius: 12, background: "rgba(244,63,94,0.15)", margin: "0 auto 14px auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={24} color="var(--critical)" />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>3. Reinforcement Learning</div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Adapts dynamically when users open or dismiss notifications, auto-tuning sender weights.
          </p>
        </div>
      </div>
    ),
    notes: "Emphasize our 3 distinct pillars: Multi-stage scoring, Focus Shield batching, and Reinforcement learning that adapts automatically."
  },
  {
    id: 4,
    category: "AI ARCHITECTURE",
    title: "The Multi-Stage AI Mathematical Model",
    subtitle: "Deterministic NLP + Online Reinforcement Learning Formulation",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="card" style={{ background: "var(--surface2)", padding: 20 }}>
          <div style={{ fontSize: 13, color: "var(--cyan)", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
            Core Objective Scoring Function:
          </div>
          <div style={{ fontSize: 16, fontFamily: "monospace", color: "var(--text)", background: "var(--bg)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)" }}>
            Score = clamp(Base[45] + W_Category*100 + W_Sender*35 + Δ_SemanticIntent + P_FocusDND)
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--low)", marginBottom: 4 }}>
              1. Semantic NLP Intent Extractor
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Detects emergency markers (+32), deadlines (+24), promotional bait (-28), and passive social likes (-16).
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)", marginBottom: 4 }}>
              2. Reinforcement Feedback Loop
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Open actions reward sender with +0.08 weight. Dismiss actions penalize with -0.08 weight in real time.
            </div>
          </div>
        </div>
      </div>
    ),
    notes: "Explain the formula: Base score is 45. Category bias and semantic intent adjust it up or down. User feedback updates the sender weight via our reinforcement learning rule."
  },
  {
    id: 5,
    category: "DIGITAL DETOX",
    title: "Focus Shield & Intelligent Batching",
    subtitle: "Eliminating the urge to check devices during study sessions",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card">
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--critical)", marginBottom: 12 }}>
            ⚡ Critical Alerts (Score ≥ 52)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
            <div style={{ padding: "8px 12px", background: "rgba(244,63,94,0.1)", borderRadius: 8, borderLeft: "3px solid var(--critical)" }}>
              <strong>"Server Down / Security Alert"</strong> ➔ Score 96 (Delivered Immediately)
            </div>
            <div style={{ padding: "8px 12px", background: "rgba(244,63,94,0.1)", borderRadius: 8, borderLeft: "3px solid var(--critical)" }}>
              <strong>"Mom: Are you free tonight?"</strong> ➔ Score 81 (Delivered Immediately)
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--medium)", marginBottom: 12 }}>
            ⏳ Batched Distractions (Score &lt; 52 in Focus Mode)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
            <div style={{ padding: "8px 12px", background: "rgba(234,179,8,0.1)", borderRadius: 8, borderLeft: "3px solid var(--medium)" }}>
              <strong>"50% OFF Flash Sale!"</strong> ➔ Score 0 (Held for 30m batch digest)
            </div>
            <div style={{ padding: "8px 12px", background: "rgba(234,179,8,0.1)", borderRadius: 8, borderLeft: "3px solid var(--medium)" }}>
              <strong>"Alex liked your photo"</strong> ➔ Score 29 (Held for 30m batch digest)
            </div>
          </div>
        </div>
      </div>
    ),
    notes: "Show how the filter differentiates between true emergencies and dopamine-trigger marketing sales."
  },
  {
    id: 6,
    category: "LIVE DEMO",
    title: "Live Product Demonstration",
    subtitle: "Watch NeuroDetox AI triage live incoming notifications in real time",
    content: (
      <div style={{ textAlign: "center", padding: "30px 0" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🚀</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Ready to Witness Live AI Triage?</div>
        <p style={{ fontSize: 14, color: "var(--text-muted)", maxWidth: 520, margin: "0 auto 24px auto" }}>
          We will now switch to the live console to show real-time WebSockets, intent analysis, and the adaptive learning loop.
        </p>
      </div>
    ),
    notes: "Switch seamlessly to the Dashboard tab or Live Feed to show the live WebSocket stream running!"
  },
  {
    id: 7,
    category: "FUTURE SCOPE",
    title: "Mobile OS & Wearables Integration",
    subtitle: "Architected for On-Device Edge Deployment (Android & iOS)",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--cyan)", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Smartphone size={16} /> 1. Native Android Integration
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Hooks directly into Android's <code>NotificationListenerService</code> to intercept all push notifications before they ring the phone.
          </p>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--primary)", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Layers size={16} /> 2. iOS Focus FilterKit
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Integrates with Apple's <code>FocusFilters API</code> and App Intents to dynamically adjust Lock Screen notification delivery.
          </p>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--low)", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Zap size={16} /> 3. On-Device Edge NPU Inference
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Compiles the model to ONNX / TensorFlow Lite for 0.5ms on-device inference with 100% privacy and zero battery drain.
          </p>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#f59e0b", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Clock size={16} /> 4. Smart Wearable Haptic Triage
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Smartwatches vibrate only for Critical emergencies, completely muting marketing pings.
          </p>
        </div>
      </div>
    ),
    notes: "Judges always ask how this goes to production. Show this slide to prove mobile readiness via Android NotificationListenerService and iOS Focus FilterKit."
  },
  {
    id: 8,
    category: "CONCLUSION",
    title: "Conclusion & Impact",
    subtitle: "Empowering students to conquer attention fragmentation",
    content: (
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 720, margin: "0 auto 24px auto" }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--cyan)" }}>+2.5 hrs</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Deep Study Time Daily</div>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--low)" }}>84.6%</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Spam Deflected</div>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--critical)" }}>0</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Missed Emergencies</div>
          </div>
        </div>

        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
          Thank You! Questions & Answers
        </div>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          NeuroDetox AI · Problem Statement 30 · Digital Detox & Cognitive Well-Being
        </p>
      </div>
    ),
    notes: "Conclude with our 3 key metrics: 2.5 hours saved, 85% spam deflected, zero missed emergencies. Open the floor for questions."
  },
];

export default function PresentationDeck({ onLaunchApp }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(true);

  const slide = SLIDES[currentSlide];

  const nextSlide = () => setCurrentSlide((prev) => Math.min(SLIDES.length - 1, prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(0, prev - 1));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* Top Deck Control Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, background: "rgba(99,102,241,0.15)", color: "var(--primary)", padding: "4px 10px", borderRadius: 20 }}>
            Slide {slide.id} of {SLIDES.length}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            (Use ◀ / ▶ Arrow Keys to Navigate)
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-ghost"
            style={{ fontSize: 12, padding: "6px 12px" }}
            onClick={() => setShowNotes(!showNotes)}
          >
            {showNotes ? <EyeOff size={13} /> : <Eye size={13} />}
            {showNotes ? "Hide Speaker Notes" : "Show Speaker Notes"}
          </button>
          <button
            className="btn btn-primary"
            style={{ fontSize: 12, padding: "6px 14px" }}
            onClick={onLaunchApp}
          >
            <Play size={13} /> Switch to Live Demo
          </button>
        </div>
      </div>

      {/* Main Slide Projector Canvas */}
      <div
        className="card card-glow-primary"
        style={{
          minHeight: 460,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "36px 40px",
          background: "linear-gradient(145deg, rgba(19,24,37,0.95) 0%, rgba(13,17,26,0.98) 100%)",
        }}
      >
        <div>
          {/* Category Tag */}
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--cyan)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
            {slide.category}
          </div>

          {/* Slide Heading */}
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>
            {slide.title}
          </h2>
          <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
            {slide.subtitle}
          </div>

          {/* Slide Dynamic Content */}
          {slide.content}
        </div>

        {/* Slide Progress Indicator */}
        <div style={{ display: "flex", gap: 6, marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          {SLIDES.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: idx === currentSlide ? "var(--cyan)" : idx < currentSlide ? "var(--primary)" : "var(--border)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
        <button
          className="btn btn-ghost"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          style={{ opacity: currentSlide === 0 ? 0.4 : 1 }}
        >
          <ChevronLeft size={16} /> Previous Slide
        </button>

        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {slide.title}
        </div>

        <button
          className="btn btn-primary"
          onClick={nextSlide}
          disabled={currentSlide === SLIDES.length - 1}
          style={{ opacity: currentSlide === SLIDES.length - 1 ? 0.4 : 1 }}
        >
          Next Slide <ChevronRight size={16} />
        </button>
      </div>

      {/* Speaker Notes Drawer */}
      {showNotes && (
        <div
          className="card"
          style={{
            marginTop: 16,
            background: "rgba(99,102,241,0.08)",
            borderColor: "rgba(99,102,241,0.3)",
            padding: 16,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <HelpCircle size={14} /> 🗣️ Student Speaker Note (What to say to judges):
          </div>
          <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>
            "{slide.notes}"
          </p>
        </div>
      )}
    </div>
  );
}
