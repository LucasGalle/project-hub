# PH-FLOW-008 — Bronnen verbinden en per project koppelen

**Status:** APPROVED (PH-DEC-008) · **Owner:** Lucas · **Last updated:** 2026-10-18 · **Bron:** SRC-DES-001 (Bronnen)

## Doel

De zeven bronnen verbinden met het account van de gebruiker, en per project aangeven welk stuk van elke bron erbij hoort.

## Stappen

```mermaid
flowchart TD
  B[Scherm Bronnen<br/>7 bronnen met status] -->|Verbinden| O[Inloggen bij de tool<br/>en toestemming geven]
  O -->|gelukt| C[Status Verbonden<br/>laatste sync]
  O -->|geweigerd| B
  C -->|token verloopt| R[Status Opnieuw verbinden]
  R --> O
  C --> K[Koppelingen per project]
  K --> K1[Asana-project]
  K --> K2[Slack-kanaal]
  K --> K3[Gmail-label]
  K --> K4[Agendatitel / trefwoord]
  K --> K5[Drive-map]
  K --> K6[Notion-pagina]
  K --> K7[Canva-design]
```

1. Per bron: Verbinden → inlogscherm van die tool → toestemming → terug in de app.
2. Status per bron: Verbonden, Opnieuw verbinden, Niet verbonden; met laatste sync.
3. Per project kiest de gebruiker de koppelingen (lijst uit de tool, bv. Slack-kanalen).
4. Ontkoppelen verwijdert de toegang en stopt het lezen.

## Regels

- PH-BR-008 (voorgesteld): vraag per tool de kleinst mogelijke rechten; schrijfrechten pas vragen als een actietype dat nodig heeft.

## Open vragen

- Welke bronnen in v1? Zie PH-DEC-005 en `05-architecture/integrations.md` (Gmail en Drive vragen een Google-veiligheidscontrole bij publiek gebruik; Canva-API is beperkt).
- Kan de agent koppelingen voorstellen ("dit kanaal lijkt bij project X te horen")?
