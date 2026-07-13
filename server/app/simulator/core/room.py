from dataclasses import dataclass


@dataclass
class Room:
    room_temp: float
    outside_temp: float = 24

    cooling_rate: float = 0.02
    heat_rate: float = 0.005

    async def simulate_step(self, dt: float, cooling: bool) -> None:
        if cooling:
            self.room_temp -= self.cooling_rate * dt
        else:
            self.room_temp += self.heat_rate * dt
