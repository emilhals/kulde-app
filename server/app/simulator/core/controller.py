from dataclasses import dataclass

from app.models.simulator import ControllerParams


@dataclass
class Controller:
    parameters: ControllerParams

    async def update_params(self, params: dict[str, str | int | float]):
        for key, value in params.items():
            self.parameters[key] = value
