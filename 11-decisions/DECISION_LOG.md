# Decision log

**Last updated:** 2026-10-18 · Statussen: `PROPOSED`, `NEEDS_INPUT`, `APPROVED`, `REJECTED`, `SUPERSEDED` (zie `00-governance/decision-process.md`).

Alleen Lucas zet een beslissing op `APPROVED`. Beslissingen die op hem wachten staan bovenaan.

## Wacht op Lucas

| ID | Vraag | Opties | Voorstel van Claude | Status |
|---|---|---|---|---|
| PH-DEC-006 | Welke tech stack? | A Vercel+Supabase · B Cloudflare · C Cloudflare+Supabase · D low-code | zie `05-architecture/stack-options.md`; geen keuze door Claude | NEEDS_INPUT |
| PH-DEC-007 | Voor wie is dit? | alleen Lucas · klein team · product voor kmo's | eerst alleen Lucas, zo gebouwd dat teams later kunnen | NEEDS_INPUT |
| PH-DEC-008 | Zijn de flows juist? | goedkeuren · aanpassen | `03-flows/` | NEEDS_INPUT |
| PH-DEC-005 | Welke bronnen en functies in v1? | zie capability map | Slack, Asana, Calendar; Vandaag, Focusronde, Beslissen | NEEDS_INPUT |
| PH-DEC-012 | Wat moet het voortgangsdashboard tonen over de Pro-credits? | (a) voortgang per milestone + geschatte inspanning · (b) ook manueel ingegeven creditverbruik · (c) automatisch verbruik (niet beschikbaar via een API, INFERENTIE) | (a) + (b) | NEEDS_INPUT |
| PH-DEC-009 | Hoe vaak syncen? | elk uur · 3× per dag · alleen 's ochtends + manueel | 3× per dag + manueel | NEEDS_INPUT |
| PH-DEC-010 | Wat bewaren we van mails/berichten? | alleen link + samenvatting · volledige tekst | link + samenvatting | NEEDS_INPUT |
| PH-DEC-011 | Mails versturen of als concept klaarzetten? | versturen · concept in Gmail | concept in v1 | NEEDS_INPUT |
| PH-DEC-013 | Waar komt de code? | in deze repo (map `app/`) · aparte repo | deze repo | NEEDS_INPUT |
| PH-DEC-014 | Welk AI-model? | Haiku · Sonnet · mix | mix Haiku + Sonnet | NEEDS_INPUT |

## Beslist

| ID | Beslissing | Bron | Status |
|---|---|---|---|
| PH-DEC-001 | Dit projectdossier is de bron van waarheid; alles wordt hier eerst beschreven | SRC-REQ-002 | APPROVED |
| PH-DEC-002 | De tech stack en elke betaalde dienst worden samen bepaald op kostprijs; Lucas beslist, niet Claude | SRC-REQ-002 | APPROVED |
| PH-DEC-003 | Werkvolgorde: flows → architectuur → stackkeuze → bouwen in kleine milestones | SRC-REQ-002 | APPROVED |
| PH-DEC-004 | Het prototype v8 is het doeldesign | SRC-REQ-001, SRC-DES-001 | APPROVED |
| PH-DEC-015 | Er komt een live voortgangsdashboard van dit project, gevoed door `project-status.json` | SRC-REQ-002 | APPROVED (inhoud: PH-DEC-012) |

Detail per beslissing kan in `open/` of `approved/` met `templates/decision-template.md` wanneer een tabelrij niet volstaat.
