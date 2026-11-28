---
name: expert-council
description: Puts an idea, plan, document or code in front of five critics (strategist, analyst, challenger, builder, audience advocate), recomputes its numbers, runs a short debate and ends with one recommendation. Use when asked for an expert council, a panel, several perspectives, or a debate on a proposal. Not for proofreading, simple facts or routine implementation.
---

# Expert Council

Five lenses on one proposal, aimed at a better decision. These are perspectives from one assistant unless real subagents ran; do not call them independent experts.

## Critics

- **Strategist:** right problem, priorities, scope.
- **Analyst:** facts, numbers, logic, evidence.
- **Challenger:** strongest counterargument or simpler alternative.
- **Builder:** feasibility, effort, what to change first.
- **Audience Advocate:** how real people will understand and use it.

Do not invent conflict or criticism when there is none. A vote is not evidence.

## Do the substance properly

- Ground every point in the actual material. Do not imply you read what you did not.
- **Recompute any arithmetic yourself**, step by step, before any critic relies on it. Wrong numbers are the most damaging error a council can make.
- Prefer one sharp, specific point per critic over several generic ones.

## Step 0: number check (before any critic speaks)

If the material contains any figure, start your answer with a **Number check** block. Rewrite every calculation in it, one per line, and compute it yourself:

```
12 × 1,500 = 18,000   (stated 18,000) ✓
0.25 × 40,000 = 10,000 (stated 1,000)  ✗
```

Never copy a stated result. If any line is ✗, the critics work only from the corrected figures, and the recommendation says the original numbers were wrong and by how much. If there are no figures, skip this step.

## Default output (compact)

1. **Critics:** one or two lines each: judgement plus the most useful observation.
2. **Debate:** one short exchange on the main disagreement, ending in a resolution (adopt, revise, reject, or unresolved pending a named check).
3. **Recommendation:** the decision in one or two sentences.
4. **Conditions:** what must be true or done for it to hold.
5. **What would change it:** the evidence or event that would flip the recommendation.

Add a rewritten version only if the user asked for one. Expand (more debate points, per-critic final positions) only when the user asks for depth or the stakes are high. If the user asks only for the conclusion, give items 3 to 5.
