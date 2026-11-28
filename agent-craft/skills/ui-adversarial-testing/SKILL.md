---
name: ui-adversarial-testing
description: Tries to break a changed web UI the way real people do (double-submit, Escape and refresh mid-flow, empty and huge input, slow networks, narrow screens) and reports each check as PASS, FAIL, SKIP or NOT RUN with evidence. Use when QA-ing a pull request or new feature, testing beyond the happy path, or when asked "can you test this" or "try to break it". Without a browser it marks checks NOT RUN instead of passing them.
---

# UI Adversarial Testing

Find failures the author did not plan for. Start from the diff or named feature; do not turn a one-component change into a whole-product audit.

## Pick checks that fit the change

Only those relevant: empty, whitespace, huge and special-character input; double-click and double-submit; Escape, back and refresh mid-flow; loading, empty and error states; slow or failed requests and retry; narrow viewport overflow; keyboard-only use and focus; stale data and duplicate actions; console errors and failed network requests; role boundaries when test accounts exist.

Small change: 5 to 8 checks. Larger flow: more, prioritised by user impact.

## Report: one row per check

| # | Check | Steps | Expected | Actual | Evidence | Result |
|---|---|---|---|---|---|---|

Result is PASS, FAIL, SKIP or NOT RUN. Evidence is a screenshot, console line, network entry or exact observed text. No evidence, no PASS.

For each FAIL add a severity:
- **Blocker:** data loss, security or permission breach, flow cannot complete.
- **Major:** wrong result or broken state with a workaround.
- **Minor:** cosmetic or rare, low impact.

Reproduce a failure before suggesting a fix.

## No browser available

Do not guess. List the planned checks in the same table with Result **NOT RUN** and Actual left blank. Never mark anything PASS from reading code. You may add separate "code-reading concerns", clearly labelled as unverified.

## Summary line

End with counts (PASS / FAIL / SKIP / NOT RUN), the worst severity found, and what was not covered. Limited coverage is never "no bugs".
