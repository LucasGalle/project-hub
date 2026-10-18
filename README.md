# Project Hub — projectdossier

Dit repository is het **projectdossier en de blueprint** voor Project Hub: een AI-werkplek voor projectmanagers die bronnen (mail, chat, agenda, taken, documenten) leest, voorstellen doet en de projectmanager laat beslissen.

**Dit dossier is de bron van waarheid** (PH-DEC-001). Alles wat ontworpen, beslist en ontwikkeld wordt, staat hier uitgeschreven en gedocumenteerd.

## Status

- **Datum baseline:** 2026-10-18
- **Eigenaar:** Lucas Galle
- **Huidige fase:** **M0 — Dossier, flows en architectuur** (ter review) (zie `PROJECT_STATUS.md`)
- **Doeldesign:** Claude Design-canvas "Project Hub", versie 8 (`SRC-DES-001`)
- **Tech stack:** **nog niet gekozen** (`PH-DEC-006`, NEEDS_INPUT). Lucas kiest samen met Claude op basis van kostprijs.

## Start hier

1. `PROJECT_STATUS.md` — waar staan we, wat is de volgende stap.
2. `00-governance/source-of-truth-policy.md` — wat telt als waarheid.
3. `00-governance/cost-policy.md` — hoe we stack- en kostenkeuzes maken.
4. `11-decisions/DECISION_LOG.md` — alle beslissingen, open en goedgekeurd.
5. `03-flows/README.md` — de flows van het product.
6. `05-architecture/README.md` en `05-architecture/stack-options.md` — architectuur en kostenvergelijking.
7. Voor implementatie: `CLAUDE.md`.

## Werkvolgorde (PH-DEC-003)

1. Flows bepalen, documenteren en digitaliseren.
2. Architectuur opstellen (los van leveranciers).
3. Tech stack samen kiezen op kostprijs.
4. Pas daarna bouwen, milestone per milestone.

## Structuur

| Map | Inhoud |
|---|---|
| `00-governance/` | spelregels: bron van waarheid, beslissingen, documentatie, kosten, definition of done |
| `01-context/` | waarom dit project bestaat, voor wie, wat het moet opleveren |
| `02-sources/` | bronnen (design-prototype, berichten van Lucas) met ID's |
| `03-flows/` | alle gebruikers- en systeemflows met diagrammen |
| `04-product/` | capability map en state machines |
| `05-architecture/` | logische architectuur, integraties, datamodel, stack-opties met kosten |
| `06-design/` | designstatus en tokens |
| `11-decisions/` | beslissingenlog |
| `12-roadmap/` | milestones |
| `13-dashboard/` | specificatie van het live voortgangsdashboard |
| `templates/` | sjablonen voor beslissingen, flows en features |

## Belangrijkste werkregel

**Geen beslissing verzinnen.** Wat ontbreekt wordt een `OPEN_DECISION` of `NEEDS_INPUT` in `11-decisions/`. Claude mag technische details uitwerken, maar kiest geen tech stack, geen kosten en geen productregels zonder Lucas.
