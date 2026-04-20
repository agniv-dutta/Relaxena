import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websockets.manager import ws_channel_manager

router = APIRouter(tags=["websocket"])


async def _stream_channel(websocket: WebSocket, channel: str) -> None:
    """Stream messages to websocket from channel."""
    await ws_channel_manager.connect(channel, websocket)

    try:
        while True:
            try:
                msg = await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
                if msg.lower() == "ping":
                    await websocket.send_text("pong")
            except asyncio.TimeoutError:
                # Keep connection alive
                continue
    except WebSocketDisconnect:
        pass
    finally:
        ws_channel_manager.disconnect(channel, websocket)


@router.websocket("/ws/crowd/{venue_id}")
async def crowd_ws(websocket: WebSocket, venue_id: int) -> None:
    await _stream_channel(websocket, f"crowd:{venue_id}")


@router.websocket("/ws/queue/{user_id}")
async def queue_ws(websocket: WebSocket, user_id: int) -> None:
    await _stream_channel(websocket, f"queue:{user_id}")


@router.websocket("/ws/alerts/{venue_id}")
async def alerts_ws(websocket: WebSocket, venue_id: int) -> None:
    await _stream_channel(websocket, f"alerts:{venue_id}")
