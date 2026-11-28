#!/usr/bin/env node
// Trigger test: given only the skill descriptions, does the model pick the right skill (or none)? Old vs new descriptions.
import { readFileSync, appendFileSync, existsSync } from "node:fs";
const KEY = process.env.OPENROUTER_API_KEY || readFileSync(new URL("./openrouter.key", import.meta.url), "utf8").trim();
const MODELS = (process.env.AB_MODELS ?? "z-ai/glm-5.3-flash,deepseek/deepseek-v4.1-flash,anthropic/claude-haiku-5.5").split(",");
const RUNS = Number(process.argv[2] ?? 3);
const descs = JSON.parse(readFileSync(new URL("./descs.json", import.meta.url)));
const cases = JSON.parse(readFileSync(new URL("./cases/trigger.json", import.meta.url)));
const OUT = new URL("./results/results-trigger.jsonl", import.meta.url);
const done = new Set(existsSync(OUT) ? readFileSync(OUT, "utf8").split("\n").filter(Boolean).map((l) => { const r = JSON.parse(l); return `${r.model}|${r.q}|${r.cond}|${r.run}`; }) : []);
const jobs = [];
for (const model of MODELS) for (const c of cases) for (const cond of ["old", "new"]) for (let run = 1; run <= RUNS; run++)
  if (!done.has(`${model}|${c.q}|${cond}|${run}`)) jobs.push({ model, c, cond, run });
async function ask(model, prompt) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { authorization: `Bearer ${KEY}`, "content-type": "application/json" },
        body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], max_tokens: 3000, temperature: 0.7, reasoning: { effort: "low" } }) });
      const j = await r.json(); if (!r.ok) throw new Error(JSON.stringify(j).slice(0, 200));
      const t = (j.choices?.[0]?.message?.content ?? "").trim(); if (!t) throw new Error("empty"); return t;
    } catch (e) { if (a === 2) throw e; await new Promise((s) => setTimeout(s, 2000)); }
  }
}
let i = 0;
async function worker() {
  while (i < jobs.length) {
    const { model, c, cond, run } = jobs[i++];
    const list = Object.entries(descs[cond]).map(([k, v]) => `- ${k}: ${v}`).join("\n");
    const p = `You are an agent with these skills available:\n${list}\n\nUser request: "${c.q}"\n\nWhich ONE skill should you load before answering, or "none"? Reply with only the skill name or none.`;
    try {
      const t = (await ask(model, p)).toLowerCase();
      const pick = Object.keys(descs.new).find((k) => t.includes(k)) ?? "none";
      appendFileSync(OUT, JSON.stringify({ model, q: c.q, want: c.want, cond, run, pick, ok: pick === c.want }) + "\n");
    } catch (e) { console.error("ERR", e.message); }
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
const rows = readFileSync(OUT, "utf8").split("\n").filter(Boolean).map(JSON.parse);
for (const cond of ["old", "new"]) for (const m of MODELS) { const r = rows.filter((x) => x.cond === cond && x.model === m); console.log(cond, m, `${r.filter((x) => x.ok).length}/${r.length}`); }
for (const x of rows.filter((x) => !x.ok)) console.log("MISS", x.cond, x.model.split("/")[1], x.want, "->", x.pick, "|", x.q.slice(0, 50));
