# Project status

**Last updated:** 2026-10-18 · **Fase:** M0 — dossier, flows en architectuur (ter review bij Lucas)

## Nu

- Dossier, flows (PH-FLOW-001 t/m 010) en logische architectuur staan klaar voor review.
- Er wordt **niets gebouwd** tot de flows goedgekeurd zijn (PH-DEC-003, PH-DEC-008).
- Stack gekozen door Lucas: **Cloudflare alles-in-één** (PH-DEC-006, 2026-10-18).

## Wacht op Lucas

1. **PH-DEC-007** — voor wie is dit (alleen Lucas, team, product)?
2. **PH-DEC-008** — flows goedkeuren of aanpassen
3. **PH-DEC-012** — wat het dashboard over de Pro-credits toont

Overige open punten: zie `11-decisions/DECISION_LOG.md`.

## Milestones

| ID | Milestone | Status |
|---|---|---|
| M0 | Dossier, flows en architectuur | IN_REVIEW |
| M1 | Stackkeuze + voortgangsdashboard | IN_PROGRESS (stack beslist) |
| M2–M8 | zie `12-roadmap/milestone-map.md` | TODO |

## Aangemaakte resources

| Resource | Waarom | Kost | Opruimen |
|---|---|---|---|
| Supabase-project `mhnxozxxygsosbzdbnqa` (gratis plan), met testtabellen | aangemaakt vóór deze werkwijze, voor een eerste codeproef | $0 | niet meer nodig na PH-DEC-006 (Cloudflare); verwijderen na akkoord van Lucas |
| Codeproef Next.js | eerste omzetting van het prototype, geparkeerd buiten de repo | $0 | niet in gebruik; wordt pas herbekeken na de stackkeuze |
| GitHub-repo `LucasGalle/project-hub` | dit dossier | $0 | — |

## Laatste wijzigingen

- 2026-10-18 — PH-DEC-006 beslist: Cloudflare alles-in-één. Nieuwe open beslissing PH-DEC-016 (login).
- 2026-10-18 — Dossier opgezet: governance, context, bronnen, flows, architectuur, stackopties, decision log, roadmap, dashboardspecificatie.
