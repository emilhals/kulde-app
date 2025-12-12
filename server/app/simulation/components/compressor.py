import asyncio

from dataclasses import dataclass

from pyfluids import Input

from app.logger import logger
from app.utils.enums import RunStateEnum, PowerStateEnum
from app.simulation.controller import Controller

from app.simulation.room import Room


@dataclass
class Compressor:
    run_state: RunStateEnum
    power_state: PowerStateEnum

    startup_delay: float = 3.0

    room: Room | None = None
    controller: Controller | None = None

    compressor_task: asyncio.Task[None] | None = None

    async def start(self, controller: Controller, room: "Room") -> None:
        if self.power_state is PowerStateEnum["ON"]:
            self.controller = controller
            self.room = room
            await self._run_compressor(controller=controller, room=room)

    async def stop(self) -> None:
        if self.compressor_task:
            self.compressor_task.cancel()

    async def _run_compressor(self, controller: Controller, room: Room) -> None:
        logger.info(
            "Compressor run state: %s | Compressor power state: %s",
            self.run_state,
            self.power_state,
        )
        if self.power_state == PowerStateEnum["ON"]:
            if room.room_temp > controller.set_point["value"]:
                self.run_state = RunStateEnum["RUNNING"]
            elif room.room_temp == controller.set_point["value"]:
                self.run_state = RunStateEnum["IDLE"]

        if self.power_state == PowerStateEnum["OFF"]:
            if (
                room.room_temp
                == controller.set_point["value"] + controller.differential["value"]
            ):
                self.run_state = RunStateEnum["RUNNING"]
                self.power_state = PowerStateEnum["ON"]

    async def get_lp(self, app_state):
        fluid = app_state.refrigerant.get_properties()
        fluid.update(Input.temperature(app_state.room.room_temp), Input.quality(0))

        return fluid.pressure / 1.0e5
