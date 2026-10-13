import logging

from tennis_etl.logging_config import DATE_FORMAT, LOG_FORMAT, configure_logging


def test_returns_package_logger() -> None:
    logger = configure_logging()

    assert logger.name == "tennis_etl"


def test_applies_requested_level() -> None:
    configure_logging(logging.DEBUG)

    assert logging.getLogger().level == logging.DEBUG


def test_repeated_calls_do_not_duplicate_handlers() -> None:
    configure_logging()
    handler_count = len(logging.getLogger().handlers)

    configure_logging()

    assert len(logging.getLogger().handlers) == handler_count


def test_installs_the_pipeline_formatter() -> None:
    configure_logging()

    formatter = logging.getLogger().handlers[0].formatter

    assert formatter is not None
    assert formatter._style._fmt == LOG_FORMAT
    assert formatter.datefmt == DATE_FORMAT
