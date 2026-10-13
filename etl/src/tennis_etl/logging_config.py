"""Logging configuration for the pipeline.

The pipeline never writes to stdout directly; every message goes through the
standard library logger so that scheduled runs produce parsable output.
"""

import logging
from typing import Final

LOG_FORMAT: Final = "%(asctime)s %(levelname)-8s %(name)s %(message)s"
DATE_FORMAT: Final = "%Y-%m-%dT%H:%M:%S%z"


def configure_logging(level: int = logging.INFO) -> logging.Logger:
    """Configure the root logger and return the pipeline logger.

    Calling this more than once replaces the previous handlers, so repeated
    calls in tests or notebooks do not duplicate log lines.

    Args:
        level: Minimum severity emitted by the root logger.

    Returns:
        The logger dedicated to the `tennis_etl` package.
    """
    logging.basicConfig(
        level=level,
        format=LOG_FORMAT,
        datefmt=DATE_FORMAT,
        force=True,
    )
    return logging.getLogger("tennis_etl")
