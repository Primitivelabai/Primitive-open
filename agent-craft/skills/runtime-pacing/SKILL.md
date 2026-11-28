---
name: runtime-pacing
description: Keeps agents on a shared run clock so they explore early, converge near a time target and stop at an honest checkpoint, without ever skipping tests, reviews, approvals or deadline gates. Use when a run has a time or latency target, a deadline or cutoff, helpers joining mid-run, or an instruction to "hurry", "converge" or "ship it fast". Not a replacement for the runtime's scheduler, timeouts or approval gates.
---

# Runtime Pacing

> Time pressure changes strategy. It never skips gates or approvals.

## Pace by how far along the run is

- **Early:** investigate real uncertainty; parallelise independent work.
- **Mid:** stop duplicate searches, rereading, speculative branches and polish.
- **Near target:** finish the requested outcome, mandatory checks and a recoverable checkpoint; note remaining uncertainty.
- **Past target:** do not fake completion. Reach the safest useful checkpoint and state the overrun.

Helpers joining a run inherit its start time and target; delegation does not reset the clock. Stop helpers whose output is no longer needed. If no trustworthy elapsed time is available, say so and work normally; never invent a clock.

## Never, whatever the time

Skip required tests, review or approval; widen scope or authority; merge, deploy, publish, pay or send without authority; present assumptions as evidence.

## Hard deadline that is also a gate

If the deadline itself is a gate (for example "must not deploy after 17:00" or a submission cutoff), respect it as a gate: when the remaining required checks cannot finish in time, do not rush them or ship unchecked. Stop at the deadline with a clear checkpoint and report what is incomplete. Missing the deadline honestly beats passing it with skipped gates.

## Status

One line when useful: `[elapsed 7m / target 10m, phase: verify, next: rerun tests]`. Omit unknown fields.

`references/portable-spec.md` has the full spec if you are implementing pacing in a runtime.
