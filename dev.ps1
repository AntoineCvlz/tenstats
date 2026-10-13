#!/usr/bin/env pwsh
# Run a Makefile target inside the development container.
$ErrorActionPreference = 'Stop'
docker compose run --rm --service-ports dev make @args
exit $LASTEXITCODE
