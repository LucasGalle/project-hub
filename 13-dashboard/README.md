# Voortgangsdashboard

**Status:** PROPOSED (PH-DEC-015 beslist dat het er komt; inhoud PH-DEC-012) · **Last updated:** 2026-10-18

Een eenvoudige pagina die de live voortgang van dit project toont. Ze leest alleen `project-status.json` in de root van de repo; Claude werkt dat bestand bij na elke afgeronde stap (CLAUDE.md).

## Wat het toont (voorstel)

```mermaid
flowchart LR
  J[project-status.json] --> D[Dashboard]
  D --> A[Huidige fase en milestone]
  D --> B[Milestones: klaar / bezig / te doen]
  D --> C[Beslissingen die op Lucas wachten]
  D --> E[Flows: goedgekeurd of niet]
  D --> F[Kosten: maandkost diensten + AI-verbruik]
  D --> G[Inspanning: sessies per milestone, gepland vs. gebruikt]
  D --> H[Laatste wijzigingen met link naar commit/PR]
```

## Pro-credits

Het verbruik van een Claude Pro-plan is voor zover bekend niet via een API op te vragen (**INFERENTIE**). Voorstel (PH-DEC-012): per milestone een geschatte inspanning (S/M/L) en het aantal werkelijk gebruikte sessies; Lucas kan optioneel zijn verbruikspercentage manueel invullen.

## Hosting

Volgt de stackkeuze (PH-DEC-006). Kan ook gratis als statische pagina (bv. GitHub Pages) zonder iets van de rest te bouwen. Het is milestone M1.

## Formaat van `project-status.json`

Zie het bestand zelf; velden: `project`, `updated`, `phase`, `milestones[]`, `decisions_waiting[]`, `flows[]`, `costs`, `effort`, `log[]`.
