---
name: check-the-work
description: Checks whether delegated work is really done by looking at git, CI and the running system instead of trusting the report. Use when an agent, subagent or teammate says "done", "fixed", "pushed", "CI green", "deployed" or "live", before you tell anyone it is finished, before merging, or when a worker has gone quiet. Not for in-depth code quality review.
---

# Check the Work

A report is a claim. Check git, CI and the running system yourself. If you could not check something, say "reported, not verified".

## What to check

- **Committed / pushed:** the commit is on the remote branch, not just local. Run `git status` too: uncommitted or unstaged changes in the working tree mean the reported work may not be what was committed.
- **Tests pass:** CI ran on the exact head commit, with a test count above zero. A job that ran zero tests failed.
- **Fixed:** the original failing case now passes and is in a test. Check that test is not marked skip, xfail, only, or given a raised timeout; a skipped or xfail test does not cover the fix.
- **Merged:** the merged tree was tested, not just the two branches separately.
- **Deployed:** the running version matches the commit.
- **Live:** a real user can complete the whole path in production, back end included.
- **Nothing else changed:** the diff touches only what the job was about; shared setup and test assertions were not weakened.

Quiet worker with no recent commits: ask one specific question with the evidence ("No commits on `branch` since 10:40. Where is the change to X?").

## Report

Lead with the verdict, then the discrepancies. Keep it short.

```
VERIFIED | PARTLY VERIFIED | NOT VERIFIED | CONTRADICTED
- <discrepancy: claimed X, record shows Y (commit/run id)>
- ...
Next: <one action that closes the biggest gap>
```

If everything checks out, one line with the commit and CI run ids is enough.
