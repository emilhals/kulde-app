import asyncio
from enum import Enum
from dataclasses import dataclass, field

from app.api.websocket.connection_manager import ConnectionManager
from app.core.system import System
from app.logger import logger


class SimulationState(str, Enum):
    STOPPED = "stopped"
    RUNNING = "running"
    PAUSED = "paused"

manager = ConnectionManager()

@dataclass
class SimulationService:
    system: System
    dt: float = 1.0

    _state: SimulationState = field(default=SimulationState.STOPPED, init=False)
    _sim_task: asyncio.Task[None] | None = field(default=None, init=False)
    _broadcast_task: asyncio.Task[None] | None = field(default=None, init=False) 

    async def start(self, controllerParams: dict[str, str | int | float]) -> None:
        if self._state == SimulationState.RUNNING:
            logger.warning("Simulation is already running")
            return

        self._state = SimulationState.RUNNING
        await self.system.initialize_system()

        self._sim_task = asyncio.create_task(self.simulation_loop())
        self._broadcast_task = asyncio.create_task(self.get_values())

    async def pause(self) -> None:
        self._state = SimulationState.PAUSED
        self._sim_task.cancel()

    async def stop(self) -> None:
        pass

    async def simulation_loop(self) -> None:
        try:
            while self._state == SimulationState.RUNNING:
                await self.system.simulate_system()
                await asyncio.sleep(self.dt)
        except asyncio.CancelledError:
            logger.info("Simulation loop cancelled")
            raise
        except Exception as e:
            logger.error(f"Error in simulation loop: {e}", e)
            raise

    async def get_values(self) -> None:
        try:
            while self._state == SimulationState.RUNNING: 
                values = {}
                values["room"] = {"room_temp": self.system.room.room_temp}
                for component in self.system.components:
                    values[component.component_name] = await component.get_values()

                logger.debug("values: %s", values)
                await manager.broadcast(values)
                await asyncio.sleep(1)
        except asyncio.CancelledError:
            logger.info("get_values cancelled")
            raise
        except Exception as e:
            logger.info(f"Error in get_values: {e}", e)
            raise

