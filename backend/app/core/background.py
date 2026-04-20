"""Background task runner for Relaxena - uses asyncio instead of Celery."""

import asyncio
import logging
from typing import Coroutine

logger = logging.getLogger(__name__)

_background_tasks: set[asyncio.Task] = set()


def create_background_task(coro: Coroutine) -> asyncio.Task:
    """Create and track a background task."""
    task = asyncio.create_task(coro)
    _background_tasks.add(task)
    task.add_done_callback(_background_tasks.discard)
    return task


async def cancel_all_background_tasks() -> None:
    """Cancel all running background tasks."""
    for task in _background_tasks:
        if not task.done():
            task.cancel()
    await asyncio.gather(*_background_tasks, return_exceptions=True)
