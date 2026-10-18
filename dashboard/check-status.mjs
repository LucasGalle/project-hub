// Controleert project-status.json vóór elke build (M1, AC-006).
// Gebruik: node dashboard/check-status.mjs [pad]
import { readFileSync } from 'node:fs';

const MILESTONE = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED'];
const FLOW = ['PROPOSED', 'NEEDS_INPUT', 'APPROVED', 'REJECTED', 'SUPERSEDED'];
const EFFORT = ['S', 'M', 'L'];

export function check(data) {
  const errors = [];
  const need = (cond, msg) => { if (!cond) errors.push(msg); };
  need(data && typeof data === 'object', 'bestand is geen object');
  if (errors.length) return errors;
  need(typeof data.project === 'string', 'project ontbreekt');
  need(/^\d{4}-\d{2}-\d{2}/.test(data.updated ?? ''), 'updated is geen datum');
  need(data.phase && typeof data.phase.id === 'string', 'phase.id ontbreekt');
  need(Array.isArray(data.milestones) && data.milestones.length > 0, 'milestones ontbreekt of is leeg');
  for (const m of data.milestones ?? []) {
    need(typeof m.id === 'string' && typeof m.name === 'string', `milestone zonder id of naam`);
    need(MILESTONE.includes(m.status), `milestone ${m.id}: onbekende status ${m.status}`);
    need(EFFORT.includes(m.effort_planned), `milestone ${m.id}: effort_planned moet S, M of L zijn`);
    need(Number.isInteger(m.sessions_used) && m.sessions_used >= 0, `milestone ${m.id}: sessions_used moet een getal ≥ 0 zijn`);
  }
  need(Array.isArray(data.decisions_waiting), 'decisions_waiting ontbreekt');
  need(Array.isArray(data.flows), 'flows ontbreekt');
  for (const f of data.flows ?? []) need(FLOW.includes(f.status), `flow ${f.id}: onbekende status ${f.status}`);
  need(data.costs && typeof data.costs.monthly_services_now === 'number', 'costs.monthly_services_now ontbreekt');
  need(Array.isArray(data.log), 'log ontbreekt');
  const pct = data.effort?.pro_plan_usage_pct_manual;
  need(pct == null || (typeof pct === 'number' && pct >= 0 && pct <= 100), 'pro_plan_usage_pct_manual moet leeg of 0–100 zijn');
  return errors;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const path = process.argv[2] ?? 'project-status.json';
  let data;
  try { data = JSON.parse(readFileSync(path, 'utf8')); }
  catch (e) { console.error(`✗ ${path}: ${e.message}`); process.exit(1); }
  const errors = check(data);
  if (errors.length) { errors.forEach(e => console.error(`✗ ${e}`)); process.exit(1); }
  console.log(`✓ ${path} is geldig`);
}
