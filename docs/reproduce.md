# Reproduce a result

Thank you for checking our work. Independent reproduction, including negative results, is welcome.

## Choose the right verification boundary

| Entry point | What it checks | What it does not establish |
| --- | --- | --- |
| [Hardware fixture](../research/hardware-verification-2026-11-19/README.md) | Seven expected synthetic scalar-output checksums | Optimized timing, element-by-element equality, or GPU performance |
| [OHIA Sky verifier](../research/ohia-sky/README.md) | Published receipt totals and selected statistical calculations | Re-running the original archive search or independently recovering objects |
| [OHIA Sky round 3](../research/ohia-sky/round-3/README.md) | Published numerical receipts and the documented Lean theorem checks | New astronomical discoveries or universal speedup |
| [Ohio weighted quotients](../research/ohio-weighted-quotients-2026-11-17/README.md) | Seeded scoped numerical comparison and specified Lean contracts | Advantage against all symmetry-reduced solvers or quantum-hardware acceleration |

## Record the environment

Before executing, capture the repository commit, exact command, operating system, language and library versions, hardware and any changed configuration. Use the project-specific instructions and preserve the original checked-in receipts. Run experiments in a clean copy when a script writes result files.

```sh
git rev-parse HEAD
python3 --version
```

## Submit the evidence

Include raw output, exit status, input identity or hash, expected and observed results, and whether the work was a receipt check, fresh execution, or independent reimplementation. For timing comparisons, separate cold start, compilation, kernel time, transfers, setup and total wall time; report repeated measurements and failures.

Please link to the relevant research note and commit. Do not publish personal information, secrets, unpublished third-party material or sensitive security reproduction details.

See [Contributing](../CONTRIBUTING.md) and [Security](../SECURITY.md).
