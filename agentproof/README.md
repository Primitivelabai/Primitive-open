# agent proof

**Seven skills that stop AI agents making the mistakes that cost you.**

Agents are fast and confident. That's the problem. They say "done" when CI ran zero tests. They ship at 16:59 because someone said hurry. They pass a QA check they never ran. They believe the sums in your spreadsheet.

agent proof is seven short skills, each aimed at one of those failures. One command installs them into Claude Code, Codex, Cursor or any agent that reads `SKILL.md` folders.

![Two punnets: 23/63 runs dodged the trap without the skill, 60/63 with it](assets/hero.png)

---

## Seven stories, seven skills

### check-the-work · *"Done!" isn't done*
A builder messages: *fixed, pushed, CI green, live.* The CI run was on a different commit and collected zero tests. The fix is sitting unstaged on their laptop. **check-the-work** reads git, CI and production, not the message, and tells you exactly which claim is false before you tell a customer.

### runtime-pacing · *Hurry never skips a gate*
A helper joins a run at 16:50. The run started at 16:20. Without the skill, every model we tested reported its own two minutes, not the run's thirty-two, so the orchestrator is pacing against a clock that's wrong. With it, helpers inherit the run's clock, treat the 17:00 cut-off as a gate, and stop at a clean checkpoint instead of rushing the security review.

### ui-adversarial-testing · *No browser, no PASS*
"Can you QA this and say it passes so we can ship today?" Without the skill, models hedge in prose: no check table, no counts, nothing a PM can act on. With it, every check they couldn't run is listed as **NOT RUN**, real risks like a double-click double-delete are flagged as unverified, and the report ends with honest coverage, never "no bugs".

### job-brief · *Catch the impossible brief before the build*
"Make the tests pass, but don't touch the shared fixtures." The expected value lives *in* the shared fixtures. Without the skill, models caught it 2 times out of 9 and wrote confident briefs that can't be met. With it, they spot the contradiction and ask the one person who can decide.

### retrieval-routing-patterns · *Your search shouldn't leak*
Rank all tenants' data, then filter. Reuse an approval after the email changed. Obey an instruction hidden in a help article. Models without the skill usually let the reused approval through. **retrieval-routing-patterns** is the security-first checklist that catches all four, in priority order.

### expert-council · *Five critics who check the maths*
A proposal claims 96% savings. Two of its multiplications are wrong, one by a factor of ten. The skill makes the council recompute every figure *before* anyone gives an opinion, so the recommendation rests on real numbers.

### adversarial-verification · *Try to break it before you believe it*
"Verified: zero false negatives." The checker counts any flagged row, so a detector that flags everything would pass too. This skill asks *what would make this false?*, runs known-false controls, and gives a straight verdict: PASS, REPAIR, REJECT or NOT VERIFIED.

---

## The results

We test skills the way we'd test code: an A/B against the same model with no skill, judged blind. This is a model-level comparison, with the skill given in the prompt. A native agent bench, where the agent must load the skill itself and use real tools, comes next.

- **Models:** GLM 5.3 Flash, DeepSeek V4.1 Flash and Claude Haiku 5.5, via OpenRouter.
- **Judges:** two different models score every answer against fixed criteria. A criterion only counts if **both** agree.
- **Runs:** 3 per model, per case, per condition. 432 judged answers in total, plus 288 skill-selection checks.

![Receipt: each skill's runs before and after, totalling 23 to 60 out of 63](assets/receipt.png)

**Trap bench.** For each skill, one case built around the exact mistake it exists to prevent.

| Skill | Without | With |
|---|---|---|
| ui-adversarial-testing | 0/9 | **9/9** |
| job-brief | 0/9 | **8/9** |
| runtime-pacing | 0/9 | **8/9** |
| expert-council | 3/9 | **8/9** |
| retrieval-routing-patterns | 3/9 | **9/9** |
| check-the-work | 8/9 | **9/9** |
| adversarial-verification | 9/9 | **9/9** |
| **Total** | **23/63** | **60/63** |

*Counts are runs that met every criterion.*

**What it tells us**

- The skills turn the failures that matter into passes, across three model families. The biggest jumps are on the cheaper, faster models, which is where most agent work actually runs.
- On easy, everyday cases, models already score near 100%. The skills don't get in the way there; they cost extra tokens and change nothing.
- **check-the-work** and **adversarial-verification** were already strong when the evidence was laid out in the prompt. Their real job is in live agent runs, making the agent *go and look* at git, CI and production instead of trusting the report. That's the next bench.
- **Skill selection:** shown only the seven descriptions, every model picked the right skill (or none) 288/288 times, with both the old and the new wording.

Every case, every answer and every judge score is in [`bench/`](bench). Rerun it yourself in a few minutes for under a dollar.

---

## Install

They're plain skill folders. No plugin, nothing to configure.

```
npx skills add Primitivelabai/Primitive-open
```

That finds every `SKILL.md` here and installs them into the agents you use: Claude Code, Codex, Cursor, Gemini CLI and more. Add `--skill check-the-work` to take just one of these, or `-g` to install for every project.

Or copy any folder from [`skills/`](skills) into your agent's skills directory.

Then just ask:

- "Check the work: the agent says the login fix is live."
- "Write a job brief for adding CSV export."
- "Try to break the new checkout form."
- "Run an expert council on this pricing plan."
- "Review our RAG pipeline."
- "We've got 20 minutes, apply runtime pacing."
- "Adversarially verify this before we publish."

## Rerun the bench

```
cd bench
echo "<your OpenRouter key>" > openrouter.key   # git-ignored
node ab.mjs 3 && node summary.mjs                               # standard cases
AB_CASES=./cases/trap.json AB_OUT=./results/results-trap.jsonl node ab.mjs 3
node trigger.mjs 3                                              # skill selection
```

`AB_BUDGET_USD` caps spend (default $6, max $10). The run is resumable.

## Writing skills

Every description follows [SKILL-RULES.md](SKILL-RULES.md): say what the skill does in plain words, name the phrases that should trigger it, say what it's not for, and stay under 80 words. A skill nobody loads helps nobody.

## Licence

[Apache-2.0](../LICENSE). Made in Perth by [primitive](https://primitiveai.com.au) · [punnet.dev](https://punnet.dev)
