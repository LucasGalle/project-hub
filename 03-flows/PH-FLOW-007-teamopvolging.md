# PH-FLOW-007 — Team opvolgen met een statusvraag

**Status:** PROPOSED · **Owner:** Lucas · **Last updated:** 2026-10-18 · **Bron:** SRC-DES-001 (Opvolgen, Team-tab, Slack-dialoog)

## Doel

Teamleden van wie al even geen update kwam vriendelijk om status vragen, met een bericht dat de agent voorbereidt.

## Stappen

```mermaid
sequenceDiagram
  autonumber
  actor G as Gebruiker
  participant App
  participant A as AI-model
  participant S as Slack
  App->>G: lijst "Opvolgen" (naam, project, laatste update)
  G->>App: Vraag status
  App->>A: context: taken, laatste berichten
  A-->>App: concept-bericht
  App->>G: Slack-dialoog met concept
  G->>App: aanpassen + Versturen
  App->>S: bericht naar DM of projectkanaal
  S-->>App: link naar bericht
  App->>G: melding + ongedaan maken
```

## Regels

- PH-BR-001 geldt: niets vertrekt zonder klik op Versturen.

## Open vragen

- DM of projectkanaal als standaard?
- Telt een antwoord in Slack automatisch als "update" (en verdwijnt de persoon dan uit Opvolgen)?
