from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import TYPE_CHECKING

from app.utils.logger import logger

if TYPE_CHECKING:
    from app.simulator.core.system import System


@dataclass
class Component(ABC):
    component_name: str
    system: System | None

    inlet_state = None
    outlet_state = None

    async def attach(self) -> None:
        if self.system:
            await self.system.add_component(self)
        else:
            logger.error("System does not exist")

    async def detach(self) -> None:
        if self.system:
            await self.system.remove_component(self)
            self.system = None
        else:
            logger.error("System does not exist")

    @abstractmethod
    async def initialize(self) -> None:
        pass

    @abstractmethod
    async def simulate_step(self, dt: float, sim_time: float) -> None:
        pass

    @abstractmethod
    async def get_values(self) -> dict[str, str | int | float]:
        pass
