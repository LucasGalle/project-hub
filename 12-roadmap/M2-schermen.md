# M2 — Skelet met demodata

**Status:** M2a DONE (2026-10-19) · M2b IN_PROGRESS · **Inspanning:** M · **Hangt af van:** M1 (DONE), PH-DEC-016 (login zelf bouwen), PH-DEC-017 (getrouwe kopie)

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

## Bewijs (M2a)

- PR #1, merge commit dcd96eb.
- Live: https://project-hub-app.lucas-galle1.workers.dev (Worker `project-hub-app`, rootmap `app`, $0).
- AC-001..004: Playwright-test `app/tests/screens.test.cjs` groen; schermafbeeldingen in de projectbestanden (`app-schermen/`).
- AC-005 en getrouwheid: op 2026-10-19 door Lucas bevestigd ("Yes het klopt!").

## M2b — Login met Google

**Status:** IN_PROGRESS · **Beslissingen:** PH-DEC-016 (zelf bouwen), PH-DEC-018 (Google)

### Aanpak

- De Worker `project-hub-app` krijgt een klein script (`app/src/worker.js`) dat vóór elk bestand controleert of je ingelogd bent. Niet ingelogd: je ziet het loginscherm.
- "Inloggen met Google" volgt de standaard OpenID Connect-stappen (met `state` en PKCE tegen misbruik). We vragen alleen je naam en e-mailadres (`openid email profile`), geen toegang tot Gmail, Agenda of Drive; dat komt pas bij de bronnen (M4, PH-FLOW-008).
- Wie mag binnen: alleen e-mailadressen op een lijst (`ALLOWED_EMAILS`), nu enkel Lucas. Dat volgt het voorstel bij PH-DEC-007 (eerst alleen Lucas). Het e-mailadres moet bij Google bevestigd zijn.
- Sessie: een ondertekende cookie (HMAC-SHA256), 30 dagen geldig, `HttpOnly`, `Secure`, `SameSite=Lax`. Geen database nodig, dus geen extra dienst en $0. Alle sessies intrekken kan door `SESSION_SECRET` te veranderen.
- Uitloggen via het adres `/auth/logout`. Een knop komt er pas na PH-DEC-019, want het design heeft er geen.
- Ontbreken de geheime instellingen, dan blijft de app dicht en toont het loginscherm dat de login nog niet ingesteld is (veilig falen).
- Preview-builds van andere branches hebben een ander adres, dat Google niet kent; daar werkt inloggen niet. Bewust zo gelaten.

### Loginscherm (PH-DEC-017)

Het prototype heeft geen loginscherm. Het scherm wordt gebouwd met uitsluitend de bestaande stijl van het design (achtergrond met bollen, `panel`, `brand-mark`, `btn btn-primary btn-lg`, lettertypes en kleuren uit `styles.css`), met een minimaal eigen stukje CSS voor het centreren. Lucas keurt het goed via een schermafbeelding vóór het samenvoegen.

### Wat Lucas instelt (eenmalig, gratis)

1. Google Cloud Console: project aanmaken, OAuth-toestemmingsscherm (type External), OAuth-client van het type Web application met als redirect-adres `https://project-hub-app.lucas-galle1.workers.dev/auth/callback`.
2. Cloudflare, Worker `project-hub-app`, Settings › Variables and Secrets, vier geheimen: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET` (lange willekeurige tekst), `ALLOWED_EMAILS` (je e-mailadres; meerdere gescheiden door komma's).

Geheimen komen nooit in de repo (die is publiek) en nooit in de chat.

### Acceptatiecriteria M2b

- AC-006: zonder sessie toont elk adres van de app het loginscherm; de schermen en hun bestanden zijn niet bereikbaar.
- AC-007: "Inloggen met Google" stuurt naar Google met `state` en PKCE; een terugkeer met een foute of ontbrekende `state` wordt geweigerd.
- AC-008: een Google-account dat niet op de lijst staat of geen bevestigd e-mailadres heeft, komt niet binnen en ziet een duidelijke melding.
- AC-009: een toegelaten account komt op Vandaag; een vervalste of verlopen cookie wordt geweigerd.
- AC-010: `/auth/logout` wist de sessie en toont het loginscherm.
- AC-011: zonder ingestelde geheimen blijft de app dicht met de melding dat de login nog niet ingesteld is.
- AC-012: het loginscherm gebruikt enkel de stijl van het design en is goedgekeurd door Lucas.
- AC-013: kost blijft $0 (Cloudflare gratis plan, Google-login gratis).

### Tests

`app/tests/auth.test.mjs` test de Worker zonder netwerk (Google wordt nagebootst): AC-006 t/m AC-011, positief en negatief.
