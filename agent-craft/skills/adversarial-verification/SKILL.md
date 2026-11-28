---
name: adversarial-verification
description: Tries to prove a claim wrong before you trust it: hunts counterexamples, checks whether the checker itself could pass while the thing is broken, and gives a PASS / REPAIR / REJECT / NOT VERIFIED verdict. Use when someone says "verified", "proved", "safe", "fixed" or "beats the benchmark", or before a research, security or benchmark claim others will rely on. Not for routine code review.
---

# Adversarial Verification

Ask **"what would make this false, and can I make that happen?"**, not "can I confirm this?". Agreement is not verification; a passing test is evidence about that case only.

## Pick a mode

- **Lightweight (default for quick calls):** state the claim in one line, list 3 to 5 kill conditions, try the cheapest ones, give a verdict. A few lines total.
- **Full:** for research, proofs, security or safety guarantees, benchmarks, or claims others will rely on. Use independent lanes below.

## Full mode

Pin the claim and scope before checking. Never strengthen the claim after seeing good results.

Run separate attack lanes, blind to each other where practical:
- **Counterexample hunter:** valid-looking cases where it should fail.
- **Assumption auditor:** hidden, circular or unrealistic assumptions.
- **Re-deriver:** reproduce independently from sources, data or code.
- **Oracle auditor:** could the checker pass while the system is wrong? A checker trusting mutable state it should verify is an oracle defect.
- **Boundary reviewer:** what the result does not establish.

Strong checks: known-false controls, "proves too much" (does the method also certify something false?), ablating each load-bearing assumption, coverage gaps, and whether the running system matches the spec that was verified.

## Discipline

- "No failure found" is not "safe". "Tests pass" is not "correct". A formal proof covers the model, not the implementation, without a correspondence argument.
- Classify a failure before fixing it (claim wrong, implementation bug, oracle blind spot, coverage gap, bad assumption, source error).
- A fix counts only once the failing case is a regression test and affected checks are rerun.
- If correctness needs unrealistic assumptions or patches keep piling up, say REDESIGN or REJECT.

## Waiting on lanes

Do not **promote** the claim while a required lane is outstanding just because earlier lanes passed. You may take reversible interim actions meanwhile (draft, stage behind a flag, prepare a rollback), labelled as provisional. Irreversible or external actions wait.

## Output

Lightweight: verdict, claim, kill conditions tried and results, what remains unchecked.

Full:
```
VERDICT: PASS | PASS WITH LIMITS | REPAIR | REJECT | NOT VERIFIED
CLAIM / NON-CLAIMS
ATTACKS RUN and results
FINDINGS (with evidence and classification)
REMAINING GAPS
NEXT ACTION
```
Keep a short note of disproved routes so they are not retried.
