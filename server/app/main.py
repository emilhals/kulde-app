from typing import Annotated
from fastapi import Depends, FastAPI, WebSocket, WebSocketDisconnect

import asyncio

from app.app_state import AppState

from app.api.websocket.connection_manager import ConnectionManager

from app.core.system import System
from app.dependencies import create_system, create_simulation_service
from app.services import simulation_service
from app.services.simulation_service import SimulationService

from app.logger import load_config, logger

app: FastAPI = FastAPI(title="Refrigeration Simulation")

load_config()

app_state: AppState = AppState()

simulation_dependency = Annotated[SimulationService, Depends(create_simulation_service)]


@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket, simulation_service: simulation_dependency
) -> None:
    manager = ConnectionManager()

    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()

            if data["command"] == "start":
                await simulation_service.start(data["controllerParams"])
                simulation_values = await simulation_service.get_values()
                await manager.broadcast(simulation_values)
    except WebSocketDisconnect:
        manager.disconnect(websocket)


"""
@app.websocket(path="/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)

    data = await websocket.receive_json()

    logger.debug("Recieved: %s", data)

    command_queue = asyncio.Queue()

    receiver_task = asyncio.create_task(
        coro=manager.receive_messages(websocket, command_queue, app_state)
    )

    simulation_task = None

    try:
        while True:
            command_message = command_queue.get_nowait()
            command = command_message.get("command")

            controller_params = command_message.get("controllerParams")

            if controller_params:
                await app_state.update_controller_params(controller_params["setPoint"])
                logger.info("setpoint : %s", controller_params["setPoint"])

            if command == "start":
                simulation_task = asyncio.create_task(
                    simulation_service.start_service(app_state=app_state)
                )

            if simulation_task and simulation_task.done():
                logger.info(
                    "simulation_task has finished. room_temp = %s",
                    app_state.room.room_temp,
                )

            if simulation_task and not simulation_task.done():
                logger.debug("simulation_task is running")
                simulation_values = await app_state.get_values()
                await manager.broadcast(simulation_values)

            await asyncio.sleep(1)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast({"info": "Client left"})
    except asyncio.CancelledError:
        logger.debug(msg="Asyncio cancelled aerror")
        await websocket.close()
"""
