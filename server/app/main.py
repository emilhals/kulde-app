from typing import Annotated
from fastapi import Depends, FastAPI, WebSocket, WebSocketDisconnect

from app.api.websocket.connection_manager import ConnectionManager

from app.dependencies import create_simulation_service, get_manager
from app.services.simulation_service import SimulationService

from app.logger import load_config

app: FastAPI = FastAPI(title="kulde.app")

load_config()

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

            print(data["command"])

            if data["command"] == "start":
                await simulation_service.start(data["controllerParams"])

            if data["command"] == "update_params":
                pass

            if data["command"] == "RESTART":
                await simulation_service.restart(data["controllerParams"])

            if data["command"] == "STOP":
                await simulation_service.stop()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
