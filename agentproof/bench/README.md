# bench

A/B harness for the skills. Each case is answered with and without the skill, by every model, then scored blind by two judge models. A criterion passes only when both judges agree.

| File | What it is |
|---|---|
| `cases/standard.json` | 14 everyday cases, a hard and an easy one per skill |
| `cases/trap.json` | 7 trap cases, each built around the mistake one skill prevents |
| `cases/trap2.json` | Round two: expert-council rerun with the number-check step, plus harder check-the-work and adversarial-verification traps |
| `cases/trigger.json` | 16 requests for the skill-selection test |
| `results/*.jsonl` | Every answer and every judge score from our runs |

Note: in `results-trap.jsonl` the expert-council rows use the earlier skill without Step 0 (number check). `results-trap2.jsonl` has the current skill; the headline uses that.

Your key stays in `openrouter.key` (git-ignored) or `OPENROUTER_API_KEY`.
