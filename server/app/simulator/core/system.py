from dataclasses import dataclass, field

from app.models.simulator import ControllerParams
from app.simulator.components.compressor import Compressor
from app.simulator.components.condensator import Condensator
from app.simulator.components.evaporator import Evaporator
from app.simulator.components.txv import TXV
from app.simulator.core.component import Component
from app.simulator.core.controller import Controller
from app.simulator.core.room import Room
from app.utils.logger import logger


@dataclass
class System:
    controller: Controller
    room: Room
    components: list[Component] = field(default_factory=list)
    refrigerant: str = "R404a"

    @classmethod
    async def create(cls, controller_params: ControllerParams):
        controller = Controller(controller_params)
        room = Room(room_temp=24)

        system = cls(
            controller=controller,
            room=room,
        )

        await system.build_components()
        await system.initialize_system()

        return system

    async def build_components(self) -> None:
        self.components.clear()

        compressor = Compressor()
        evaporator = Evaporator()
        condensator = Condensator()
        txv = TXV()

        await self.add_component(compressor)
        await self.add_component(evaporator)
        await self.add_component(condensator)
        await self.add_component(txv)

    async def initialize_system(self) -> None:
        logger.info("Initialized system")

        for component in self.components:
            logger.info("Initialized: %s", component.component_name)
            await component.initialize()

    async def simulate_system(self, dt: float, sim_time: float) -> None:
        for name in ["Evaporator", "Condensator", "Compressor", "TXV"]:
            component = next(c for c in self.components if c.component_name == name)
            await component.simulate_step(dt=dt, sim_time=sim_time)

    async def add_component(self, component: Component) -> None:
        self.components.append(component)
        component.system = self

    async def remove_component(self, component: Component) -> None:
        self.components.remove(component)
        component.system = None

    def has_components(self):
        return len(self.components) > 0

    async def get_values(self) -> dict[str, dict[str, str | int | float]]:
        values: dict[str, dict[str, str | int | float]] = {}
        for component in self.components:
            values[component.component_name] = await component.get_values()
        return values

    async def rebuild_system(self, controller_params: ControllerParams):
        return await System.create(controller_params)
