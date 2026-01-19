from dataclasses import dataclass


@dataclass
class Room:
    room_temp: int
    ambient_temp: int = 16

    async def update_temperature(self) -> None:
        pass

    async def decrease_temperature(self) -> None:
        self.room_temp -= 1

    async def increase_temperature(self) -> None:
        self.room_temp += 1
