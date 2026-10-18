# Voortgangsdashboard

**Status:** GEBOUWD, wacht op live zetten (PH-DEC-015 beslist dat het er komt; inhoud PH-DEC-012) · **Last updated:** 2026-10-18

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

## Gebouwd (M1)

- Pagina: `dashboard/index.html` (geen framework, stijl en kleuren uit het prototype, licht/donker, gsm).
- Controle: `node dashboard/check-status.mjs` weigert een ongeldig `project-status.json`.
- Getest op 2026-10-18 in Chromium: desktop licht en donker, gsm 375 px (geen horizontaal scrollen), foutmelding bij ontbrekend en bij ongeldig bestand; de controle weigert een bestand met een onbekende status.

## Live zetten op Cloudflare Pages (eenmalig, door Lucas)

1. Cloudflare-dashboard › **Workers & Pages** › **Create** › **Pages** › **Connect to Git**.
2. Kies de repo `LucasGalle/project-hub`, branch `main`.
3. Framework preset: **None**. Build command: `node dashboard/check-status.mjs && cp project-status.json dashboard/`. Build output directory: `dashboard`.
4. **Save and Deploy**. Het adres wordt `https://<naam>.pages.dev`.

Daarna werkt elke push naar `main` de pagina vanzelf bij. Kost: $0 (gratis plan).
