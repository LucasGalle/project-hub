# Source of Truth Policy

**Status:** APPROVED (PH-DEC-001) · **Owner:** Lucas · **Last updated:** 2026-10-18

## 1. Productwaarheid

Dit dossier (`LucasGalle/project-hub`) is de bron van waarheid voor:
- productvisie en scope;
- flows (`03-flows/`);
- capabilities en productregels (`04-product/`);
- architectuur en stackkeuze (`05-architecture/`, `11-decisions/`);
- planning en voortgang (`12-roadmap/`, `PROJECT_STATUS.md`, `project-status.json`).

Goedgekeurde beslissingen staan in `11-decisions/DECISION_LOG.md` met status `APPROVED`. Open vragen hebben status `NEEDS_INPUT` of `PROPOSED`.

## 2. Technische waarheid

Zodra er code is, bepaalt de code samen met tests, CI en deployment wat **werkelijk gebouwd** is. Een document dat zegt dat iets werkt, weegt nooit zwaarder dan code-evidence. Waar de code staat, is nog niet beslist (PH-DEC-013).

## 3. Brondocumenten

Bronnen zijn input, geen finale waarheid. Elke bron krijgt een ID in `SOURCE_REGISTRY.md` met herkomst, datum, scope en beperkingen.

Belangrijk: het design-prototype (`SRC-DES-001`) bevat **demodata** (fictieve klanten, teamleden, cijfers). Die data is geen requirement.

## 4. Conflictregel

1. Nieuwe expliciete beslissing van Lucas vs oudere beslissing: de nieuwste wint en de oude krijgt `SUPERSEDED`.
2. Code vs document over wat gebouwd is: code + tests winnen.
3. Prototype vs beslissing: de beslissing wint; het prototype wordt bijgewerkt of de afwijking wordt genoteerd.
4. Geen bron: markeer als `UNSOURCED`, `INFERENCE` of `NEEDS_INPUT`.

## 5. Verwijzingsformaat

```yaml
source_id: SRC-DES-001
file: 02-sources/raw/project-hub-prototype-v8.dc.html
section: "INBOX"
evidence: "wat dit werkelijk bewijst"
```
