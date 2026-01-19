from dataclasses import dataclass

from pyfluids import Input, Fluid, FluidsList
from pyfluids.fluids.fluid import AbstractFluid

from app.core.component import Component
from app.core.system import System

@dataclass
class TXV(Component):
    system: System | None = None
    component_name: str = "TXV"

    inlet_state: AbstractFluid | None = None
    outlet_state: AbstractFluid | None = None

    target_superheat: float = 8.0

    async def attach(self) -> None:
        await super().attach()

    async def detach(self) -> None:
        await super().detach()

    async def initialize(self) -> None:
        pass

    async def simulate_step(self) -> None:
        if not self.system:
            raise RuntimeError("TXV does not belong to system.")

        condensator  = next(c for c in self.system.components if c.component_name == "Condensator")
        evaporator= next(c for c in self.system.components if c.component_name == "Evaporator")

        self.inlet_state = condensator.outlet_state

        if self.inlet_state is None:
            self.outlet_state = None
            return

        h_in = self.inlet_state.enthalpy
        self.outlet_state = Fluid(FluidsList.R404A)
        self.outlet_state.update(Input.pressure(evaporator.saturated_state.pressure), Input.enthalpy(h_in))

    async def get_values(self) -> dict[str, str | int | float]:
        if self.outlet_state is None:
            return {"status": "idle"}

        values: dict[str, str | int | float ] = {"outlet_pressure": round(self.outlet_state.pressure / 1e5, 2)}

        if self.outlet_state.quality is None:
            values["quality"] = "N/A"
            values["phase"] = self.outlet_state.phase.name
        else:
            values["quality"] = round(self.outlet_state.quality, 3)
            values["phase"] = "two-phase"

        return values 
