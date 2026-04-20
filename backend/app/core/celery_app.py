from celery import Celery
from celery.schedules import crontab

from app.core.config import settings

celery_app = Celery(
    "relaxena",
    broker=settings.celery_broker_url,
    backend=settings.redis_url,
    include=["app.tasks.worker_tasks", "app.tasks.ai_tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    beat_schedule={
        "predictive-crowd-analytics-every-5-min": {
            "task": "tasks.predict_crowd_density",
            "schedule": crontab(minute="*/5"),
        },
        "queue-optimizer-every-2-min": {
            "task": "tasks.optimize_queues",
            "schedule": crontab(minute="*/2"),
        },
        "queue-auto-bump-every-30-sec": {
            "task": "tasks.process_virtual_queues",
            "schedule": 30.0,
        },
        "sports-poll-every-60-sec": {
            "task": "tasks.poll_live_sports_data",
            "schedule": 60.0,
        },
        "weather-sync-every-30-min": {
            "task": "tasks.update_venue_weather",
            "schedule": crontab(minute="*/30"),
        },
    },
)
