import logging.config

import pathlib
import json

import logging


def load_config() -> None:
    config_file = pathlib.Path("app/logging_config.json")
    with open(config_file) as f_in:
        config = json.load(f_in)

    logging.config.dictConfig(config)


logger = logging.getLogger(__name__)
