# Documentation Rules

**Status:** APPROVED · **Owner:** Lucas · **Last updated:** 2026-10-18

1. Eén onderwerp = één canoniek document.
2. Geen bestandsnamen als `final-v2`.
3. Elk beslissend document heeft bovenaan status, owner en last updated.
4. Stabiele ID's:
   - beslissingen `PH-DEC-###`;
   - flows `PH-FLOW-###`;
   - features `PH-FEAT-<DOMEIN>-###`;
   - productregels `PH-BR-###`;
   - acceptatiecriteria `AC-###` binnen een feature of flow;
   - bronnen `SRC-...`;
   - milestones `M0`, `M1`, ...
5. Verwijzingen zijn exacte paden, PR-nummers, commits of documentsecties.
6. "Werkt", "live" of "klaar" vereist bewijs (PR, commit, test, URL).
7. Een `TODO` zonder eigenaar en reden is niet toegestaan.
8. Nieuwe informatie wordt eerst geclassificeerd: bron, beslissing, requirement, bewijs, risico of aanname (`INFERENCE`).
9. Diagrammen staan als Mermaid in de Markdown, zodat ze op GitHub renderen en in versiebeheer zitten.
10. Na elke afgeronde stap: `PROJECT_STATUS.md` en `project-status.json` bijwerken.
