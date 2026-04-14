from app.core.celery_app import celery_app


@celery_app.task(name="tasks.send_staff_notification")
def send_staff_notification(venue_id: int, message: str) -> dict[str, str | int]:
    return {
        "venue_id": venue_id,
        "status": "queued",
        "message": message,
    }


@celery_app.task(name="tasks.recompute_wait_time")
def recompute_wait_time(venue_id: int, queue_type: str, resource_id: str) -> dict[str, str | int | float]:
    estimated_wait = 6.0
    return {
        "venue_id": venue_id,
        "queue_type": queue_type,
        "resource_id": resource_id,
        "estimated_wait": estimated_wait,
    }
