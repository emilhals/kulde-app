from typing import Any

from websockets.asyncio.client import ClientConnection
from websockets.asyncio.server import ServerConnection

type WebSocket = ServerConnection | ClientConnection
type Message = dict[str, Any]
