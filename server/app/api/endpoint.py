import asyncio
import json
from dataclasses import dataclass, field

from websockets import ConnectionClosed

from app.models.api import Message, WebSocket
from app.utils.logger import logger


@dataclass
class Endpoint:
    connections: set[WebSocket] = field(default_factory=set)
    _lock: asyncio.Lock = field(default_factory=asyncio.Lock)

    async def accept(self, ws: WebSocket):
        async with self._lock:
            self.connections.add(ws)

    async def close(self, ws: WebSocket):
        try:
            self.connections.remove(ws)
        except Exception:
            logger.error("failed to remove ws: %s", ws)

    async def broadcast(self, payload: Message) -> None:
        message = json.dumps(payload)

        async with self._lock:
            connections = list(self.connections)

        dead: list[WebSocket] = []

        for ws in connections:
            try:
                await ws.send(message)
            except ConnectionClosed:
                dead.append(ws)
        if dead:
            async with self._lock:
                for ws in dead:
                    self.connections.discard(ws)
