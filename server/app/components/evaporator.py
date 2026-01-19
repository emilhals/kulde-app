from pyfluids import FluidsList, Fluid, Input

from dataclasses import dataclass, field
from enum import Enum

from pyfluids.fluids.fluid import AbstractFluid

from app.core.component import Component
from app.core.system import System


@dataclass
class Evaporator(Component):
    system: System | None = None
    component_name: str = "Evaporator"

    saturated_state: AbstractFluid | None = None
    outlet_state: AbstractFluid | None = None

    superheat: int = 8
    delta_temp: int = 10
    fan_speed: int = 0

    async def attach(self) -> None:
        await super().attach()

    async def detach(self) -> None:
        await super().detach()

    async def initialize(self) -> None:
        pass

    async def simulate_step(self) -> None:
        if not self.system:
            raise RuntimeError(
                f"{self.component_name} class does not have a controller!"
            )

        T_evap = self.system.room.room_temp - self.delta_temp
        self.saturated_state = Fluid(FluidsList.R404A).dew_point_at_temperature(T_evap)

        T_suction = T_evap + self.superheat + 273.15

        self.outlet_state = Fluid(FluidsList.R404A)
        self.outlet_state.update(
            Input.pressure(self.saturated_state.pressure), Input.temperature(T_suction)
        )

    async def get_values(self) -> dict[str, str | int | float]:
        if self.outlet_state is None or self.saturated_state is None:
            return {}

        return {
            "suction_pressure": round(self.outlet_state.pressure / 1e5, 2),
            "suction_temp": round(self.outlet_state.temperature - 273.15, 2),
        }
