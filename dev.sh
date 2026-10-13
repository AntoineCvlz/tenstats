#!/usr/bin/env sh
# Run a Makefile target inside the development container.
set -eu
exec docker compose run --rm --service-ports dev make "$@"
