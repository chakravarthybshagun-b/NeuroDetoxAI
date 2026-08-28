"""
notification_store.py
In-memory store for notifications + JSON-backed persistence for learned weights.
"""

import json
import os
from typing import List, Optional, Dict
from models import Notification, ScheduleConfig, StatsResponse

DATA_FILE = os.path.join(os.path.dirname(__file__), "data.json")

_notifications: List[Notification] = []
_sender_weights: Dict[str, float] = {}

_category_weights: Dict[str, float] = {
    "work":     0.30,
    "personal": 0.22,
    "system":   0.15,
    "social":   0.00,
    "news":    -0.10,
    "ads":     -0.25,
}

_schedule_config: ScheduleConfig = ScheduleConfig()


def _load_from_disk():
    global _sender_weights, _notifications
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r") as f:
                data = json.load(f)
            _sender_weights = data.get("sender_weights", {})
            raw = data.get("notifications", [])
            _notifications = [Notification(**n) for n in raw]
        except Exception:
            _notifications = []
            _sender_weights = {}

    if not _notifications:
        _seed_initial_data()


def _seed_initial_data():
    global _notifications, _sender_weights
    _sender_weights = {"Datadog": 0.25, "AWS Security": 0.30, "ShopNow": -0.40, "Instagram": -0.20}
    samples = [
        {
            "title": "CRITICAL: Database connection pool exhausted",
            "body": "Auth microservice latency > 4000ms. Immediate action required.",
            "sender": "Datadog",
            "category": "work",
            "app": "Datadog",
            "priority_score": 95.0,
            "priority_label": "critical",
            "status": "delivered",
        },
        {
            "title": "Security Alert: Unauthorized login attempt",
            "body": "New login from unrecognized IP: 185.220.101.5. Check now.",
            "sender": "AWS Security",
            "category": "system",
            "app": "AWS",
            "priority_score": 92.0,
            "priority_label": "critical",
            "status": "delivered",
        },
        {
            "title": "Sprint Review meeting in 10 minutes",
            "body": "Google Meet link is live: meet.google.com/xyz-abc",
            "sender": "Google Calendar",
            "category": "work",
            "app": "Calendar",
            "priority_score": 78.0,
            "priority_label": "high",
            "status": "delivered",
        },
        {
            "title": "Doctor appointment reminder",
            "body": "Your dental checkup is scheduled tomorrow at 3:00 PM.",
            "sender": "HealthApp",
            "category": "personal",
            "app": "Health",
            "priority_score": 62.0,
            "priority_label": "medium",
            "status": "batched",
        },
        {
            "title": "50% OFF Flash Sale ends in 2 hours!",
            "body": "Exclusive discounts on noise-cancelling headphones. Buy now!",
            "sender": "ShopNow",
            "category": "ads",
            "app": "ShopNow",
            "priority_score": 15.0,
            "priority_label": "low",
            "status": "dismissed",
        },
        {
            "title": "Alex liked your photo",
            "body": "Alex and 18 others reacted to your story.",
            "sender": "Instagram",
            "category": "social",
            "app": "Instagram",
            "priority_score": 25.0,
            "priority_label": "low",
            "status": "batched",
        },
    ]
    _notifications = [Notification(**s) for s in samples]


def _save_to_disk():
    try:
        with open(DATA_FILE, "w") as f:
            json.dump(
                {
                    "sender_weights": _sender_weights,
                    "notifications": [n.model_dump() for n in _notifications],
                },
                f,
                indent=2,
            )
    except Exception:
        pass


_load_from_disk()


def get_all_notifications() -> List[Notification]:
    return list(reversed(_notifications))


def get_notification_by_id(nid: str) -> Optional[Notification]:
    for n in _notifications:
        if n.id == nid:
            return n
    return None


def add_notification(n: Notification) -> Notification:
    _notifications.append(n)
    _save_to_disk()
    return n


def update_notification(n: Notification):
    for i, existing in enumerate(_notifications):
        if existing.id == n.id:
            _notifications[i] = n
            break
    _save_to_disk()


def get_sender_weights() -> Dict[str, float]:
    return _sender_weights


def get_category_weights() -> Dict[str, float]:
    return _category_weights


def update_sender_weight(sender: str, delta: float):
    current = _sender_weights.get(sender, 0.0)
    _sender_weights[sender] = round(max(-1.0, min(1.0, current + delta)), 3)
    _save_to_disk()


def get_schedule_config() -> ScheduleConfig:
    return _schedule_config


def set_schedule_config(cfg: ScheduleConfig):
    global _schedule_config
    _schedule_config = cfg


def clear_all():
    global _notifications, _sender_weights
    _notifications = []
    _sender_weights = {}
    if os.path.exists(DATA_FILE):
        try:
            os.remove(DATA_FILE)
        except Exception:
            pass


def get_stats_data() -> StatsResponse:
    all_n = _notifications
    total = len(all_n)
    delivered = sum(1 for n in all_n if n.status == "delivered")
    batched = sum(1 for n in all_n if n.status == "batched")
    dismissed = sum(1 for n in all_n if n.status == "dismissed")
    opened = sum(1 for n in all_n if n.status == "opened")
    snoozed = sum(1 for n in all_n if n.status == "snoozed")
    avg_priority = (sum(n.priority_score for n in all_n) / total) if total else 0.0

    if total == 0:
        focus_score = 100
        reduction_pct = 0.0
    else:
        mitigated = batched + dismissed
        reduction_pct = round((mitigated / total) * 100.0, 1)
        intrusive = opened + (delivered if not _schedule_config.focus_mode else 0)
        focus_score = max(10, min(100, int(100 - (intrusive / total) * 60 + (batched / total) * 25)))

    return StatsResponse(
        total=total,
        delivered=delivered,
        batched=batched,
        dismissed=dismissed,
        opened=opened,
        snoozed=snoozed,
        avg_priority=round(avg_priority, 1),
        focus_score=focus_score,
        distraction_reduction_pct=reduction_pct,
    )
