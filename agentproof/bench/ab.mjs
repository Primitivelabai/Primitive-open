#!/usr/bin/env node
// agent proof A/B: each case answered with and without the skill, across models, judged blind.
// Usage: OPENROUTER_API_KEY=... AB_BUDGET_USD=6 node ab.mjs [runs=3]
import { readFileSync, appendFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
// Prefer Pass Shield's local key gateway: the OpenRouter key stays in Pass and is never seen here.
const GW = join(homedir(), ".config", "primitive-code", "pass-gateway.json");
const gw = existsSync(GW) ? JSON.parse(readFileSync(GW, "utf8")) : null;
const BASE = gw ? `${gw.baseUrl}/openrouter` : "https://openrouter.ai/api/v1";
const KEYFILE = new URL("./openrouter.key", import.meta.url);
const KEY = gw ? gw.token : (process.env.OPENROUTER_API_KEY || (existsSync(KEYFILE) ? readFileSync(KEYFILE, "utf8").trim() : ""));
if (!KEY) throw new Error("Connect Primitive Code in Pass Shield, or set OPENROUTER_API_KEY");
console.log(gw ? "Using Pass Shield gateway (key stays in Pass)" : "Using OPENROUTER_API_KEY directly");
const BUDGET = Math.min(Number(process.env.AB_BUDGET_USD ?? 6), 10);
const RUNS = Number(process.argv[2] ?? 3);
const MODELS = (process.env.AB_MODELS ?? "z-ai/glm-5.3-flash,deepseek/deepseek-v4.1-flash,anthropic/claude-haiku-5.5").split(",");
const JUDGES = (process.env.AB_JUDGES ?? "deepseek/deepseek-v4.1-flash,z-ai/glm-5.3-flash").split(",");
const cases = JSON.parse(readFileSync(new URL(process.env.AB_CASES ?? "./cases/standard.json", import.meta.url)));
const skill = (k) => readFileSync(new URL(`../skills/${k}/SKILL.md`, import.meta.url), "utf8");
const OUT = new URL(process.env.AB_OUT ?? "./results/results.jsonl", import.meta.url);
let spend = 0;

async function chat(model, messages, maxTokens = 8000, temperature = 0.7, reasoning = { effort: "low" }) {
  if (spend > BUDGET) throw new Error(`budget $${BUDGET} reached`);
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(`${BASE}/chat/completions`, {
        method: "POST",
        headers: { authorization: `Bearer ${KEY}`, "content-type": "application/json" },
        body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature, reasoning, ...(gw ? {} : { usage: { include: true } }) }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(JSON.stringify(j).slice(0, 300));
      spend += j.usage?.cost ?? 0;
      if (!(j.choices?.[0]?.message?.content ?? "").trim()) throw new Error("empty content (finish: " + j.choices?.[0]?.finish_reason + ")");
      return { text: j.choices[0].message.content ?? "", tokens: j.usage?.total_tokens ?? 0 };
    } catch (e) { if (a === 2) throw e; await new Promise((s) => setTimeout(s, 2000 * (a + 1))); }
  }
}

async function judge(c, answer) {
  const scores = [];
  for (const jm of JUDGES) {
    const p = `You grade an agent's answer. For each criterion reply 1 if clearly met, else 0. Reply only JSON {"scores":[...]} in order.\n\nTASK:\n${c.prompt.slice(0, 6000)}\n\nCRITERIA:\n${c.criteria.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\nANSWER:\n${answer}`;
    const { text } = await chat(jm, [{ role: "user", content: p }], 4000, 0);
    const m = text.match(/\{[\s\S]*\}/);
    let sc = null;
    try { sc = m ? JSON.parse(m[0]).scores : null; } catch {}
    if (!Array.isArray(sc) || sc.length !== c.criteria.length) throw new Error("judge parse failed: " + jm);
    scores.push(sc);
  }
  return scores;
}

const done = new Set(existsSync(OUT) ? readFileSync(OUT, "utf8").split("\n").filter(Boolean).map((l) => { const r = JSON.parse(l); return `${r.model}|${r.case}|${r.cond}|${r.run}`; }) : []);
const jobs = [];
for (const model of MODELS) for (const c of cases) for (const cond of ["base", "skill"]) for (let run = 1; run <= RUNS; run++)
  if (!done.has(`${model}|${c.id}|${cond}|${run}`)) jobs.push({ model, c, cond, run });

let i = 0;
async function worker() {
  while (i < jobs.length) {
    const { model, c, cond, run } = jobs[i++];
    const sys = cond === "skill" ? [{ role: "system", content: `Follow this skill:\n\n${skill(c.skill)}` }] : [];
    try {
      const a = await chat(model, [...sys, { role: "user", content: c.prompt }]);
      const s = await judge(c, a.text);
      appendFileSync(OUT, JSON.stringify({ model, case: c.id, skill: c.skill, cond, run, tokens: a.tokens, judges: s, answer: a.text }) + "\n");
      console.log(`${model} ${c.id} ${cond} ${run} ${JSON.stringify(s)} $${spend.toFixed(3)}`);
    } catch (e) { console.error(`${model} ${c.id} ${cond} ${run} ERROR ${e.message}`); if (/budget/.test(e.message)) return; }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
console.log(`spent $${spend.toFixed(3)}`);
