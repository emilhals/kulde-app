from enum import Enum


class RunStateEnum(str, Enum):
    STARTING = "starting"
    RUNNING = "running"
    IDLE = "idle"


class PowerStateEnum(str, Enum):
    ON = "on"
    OFF = "off"
