import asyncio
from enum import Enum
from dataclasses import dataclass, field

from app.api.websocket.connection_manager import ConnectionManager
from app.core.system import System
from app.logger import logger


class SimulationState(str, Enum):
    STOPPED = "stopped"
    RUNNING = "running"
    RESTART = "restart"


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
        await self.manager.broadcast({"status": "RUNNING"})

        if self.system.has_components() is False:
            await self.system.initialize_system()

        self._sim_task = asyncio.create_task(self.simulation_loop())
        self._broadcast_task = asyncio.create_task(self.get_values())

    async def stop(self) -> None:
        self._state = SimulationState.STOPPED
        await self.manager.broadcast({"status": "STOPPED"})

    async def restart(self, controllerParams: dict[str, str | int | float]) -> None:
        await self.manager.broadcast({"status": "RESTARTING"})

        await self._cancel_tasks()
        self._state = SimulationState.STOPPED

        self.system = await self.system.rebuild_system(controllerParams)

        await self.manager.broadcast({"status": "IDLE"})

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

    async def _cancel_tasks(self):
        for task in [self._sim_task, self._broadcast_task]:
            if task and not task.done():
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass

        self._sim_task = None
        self._broadcast_task = None
