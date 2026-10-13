# Data dictionary

One section per table, listing every column with its type, unit, nullability
and meaning, plus the source column it derives from.

No table exists yet: the schema lands in phase 1 together with the Alembic
migrations. This file is updated in the same pull request as every migration.

## Conventions (fixed now, applied from phase 1)

- Table and column names in `snake_case`, singular table names.
- Dates as `date`, timestamps as `timestamptz`.
- Surfaces stored as a constrained enum: `hard`, `clay`, `grass`, `carpet`.
- Missing values stay `NULL`. Detailed serve and return statistics are absent
  from older matches and must never be silently replaced by zero or a mean.
- Every derived metric records the sample size it was computed from, so pages
  can flag small samples (fewer than 20 matches).
