"""
scheduler.py
Decides whether to deliver a notification immediately or batch it.
"""

from datetime import datetime, timedelta
from models import Notification
import notification_store as store


def should_batch(n: Notification) -> bool:
    cfg = store.get_schedule_config()
    if not cfg.focus_mode:
        return False
    if n.priority_label in ("critical", "high"):
        return False
    now = datetime.now().time()
    try:
        start = datetime.strptime(cfg.focus_start, "%H:%M").time()
        end = datetime.strptime(cfg.focus_end, "%H:%M").time()
    except ValueError:
        return False
    return start <= now <= end


def schedule_batch_time(n: Notification) -> str:
    cfg = store.get_schedule_config()
    now = datetime.now()
    batch_dt = now + timedelta(minutes=cfg.batch_interval_minutes)
    return batch_dt.isoformat()


def process_notification(n: Notification) -> Notification:
    if should_batch(n):
        n.status = "batched"
        n.scheduled_for = schedule_batch_time(n)
    else:
        n.status = "delivered"
    return n
