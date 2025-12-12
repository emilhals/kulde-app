from dataclasses import dataclass
from pyfluids import Fluid, FluidsList, Input


@dataclass
class Refrigerant:
    refrigerant: str

    def get_available_fluids(self):
        pass

    def get_properties(self) -> Fluid:
        return Fluid(FluidsList[self.refrigerant])
