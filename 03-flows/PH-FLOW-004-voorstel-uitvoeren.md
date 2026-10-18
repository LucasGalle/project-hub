# PH-FLOW-004 — Goedgekeurd voorstel uitvoeren in een externe tool

**Status:** APPROVED (PH-DEC-008) · **Owner:** Lucas · **Last updated:** 2026-10-18 · **Bron:** SRC-DES-001 (actietypes in demodata)

## Doel

Een goedgekeurd voorstel echt uitvoeren in de juiste tool, en het resultaat terugmelden.

## Actietypes in het prototype

| Type | Tool | Wat gebeurt er | Schrijfrecht nodig |
|---|---|---|---|
| Mail | Gmail | concept of verzonden mail | ja (verzenden of concept maken) |
| Bericht | Slack | bericht in kanaal of DM | ja |
| Uitnodiging | Google Calendar | meeting aanmaken met deelnemers | ja |
| Pagina | Notion | pagina aanmaken of aanvullen | ja |
| To-do | Asana | taak in het gekoppelde project | ja |

## Stappen

```mermaid
sequenceDiagram
  autonumber
  actor G as Gebruiker
  participant App
  participant Q as Uitvoer-wachtrij
  participant T as Externe tool
  G->>App: Uitvoeren (met eventuele aanpassingen)
  App->>Q: zet actie klaar (status Uitvoeren)
  Note over App,Q: korte ongedaan-maken-periode (PH-BR-006)
  Q->>T: voer actie uit met token van de gebruiker
  alt gelukt
    T-->>Q: id + link van het resultaat
    Q-->>App: status Uitgevoerd / In Asana + link
  else fout
    T-->>Q: fout (rechten, limiet, token)
    Q-->>App: status Mislukt + uitleg, knop Opnieuw
  end
```

## Open vragen

- **PH-DEC-011, NEEDS_INPUT**: mails echt versturen of enkel als concept in Gmail klaarzetten? Concept is veiliger en vraagt minder strenge Google-goedkeuring (zie `05-architecture/integrations.md`).
- Welke van de vijf actietypes horen in de eerste versie?
