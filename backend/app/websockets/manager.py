from collections import defaultdict
from typing import Any

from fastapi import WebSocket


class ChannelWebSocketManager:
    def __init__(self) -> None:
        self._channels: dict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, channel: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self._channels[channel].add(websocket)

    def disconnect(self, channel: str, websocket: WebSocket) -> None:
        if channel in self._channels and websocket in self._channels[channel]:
            self._channels[channel].remove(websocket)
            if not self._channels[channel]:
                del self._channels[channel]

    async def broadcast(self, channel: str, payload: dict[str, Any]) -> None:
        for websocket in list(self._channels.get(channel, set())):
            try:
                await websocket.send_json(payload)
            except Exception:
                self.disconnect(channel, websocket)


ws_channel_manager = ChannelWebSocketManager()
