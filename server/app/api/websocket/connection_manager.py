import asyncio
from dataclasses import dataclass, field

from fastapi import WebSocket

from app.app_state import AppState
from app.logger import logger


@dataclass
class ConnectionManager:
    active_connections: list[WebSocket] = field(default_factory=list)

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        self.active_connections.remove(websocket)

    async def receive_messages(
        self,
        websocket: WebSocket,
        command_queue: asyncio.Queue[str],
        app_state: AppState,
    ) -> None:
        try:
            while True:
                message = await websocket.receive_json()

                command_queue.put_nowait(message)

                await asyncio.sleep(1)
        except asyncio.CancelledError:
            logger.error("Task was canceleld")
        except Exception as e:
            logger.error("Error in ConnectionManager.receive_messages: %s", e)
        finally:
            logger.info("ConnectionManager.receive_messages finished")

    async def broadcast(self, message) -> None:
        for connection in self.active_connections:
            await connection.send_json(message)
