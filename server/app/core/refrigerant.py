from dataclasses import dataclass


@dataclass
class Refrigerant:
    refrigerant: str = "R404a"

    def get_enthalpy(self, temperature):
        pass
