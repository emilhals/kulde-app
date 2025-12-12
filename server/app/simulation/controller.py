from dataclasses import dataclass


@dataclass
class Controller:
    """
    Class for the refrigeration unit controller.
    """

    set_point: float = 4
    differential: float = 3

    run_compressor: bool = False

    # async observer pattern
