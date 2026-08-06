from enum import StrEnum, auto


class SimulationState(StrEnum):
    STOPPED = auto()
    RUNNING = auto()
    RESTART = auto()
    FINISHED = auto()
