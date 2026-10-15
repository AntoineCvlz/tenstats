# 3. Switch data source to the Aneeshers archive mirror

- Status: accepted
- Date: 2026-10-15

## Context

The project's data source was specified as Jeff Sackmann's GitHub
repositories (`tennis_atp`, `tennis_wta`, `tennis_slam_pointbypoint`). As of
2026-10-13, all three return 404 from the GitHub API; the account is alive
but exposes a single public repo (`tennis_MatchChartingProject`). Re-checked
on 2026-10-15: still 404. Whether the repos were deleted, renamed or made
private is unknown.

## Decision

Use `Aneeshers/tennis-sackmann-archive` as the data source instead. It is a
complete mirror of the original Sackmann CSVs (matches 1968-2026, players,
rankings), declares the same CC BY-NC-SA 4.0 licence in its README, and was
created 2026-06-25 (~145 MB). The ETL's download step points at this repo;
the base URL stays configurable so the pipeline can be repointed if the
original repos come back or the mirror disappears.

Schema is unchanged: `atp_matches_*.csv` (49 columns), `atp_players.csv`
(8 columns), `atp_rankings_*.csv` (4 columns).

## Consequences

- Attribution (footer, README, data-dictionary) must credit both Jeff
  Sackmann (original author) and the Aneeshers archive (current host).
- The pipeline has one more single point of failure: an unofficial mirror
  with no update guarantee. Acceptable for a personal, free-tier project;
  revisit if Sackmann's repos resurface or the mirror goes stale.
