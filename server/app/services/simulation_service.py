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


@dataclass
class SimulationService:
    system: System
    manager: ConnectionManager
    dt: float = 3.0

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

    async def get_values(self):
        try:
            while self._state == SimulationState.RUNNING:
                values = {}
                values["Room"] = {"room_temp": self.system.room.room_temp}
                # values["Controller"] = self.controller.
                for component in self.system.components:
                    values[component.component_name] = await component.get_values()
                await self.manager.broadcast(values)

                await asyncio.sleep(self.dt)
        except asyncio.CancelledError:
            logger.info("get_values cancelled")
            raise
        except Exception as e:
            logger.info(f"Error in get_values: {e}", e)
            raise
