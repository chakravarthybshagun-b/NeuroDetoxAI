"""
scheduler.py
Decides whether to deliver a notification immediately or batch it.
During focus hours, low/medium priority notifications are batched.
"""

from datetime import datetime, timedelta
from models import Notification
import notification_store as store


def should_batch(n: Notification) -> bool:
    """Return True if the notification should be deferred."""
    cfg = store.get_schedule_config()
    if not cfg.focus_mode:
        return False
    # Only batch low/medium during focus
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
    """Return ISO timestamp when the batched notification will be delivered."""
    cfg = store.get_schedule_config()
    now = datetime.now()
    batch_dt = now + timedelta(minutes=cfg.batch_interval_minutes)
    return batch_dt.isoformat()


def process_notification(n: Notification) -> Notification:
    """Apply scheduling logic; mutate status/scheduled_for in place."""
    if should_batch(n):
        n.status = "batched"
        n.scheduled_for = schedule_batch_time(n)
    else:
        n.status = "delivered"
    return n
