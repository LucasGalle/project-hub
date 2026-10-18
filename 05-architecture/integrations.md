# Integraties per bron

**Status:** PROPOSED · **Last updated:** 2026-10-18

| Bron | Lezen | Schrijven (actietype) | Drempel | Status bron-info |
|---|---|---|---|---|
| Gmail | mails in gekoppelde labels | concept of verzenden (Mail) | Google beschouwt Gmail-lezen als "beperkte scope": voor publiek gebruik is een veiligheidsbeoordeling nodig; in testmodus vervallen tokens na 7 dagen | INFERENTIE, te verifiëren |
| Google Calendar | meetings | uitnodiging maken | zelfde Google-app als Gmail; minder streng | INFERENTIE |
| Google Drive | documenten in gekoppelde map | — | Drive-lezen kan ook een beperkte scope zijn | INFERENTIE |
| Slack | berichten in gekoppelde kanalen | bericht (Bericht, statusvraag) | interne app in eigen workspace is eenvoudig; leeslimieten voor niet-goedgekeurde apps | INFERENTIE |
| Asana | taken in gekoppeld project | taak aanmaken (To-do) | API beschikbaar, ook op gratis plan | INFERENTIE |
| Notion | gekoppelde pagina's | pagina maken | interne integratie per workspace, eenvoudig | INFERENTIE |
| Canva | designs | — | Connect-API vraagt aanvraag/goedkeuring | INFERENTIE |

## Gevolg voor v1 (voorstel)

Voor een tool die alleen Lucas gebruikt kan de Google-app in testmodus draaien met Lucas als testgebruiker; de 7-dagenregel betekent wekelijks opnieuw verbinden (zichtbaar als "Opnieuw verbinden"). Voor een product voor klanten (PH-DEC-007) is de Google-beoordeling een apart traject.

Voorstel volgorde: Slack + Asana + Google Calendar eerst (laagste drempel), dan Gmail, dan Notion en Drive, Canva als laatste. **NEEDS_INPUT** (PH-DEC-005).
