import logging.config
from pathlib import Path

import yaml


def setup_logging():
    config_path = Path("app/logger.config.yaml")

    with open(config_path) as file:
        config = yaml.safe_load(file)
    logging.config.dictConfig(config)


logger = logging.getLogger(__name__)
