from dataclasses import dataclass, field
from enum import Enum

from pyfluids import Fluid, FluidsList, Input
from pyfluids.fluids.fluid import AbstractFluid

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

    power_state: PowerStateEnum = field(default=PowerStateEnum.OFF)
    run_state: RunStateEnum = field(default=RunStateEnum.IDLE)
    isentropic_efficieny: float = 0.75

    inlet_state: AbstractFluid | None = None
    outlet_state: AbstractFluid | None = None

    setpoint_delay: int = 10

    _elapsed_time: int = 10
    _current_time: int = 0
    _setpoint_reached_time: int | None = None

    async def attach(self) -> None:
        await super().attach()

    async def detach(self) -> None:
        await super().detach()

    async def initialize(self) -> None:
        self.power_state = PowerStateEnum.ON
        self.run_state = RunStateEnum.RUNNING

    async def simulate_step(self) -> None:
        if not self.system:
            raise RuntimeError(
                f"{self.component_name} class does not have a controller!"
            )

        evaporator = next(
            c for c in self.system.components
            if c.component_name == "Evaporator"
        )

        condensator= next(
            c for c in self.system.components
            if c.component_name == "Condensator"
        )

        self.inlet_state = evaporator.outlet_state
        #if self.inlet_state is None:
        #    return


        ideal = Fluid(FluidsList.R404A)
        ideal.update(Input.pressure(condensator.condensing_pressure), Input.entropy(self.inlet_state.entropy))

        h_in = self.inlet_state.enthalpy
        h_ideal = ideal.enthalpy

        h_out = h_in + (h_ideal - h_in) / self.isentropic_efficieny

        self.outlet_state = Fluid(FluidsList.R404A)
        self.outlet_state.update(Input.pressure(condensator.condensing_pressure), Input.enthalpy(h_out))


        # bytt til dt fra simulation_service senere
        self._current_time += 3

        controller = self.system.controller
        room = self.system.room

        set_point = float(controller.parameters["set_point"])
        differential = float(controller.parameters["differential"])

        if self.power_state == PowerStateEnum.ON:
            if room.room_temp > set_point:
                self.run_state = RunStateEnum.RUNNING
                self._reached_setpoint = None
                await self.system.room.decrease_temperature()
            elif room.room_temp == set_point:
                if self._setpoint_reached_time is None:
                    self._setpoint_reached_time = self._current_time
                    self.run_state = RunStateEnum.IDLE

                elapsed = self._current_time - self._setpoint_reached_time
                if elapsed >= self.setpoint_delay:
                    await self.system.room.increase_temperature()

            if room.room_temp < set_point:
                self.run_state = RunStateEnum.IDLE
                self.power_state = PowerStateEnum.ON
                self._setpoint_reached_time = None

        if self.power_state == PowerStateEnum.OFF:
            if room.room_temp == set_point + differential:
                self.run_state = RunStateEnum.RUNNING
                self.power_state = PowerStateEnum.ON
                self._setpoint_reached_time = None

    async def get_values(self) -> dict[str, str | int | float]:
        values : dict [str, str | int | float]= {"power_state": self.power_state, "run_state": self.run_state}

        if self.outlet_state:
            values.update({
                "discharge_pressure": round(self.outlet_state.pressure / 1e5, 2),
                "discharge_temp": round(self.outlet_state.temperature - 273.15, 2)
            })
        return values
