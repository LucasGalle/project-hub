# Project Hub — app

De app is een getrouwe kopie van het design (PH-DEC-017). Stijl, template en logica komen letterlijk uit het prototype v8 (`02-sources/raw/project-hub-prototype-v8.dc.html`).

| Bestand | Rol |
|---|---|
| `public/index.html` | pagina + het template van het design |
| `public/styles.css` | stijl van het design, ongewijzigd |
| `public/component.js` | logica van het design (schermen, interacties, demodata), ongewijzigd |
| `public/runtime.js` | kleine runtime die het Claude Design-template rendert met Preact |
| `public/vendor/` | Preact 10.27.2 (MIT) |
| `tools/extract-design.mjs` | haalt stijl, template en logica opnieuw uit het prototype |
| `tests/screens.test.cjs` | doorklik-test van alle schermen |

Lokaal bekijken: `cd app/public && python3 -m http.server 8790`, open http://localhost:8790.

Testen: `PLAYWRIGHT_PATH=<pad naar playwright> node app/tests/screens.test.cjs`.

Live: Cloudflare Worker `project-hub-app` (zie `wrangler.jsonc`), gratis plan.
