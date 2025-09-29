import asyncio
from dataclasses import dataclass

from app.app_state import AppState

from app.logger import logger

@dataclass
class SimulationService:
    async def start_service(self, app_state: AppState) -> None:
        try:
            while True:
                await app_state.run_simulation()

                await asyncio.sleep(1)
        except Exception as e:
            logger.error("Error from SimulationService: %s", e)
