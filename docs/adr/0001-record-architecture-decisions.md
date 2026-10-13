# 1. Record architecture decisions

- Status: accepted
- Date: 2026-10-13

## Context

The project is built incrementally over several phases. Decisions about the
stack, the data model and the deployment pipeline need to stay traceable so
later changes can be judged against the reasoning that produced them.

## Decision

Every structural decision is recorded as a short architecture decision record
in `docs/adr/`, numbered sequentially, written in the pull request that
implements the decision.

## Consequences

- Reviewers see the reasoning, not only the diff.
- Superseded records are kept and marked as superseded rather than deleted.
