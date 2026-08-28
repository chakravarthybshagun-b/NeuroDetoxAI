"""
ai_engine.py
Advanced Multi-Stage AI Prioritization & Intent Classification Engine

Components:
1. Semantic NLP Intent Extractor (Temporal Urgency, Security/Ops Alert, Promotional, Social Engagement)
2. Contextual Category Affinity Engine
3. Online Reinforcement Learning Loop (Dynamic User Feedback Adaptation)
4. Explainable AI (XAI) Reason Generator
"""

import re
import math
from datetime import datetime
from typing import Tuple, List, Dict
import notification_store as store
from models import AIReasoning

# ---------------------------------------------------------------------------
# Lexical & Semantic Urgency Patterns
# ---------------------------------------------------------------------------
SEMANTIC_INTENTS = {
    "critical_security": {
        "patterns": [
            r"\b(security alert|unauthorized|failed login|password reset|breach|2fa|verification code|otp)\b",
            r"\b(server (is )?down|production error|outage|nullpointer|500 error|service unavailable)\b",
        ],
        "score_delta": 32.0,
        "intent_label": "Security / Infrastructure Critical",
    },
    "urgent_deadline": {
        "patterns": [
            r"\b(urgent|immediate action|asap|deadline today|due today|overdue|emergency|action required)\b",
            r"\b(flight delay|boarding now|gate change|hospital|doctor appointment)\b",
        ],
        "score_delta": 24.0,
        "intent_label": "Time-Sensitive Deadline",
    },
    "work_collaboration": {
        "patterns": [
            r"\b(meeting in \d+|interview scheduled|pull request|code review|sprint planning|client call|standup)\b",
            r"\b(mentioned you|assigned to you|escalation|invoice|salary)\b",
        ],
        "score_delta": 18.0,
        "intent_label": "Direct Work Collaboration",
    },
    "personal_direct": {
        "patterns": [
            r"\b(dinner|home|call me|are you free|mom|dad|family|pickup|delivery arrived)\b",
        ],
        "score_delta": 14.0,
        "intent_label": "Direct Personal Message",
    },
    "promotional_spam": {
        "patterns": [
            r"\b(sale|discount|\d+%\s*off|promo|coupon|deal of the day|cashback|flat \d+|shop now|limited time offer)\b",
            r"\b(subscribe|newsletter|clearance|save big|free gift|exclusive offer)\b",
        ],
        "score_delta": -28.0,
        "intent_label": "Marketing & Promotional Bait",
    },
    "passive_social": {
        "patterns": [
            r"\b(liked your|reacted to|started following|shared your|viewed your profile|trending on|recommended for you)\b",
            r"\b(streak|daily digest|photo of the week|new video from)\b",
        ],
        "score_delta": -16.0,
        "intent_label": "Passive Social Engagement",
    },
}

FOCUS_HOUR_PENALTY = -25.0


def _extract_semantic_features(text: str) -> Tuple[float, List[str]]:
    """Evaluates text against multi-intent semantic ontology."""
    text_lower = text.lower()
    total_delta = 0.0
    detected_intents = []

    for key, data in SEMANTIC_INTENTS.items():
        matched = False
        for pat in data["patterns"]:
            if re.search(pat, text_lower):
                matched = True
                break
        if matched:
            total_delta += data["score_delta"]
            detected_intents.append(data["intent_label"])

    return total_delta, detected_intents


def _calculate_time_penalty(focus_mode: bool, focus_start: str, focus_end: str) -> float:
    """Calculates temporal penalty if notification arrives inside Focus Mode window."""
    if not focus_mode:
        return 0.0
    now = datetime.now().time()
    try:
        start = datetime.strptime(focus_start, "%H:%M").time()
        end = datetime.strptime(focus_end, "%H:%M").time()
    except ValueError:
        return 0.0

    if start <= now <= end:
        return FOCUS_HOUR_PENALTY
    return 0.0


def score_notification(title: str, body: str, sender: str, category: str) -> Tuple[float, str, AIReasoning]:
    """
    Computes AI Priority Score (0-100), Priority Label, and Explainable AI Reasoning.
    """
    cfg = store.get_schedule_config()
    category_weights = store.get_category_weights()
    sender_weights = store.get_sender_weights()

    # 1. Base Score
    base_score = 45.0

    # 2. Contextual Category Bias
    cat_bias = category_weights.get(category, 0.0) * 100.0

    # 3. Learned Sender Weight (Reinforcement Loop)
    sender_weight = sender_weights.get(sender, 0.0) * 35.0

    # 4. Semantic NLP Feature Analysis
    combined_text = f"{title} {body}"
    urgency_semantic_score, detected_intents = _extract_semantic_features(combined_text)

    # 5. Temporal DND / Focus Window Bias
    dnd_penalty = _calculate_time_penalty(cfg.focus_mode, cfg.focus_start, cfg.focus_end)

    # Aggregated Score
    raw_score = base_score + cat_bias + sender_weight + urgency_semantic_score + dnd_penalty
    final_score = round(max(0.0, min(100.0, raw_score)), 1)

    # Priority Label Classification
    if final_score >= 75.0:
        label = "critical"
    elif final_score >= 52.0:
        label = "high"
    elif final_score >= 32.0:
        label = "medium"
    else:
        label = "low"

    # Human-Readable Explainable AI (XAI) Synthesis
    explanations = []
    if detected_intents:
        explanations.append(f"Detected: {', '.join(detected_intents)}")
    if sender_weight > 0:
        explanations.append(f"Sender '{sender}' boosted (+{round(sender_weight, 1)}) by user affinity")
    elif sender_weight < 0:
        explanations.append(f"Sender '{sender}' penalized ({round(sender_weight, 1)}) by frequent dismissals")
    if dnd_penalty < 0:
        explanations.append("DND Focus Mode penalty applied (-25)")
    if not explanations:
        explanations.append(f"Categorized as standard {category} notification")

    reasoning = AIReasoning(
        base_score=base_score,
        category_bias=round(cat_bias, 1),
        sender_weight=round(sender_weight, 1),
        urgency_semantic_score=round(urgency_semantic_score, 1),
        dnd_penalty=round(dnd_penalty, 1),
        explanation=" · ".join(explanations),
        detected_intents=detected_intents,
    )

    return final_score, label, reasoning


def apply_user_action(sender: str, category: str, action: str):
    """
    Online Reinforcement Learning:
    - User 'open' reinforces sender affinity (+0.08)
    - User 'dismiss' degrades sender affinity (-0.08)
    - User 'snooze' slight positive reinforcement (+0.02)
    """
    if action == "open":
        store.update_sender_weight(sender, +0.08)
    elif action == "dismiss":
        store.update_sender_weight(sender, -0.08)
    elif action == "snooze":
        store.update_sender_weight(sender, +0.02)
