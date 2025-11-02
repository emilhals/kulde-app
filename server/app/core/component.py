from __future__ import annotations
from typing import TYPE_CHECKING
from dataclasses import dataclass
from abc import ABC, abstractmethod

from app.logger import logger

if TYPE_CHECKING:
    from app.core.system import System


@dataclass
class Component(ABC):
    """Base class for all components."""

    component_name: str
    system: System | None

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
    async def get_values(self) -> dict[str, str | int | float]:
        pass
