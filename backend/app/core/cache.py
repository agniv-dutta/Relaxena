"""Simple in-memory cache with TTL support."""

import time
from typing import Any

_cache: dict[str, tuple[Any, float]] = {}


def cache_get(key: str) -> Any:
    """Get value from cache if not expired."""
    if key in _cache:
        val, exp = _cache[key]
        if time.time() < exp:
            return val
        else:
            del _cache[key]
    return None


def cache_set(key: str, val: Any, ttl: int = 60) -> None:
    """Set value in cache with TTL in seconds."""
    _cache[key] = (val, time.time() + ttl)


def cache_delete(key: str) -> None:
    """Delete a cache key."""
    _cache.pop(key, None)


def cache_clear() -> None:
    """Clear entire cache."""
    _cache.clear()
