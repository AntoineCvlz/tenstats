# tenstats

Tennis analytics for the ATP and WTA tours: Elo ratings (overall and per
surface), player profiles, head-to-head records, tournament history and
background analyses.

Personal, non-commercial project. Phase 0 — repository skeleton and tooling.
The data pipeline and the analytics pages are not implemented yet.

## Stack

| Layer | Choice |
| --- | --- |
| ETL and computation | Python 3.12, `uv` |
| Database | PostgreSQL (Neon in production, Docker locally) |
| Web | Next.js 16 (App Router, Server Components), TypeScript strict, Tailwind CSS 4 |
| Tests | pytest, Vitest + Testing Library, Playwright |
| Hosting | Vercel |

Everything runs in Docker: the host needs only **Docker** and **Git**.

## Getting started

```sh
git clone <repository-url> tenstats
cd tenstats
cp .env.example .env
docker compose build dev
./dev.ps1 setup     # ./dev.sh setup on macOS and Linux
./dev.ps1 dev       # http://localhost:3000
```

## Commands

Every target runs inside the development container. Use `./dev.ps1 <target>`
on Windows, `./dev.sh <target>` elsewhere.

| Target | What it does |
| --- | --- |
| `setup` | Install all dependencies, the git hooks and the Playwright browser |
| `check` | Lint, type-check and test both stacks |
| `lint` / `format` / `typecheck` / `test` | Run a single stage |
| `test-e2e` | Playwright end-to-end suite |
| `build` | Production build of the web app |
| `dev` | Next.js development server on port 3000 |
| `clean` | Remove caches and build output |

Start the local database with `docker compose up -d db`.

The development server is published on host port 3000. If that port is already
taken, set `WEB_PORT` in `.env` to something else; the container always serves
on 3000 internally.

## Repository layout

```
.devcontainer/   development image
.github/         CI workflows and repository metadata
data/            raw CSV, git-ignored, reproducible by the pipeline
docs/            architecture, data dictionary, decision records
etl/             Python pipeline (the only writer to the database)
web/             Next.js application (read-only access to the database)
```

See [docs/architecture.md](docs/architecture.md).

## Data and licence

Match, ranking and player data come from Jeff Sackmann's
[tennis datasets](https://github.com/JeffSackmann) (`tennis_atp`,
`tennis_wta`), licensed under
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
Use is **non-commercial** and the attribution is displayed in the site footer.

Raw data is never committed: `./dev.ps1 setup` followed by the pipeline
regenerates `data/`.
