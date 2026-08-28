"""
main.py — FastAPI Real-Time WebSocket & REST Backend for Smart Notification Manager
"""

import asyncio
import random
from datetime import datetime
from typing import List, Set

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

import notification_store as store
import ai_engine as ai
import scheduler
from models import (
    Notification,
    NotificationCreate,
    UserAction,
    ScheduleConfig,
    StatsResponse,
)

app = FastAPI(
    title="Smart Notification Manager API",
    description="Real-time AI-powered notification prioritization, intent classification & scheduling",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# WebSocket Real-Time Connection Manager
# ---------------------------------------------------------------------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)

    async def broadcast(self, event_type: str, data: dict):
        message = {"type": event_type, "data": data, "timestamp": datetime.now().isoformat()}
        dead_connections = set()
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                dead_connections.add(connection)
        for dead in dead_connections:
            self.active_connections.discard(dead)


ws_manager = ConnectionManager()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        # Send initial snapshot upon connection
        stats = store.get_stats_data()
        await websocket.send_json({
            "type": "INITIAL_STATE",
            "data": {
                "stats": stats.model_dump(),
                "notifications": [n.model_dump() for n in store.get_all_notifications()],
                "schedule": store.get_schedule_config().model_dump(),
                "weights": {
                    "sender_weights": store.get_sender_weights(),
                    "category_weights": store.get_category_weights(),
                }
            }
        })
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)


# ---------------------------------------------------------------------------
# Helper: Process, Ingest & Broadcast
# ---------------------------------------------------------------------------
async def _ingest_and_broadcast(payload: NotificationCreate) -> Notification:
    score, label, reasoning = ai.score_notification(
        payload.title, payload.body, payload.sender, payload.category
    )
    n = Notification(
        title=payload.title,
        body=payload.body,
        sender=payload.sender,
        category=payload.category,
        app=payload.app or payload.sender,
        priority_score=score,
        priority_label=label,
        ai_reasoning=reasoning,
    )
    n = scheduler.process_notification(n)
    store.add_notification(n)

    # Broadcast in real-time to all connected frontend clients
    stats = store.get_stats_data()
    await ws_manager.broadcast("NOTIFICATION_ARRIVED", {
        "notification": n.model_dump(),
        "stats": stats.model_dump(),
    })
    return n


# ---------------------------------------------------------------------------
# Notification Endpoints
# ---------------------------------------------------------------------------

@app.post("/notifications", response_model=Notification, tags=["Notifications"])
async def create_notification(payload: NotificationCreate):
    """Ingest a new notification, score it with AI, apply scheduling, and push via WebSocket."""
    return await _ingest_and_broadcast(payload)


@app.get("/notifications", response_model=List[Notification], tags=["Notifications"])
def list_notifications(status: str = None, limit: int = 100):
    all_n = store.get_all_notifications()
    if status:
        all_n = [n for n in all_n if n.status == status]
    return all_n[:limit]


@app.get("/notifications/{nid}", response_model=Notification, tags=["Notifications"])
def get_notification(nid: str):
    n = store.get_notification_by_id(nid)
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    return n


@app.post("/notifications/{nid}/action", response_model=Notification, tags=["Notifications"])
async def user_action(nid: str, payload: UserAction):
    """Record user feedback (open/dismiss/snooze) and update AI model reinforcement weights."""
    n = store.get_notification_by_id(nid)
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    n.status = payload.action + "d" if payload.action != "snooze" else "snoozed"
    ai.apply_user_action(n.sender, n.category, payload.action)
    store.update_notification(n)

    # Broadcast updated stats and weights
    stats = store.get_stats_data()
    await ws_manager.broadcast("ACTION_PROCESSED", {
        "notification": n.model_dump(),
        "stats": stats.model_dump(),
        "sender_weights": store.get_sender_weights(),
    })
    return n


@app.delete("/notifications", tags=["Notifications"])
async def clear_notifications():
    store.clear_all()
    stats = store.get_stats_data()
    await ws_manager.broadcast("CLEARED_ALL", {
        "stats": stats.model_dump(),
        "sender_weights": {},
    })
    return {"message": "All notifications cleared"}


# ---------------------------------------------------------------------------
# Schedule & Stats Endpoints
# ---------------------------------------------------------------------------

@app.get("/schedule", response_model=ScheduleConfig, tags=["Schedule"])
def get_schedule():
    return store.get_schedule_config()


@app.put("/schedule", response_model=ScheduleConfig, tags=["Schedule"])
async def update_schedule(cfg: ScheduleConfig):
    store.set_schedule_config(cfg)
    await ws_manager.broadcast("SCHEDULE_UPDATED", {"schedule": cfg.model_dump()})
    return cfg


@app.get("/stats", response_model=StatsResponse, tags=["Stats"])
def get_stats():
    return store.get_stats_data()


@app.get("/ai/weights", tags=["AI"])
def get_weights():
    return {
        "sender_weights": store.get_sender_weights(),
        "category_weights": store.get_category_weights(),
    }


# ---------------------------------------------------------------------------
# Simulation & Real-Time Auto-Stream
# ---------------------------------------------------------------------------

SAMPLE_NOTIFICATIONS = [
    {"title": "CRITICAL: Database connection pool exhausted", "body": "Auth microservice latency > 4000ms. Immediate action required.", "sender": "Datadog", "category": "work", "app": "Datadog"},
    {"title": "Urgent: Production server down", "body": "Node #4 failed health checks. Escalation triggered.", "sender": "PagerDuty", "category": "work", "app": "PagerDuty"},
    {"title": "Security Alert: Unauthorized login attempt", "body": "New login from unrecognized IP: 185.220.101.5. Check now.", "sender": "AWS Security", "category": "system", "app": "AWS"},
    {"title": "Sprint Review meeting in 10 minutes", "body": "Google Meet link is live: meet.google.com/xyz-abc", "sender": "Google Calendar", "category": "work", "app": "Calendar"},
    {"title": "Doctor appointment reminder", "body": "Your dental checkup is scheduled tomorrow at 3:00 PM.", "sender": "HealthApp", "category": "personal", "app": "Health"},
    {"title": "Mom: Are you coming home for dinner?", "body": "Let me know so I can cook your favorite meal!", "sender": "Mom", "category": "personal", "app": "WhatsApp"},
    {"title": "Sarah mentioned you in #backend-dev", "body": "Can you review this pull request before deploying?", "sender": "Slack", "category": "work", "app": "Slack"},
    {"title": "50% OFF Flash Sale ends in 2 hours!", "body": "Exclusive discounts on noise-cancelling headphones. Buy now!", "sender": "ShopNow", "category": "ads", "app": "ShopNow"},
    {"title": "Claim your $20 cashback voucher today", "body": "Limited time offer. Apply code DETOX20 at checkout.", "sender": "DealsHub", "category": "ads", "app": "DealsHub"},
    {"title": "Alex liked your photo", "body": "Alex and 18 others reacted to your story.", "sender": "Instagram", "category": "social", "app": "Instagram"},
    {"title": "Trending in Tech: New AI model released", "body": "See what 4,200 developers are discussing right now.", "sender": "Twitter", "category": "news", "app": "Twitter"},
    {"title": "System Update 14.5.1 available", "body": "Includes vital security patches and bug fixes.", "sender": "System", "category": "system", "app": "OS"},
]


@app.post("/simulate", tags=["Simulation"])
async def simulate_notification(count: int = 1):
    """Generate random sample notifications and broadcast them in real time."""
    created = []
    for _ in range(min(count, 10)):
        sample = random.choice(SAMPLE_NOTIFICATIONS)
        payload = NotificationCreate(**sample)
        n = await _ingest_and_broadcast(payload)
        created.append(n)
        if count > 1:
            await asyncio.sleep(0.15)
    return created


# Background task for live stream simulation
_stream_task = None
_streaming_active = False


async def _stream_worker():
    global _streaming_active
    while _streaming_active:
        sample = random.choice(SAMPLE_NOTIFICATIONS)
        payload = NotificationCreate(**sample)
        await _ingest_and_broadcast(payload)
        await asyncio.sleep(random.uniform(3.5, 6.0))


@app.post("/simulate/stream/toggle", tags=["Simulation"])
async def toggle_stream():
    global _stream_task, _streaming_active
    _streaming_active = not _streaming_active
    if _streaming_active:
        _stream_task = asyncio.create_task(_stream_worker())
    else:
        if _stream_task:
            _stream_task.cancel()
            _stream_task = None
    
    await ws_manager.broadcast("STREAM_STATUS", {"streaming": _streaming_active})
    return {"streaming": _streaming_active}


@app.get("/simulate/stream/status", tags=["Simulation"])
def stream_status():
    return {"streaming": _streaming_active}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok", "version": "2.0.0", "time": datetime.now().isoformat()}
