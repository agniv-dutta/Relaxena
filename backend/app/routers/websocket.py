import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.websocket_manager import ws_manager

router = APIRouter()


@router.websocket("/ws/crowd/{venue_id}")
async def crowd_updates(websocket: WebSocket, venue_id: int) -> None:
    await ws_manager.connect(venue_id, websocket)

    try:
        while True:
            try:
                client_message = await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
                if client_message.lower() == "ping":
                    await websocket.send_text("pong")
            except asyncio.TimeoutError:
                continue
    except WebSocketDisconnect:
        pass
    finally:
        ws_manager.disconnect(venue_id, websocket)
