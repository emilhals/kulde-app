import asyncio
from dataclasses import dataclass, field
from enum import Enum

from app.core.component import Component
from app.core.system import System
from app.logger import logger


class RunStateEnum(str, Enum):
    STARTING = "starting"
    RUNNING = "running"
    IDLE = "idle"


class PowerStateEnum(str, Enum):
    ON = "on"
    OFF = "off"


@dataclass
class Compressor(Component):
    system: System | None = None
    component_name: str = "Compressor"
    startup_delay: float = 3.0

    power_state: PowerStateEnum = field(default=PowerStateEnum.OFF)
    run_state: RunStateEnum = field(default=RunStateEnum.IDLE)

    async def attach(self) -> None:
        await super().attach()

    async def detach(self) -> None:
        await super().detach()

    async def initialize(self) -> None:
        self.power_state = PowerStateEnum.ON
        self.run_state = RunStateEnum.RUNNING

    async def simulate_step(self) -> None:
        if not self.system:
            raise RuntimeError("Compressor class does not have a controller!")

        controller = self.system.controller
        room = self.system.room

        set_point = float(controller.parameters["set_point"])
        differential = float(controller.parameters["differential"])

        logger.info("powerState: %s | runState: %s", self.power_state, self.run_state)

        if self.power_state == PowerStateEnum.ON:
            if room.room_temp > set_point:
                self.run_state = RunStateEnum.RUNNING
            elif room.room_temp == set_point:
                self.run_state = RunStateEnum.IDLE

        if self.power_state == PowerStateEnum.OFF:
            if room.room_temp == set_point + differential:
                self.run_state = RunStateEnum.RUNNING
                self.power_state = PowerStateEnum.ON

    async def get_values(self) -> dict[str, str | int | float]:
        return {"power_state": self.power_state, "run_state": self.run_state}
