# Stackopties met kostprijs

**Status:** BESLIST — Lucas koos optie **B. Cloudflare alles-in-één** op 2026-10-18 (PH-DEC-006, APPROVED) · **Last updated:** 2026-10-18 · **Bron:** SRC-PRICE-001

Claude kiest de stack niet (PH-DEC-002). Dit document legt vier opties naast elkaar volgens `00-governance/cost-policy.md`. Prijzen zijn opgezocht op 2026-10-18 en worden opnieuw gecheckt vóór de keuze. Wat niet uit een bron komt, staat als **INFERENTIE**.

## Drie kostenmomenten

- **Nu**: bouwen en testen, alleen Lucas gebruikt het.
- **Echt gebruik**: Lucas gebruikt het dagelijks met zijn eigen projecten.
- **Commercieel**: betalende klanten of gebruik voor een bedrijf (dan vallen sommige gratis plannen weg).

De ontwikkeling zelf (Claude Code) loopt op de credits van het Claude Pro-plan. Het Pro-abonnement betaalt **geen** API-gebruik: de AI-agent in de app heeft een aparte API-rekening nodig (zie § AI-kost).

## Overzicht

| | A. Vercel + Supabase | B. Cloudflare alles-in-één | C. Cloudflare + Supabase | D. Low-code (n8n/Make) + database |
|---|---|---|---|---|
| Web-app | Vercel (Next.js) | Cloudflare Pages/Workers | Cloudflare Pages/Workers | Vercel of Cloudflare |
| Database | Supabase (Postgres) | Cloudflare D1 (SQLite) | Supabase (Postgres) | Supabase |
| Login | Supabase Auth (klaar) | zelf bouwen of losse dienst | Supabase Auth (klaar) | Supabase Auth |
| Planner (syncs) | Vercel Cron of Supabase | Cloudflare Cron Triggers | Cloudflare Cron Triggers | n8n/Make-scenario's |
| Koppelingen met tools | zelf coderen | zelf coderen | zelf coderen | grotendeels kant-en-klaar in n8n/Make |
| **Kost nu** | **$0** | **$0** | **$0** | $0 (n8n zelf hosten) tot ±$10–20/m — **prijzen te verifiëren** |
| **Kost echt gebruik** | $0 hosting, maar zie valkuilen | $0–5/m | $0–5/m | idem |
| **Kost commercieel** | $20 (Vercel Pro) + $25 (Supabase Pro) = **$45/m** | **$5/m** (Workers Paid) | **$5–30/m** | $25 + low-code-abonnement |
| Eigen werk | laagst | hoogst (login, realtime zelf) | middel | laag voor koppelingen, hoog voor de schermen |
| Lock-in | middel (Postgres is standaard en verhuisbaar) | hoger (D1/Workers-specifiek) | middel | hoog (logica zit in scenario's) |
| Past bij design | zeer goed | goed | goed | matig: de schermen moeten toch gebouwd worden |

AI-kost komt daar telkens bovenop (± $1 tot $42 per maand, zie hieronder).

## Valkuilen van de gratis plannen

**A. Vercel Hobby + Supabase Free**
- Vercel Hobby is alleen voor **niet-commercieel** gebruik en heeft harde limieten; bij commercieel gebruik is Pro ($20 per lid per maand, inclusief $20 verbruikstegoed) verplicht. [makerkit.dev, mei 2026]
- Cron-jobs op Hobby zijn beperkt (vermoedelijk max. één keer per dag) — **INFERENTIE, te verifiëren**. Alternatief: plannen via Supabase (pg_cron) — **INFERENTIE**.
- Supabase Free: 500 MB database, 50.000 maandelijkse gebruikers, max. 2 actieve projecten, en een project **pauzeert na 1 week zonder activiteit**. [makerkit.dev, sep 2026] Voor een dagelijkse tool is dat meestal geen probleem; tijdens een bouwpauze wel.
- Supabase Pro: $25/m inclusief $10 rekentegoed. [makerkit.dev, sep 2026]

**B. Cloudflare Workers Free**
- 100.000 verzoeken per dag gratis; Workers Paid $5/m met 10 miljoen verzoeken. [developers.cloudflare.com]
- De gratis versie heeft een korte rekentijd per verzoek; wachten op een externe API telt doorgaans niet mee, maar een lange sync moet in stukken — **INFERENTIE, te verifiëren**.
- Geen kant-en-klare login: extra bouwwerk, dus meer Pro-credits tijdens de ontwikkeling.

**C. Hybride**: combineert de goedkope planner en hosting van Cloudflare met Postgres en login van Supabase. Twee leveranciers om te beheren.

**D. Low-code**: koppelingen met Gmail, Slack, Asana enz. zijn snel klaar, maar de schermen (het eigenlijke design) moeten toch gebouwd worden, en de logica zit verspreid over scenario's die moeilijk te testen en te versioneren zijn. Prijzen van n8n Cloud en Make zijn niet nagekeken.

## AI-kost (los van de hosting te kiezen)

Prijzen Claude API per miljoen tokens (in/uit): Haiku 5.5 $0,10/$0,50 · Sonnet 5.5 $2/$10 · Opus 5.5 $4/$20. Batchverwerking (niet dringend) is 50% goedkoper.

**Aanname (INFERENTIE)**: 4 projecten, 3 syncs per dag, ± 250.000 tokens in en 20.000 tokens uit per dag → ± 7,5 miljoen in en 0,6 miljoen uit per maand.

| Model | Per maand | Opmerking |
|---|---|---|
| Haiku 5.5 | **± $1** | goed voor sorteren en eenvoudige voorstellen |
| Sonnet 5.5 | **± $21** | betere concepten van mails en berichten |
| Opus 5.5 | **± $42** | waarschijnlijk overkill voor deze taak |
| Mix: Haiku voor lezen, Sonnet alleen voor concepten | **± $3–6** | INFERENTIE |

Grootste knoppen: hoe vaak syncen (PH-DEC-009) en hoeveel inhoud mee gaat naar het model (PH-DEC-010). Het dashboard toont de echte kost per sync (`SYNC_RUN`).

## Wat al bestaat

- Een gratis Supabase-project (`mhnxozxxygsosbzdbnqa`) werd aangemaakt vóór deze werkwijze. Het kost niets en kan verwijderd worden als Lucas een andere optie kiest.
- Een eerste codeproef (Next.js) staat geparkeerd buiten de repo en is niet in gebruik.

## Gevolgen van de keuze (B)

- Web-app, API, sync en planner draaien op Cloudflare Workers/Pages met Cron Triggers; data in D1.
- Login bouwen we zelf of met een bibliotheek: open beslissing PH-DEC-016, uit te werken vóór M2.
- Lange syncs worden in stukken verdeeld (rekentijdlimiet per verzoek, te verifiëren in M4).
- Het gratis Supabase-project is niet meer nodig.

## Advies dat vóór de keuze gegeven werd

Voor "nu" kosten alle opties $0. Het verschil zit in hoeveel bouwwerk (dus Pro-credits) nodig is en wat het later kost. Optie A vraagt het minste bouwwerk maar wordt $45/m zodra het commercieel wordt; optie C houdt die latere kost lager met wat meer werk. Voor het AI-model lijkt een mix van Haiku en Sonnet de beste prijs/kwaliteit. Lucas beslist.

## Bronnen

- Vercel-prijzen: https://makerkit.dev/blog/saas/vercel-cost (mei 2026)
- Supabase-prijzen: https://makerkit.dev/blog/saas/supabase-pricing (sep 2026)
- Cloudflare Workers-prijzen: https://developers.cloudflare.com/workers/about/pricing
- Claude API-prijzen: Anthropic-documentatie, opgevraagd 2026-10-18
