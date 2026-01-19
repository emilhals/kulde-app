from typing import Annotated
from fastapi import Depends, FastAPI, WebSocket, WebSocketDisconnect

import asyncio

from app.app_state import AppState

from app.api.websocket.connection_manager import ConnectionManager

from app.core.system import System
from app.dependencies import create_system, create_simulation_service, get_manager
from app.services import simulation_service
from app.services.simulation_service import SimulationService

from app.logger import load_config, logger

app: FastAPI = FastAPI(title="Refrigeration Simulation")

load_config()

app_state: AppState = AppState()

simulation_dependency = Annotated[SimulationService, Depends(create_simulation_service)]
manager_dependency = Annotated[ConnectionManager, Depends(get_manager)]


@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    simulation_service: simulation_dependency,
    manager: manager_dependency,
) -> None:
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()

            if data["command"] == "start":
                await simulation_service.start(data["controllerParams"])

            if data["command"] == "update_params":
                pass

            if data["command"] == "pause":
                await simulation_service.pause()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
