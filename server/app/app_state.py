from dataclasses import dataclass, field

from app.simulation.controller import Controller
from app.simulation.room import Room

from app.simulation.components.compressor import Compressor

from app.utils.enums import RunStateEnum, PowerStateEnum


@dataclass
class AppState:
    controller: Controller = field(init=False)
    room: Room = field(init=False)
    compressor: Compressor = field(init=False)

    def __post_init__(self) -> None:
        self.room = Room(room_temp=24)
        self.controller = Controller(set_point=4, differential=3)
        self.compressor = Compressor(
            run_state=RunStateEnum["IDLE"], power_state=PowerStateEnum["ON"]
        )

    async def run_simulation(self) -> None:
        await self.compressor.start(controller=self.controller, room=self.room)
        await self.room.start(
            controller_setpoint=self.controller.set_point,
            compressor_run_state=self.compressor.run_state,
        )

    async def get_values(
        self,
    ) -> dict[str, int | RunStateEnum | PowerStateEnum | dict[str, float | int]]:
        return {
            "room_temp": self.room.room_temp,
            "compressor_run_status:": self.compressor.run_state,
            "compressor_power_status": self.compressor.power_state,
            "controller": {
                "u56": self.room.room_temp,
                "setPoint": self.controller.set_point,
                "r01": self.controller.differential,
            },
        }

    async def update_controller_params(self, set_point) -> None:
        self.controller.set_point = set_point

    async def stop_simulation(self) -> bool:
        return False
