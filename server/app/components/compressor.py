from dataclasses import dataclass, field
from enum import Enum

from app.core.component import Component
from app.core.system import System


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

    async def _run_compressor(self) -> None:
        if not self.system:
            raise RuntimeError("Compressor class does not have a controller!")

        controller = self.system.controller

        room_temp = float(controller.parameters["u56"])
        set_point = float(controller.parameters["setPoint"])
        differential = float(controller.parameters["differential"])

        if self.power_state == PowerStateEnum.ON:
            if room_temp > set_point:
                self.run_state = RunStateEnum.RUNNING
            elif room_temp == set_point:
                self.run_state = RunStateEnum.IDLE

        if self.power_state == PowerStateEnum.OFF:
            if room_temp == set_point + differential:
                self.run_state = RunStateEnum.RUNNING
                self.power_state = PowerStateEnum.ON

    async def get_values(self) -> dict[str, str | int | float]:
        return {"power_state": self.power_state, "run_state": self.run_state}
