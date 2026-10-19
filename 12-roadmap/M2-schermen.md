# M2 — Skelet met demodata

**Status:** IN_PROGRESS · **Inspanning:** M · **Hangt af van:** M1 (DONE), PH-DEC-016 (login zelf bouwen), PH-DEC-017 (getrouwe kopie)

Opgesplitst op vraag van Lucas (2026-10-18):

- **M2a — Schermen:** alle schermen van het design als echte app op Cloudflare, met de demodata van het prototype, zonder login.
- **M2b — Login:** zelfgebouwde login (PH-DEC-016), uit te werken in PH-FLOW-009.

## M2a — aanpak

Om een getrouwe kopie te garanderen, wordt niets opnieuw getekend: stijl (CSS), template en logica komen letterlijk uit het prototype (`app/tools/extract-design.mjs`). Een kleine runtime (`app/public/runtime.js`, op Preact 10.27.2) rendert het Claude Design-template zoals Claude Design dat doet. Geen build-stap, geen betaalde dienst.

## Acceptatiecriteria M2a

- AC-001: Vandaag, Focusronde (4 stappen + afronding), Projecten, Project Hub (5 tabbladen), Inbox, Bronnen, detail-pop-up en Slack-dialoog werken zoals in het prototype.
- AC-002: stijl, teksten, lettertypes en animaties zijn die van het prototype (zelfde CSS en template).
- AC-003: geen fouten in de browserconsole en geen onopgeloste `{{gaten}}` in de pagina.
- AC-004: licht en donker thema werken; op gsm-breedte geen horizontaal scrollen.
- AC-005: de app staat live op een eigen Cloudflare Worker (`project-hub-app`), gratis.

## Tests

`app/tests/screens.test.cjs` klikt alle schermen door en faalt bij een ontbrekend scherm, een consolefout of een onopgelost gat.

## Afwijkingen van het prototype

Geen. Wat het prototype doet met demodata (beslissen, ongedaan maken, sync) doet de app ook, nog zonder echte opslag of bronnen; dat komt in M3 en M4.
