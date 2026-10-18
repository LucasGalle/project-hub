# M1 — Voortgangsdashboard

**Status:** DONE (live op https://project-hub.lucas-galle1.workers.dev, bevestigd door Lucas 2026-10-18) · **Inspanning:** S · **Hangt af van:** M0 (DONE), PH-DEC-006 (Cloudflare)

## Resultaat (wat Lucas kan zien of doen)

Een webpagina die de live voortgang van Project Hub toont: fase, milestones, goedgekeurde flows, beslissingen die op Lucas wachten, kosten, inspanning en de laatste wijzigingen. De pagina leest alleen `project-status.json`; elke push naar `main` werkt ze bij.

## Keuzes binnen deze milestone

- **Inhoud over Pro-credits (PH-DEC-012):** standaard voorstel (a)+(b): geplande inspanning per milestone (S/M/L) tegenover gebruikte sessies, plus een optioneel veld `effort.pro_plan_usage_pct_manual` dat Lucas zelf invult. Lucas kan dit nog wijzigen.
- **Hosting:** Cloudflare Worker met statische bestanden (gratis; Lucas koppelde het als Worker), gekoppeld aan deze repo; volgt PH-DEC-006. Geen betaalde dienst.
- **Code:** in deze repo, map `dashboard/` (voorstel PH-DEC-013).
- **Zichtbaarheid:** de pagina is standaard publiek bereikbaar via een `*.pages.dev`-adres. Afschermen kan gratis met Cloudflare Access; **NEEDS_INPUT** of dat nodig is.

## Opbouw

| Bestand | Rol |
|---|---|
| `dashboard/index.html` | de pagina (HTML, CSS, JavaScript zonder framework), stijl uit het prototype |
| `dashboard/check-status.mjs` | controleert of `project-status.json` geldig is; draait bij elke build |
| `wrangler.jsonc` | beperkt wat online komt tot `dashboard/` |
| build op Cloudflare (Worker `project-hub`) | `node dashboard/check-status.mjs && cp project-status.json dashboard/` · uitvoermap `dashboard` |

## Acceptatiecriteria

- AC-001: de pagina toont fase, aantal afgeronde milestones, aantal goedgekeurde flows, aantal open beslissingen en de maandkost uit `project-status.json`.
- AC-002: elke milestone staat in de lijst met zijn status (klaar, bezig, te doen) en geplande vs. gebruikte inspanning.
- AC-003: beslissingen die op Lucas wachten staan apart en vallen op.
- AC-004: licht en donker volgen de instelling van het toestel; leesbaar op gsm-breedte.
- AC-005: is `project-status.json` onbereikbaar of ongeldig, dan toont de pagina een duidelijke foutmelding in plaats van een lege of foute pagina.
- AC-006: een ongeldig `project-status.json` laat de build falen, zodat er nooit een kapotte versie live komt.

## Tests

- Positief: `check-status.mjs` aanvaardt het huidige bestand; de pagina rendert alle onderdelen (browsertest).
- Negatief: `check-status.mjs` weigert een bestand zonder `milestones` of met een onbekende status; de pagina toont de foutmelding als het bestand ontbreekt.

## Bewijs bij afronding

Commit in `main`, schermafbeelding, en de `pages.dev`-URL zodra Lucas de koppeling op Cloudflare heeft gemaakt.
