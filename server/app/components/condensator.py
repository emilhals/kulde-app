from dataclasses import dataclass, field

from pyfluids import FluidsList, Fluid, Input
from pyfluids.fluids.fluid import AbstractFluid

from app.core.component import Component
from app.core.system import System


@dataclass
class Condensator(Component):
    system: System | None = None
    component_name: str = "Condensator"

    inlet_state: AbstractFluid | None = None
    outlet_state: AbstractFluid | None = None

    condensing_temp: float | None = None
    condensing_pressure: float | None = None

    delta_temp: int = 15
    subcooling: int = 12
    fan_speed: int = 0

    async def attach(self) -> None:
        await super().attach()

    async def detach(self) -> None:
        await super().detach()

    async def initialize(self) -> None:
        # self.power_state = PowerStateEnum.ON
        # self.run_state = RunStateEnum.RUNNING
        pass

    async def simulate_step(self) -> None:
        if not self.system:
            raise RuntimeError(
                f"{self.component_name} class does not have a controller!"
            )

        ambient_temp = self.system.room.ambient_temp
        self.condensing_temp = ambient_temp + self.delta_temp

        saturated_liquid = Fluid(FluidsList.R404A)
        saturated_liquid.update(
            Input.temperature(self.condensing_temp), Input.quality(0.0)
        )
        self.condensing_pressure = saturated_liquid.pressure

        compressor = next(
            c for c in self.system.components if c.component_name == "Compressor"
        )

        self.inlet_state = compressor.outlet_state
        if self.inlet_state is None:
            self.outlet_state = None
            return

        liquid_out_temp = self.condensing_temp - self.subcooling + 273.15

        self.outlet_state = Fluid(FluidsList.R404A)
        self.outlet_state.update(
            Input.pressure(self.condensing_pressure), Input.temperature(liquid_out_temp)
        )

    async def get_values(self) -> dict[str, str | int | float]:
        if self.condensing_pressure is None or self.condensing_temp is None:
            return {"status": "not_initialized"}

        values = {
            "condensing_temp": round(self.condensing_temp, 1),
            "condensing_pressure": round(self.condensing_pressure / 1e5, 2),
            "subcooling": self.subcooling,
        }

        if self.outlet_state is None:
            values["status"] = "waiting_for_compressor"
        else:
            values["liquid_temp"] = round(self.outlet_state.temperature - 273.15, 2)
        values["status"] = "condensing"

        return values
