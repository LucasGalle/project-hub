# Project status

**Last updated:** 2026-10-18 · **Fase:** M2 — skelet met demodata (nog te starten)

## Nu

- Flows en architectuur goedgekeurd door Lucas (PH-DEC-008). Stack: Cloudflare alles-in-één (PH-DEC-006).
- M1 afgerond: voortgangsdashboard live op https://project-hub.lucas-galle1.workers.dev (bevestigd door Lucas).
- Volgende: M2, de schermen van het design getrouw omzetten (PH-DEC-017).

## Wacht op Lucas

1. **PH-DEC-007** — voor wie is dit (alleen Lucas, team, product)?
2. **PH-DEC-012** — wat het dashboard over de Pro-credits toont

Overige open punten: zie `11-decisions/DECISION_LOG.md`.

## Milestones

| ID | Milestone | Status |
|---|---|---|
| M0 | Dossier, flows en architectuur | DONE |
| M1 | Stackkeuze + voortgangsdashboard | DONE |
| M2–M8 | zie `12-roadmap/milestone-map.md` | TODO |

## Aangemaakte resources

| Resource | Waarom | Kost | Opruimen |
|---|---|---|---|
| Supabase-project `mhnxozxxygsosbzdbnqa` (gratis plan), met testtabellen | aangemaakt vóór deze werkwijze, voor een eerste codeproef | $0 | gepauzeerd op 2026-10-18 na akkoord van Lucas; definitief verwijderen gebeurt door Lucas in het Supabase-dashboard |
| Codeproef Next.js | eerste omzetting van het prototype, geparkeerd buiten de repo | $0 | niet in gebruik; wordt pas herbekeken na de stackkeuze |
| GitHub-repo `LucasGalle/project-hub` | dit dossier | $0 | — |
| Cloudflare Worker `project-hub` | voortgangsdashboard | $0 (gratis plan) | — |

## Laatste wijzigingen

- 2026-10-18 — M1 afgerond; dashboard live en bevestigd.
- 2026-10-18 — Dashboard live via Cloudflare Worker `project-hub`; vereiste PH-DEC-017 (getrouwe kopie van het design) vastgelegd.
- 2026-10-18 — Voortgangsdashboard gebouwd (`dashboard/index.html`, `dashboard/check-status.mjs`).
- 2026-10-18 — Flows en architectuur goedgekeurd (PH-DEC-008); M0 afgerond.
- 2026-10-18 — Supabase-project gepauzeerd (niet meer nodig na PH-DEC-006).

- 2026-10-18 — PH-DEC-006 beslist: Cloudflare alles-in-één. Nieuwe open beslissing PH-DEC-016 (login).
- 2026-10-18 — Dossier opgezet: governance, context, bronnen, flows, architectuur, stackopties, decision log, roadmap, dashboardspecificatie.
