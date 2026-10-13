# Contributing

## Requirements

Docker and Git. No language runtime is installed on the host — see
[ADR 0002](docs/adr/0002-containerised-development-environment.md).

```sh
cp .env.example .env
docker compose build dev
./dev.ps1 setup
```

`setup` also installs the git hooks, which delegate to the container:

- `pre-commit`: lint-staged (Ruff on Python, ESLint and Prettier on
  TypeScript) and a gitleaks secret scan.
- `commit-msg`: commitlint.

## Workflow

1. One change, one branch, one pull request, ideally under 400 modified lines.
2. Write the test first when the change is testable.
3. Run `./dev.ps1 check` until it is green before pushing.
4. Open a pull request; CI must be green. Merges are squash merges onto
   `main`, which is protected.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/), in English:

```
feat(etl): load atp match results idempotently
fix(web): handle missing serve statistics on old matches
```

Allowed scopes: `etl`, `web`, `db`, `ci`, `docs`, `deps`, `repo`.

## Quality gates

- Python: Ruff, `mypy --strict`, pytest with coverage at or above 85 %.
- TypeScript: ESLint, Prettier, `tsc --noEmit`, Vitest with coverage at or
  above 80 %.

Never relax a lint rule, a CI job or a coverage threshold to make a failure go
away. A local exception must carry a comment explaining why.

## Documentation

Update the README when commands change, `docs/data-dictionary.md` with every
migration, and add an ADR for every structural decision.
