from typing import AsyncGenerator

from fastapi import Depends
from app.core.room import Room
from app.logger import logger
from app.components.compressor import Compressor
from app.core.controller import Controller
from app.core.system import System
from app.services.simulation_service import SimulationService


async def create_system() -> AsyncGenerator[System, None]:
    logger.info("Created new system")
    controller = Controller({"set_point": 4, "differential": 3})
    room = Room(room_temp=24)
    system = System(controller=controller, room=room)

    compressor = Compressor()

    await system.add_component(compressor)

    await system.initialize_system()

    try:
        yield system
    finally:
        # shutdown logikk
        pass


async def get_system() -> System:
    async for system in create_system():
        return system
    raise RuntimeError("Failed to create system")


async def create_simulation_service(
    system: System = Depends(create_system),
) -> SimulationService:
    return SimulationService(system)
