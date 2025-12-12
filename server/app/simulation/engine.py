from dataclasses import dataclass, field
from typing import Optional

import asyncio

from app.logger import logger
from app.app_state import AppState
from app.simulation.refrigerant import Refrigerant

from app.utils.enums import RunStateEnum, PowerStateEnum


@dataclass
class Engine:
    """
    Core simulation engine
    """

    refrigerant: Optional[Refrigerant] = None

    async def run(
        self, command_queue, app_state: AppState, is_powered: bool, refrigerant: str
    ) -> None:
        self.refrigerant = Refrigerant(refrigerant=refrigerant)

        while is_powered:
            logger.debug("Hello from engine run")

            # hmm litt rart kanskje
            await app_state.compressor.run_compressor(
                controller=app_state.controller, room=app_state.room
            )

            if app_state.room.room_temp >= app_state.controller.set_point:
                if app_state.compressor.run_state == RunStateEnum["RUNNING"]:
                    await app_state.room.decrease_temperature()

                if app_state.compressor.run_state == RunStateEnum["IDLE"]:
                    app_state.compressor.power_state = PowerStateEnum["OFF"]
                    await app_state.room.increase_temperature()

                # wait longer if compressor is idle
                if app_state.compressor.run_state == RunStateEnum["IDLE"]:
                    await asyncio.sleep(5)
                else:
                    await asyncio.sleep(3)
        await asyncio.sleep(1)
