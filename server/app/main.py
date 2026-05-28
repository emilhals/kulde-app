import asyncio
import http
import json
import signal

from websockets import Request, ServerConnection
from websockets.asyncio.server import serve
from websockets.exceptions import ConnectionClosed

from app.api.endpoint import Endpoint
from app.models.api import WebSocket
from app.models.simulator import ControllerParams
from app.services.simulation_service import SimulationService
from app.simulator.core.controller import Controller
from app.simulator.core.room import Room
from app.simulator.core.system import System
from app.utils.logger import logger, setup_logging


async def create_system(controller_params: ControllerParams | None = None) -> System:
    if controller_params is None:
        controller_params = {"setPoint": 4, "r01": 3}

    return System(
        controller=Controller(controller_params),
        room=Room(room_temp=24),
    )


def health_check(connection: ServerConnection, request: Request):
    if request.path == "/healthz":
        return connection.respond(http.HTTPStatus.OK, "OK\n")


async def handler(ws: WebSocket):
    endpoint = Endpoint()

    await endpoint.accept(ws)
    logger.info("Client connected. Connenctions: %s", len(endpoint.connections))

    system = await create_system()
    sim_service = SimulationService(
        endpoint=endpoint,
        system=system,
    )

    try:
        async for message in ws:
            try:
                event = json.loads(message)
            except json.JSONDecodeError:
                await endpoint.broadcast(
                    {
                        "status": "ERROR",
                        "message": "Invalid JSON",
                    },
                )
                continue

            command = event.get("command")
            controller_params = event.get("controllerParams")

            if command == "START":
                await sim_service.start(controller_params)
            elif command == "RESTART":
                await sim_service.restart(controller_params)
            elif command == "STOP":
                await sim_service.stop()
            else:
                logger.error("Unsupported event: %s", event)
    except ConnectionClosed:
        logger.info("Client disconnected")
    finally:
        await endpoint.close(ws)
        logger.info("Client removed. Connenctions: %s", len(endpoint.connections))


async def main():
    setup_logging()

    async with serve(handler, "0.0.0.0", 8001, process_request=health_check) as server:
        loop = asyncio.get_running_loop()
        loop.add_signal_handler(signal.SIGTERM, server.close)
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(main())
