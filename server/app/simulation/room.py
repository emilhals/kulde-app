import asyncio
from dataclasses import dataclass

from app.logger import logger
from app.utils.enums import RunStateEnum


@dataclass
class Room:
    room_temp: int = 24

    process_task: asyncio.Task[None] | None = None

    async def start(
        self, controller_setpoint: any, compressor_run_state: RunStateEnum
    ) -> None:
        self.process_task = asyncio.create_task(
            self._handle_temperature(
                controller_setpoint=controller_setpoint,
                compressor_run_state=compressor_run_state,
            )
        )

    async def _handle_temperature(
        self, controller_setpoint: float, compressor_run_state: RunStateEnum
    ) -> None:
        if self.room_temp >= controller_setpoint["value"] + 1:
            if compressor_run_state == RunStateEnum["RUNNING"]:
                await self._decrease_temperature(0.5)
        if compressor_run_state == RunStateEnum["IDLE"]:
            await self._increase_temperature(0.5)

    async def _increase_temperature(self, dt) -> None:
        self.room_temp += 0.1 * dt

    async def _decrease_temperature(self, dt) -> None:
        self.room_temp -= 0.5 * dt
