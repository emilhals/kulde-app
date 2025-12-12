from dataclasses import dataclass


@dataclass
class Controller:
    parameters: dict[str, str | int | float]

    async def update_params(self, params: dict[str, str | int | float]):
        for key, value in params.items():
            self.parameters[key] = value
