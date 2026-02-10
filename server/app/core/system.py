from dataclasses import dataclass, field

from app.api.websocket.connection_manager import ConnectionManager
from app.core.controller import Controller
from app.core.component import Component

from app.core.room import Room
from app.logger import logger

from app.components.compressor import Compressor
from app.components.evaporator import Evaporator
from app.components.condensator import Condensator
from app.components.txv import TXV


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

    def has_components(self):
        return True if len(self.components) > 0 else False

    async def get_values(self) -> dict[str, dict[str, str | int | float]]:
        values: dict[str, dict[str, str | int | float]] = {}
        for component in self.components:
            values[component.component_name] = await component.get_values()
        return values

    async def rebuild_system(self, controllerParams: dict[str, str | int | float]):
        print(f"rebuild: {controllerParams}")

        controller = Controller(controllerParams)
        room = Room(room_temp=24)

        system = System(
            controller=controller,
            room=room,
            manager=self.manager,
        )

        await system.add_component(Compressor())
        await system.add_component(Evaporator())
        await system.add_component(Condensator())
        await system.add_component(TXV())

        await system.initialize_system()

        return system
