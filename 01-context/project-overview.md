# Projectoverzicht

**Status:** DRAFT · **Owner:** Lucas · **Last updated:** 2026-10-18

## Wat is Project Hub?

Een AI-werkplek voor een projectmanager die meerdere klantprojecten tegelijk loopt. Een agent leest de bronnen waar het werk gebeurt (Gmail, Slack, Google Calendar, Asana, Google Drive, Notion, Canva), en zet daaruit:

- **voorstellen voor volgende stappen** (een mail, een Slack-bericht, een uitnodiging, een Notion-pagina) die de projectmanager kan uitvoeren, bewerken, uitstellen of negeren;
- **nieuw gespotte to-do's** die na goedkeuring als taak in Asana komen;
- **wat brandt**: blokkades die het team tegenhouden;
- **wie stil is**: teamleden van wie al even geen update kwam;
- **een projectbeeld** per project: fase, voortgang, uren, risico's, beslissingen, documenten en activiteit.

De agent stelt voor, de projectmanager beslist. Er wordt niets verstuurd zonder klik (PH-BR-001, voorgesteld).

Bron: `SRC-DES-001` (prototype v8), schermen Vandaag, Focusronde, Projecten, Project Hub, Inbox en Bronnen.

## Waarom?

Een projectmanager verliest dagelijks tijd aan het bijeen zoeken van informatie uit zeven tools en aan het opvolgen van kleine dingen. Project Hub bundelt dat tot één rustige ronde per dag ("Vandaag vraagt ±15 min van je").

## Voor wie?

- **Nu:** Lucas zelf, als projectmanager (`SRC-REQ-001`).
- **Mogelijk later:** andere projectmanagers of kmo's, als onderdeel van Lucas' plan om kleine bedrijven te helpen met digitale oplossingen. Of dat de bedoeling is, is open (PH-DEC-007) en bepaalt mee de architectuur en de kosten.

## Wat is er al?

| Onderdeel | Status | Bewijs |
|---|---|---|
| Klikbaar prototype met alle schermen | ✅ klaar (demodata) | `SRC-DES-001`, versie 8 |
| Projectdossier | 🟡 in opbouw | deze repo |
| Flows | 🟡 draft | `03-flows/` |
| Architectuur en stack | 🟡 voorstel | `05-architecture/`, PH-DEC-006 open |
| Werkende app | ⬜ niet gestart | — |

## Wat is het niet (voorlopig)?

- Geen vervanging van Asana: Asana blijft de bron van waarheid voor taken (prototype, Bronnen-scherm: "Source of truth voor taken").
- Geen tool die zelfstandig communiceert met klanten.
