import re

import tennis_etl

SEMVER_PATTERN = re.compile(r"^\d+\.\d+\.\d+$")


def test_exposes_a_semver_version() -> None:
    assert SEMVER_PATTERN.match(tennis_etl.__version__)
