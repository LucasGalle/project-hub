# Veiligheid en privacy

**Status:** PROPOSED · **Last updated:** 2026-10-18

De agent leest mails, berichten en documenten van klanten en teamleden. Dat maakt privacy een kerneis.

- Tokens van externe tools worden versleuteld bewaard en alleen op de server gebruikt.
- Minimale rechten per tool (PH-BR-008); schrijfrechten pas wanneer een actietype ze nodig heeft.
- Bewaar verwijzingen en korte samenvattingen, geen volledige inhoud (voorstel PH-DEC-010).
- Inhoud die naar het AI-model gaat: alleen wat nodig is voor het voorstel. Bij de Claude API wordt API-data standaard niet gebruikt om modellen te trainen (te verifiëren in de voorwaarden op het moment van kiezen).
- Ontkoppelen van een bron wist token en koppelingen.
- GDPR: bij gebruik voor klanten (PH-DEC-007) is een verwerkersovereenkomst en een privacyverklaring nodig. **NEEDS_INPUT**.
- Data-locatie (EU of VS) is een criterium in `stack-options.md`.
