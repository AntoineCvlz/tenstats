# 2. Containerised development environment

- Status: accepted
- Date: 2026-10-13

## Context

The project needs Python 3.12 with `uv`, Node 22 with `pnpm`, `make` and a
local PostgreSQL instance. The development machine is Windows and had none of
the language runtimes installed, only Node, Git and Docker.

## Decision

A single development image (`.devcontainer/Dockerfile`) carries both
toolchains. `docker-compose.yml` defines two services: `dev` (the toolchain,
with the repository bind-mounted at `/workspace`) and `db` (PostgreSQL 17).
All commands go through the `Makefile`, which is executed inside the `dev`
service; `dev.ps1` and `dev.sh` are thin host wrappers around
`docker compose run`.

Dependency trees live in named volumes (`etl/.venv`, `web/node_modules`, the
pnpm store, the Playwright browser cache) rather than in the bind mount,
because native binaries must not cross the Windows/Linux boundary and because
bind-mount I/O is slow on Windows.

Git hooks are driven by husky on the host and delegate to the container, so no
language runtime is required outside Docker. This replaces the `pre-commit`
framework originally planned for Python, which cannot be installed on a host
without Python.

CI keeps native `uv` and `pnpm` installs instead of this image: the hosted
runners cache those toolchains, which is faster than rebuilding the image.

## Consequences

- The host needs only Docker and Git.
- Every command is one indirection away (`./dev.ps1 check`), and each
  `docker compose run` starts a fresh container, so anything that must persist
  has to be a named volume or part of the image.
- The image and the CI workflow describe the toolchain twice and must be kept
  aligned; the Playwright version in the image mirrors `web/package.json`.
