# State machine — Voorstel

**Status:** PROPOSED · **Last updated:** 2026-10-18 · **Flow:** PH-FLOW-003, PH-FLOW-004

| Status | Betekenis | Mag naar |
|---|---|---|
| `new` (Nieuw) | door agent gemaakt, wacht op beslissing | `snoozed`, `executing`, `ignored`, `rejected` |
| `snoozed` (Later) | uitgesteld tot een tijdstip | `new` |
| `executing` (Uitvoeren) | goedgekeurd, wacht in ongedaan-maken-periode of loopt | `done`, `in_asana`, `failed`, `new` (ongedaan) |
| `done` (Uitgevoerd) | externe actie gelukt, met link | eindstatus |
| `in_asana` (In Asana) | to-do aangemaakt, met link | eindstatus |
| `failed` (Mislukt) | externe fout, met uitleg | `new` (opnieuw) |
| `ignored` (Genegeerd) | weg zonder feedback | `new` (ongedaan) |
| `rejected` (Afgewezen) | weg met reden, voedt PH-FLOW-010 | `new` (ongedaan) |

Elke overgang wordt gelogd met tijd en wie (gebruiker of systeem), zodat ongedaan maken en de afronding van de focusronde kloppen.
