from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Literal
from datetime import datetime
import uuid


class NotificationCreate(BaseModel):
    title: str
    body: str
    sender: str
    category: Literal["work", "social", "news", "ads", "system", "personal"]
    app: Optional[str] = "Unknown"


class AIReasoning(BaseModel):
    base_score: float
    category_bias: float
    sender_weight: float
    urgency_semantic_score: float
    dnd_penalty: float
    explanation: str
    detected_intents: List[str] = []


class Notification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    body: str
    sender: str
    category: str
    app: str = "Unknown"
    priority_score: float = 50.0          # 0–100, higher = more important
    priority_label: str = "medium"        # critical | high | medium | low
    status: str = "pending"               # pending | delivered | batched | dismissed | opened | snoozed
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())
    scheduled_for: Optional[str] = None   # ISO string if batched
    ai_reasoning: Optional[AIReasoning] = None


class UserAction(BaseModel):
    notification_id: str
    action: Literal["open", "dismiss", "snooze"]


class ScheduleConfig(BaseModel):
    focus_mode: bool = False
    focus_start: str = "09:00"   # HH:MM
    focus_end: str = "18:00"     # HH:MM
    batch_interval_minutes: int = 30
    auto_stream_active: bool = False


class StatsResponse(BaseModel):
    total: int
    delivered: int
    batched: int
    dismissed: int
    opened: int
    snoozed: int
    avg_priority: float
    focus_score: int   # 0–100 wellness score
    distraction_reduction_pct: float
