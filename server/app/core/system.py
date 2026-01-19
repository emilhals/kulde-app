from dataclasses import dataclass, field

from app.api.websocket.connection_manager import ConnectionManager
from app.core.controller import Controller
from app.core.component import Component

from app.core.room import Room
from app.logger import logger


@dataclass
class System:
    manager: ConnectionManager
    controller: Controller
    room: Room
    components: list[Component] = field(default_factory=list)
    refrigerant: str = "R404a"

    async def initialize_system(self) -> None:
        logger.info("Initialized system")
        for component in self.components:
            logger.info("Initialized: %s", component.component_name)
            await component.initialize()

    async def simulate_system(self) -> None:
        for name in ["Evaporator", "Condensator", "Compressor", "TXV"]:
            component = next(c for c in self.components if c.component_name == name)
            await component.simulate_step()

    async def add_component(self, component: Component) -> None:
        self.components.append(component)
        component.system = self

    async def remove_component(self, component: Component) -> None:
        self.components.remove(component)
        component.system = None

    # async def update_components(self, newState: dict[str, int | float]) -> None:
    #    for component in self.components:
    #        await component.update(newState)

    async def get_values(self) -> dict[str, dict[str, str | int | float]]:
        values: dict[str, dict[str, str | int | float]] = {}
        for component in self.components:
            values[component.component_name] = await component.get_values()
        return values
