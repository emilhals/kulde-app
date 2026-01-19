from typing import AsyncGenerator

from fastapi import Depends
from app.core.room import Room
from app.logger import logger
from app.components.compressor import Compressor
from app.components.evaporator import Evaporator
from app.components.condensator import Condensator
from app.components.txv import TXV
from app.core.controller import Controller
from app.core.system import System
from app.services.simulation_service import SimulationService
from app.api.websocket.connection_manager import ConnectionManager

manager = ConnectionManager()


async def create_system() -> AsyncGenerator[System, None]:
    logger.info("Created new system")
    controller = Controller({"set_point": 4, "differential": 3})
    room = Room(room_temp=24)
    manager = ConnectionManager
    system = System(controller=controller, room=room, manager=manager)

    compressor = Compressor()
    evaporator = Evaporator()
    condensator = Condensator()
    txv = TXV()

    await system.add_component(compressor)
    await system.add_component(evaporator)
    await system.add_component(condensator)
    await system.add_component(txv)

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


async def get_manager() -> ConnectionManager:
    return manager


async def create_simulation_service(
    system: System = Depends(create_system),
) -> SimulationService:
    return SimulationService(system=system, manager=manager)
