# PH-FLOW-009 — Aanmelden en eerste gebruik

**Status:** NEEDS_INPUT · **Owner:** Lucas · **Last updated:** 2026-10-18 · **Bron:** niet in het prototype

## Doel

Een gebruiker kan veilig inloggen en komt bij het eerste gebruik tot een gevulde Vandaag-pagina.

## Voorstel (te bevestigen)

```mermaid
flowchart TD
  L[Inloggen met Google] --> N{Eerste keer?}
  N -->|nee| V[Vandaag]
  N -->|ja| W1[Welkom: wat doet de agent]
  W1 --> W2[Bronnen verbinden<br/>PH-FLOW-008]
  W2 --> W3[Projecten aanmaken of importeren<br/>PH-FLOW-006]
  W3 --> W4[Eerste sync<br/>PH-FLOW-001]
  W4 --> V
```

## Open vragen (bepalen deze flow)

- **PH-DEC-007**: is dit een tool voor Lucas alleen, voor een klein team, of een product voor klanten? Dat bepaalt of er accounts, teams, rollen en betalingen nodig zijn.
- Inloggen met Google (handig omdat Gmail, Agenda en Drive toch Google zijn) of met e-mail en link?
