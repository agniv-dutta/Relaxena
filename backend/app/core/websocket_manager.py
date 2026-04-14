from collections import defaultdict
from typing import Any

from fastapi import WebSocket


class VenueWebSocketManager:
    def __init__(self) -> None:
        self._connections: dict[int, set[WebSocket]] = defaultdict(set)

    async def connect(self, venue_id: int, websocket: WebSocket) -> None:
        await websocket.accept()
        self._connections[venue_id].add(websocket)

    def disconnect(self, venue_id: int, websocket: WebSocket) -> None:
        if venue_id in self._connections and websocket in self._connections[venue_id]:
            self._connections[venue_id].remove(websocket)
            if not self._connections[venue_id]:
                del self._connections[venue_id]

    async def broadcast(self, venue_id: int, message: dict[str, Any]) -> None:
        for websocket in list(self._connections.get(venue_id, set())):
            try:
                await websocket.send_json(message)
            except Exception:
                self.disconnect(venue_id, websocket)


ws_manager = VenueWebSocketManager()
