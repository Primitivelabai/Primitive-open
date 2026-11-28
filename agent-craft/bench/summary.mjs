import { readFileSync } from "node:fs";
const rows = readFileSync(new URL(process.env.AB_OUT ?? "./results/results.jsonl", import.meta.url), "utf8").split("\n").filter(Boolean).map(JSON.parse);
const agg = {};
for (const r of rows) {
  const valid = r.judges.filter(Boolean); if (!valid.length) continue;
  const n = valid[0].length;
  const both = Array.from({ length: n }, (_, k) => valid.every((s) => s[k] === 1) ? 1 : 0);
  const key = `${r.skill}|${r.model}|${r.cond}`;
  (agg[key] ??= { pass: 0, n: 0, crit: 0, critN: 0, tok: 0 });
  const a = agg[key]; a.n++; a.pass += both.every((x) => x) ? 1 : 0; a.crit += both.reduce((x, y) => x + y, 0); a.critN += n; a.tok += r.tokens;
}
console.log("skill | model | cond | all-criteria pass | criteria % | avg tokens");
for (const [k, a] of Object.entries(agg).sort()) console.log(`${k.replaceAll("|", " | ")} | ${a.pass}/${a.n} | ${Math.round(100 * a.crit / a.critN)}% | ${Math.round(a.tok / a.n)}`);
