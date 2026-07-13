from __future__ import annotations

from dataclasses import dataclass, field
from enum import StrEnum
from typing import TYPE_CHECKING

from pyfluids import Fluid, FluidsList, Input
from pyfluids.fluids.fluid import AbstractFluid

from app.simulator.core.component import Component

if TYPE_CHECKING:
    from app.simulator.core.system import System


class RunState(StrEnum):
    STARTING = "starting"
    RUNNING = "running"
    IDLE = "idle"


class PowerState(StrEnum):
    ON = "on"
    OFF = "off"


@dataclass
class Compressor(Component):
    system: System | None = None
    component_name: str = "Compressor"

    power_state: PowerState = field(default=PowerState.OFF)
    run_state: RunState = field(default=RunState.IDLE)
    isentropic_efficieny: float = 0.75

    inlet_state: AbstractFluid | None = None
    outlet_state: AbstractFluid | None = None

    async def attach(self) -> None:
        await super().attach()

    async def detach(self) -> None:
        await super().detach()

    async def initialize(self) -> None:
        self.power_state = PowerState.ON
        self.run_state = RunState.RUNNING

    async def simulate_step(self, dt: float, sim_time: float) -> None:
        if not self.system:
            raise RuntimeError(
                f"{self.component_name} class does not have a controller!"
            )

        evaporator = next(
            c for c in self.system.components if c.component_name == "Evaporator"
        )

        condensator = next(
            c for c in self.system.components if c.component_name == "Condensator"
        )

        self.inlet_state = evaporator.outlet_state

        ideal = Fluid(FluidsList.R404A)
        ideal.update(
            Input.pressure(condensator.condensing_pressure),
            Input.entropy(self.inlet_state.entropy),
        )

        h_in = self.inlet_state.enthalpy
        h_ideal = ideal.enthalpy

        h_out = h_in + (h_ideal - h_in) / self.isentropic_efficieny

        self.outlet_state = Fluid(FluidsList.R404A)
        self.outlet_state.update(
            Input.pressure(condensator.condensing_pressure), Input.enthalpy(h_out)
        )

        controller = self.system.controller
        room = self.system.room

        set_point = float(controller.parameters["setPoint"])
        differential = float(controller.parameters["r01"])
        print(differential)

        if self.power_state == PowerState.OFF:
            self.run_state = RunState.IDLE
            return

        if self.run_state == RunState.RUNNING:
            if room.room_temp <= set_point:
                self.run_state = RunState.IDLE

        elif self.run_state == RunState.IDLE:
            if room.room_temp >= set_point + differential:
                self.run_state = RunState.RUNNING

    async def get_values(self) -> dict[str, str | int | float]:
        values: dict[str, str | int | float] = {
            "power_state": self.power_state,
            "run_state": self.run_state,
        }

        if self.outlet_state:
            values.update(
                {
                    "discharge_pressure": round(self.outlet_state.pressure / 1e5, 2),
                    "discharge_temp": round(self.outlet_state.temperature - 273.15, 2),
                    "overheat": 0,
                }
            )
        return values
