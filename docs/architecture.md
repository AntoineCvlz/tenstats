# Architecture

## Data flow

```
Jeff Sackmann CSV repositories
        │  (download, phase 1)
        ▼
    data/ (raw CSV, git-ignored, reproducible)
        │  extract → validate → transform → load   [etl/]
        ▼
    PostgreSQL (Neon in production, docker compose service "db" locally)
        │  read-only queries                        [web/]
        ▼
    Next.js pages (Server Components, ISR)
```

## Boundaries

- `etl/` owns every write to the database: downloads, validation, Elo
  computation, migrations.
- `web/` only reads. It uses a dedicated read-only Postgres role.
- The database schema is the only contract between the two. Neither side
  imports code from the other.

## Why pre-computation

Source data changes at most weekly, so every aggregate (Elo history, win rates,
head-to-head records) is computed once by the pipeline and stored. Pages then
serve plain indexed reads, which keeps the site inside free hosting tiers.

## Development environment

Everything runs in one container image (`.devcontainer/Dockerfile`): Python
3.12 with `uv`, Node 22 with `pnpm`, `make`, and the Playwright system
libraries. The host only needs Docker and Git. See
[ADR 0002](adr/0002-containerised-development-environment.md).

CI does not reuse that image: GitHub Actions installs `uv` and `pnpm` natively
because the hosted runners cache those toolchains, which is faster than
building the image on every run.

## Status

Phase 0 (repository skeleton, tooling, CI) is in place. The pipeline, the Elo
engine and the analytics pages are not implemented yet.
