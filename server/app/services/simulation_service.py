import asyncio
from dataclasses import dataclass, field
from enum import Enum

from app.api.endpoint import Endpoint
from app.models.simulator import ControllerParams
from app.simulator.core.system import System
from app.utils.logger import logger


class SimulationState(str, Enum):
    STOPPED = "stopped"
    RUNNING = "running"
    RESTART = "restart"


@dataclass
class SimulationService:
    endpoint: Endpoint
    system: System

    dt: float = 0.5
    time_scale: float = 60

    _state: SimulationState = field(default=SimulationState.STOPPED, init=False)
    _sim_task: asyncio.Task[None] | None = field(default=None, init=False)
    _broadcast_task: asyncio.Task[None] | None = field(default=None, init=False)
    _sim_time: float = field(default=0.0, init=False)

    async def start(self, controller_params: ControllerParams) -> None:
        if self._state == SimulationState.RUNNING:
            logger.warning("Simulation is already running")
            return

        if controller_params:
            await self.system.controller.update_params(controller_params)

        if not self.system.has_components():
            await self.system.build_components()
            await self.system.initialize_system()

        self._state = SimulationState.RUNNING
        await self.endpoint.broadcast({"status": "RUNNING"})

        self._sim_task = asyncio.create_task(self.simulation_loop())
        self._broadcast_task = asyncio.create_task(self.broadcast_values())

    async def update_params(self, params: dict[str, str | int | float]) -> None:
        if self._state != SimulationState.RUNNING:
            logger.warning("Cannot update params, simulation is not running")
            return
        await self.system.controller.update_params(params)

    async def stop(self) -> None:
        if self._state != SimulationState.RUNNING:
            await self.endpoint.broadcast({"status": "STOPPED"})
            return

        self._state = SimulationState.STOPPED
        await self.endpoint.broadcast({"status": "STOPPED"})

    async def restart(self, controllerParams: dict[str, str | int | float]) -> None:
        await self.endpoint.broadcast({"status": "RESTARTING"})

        await self._cancel_tasks()
        self._state = SimulationState.STOPPED

        self.system = await self.system.rebuild_system(controllerParams)

        await self.endpoint.broadcast({"status": "IDLE"})

    async def simulation_loop(self) -> None:
        try:
            while self._state == SimulationState.RUNNING:
                await self.system.simulate_system(dt=self.dt, sim_time=self._sim_time)
                self._sim_time += self.dt

                if self.system.controller.parameters["r12"] == 0:
                    await self.stop()
                    return

                await asyncio.sleep(2)
        except asyncio.CancelledError:
            logger.error("Simulation loop cancelled")
            raise
        except Exception as e:
            logger.error(f"Error in simulation loop: {e}", e)
            raise

    async def broadcast_values(self):
        try:
            while self._state == SimulationState.RUNNING:
                values = {}
                values["Service"] = {"dt": self.dt, "sim_time": self._sim_time}
                values["Room"] = {"room_temp": self.system.room.room_temp}

                values.update(await self.system.get_values())

                await self.endpoint.broadcast(values)
                await asyncio.sleep(2)
        except asyncio.CancelledError:
            logger.error("get_values cancelled")
            raise
        except Exception as e:
            logger.error(f"Error in get_values: {e}", e)
            raise

    def get_status(self):
        return self._state

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
