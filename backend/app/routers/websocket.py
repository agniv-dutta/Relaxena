import asyncio
import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.redis import get_redis
from app.core.websocket_manager import ws_manager

router = APIRouter()


@router.websocket("/ws/crowd/{venue_id}")
async def crowd_updates(websocket: WebSocket, venue_id: int) -> None:
    await ws_manager.connect(venue_id, websocket)
    redis = await get_redis()
    pubsub = redis.pubsub()
    await pubsub.subscribe(f"crowd:{venue_id}")

    try:
        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
            if message and message.get("data"):
                payload = message["data"]
                if isinstance(payload, str):
                    try:
                        await websocket.send_json(json.loads(payload))
                    except json.JSONDecodeError:
                        await websocket.send_text(payload)
                else:
                    await websocket.send_text(str(payload))

            try:
                client_message = await asyncio.wait_for(websocket.receive_text(), timeout=0.1)
                if client_message.lower() == "ping":
                    await websocket.send_text("pong")
            except asyncio.TimeoutError:
                continue
    except WebSocketDisconnect:
        pass
    finally:
        await pubsub.unsubscribe(f"crowd:{venue_id}")
        await pubsub.close()
        ws_manager.disconnect(venue_id, websocket)
