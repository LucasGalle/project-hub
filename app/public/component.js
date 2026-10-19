// Letterlijk overgenomen uit het prototype v8 (SRC-DES-001), op de import/export na.
import { DCLogic } from './runtime.js';

export const defaultProps = {"startScreen":"vandaag","theme":"light","showLoader":true};

export class Component extends DCLogic {
  state = {
    boot: 'on', screen: null, projectId: 'p2', theme: null, rail: false, transit: false, dayOpen: false,
    fPhase: 'alle', fHealth: 'alle', fClient: 'alle', filtersOpen: false,
    decided: {}, edits: {}, groupBy: 'persoon', feed: 'alle', slack: null, sent: {},
    sel: {}, focus: 0, inboxProject: 'alle', inboxKind: 'alle', flip: false,
    toast: null, syncing: false, lastSync: '09:42', canvaOk: false, mapProject: 'p2', srcSync: {},
    detail: null, detailCtx: null, forms: {}, rejectOpen: false, snoozeOpen: false,
    focusStep: 0, leaving: null, fireDone: {}, followDone: {}, stats: { decided: 0, sent: 0, follow: 0 }, stepFlip: false,
    hubTab: 0, tabFlip: false, moreOpen: false
  };

  IC = {
    slack: 'M10 3 8 21M16 3l-2 18M4 9h17M3 15h17',
    mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
    cal: 'M4 5h16v15H4zM4 10h16M8 3v4M16 3v4',
    drive: 'M3 6h6l2 2h10v11H3z',
    notion: 'M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7',
    canva: 'M12 3a9 9 0 1 0 0 18c1.3 0 2-.8 2-1.8 0-1.2-1-1.6-1-2.6 0-.9.8-1.6 1.8-1.6H17a4 4 0 0 0 4-4C21 6.4 17 3 12 3zM7.5 11.5h.01M10 7.5h.01M15 8h.01',
    asana: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 12.5l2.8 2.8L16 9.8'
  };
  UI = {
    sun: 'M12 3v2M12 19v2M5 12H3M21 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
    inbox: 'M3 13h5l1.5 3h5L16 13h5M5.5 5h13L21 13v6H3v-6z',
    grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
    fire: 'M12 3c1 3 4 4.5 4 8.5a4 4 0 0 1-8 0c0-1.6.7-2.7 1.5-3.5.2 1.5 1 2.5 2 2.5 0-2.5-1-4.5.5-7.5z',
    decide: 'M5 12.5l4.5 4.5L19 7.5',
    people: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14a6 6 0 0 1 3.5 6',
    cal: 'M4 5h16v15H4zM4 10h16M8 3v4M16 3v4',
    collapse: 'M15 6l-6 6 6 6M20 4v16',
    expand: 'M9 6l6 6-6 6M4 4v16'
  };
  TL = { slack: 'Slack', mail: 'Gmail', cal: 'Meeting', drive: 'Drive', notion: 'Notion', canva: 'Canva', asana: 'Asana' };
  PHASES = ['Intake', 'Analyse', 'Design', 'Development', 'Testing', 'Livegang', 'Nazorg'];
  HEALTH = { ok: 'Op schema', warn: 'Aandacht nodig', crit: 'Kritiek' };
  TEAM = ['Lucas Galle', 'Nina Verbeke', 'Jens Peeters', 'Amira El Idrissi', 'Thomas Wouters', 'Lotte Claes', 'Bram De Smet'];
  TAGS = ['Klant', 'Blokkade', 'Scope', 'Design', 'Development', 'QA', 'Data', 'Privacy', 'Documentatie'];
  ACT = {
    mail: { label: 'E-mail', title: 'Concept-mail in Gmail', icon: 'M3 6h18v12H3zM3 7l9 6 9-6' },
    slack: { label: 'Slack', title: 'Bericht in Slack', icon: 'M10 3 8 21M16 3l-2 18M4 9h17M3 15h17' },
    invite: { label: 'Uitnodiging', title: 'Uitnodiging in Google Calendar', icon: 'M4 5h16v15H4zM4 10h16M8 3v4M16 3v4' },
    doc: { label: 'Notion-pagina', title: 'Nieuwe pagina in Notion', icon: 'M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7' }
  };

  /* ---- refs & pointer effects (no re-render) ---- */
  rootRef = (el) => { this._root = el; };
  dlgRef = (el) => { this._dlg = el; };
  focusRef = (el) => { this._fs = el; };
  stop = (e) => { if (e && e.stopPropagation) e.stopPropagation(); };
  onPar = (e) => {
    const el = this._root; if (!el || this._parRaf) return;
    const x = e.clientX, y = e.clientY;
    this._parRaf = requestAnimationFrame(() => {
      this._parRaf = null;
      const w = window.innerWidth || 1, h = window.innerHeight || 1;
      el.style.setProperty('--px', ((x / w) - .5).toFixed(3));
      el.style.setProperty('--py', ((y / h) - .5).toFixed(3));
    });
  };
  tilt = (e) => {
    const el = e.currentTarget; if (!el || !el.getBoundingClientRect) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', ((.5 - y) * 7).toFixed(2) + 'deg');
    el.style.setProperty('--ry', ((x - .5) * 9).toFixed(2) + 'deg');
    el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
    el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
  };
  tiltOut = (e) => { const el = e.currentTarget; if (!el) return; el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); };
  magnet = (e) => {
    const el = e.currentTarget; if (!el || !el.getBoundingClientRect) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mgx', ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + 'px');
    el.style.setProperty('--mgy', ((e.clientY - r.top - r.height / 2) * .3).toFixed(1) + 'px');
  };
  magnetOut = (e) => { const el = e.currentTarget; if (!el) return; el.style.setProperty('--mgx', '0px'); el.style.setProperty('--mgy', '0px'); };

  componentDidMount() {
    const skip = this.props.showLoader === false;
    if (skip) this.setState({ boot: 'done' });
    else {
      this._b1 = setTimeout(() => this.setState({ boot: 'out' }), 2000);
      this._b2 = setTimeout(() => this.setState({ boot: 'done' }), 2650);
    }
    this._onScroll = () => { if (this._root) this._root.style.setProperty('--sy', String(window.scrollY || 0)); };
    try { window.addEventListener('scroll', this._onScroll, { passive: true }); } catch (e) {}
  }
  componentWillUnmount() {
    clearTimeout(this._b1); clearTimeout(this._b2); clearTimeout(this._tt); clearTimeout(this._tr); clearTimeout(this._lv);
    try { window.removeEventListener('scroll', this._onScroll); } catch (e) {}
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.detail && this.state.detail !== prevState.detail && this._dlg && this._dlg.focus) { try { this._dlg.focus({ preventScroll: true }); } catch (e) {} }
    if (this.state.focusStep === 1 && (prevState.focusStep !== 1 || prevState.screen !== this.state.screen) && this._fs && this._fs.focus) { try { this._fs.focus({ preventScroll: true }); } catch (e) {} }
    if (!this.state.detail && prevState.detail && this.state.screen === 'focus' && this.state.focusStep === 1 && this._fs) { try { this._fs.focus({ preventScroll: true }); } catch (e) {} }
  }
  db() {
    if (this._db) return this._db;
    const S = (t, l, m) => ({ t, l, m });
    const T = (title, owner, due, status, overdue) => ({ title, owner, due, status, overdue });
    const P = [
      {
        id: 'p2', name: 'Kennisbank-assistent', client: 'Zorgnet Kempen', contact: 'Karen Jacobs', channel: '#zorgnet-kb-dev',
        phase: 3, health: 'crit', healthWhy: 'SharePoint-toegang blokkeert de ingest-pipeline; start Testing komt in gevaar.',
        hours: [412, 520], hoursLabel: 'Uren (budget)', milestone: 'Start Testing', milestoneDate: 'ma 19 okt', milestoneIn: 'over 14 dagen',
        deadline: 'Admin-dashboard wireframes', deadlineDate: 'di 6 okt', golive: '13 nov 2026', itemsRead: 64,
        phases: [[100, '3 jul'], [100, '25 jul'], [100, '22 aug'], [62, '16 okt'], [0, '6 nov'], [0, '13 nov'], [0, '18 dec']],
        blockers: ['Wacht sinds 24 sep op admin consent voor de Graph API bij Zorgnet'],
        summary: 'De ontwikkeling loopt vast op de SharePoint-koppeling. Jens wacht sinds 24 september op admin consent voor de Graph API-app bij Zorgnet; Karen Jacobs liet vanochtend weten dat hun security officer pas op 8 oktober terug is. Zonder die toegang kan de ingest-pipeline niet met echte documenten getest worden, waardoor de start van Testing op 19 oktober in gevaar komt. Thomas haalde intussen 84% correcte antwoorden op de testset (doel: 90%). Van Amira kwam al 6 dagen geen update over de chat-interface.',
        notes: [
          { text: 'Uren lopen voor op de voortgang: 79% van het budget is verbruikt bij 62% afgewerkte development.', src: S('asana', 'Urenrapport', 'vandaag 07:00') },
          { text: 'De klant vroeg tijdens de sprint review om ook Engelstalige antwoorden. Dat staat niet in de offerte.', src: S('cal', 'Sprint review Zorgnet', 'do 1 okt') },
          { text: 'Fouten in de evaluatie zitten vooral bij vragen over nachtdiensten en vervangingsregels.', src: S('slack', '#zorgnet-kb-dev', 'Thomas Wouters · gisteren 17:10') }
        ],
        risks: [['Hoog', 'crit', 'Start Testing schuift minstens een week als de toegang er niet vóór 9 oktober is.'], ['Middel', 'warn', 'Budgetoverschrijding van ±60 uur bij het huidige tempo.'], ['Middel', 'warn', 'Scope-uitbreiding (meertaligheid) zonder change request.']],
        steps: [
          { id: 'p2s1', title: 'Escaleer de Graph API-toegang en vraag een tijdelijke workaround', detail: 'Concept-mail aan Karen Jacobs: vraag een export van 50 representatieve procedures, zodat Jens verder kan tot de consent rond is.', src: S('mail', 'Karen Jacobs', 'vandaag 08:55'), exec: 'Concept-mail aan Karen klaargezet in Gmail', when: '08:55' },
          { id: 'p2s2', title: 'Herschik de testplanning met Jens en Thomas', detail: 'Plan 30 minuten dinsdag na de stand-up. Iedereen is vrij tussen 10:30 en 11:30.', src: S('cal', 'Agenda KB-team', 'di 6 okt'), exec: 'Uitnodiging klaargezet voor di 6 okt 10:30', when: '09:40' },
          { id: 'p2s3', title: 'Stuur een change request voor Engelstalige antwoorden', detail: 'De agent schat 24 uur extra werk (vertaalde prompts, testset EN, UI-labels).', src: S('cal', 'Sprint review Zorgnet', 'do 1 okt'), exec: 'Change request opgesteld in Notion', when: 'do' },
          { id: 'p2s4', title: 'Vraag Amira naar de status van de chat-interface', detail: 'Laatste commit op 29 sep; taak “Bronvermelding in antwoorden” is achterstallig.', src: S('asana', 'Bronvermelding in antwoorden', 'deadline 30 sep'), exec: 'Slack-bericht aan Amira klaargezet', when: '07:00' }
        ],
        todos: [
          { id: 'p2t1', title: 'Testset uitbreiden met 40 echte vragen van de verpleegafdeling', quote: 'We hebben meer echte vragen van de vloer nodig, vooral over nachtdiensten.', src: S('slack', '#zorgnet-kb-dev', 'Thomas Wouters · gisteren 17:10'), owner: 'Thomas Wouters', due: '9 okt', when: 'gisteren' },
          { id: 'p2t2', title: 'DPIA opvragen bij de DPO van Zorgnet', quote: 'Onze DPO wil de privacy-impactanalyse zien voor we live gaan.', src: S('mail', 'Karen Jacobs', 'vandaag 08:55'), owner: 'Lucas Galle', due: '7 okt', when: '08:55' },
          { id: 'p2t3', title: 'Fallback-antwoord ontwerpen als er geen bron gevonden wordt', quote: 'Wat ziet de gebruiker als de assistent het antwoord niet weet?', src: S('cal', 'Sprint review Zorgnet', 'do 1 okt'), owner: 'Lotte Claes', due: '12 okt', when: 'do' }
        ],
        tasks: [T('Ingest-pipeline SharePoint → vectorstore', 'Jens Peeters', '2 okt', 'Geblokkeerd', true), T('Chunking-strategie voor PDF-procedures', 'Jens Peeters', '9 okt', 'In uitvoering'), T('Retrieval-evaluatie ronde 2', 'Thomas Wouters', '8 okt', 'In uitvoering'), T('Bronvermelding in antwoorden', 'Amira El Idrissi', '30 sep', 'In uitvoering', true), T('Chat-interface: feedbackknoppen', 'Amira El Idrissi', '12 okt', 'Te doen'), T('Admin-dashboard wireframes', 'Lotte Claes', '6 okt', 'Review'), T('Testplan opstellen', 'Bram De Smet', '14 okt', 'Te doen')],
        devs: [
          { name: 'Jens Peeters', role: 'Backend developer', last: '2 u geleden', fresh: 'ok', update: 'Gaat verder met chunking op de lokale testset', via: 'Slack', working: 'Chunking-strategie voor PDF-procedures', blocker: 'Wacht op Graph API admin consent (sinds 24 sep)' },
          { name: 'Thomas Wouters', role: 'AI engineer', last: 'gisteren', fresh: 'ok', update: 'Eval ronde 2: 84% correct', via: 'Slack', working: 'Retrieval-evaluatie ronde 2', blocker: '' },
          { name: 'Amira El Idrissi', role: 'Frontend developer', last: '6 dagen stil', fresh: 'stale', update: 'Laatste commit “source chips WIP”', via: 'GitHub', working: 'Bronvermelding in antwoorden', blocker: '' }
        ],
        meetings: [['Di 6 okt', '09:30', 'Stand-up KB-team', 'Jens, Thomas, Amira, Lucas'], ['Do 8 okt', '14:00', 'Stuurgroep Zorgnet', 'Karen Jacobs, dr. Van Loock, Lucas'], ['Vr 9 okt', '11:00', 'Interne demo retrieval', 'Thomas, Jens, Lucas']],
        docs: [['drive', 'Functionele analyse v1.3', 'Google Docs · 29 sep'], ['notion', 'Architectuur & datastromen', 'Notion · 2 okt'], ['notion', 'Sprintnotities KB', 'Notion · vandaag'], ['canva', 'Chat UI-ontwerp v2', 'Canva · 29 sep'], ['drive', 'Testset vragen.xlsx', 'Sheets · gisteren']],
        decisions: [['22 aug', 'Azure OpenAI in de EU-regio: data verlaat de EU niet.', S('cal', 'Stuurgroep Zorgnet', '22 aug')], ['5 sep', 'Enkel procedures in PDF en Word in scope, geen e-mails of intranetpagina’s.', S('mail', 'Karen Jacobs', '5 sep')], ['1 okt', 'Engelstalige antwoorden vallen buiten de huidige scope; eerst een change request.', S('cal', 'Sprint review Zorgnet', '1 okt')]],
        feed: [['slack', 'vandaag 09:31', 'Jens Peeters', 'Nog altijd geen consent op de app-registratie. Ik ga verder met chunking op de lokale testset.'], ['mail', 'vandaag 08:55', 'Karen Jacobs', 'Re: Toegang SharePoint — onze security officer is terug op 8/10, dan bekijken we de consent.'], ['slack', 'gisteren 17:10', 'Thomas Wouters', 'Eval ronde 2: 84% correct. Vooral fouten bij vragen over nachtdiensten.'], ['asana', 'vr 2 okt', 'Asana', 'Deadline “Ingest-pipeline SharePoint → vectorstore” verstreken.'], ['cal', 'do 1 okt', 'Sprint review', 'Klant vraagt Engelstalige antwoorden voor anderstalige medewerkers.'], ['drive', 'di 29 sep', 'Nina Verbeke', 'Functionele analyse v1.3 bijgewerkt (hoofdstuk rechten).'], ['canva', 'di 29 sep', 'Lotte Claes', 'Chat UI-ontwerp v2 gedeeld met het team.']]
      },
      {
        id: 'p1', name: 'Offerte-assistent', client: 'Dewaele Bouwgroep', contact: 'Pieter Dewaele', channel: '#offerte-dewaele',
        phase: 1, health: 'warn', healthWhy: 'Data van de klant laat op zich wachten; weinig speling tot het analyse-rapport.',
        hours: [64, 180], hoursLabel: 'Uren (budget)', milestone: 'Analyse-rapport naar klant', milestoneDate: 'vr 9 okt', milestoneIn: 'over 4 dagen',
        deadline: 'Workshop calculatoren', deadlineDate: 'wo 7 okt', golive: '22 jan 2027', itemsRead: 31,
        phases: [[100, '12 sep'], [55, '9 okt'], [0, '30 okt'], [0, '11 dec'], [0, '15 jan'], [0, '22 jan'], [0, '26 feb']],
        blockers: ['ERP-export van 200 historische offertes nog niet ontvangen'],
        summary: 'De analyse is voor ruim de helft klaar, maar wacht op data van de klant. Pieter Dewaele beloofde op 24 september een export van 200 historische offertes uit Navision; die is er nog niet. De workshop met de calculatoren is verschoven van 2 naar 7 oktober. Nina heeft de AS-IS-procesbeschrijving voor zo’n 60% uitgewerkt in Notion.',
        notes: [
          { text: 'Calculator Geert Vermeulen vraagt of de tool ook actuele leveranciersprijzen kan ophalen. Dat valt buiten de huidige scope.', src: S('mail', 'Geert Vermeulen', 'do 1 okt 16:20') },
          { text: 'Het analyse-rapport (9 okt) hangt af van de workshop op 7 okt: er zitten maar twee werkdagen tussen.', src: S('cal', 'Workshop calculatoren', 'wo 7 okt') }
        ],
        risks: [['Middel', 'warn', 'Oplevering analyse-rapport schuift als de ERP-export deze week niet binnenkomt.'], ['Middel', 'warn', 'Kwaliteit van de ERP-data is onbekend: oudere offertes gebruiken andere artikelcodes.'], ['Laag', 'ok', 'Scope-uitbreiding naar leveranciersprijzen als die niet expliciet wordt afgebakend.']],
        steps: [
          { id: 'p1s1', title: 'Stuur Pieter een herinnering voor de ERP-export', detail: 'Concept-mail met de velden die Jens nodig heeft en een gedeelde Drive-map om de export aan te leveren.', src: S('mail', 'Pieter Dewaele', 'do 24 sep 11:05'), exec: 'Concept-mail aan Pieter klaargezet in Gmail', when: '07:00' },
          { id: 'p1s2', title: 'Bereid de workshop van 7 okt voor met een vragenlijst', detail: 'De agent zette 12 vragen klaar op basis van het intakeverslag en de open punten.', src: S('notion', 'Intakeverslag Dewaele', 'bijgewerkt 2 okt'), exec: 'Vragenlijst aangemaakt als Notion-pagina', when: 'vr' },
          { id: 'p1s3', title: 'Neem leveranciersprijzen op als aparte optie', detail: 'Beschrijf het als optie in het analyse-rapport, niet in de basis-scope.', src: S('mail', 'Geert Vermeulen', 'do 1 okt 16:20'), exec: 'Sectie “Opties” toegevoegd aan het analyse-rapport', when: 'do' }
        ],
        todos: [
          { id: 'p1t1', title: 'NDA laten ondertekenen vóór ontvangst van ERP-data', quote: 'Onze juridische dienst wil eerst een NDA voor we klantdata doorsturen.', src: S('mail', 'Pieter Dewaele', 'vr 2 okt 14:48'), owner: 'Lucas Galle', due: '7 okt', when: 'vr' },
          { id: 'p1t2', title: 'Drie renovatie-offertes selecteren voor de workshop', quote: 'Kunnen we op de workshop 3 echte offertes overlopen? Liefst renovatie.', src: S('slack', '#offerte-dewaele', 'Nina Verbeke · vandaag 08:47'), owner: 'Nina Verbeke', due: '6 okt', when: '08:47' }
        ],
        tasks: [T('AS-IS-procesbeschrijving offerteflow', 'Nina Verbeke', '8 okt', 'In uitvoering'), T('Data-inventaris ERP (Navision)', 'Jens Peeters', '2 okt', 'Geblokkeerd', true), T('Interviews calculatoren plannen', 'Lucas Galle', '5 okt', 'In uitvoering'), T('Offerte-templates verzamelen', 'Nina Verbeke', '9 okt', 'Te doen'), T('Analyse-rapport: structuur en conclusies', 'Lucas Galle', '9 okt', 'Te doen')],
        devs: [
          { name: 'Nina Verbeke', role: 'Business analyst', last: '1 u geleden', fresh: 'ok', update: 'Vraagt 3 voorbeeldoffertes voor de workshop', via: 'Slack', working: 'AS-IS-procesbeschrijving offerteflow', blocker: '' },
          { name: 'Jens Peeters', role: 'Backend developer', last: '3 dagen', fresh: 'aging', update: 'Taak op geblokkeerd gezet', via: 'Asana', working: 'Data-inventaris ERP (Navision)', blocker: 'Wacht op ERP-export van de klant' }
        ],
        meetings: [['Ma 5 okt', '11:00', 'Korte klantcall Dewaele', 'Pieter Dewaele, Lucas'], ['Wo 7 okt', '09:30', 'Workshop calculatoren (Kortrijk)', '3 calculatoren, Nina, Lucas'], ['Vr 9 okt', '15:00', 'Interne review analyse', 'Nina, Jens, Lucas']],
        docs: [['notion', 'Intakeverslag Dewaele', 'Notion · 2 okt'], ['notion', 'AS-IS-procesbeschrijving', 'Notion · vandaag'], ['drive', 'Voorbeeldoffertes 2024–2025', 'Drive · 14 bestanden'], ['drive', 'Offerte getekend.pdf', 'Drive · 10 sep']],
        decisions: [['12 sep', 'Start met offertes voor renovatie; nieuwbouw volgt in een tweede fase.', S('cal', 'Intakemeeting', '12 sep')], ['18 sep', 'Navision blijft de master voor prijzen en artikelcodes.', S('mail', 'Pieter Dewaele', '18 sep')]],
        feed: [['slack', 'vandaag 08:47', 'Nina Verbeke', 'Kunnen we op de workshop 3 echte offertes overlopen? Liefst renovatie.'], ['mail', 'vr 2 okt 14:48', 'Pieter Dewaele', 'Onze juridische dienst wil eerst een NDA voor we klantdata doorsturen.'], ['cal', 'vr 2 okt', 'Agenda', 'Workshop calculatoren verplaatst van 2 naar 7 oktober.'], ['asana', 'vr 2 okt', 'Asana', 'Deadline “Data-inventaris ERP” verstreken.'], ['mail', 'do 1 okt 16:20', 'Geert Vermeulen', 'Zou de tool ook dagprijzen van leveranciers kunnen ophalen?'], ['notion', 'wo 30 sep', 'Nina Verbeke', 'AS-IS-procesbeschrijving bijgewerkt (60%).']]
      },
      {
        id: 'p3', name: 'Webshop & aanbevelingen', client: 'Maison Laure', contact: 'Laure Michiels', channel: '#maisonlaure-shop',
        phase: 4, health: 'ok', healthWhy: 'Testing loopt volgens plan; 11 van 14 bevindingen opgelost.',
        hours: [598, 700], hoursLabel: 'Uren (budget)', milestone: 'UAT met Laure', milestoneDate: 'ma 12 okt', milestoneIn: 'over 7 dagen',
        deadline: 'Hertest Bancontact iOS', deadlineDate: 'di 6 okt', golive: '21 okt 2026', itemsRead: 47,
        phases: [[100, '10 jul'], [100, '31 jul'], [100, '22 aug'], [100, '26 sep'], [70, '14 okt'], [0, '21 okt'], [0, '20 nov']],
        blockers: [],
        summary: 'Testing loopt op schema. Bram registreerde 14 bevindingen, waarvan 11 opgelost. De betaalbug met Bancontact op iOS is gisteren door Amira gefixt en wacht op hertest. Laure bevestigde per mail de UAT-sessie op 12 oktober. In de A/B-test zorgen de productaanbevelingen voor 7% meer doorkliks.',
        notes: [
          { text: 'Voor 23 producten uit de wintercollectie ontbreken nog productfoto’s.', src: S('drive', 'Wintercollectie / foto’s', 'gisteren') },
          { text: 'Laure wil de lanceringsbeelden nog aanpassen na de UAT.', src: S('canva', 'Campagnebeelden lancering', 'Laure · vr 2 okt') }
        ],
        risks: [['Middel', 'warn', 'Ontbrekende foto’s: productpagina’s zonder beeld bij livegang.'], ['Laag', 'ok', 'Nieuwe redirects nog niet getest: tijdelijk SEO-verlies mogelijk.']],
        steps: [
          { id: 'p3s1', title: 'Plan de hertest van Bancontact op iOS', detail: 'Bram heeft morgen om 10:00 een vrij blok; de fix staat op staging.', src: S('slack', '#maisonlaure-shop', 'Amira El Idrissi · gisteren 18:02'), exec: 'Hertest ingepland voor di 6 okt 10:00', when: 'gisteren' },
          { id: 'p3s2', title: 'Herinner Laure aan de foto’s van de wintercollectie', detail: 'Concept-mail met de lijst van 23 ontbrekende producten als bijlage.', src: S('drive', 'Wintercollectie / foto’s', 'gisteren'), exec: 'Concept-mail aan Laure klaargezet in Gmail', when: 'gisteren' },
          { id: 'p3s3', title: 'Bevestig de livegang-checklist met de hostingpartner', detail: 'DNS-wijziging en cache-flush op 21 okt om 08:00.', src: S('notion', 'Livegang-checklist', 'bijgewerkt 1 okt'), exec: 'Bevestiging aan hostingpartner klaargezet', when: 'do' }
        ],
        todos: [
          { id: 'p3t1', title: 'Redirects van oude URL’s naar de nieuwe structuur testen', quote: 'De mapping staat in de sheet, maar niemand heeft ze al getest.', src: S('slack', '#maisonlaure-shop', 'Amira El Idrissi · vandaag 09:12'), owner: 'Bram De Smet', due: '13 okt', when: '09:12' },
          { id: 'p3t2', title: 'Cookiebanner-teksten laten nakijken', quote: 'Kunnen jullie de teksten van de cookiebanner nog even nalezen?', src: S('mail', 'Laure Michiels', 'vr 2 okt 10:31'), owner: 'Lucas Galle', due: '9 okt', when: 'vr' }
        ],
        tasks: [T('Hertest Bancontact iOS', 'Bram De Smet', '6 okt', 'Review'), T('Redirect-mapping uitwerken', 'Amira El Idrissi', '8 okt', 'In uitvoering'), T('UAT-script voor Laure', 'Lucas Galle', '9 okt', 'Te doen'), T('Productfoto’s wintercollectie uploaden', 'Lotte Claes', '7 okt', 'Te doen'), T('SEO-metadata productcategorieën', 'Amira El Idrissi', '3 okt', 'In uitvoering', true)],
        devs: [
          { name: 'Bram De Smet', role: 'QA tester', last: '40 min geleden', fresh: 'ok', update: 'Bevinding #14 gelogd (filter maat)', via: 'Asana', working: 'Regressietest checkout', blocker: '' },
          { name: 'Amira El Idrissi', role: 'Frontend developer', last: '3 u geleden', fresh: 'ok', update: 'Fix Bancontact iOS op staging', via: 'Slack', working: 'Redirect-mapping uitwerken', blocker: '' },
          { name: 'Thomas Wouters', role: 'AI engineer', last: 'gisteren', fresh: 'ok', update: 'A/B-resultaten aanbevelingen gedeeld', via: 'Slack', working: 'Aanbevelingsmodel fine-tunen', blocker: '' }
        ],
        meetings: [['Ma 5 okt', '16:00', 'Bug-triage Maison Laure', 'Bram, Amira, Lucas'], ['Ma 12 okt', '10:00', 'UAT met Laure', 'Laure Michiels, Bram, Lucas'], ['Wo 21 okt', '08:00', 'Go-live webshop', 'Team + hostingpartner']],
        docs: [['drive', 'Testrapport webshop', 'Sheets · vandaag'], ['notion', 'Livegang-checklist', 'Notion · 1 okt'], ['canva', 'Campagnebeelden lancering', 'Canva · 2 okt'], ['drive', 'Redirect-mapping.csv', 'Drive · gisteren']],
        decisions: [['15 sep', 'Lancering vastgelegd op woensdag 21 oktober.', S('mail', 'Laure Michiels', '15 sep')], ['28 sep', 'Aanbevelingen enkel op productpagina’s, niet in de winkelmand.', S('cal', 'Designreview', '28 sep')]],
        feed: [['asana', 'vandaag 09:20', 'Bram De Smet', 'Bevinding #14: filter op maat toont uitverkochte maten.'], ['slack', 'vandaag 09:12', 'Amira El Idrissi', 'De redirect-mapping staat in de sheet, maar niemand heeft ze al getest.'], ['slack', 'gisteren 18:02', 'Amira El Idrissi', 'Fix voor Bancontact op iOS staat op staging.'], ['drive', 'gisteren', 'Lotte Claes', 'Lijst ontbrekende foto’s wintercollectie aangemaakt (23).'], ['mail', 'vr 2 okt 10:31', 'Laure Michiels', 'UAT op 12/10 is goed voor mij. Cookiebanner nog nalezen?'], ['canva', 'vr 2 okt', 'Laure Michiels', 'Opmerkingen toegevoegd aan Campagnebeelden lancering.']]
      },
      {
        id: 'p4', name: 'Onboarding-automatisatie', client: 'Talentum Interim', contact: 'Wim Hermans', channel: '#talentum-onboarding',
        phase: 6, health: 'ok', healthWhy: 'Live sinds 28 sep; twee kleine incidenten, beide opgelost.',
        hours: [12, 40], hoursLabel: 'Nazorg-uren', milestone: 'Evaluatie na 30 dagen', milestoneDate: 'wo 28 okt', milestoneIn: 'over 23 dagen',
        deadline: 'Training HR-team deel 2', deadlineDate: 'wo 7 okt', golive: 'Live sinds 28 sep', itemsRead: 22,
        phases: [[100, '20 jun'], [100, '11 jul'], [100, '1 aug'], [100, '5 sep'], [100, '24 sep'], [100, '28 sep'], [25, '31 okt']],
        blockers: [],
        summary: 'Sinds de livegang op 28 september liepen 46 onboardings automatisch. Er waren twee meldingen: een verkeerde logoversie in de welkomstmail (opgelost) en een vertraging van 17 minuten in de koppeling met het loonpakket op 1 oktober (hersteld). Wim Hermans is tevreden en vraagt in Slack naar een maandrapport.',
        notes: [
          { text: 'Wim polst of dezelfde aanpak ook kan voor offboarding. Mogelijk vervolgproject.', src: S('slack', '#talentum-onboarding', 'Wim Hermans · vr 2 okt') },
          { text: 'De koppeling met het loonpakket heeft geen monitoring: het incident van 1 okt werd door de klant gemeld.', src: S('mail', 'Wim Hermans', 'do 1 okt 09:14') }
        ],
        risks: [['Laag', 'ok', 'Storingen in de loonpakket-API worden pas laat opgemerkt zonder monitoring.']],
        steps: [
          { id: 'p4s1', title: 'Zet uptime-monitoring op de loonpakket-koppeling', detail: 'Alert naar #talentum-onboarding bij meer dan 5 minuten vertraging.', src: S('mail', 'Wim Hermans', 'do 1 okt 09:14'), exec: 'Taak voor monitoring aan Jens voorgesteld', when: 'do' },
          { id: 'p4s2', title: 'Stel een voorstel op voor uitbreiding naar offboarding', detail: 'De agent maakte een eerste opzet op basis van de huidige flows.', src: S('slack', '#talentum-onboarding', 'Wim Hermans · vr 2 okt'), exec: 'Opzet voorstel aangemaakt in Notion', when: 'vr' }
        ],
        todos: [
          { id: 'p4t1', title: 'Maandrapport onboardings opzetten', quote: 'Kunnen we elke maand een overzicht krijgen van het aantal onboardings en de doorlooptijd?', src: S('slack', '#talentum-onboarding', 'Wim Hermans · vr 2 okt'), owner: 'Thomas Wouters', due: '15 okt', when: 'vr' },
          { id: 'p4t2', title: 'HR-handleiding aanvullen met de nieuwe controle-stap', quote: 'Het team wist niet dat ze het contract nog moeten nakijken.', src: S('mail', 'Wim Hermans', 'wo 30 sep 15:40'), owner: 'Nina Verbeke', due: '9 okt', when: 'wo' }
        ],
        tasks: [T('Monitoring loonpakket-koppeling', 'Jens Peeters', '9 okt', 'Te doen'), T('Overdrachtsdocument afwerken', 'Lucas Galle', '16 okt', 'In uitvoering'), T('Training HR-team deel 2', 'Lucas Galle', '7 okt', 'Te doen')],
        devs: [
          { name: 'Jens Peeters', role: 'Backend developer', last: 'gisteren', fresh: 'ok', update: 'Incident loonpakket gedocumenteerd', via: 'Notion', working: 'Hotfix-standby nazorg', blocker: '' },
          { name: 'Thomas Wouters', role: 'AI engineer', last: '2 dagen', fresh: 'aging', update: 'Logs van de documentcheck nagekeken', via: 'Slack', working: 'Kwaliteitscheck documentherkenning', blocker: '' }
        ],
        meetings: [['Do 8 okt', '13:00', 'Nazorg check-in Talentum', 'Wim Hermans, Lucas'], ['Wo 28 okt', '10:00', 'Evaluatie na 30 dagen', 'Wim Hermans, HR-team, Lucas']],
        docs: [['notion', 'Overdrachtsdocument', 'Notion · gisteren'], ['canva', 'Flowdiagram onboarding', 'Canva · 15 sep'], ['drive', 'HR-handleiding onboarding', 'Google Docs · 28 sep']],
        decisions: [['21 sep', 'Go-live op 28 september na geslaagde UAT.', S('cal', 'UAT Talentum', '21 sep')], ['1 okt', 'Incidenten korter dan 1 uur worden niet aangerekend in de nazorg.', S('mail', 'Wim Hermans', '1 okt')]],
        feed: [['slack', 'vr 2 okt', 'Wim Hermans', 'Kunnen we elke maand een overzicht krijgen van het aantal onboardings?'], ['mail', 'do 1 okt 09:14', 'Wim Hermans', 'Vanochtend 17 minuten vertraging bij de koppeling met het loonpakket.'], ['notion', 'do 1 okt', 'Jens Peeters', 'Incidentverslag loonpakket toegevoegd.'], ['asana', 'wo 30 sep', 'Asana', 'Bugfix logo welkomstmail afgerond.'], ['cal', 'ma 28 sep', 'Go-live', 'Onboarding-automatisatie live gezet.']]
      }
    ];
    const map = {
      p1: [['asana', 'Asana', ['Dewaele – Offerte-assistent']], ['slack', 'Slack', ['#offerte-dewaele']], ['mail', 'Gmail', ['Label: Klanten/Dewaele', '@dewaele-bouw.be']], ['cal', 'Agenda', ['Titel bevat “Dewaele”']], ['drive', 'Drive', ['Klanten/Dewaele Bouwgroep']], ['notion', 'Notion', ['Intakeverslag Dewaele', 'AS-IS-procesbeschrijving']], ['canva', 'Canva', ['Nog niets gekoppeld']]],
      p2: [['asana', 'Asana', ['Zorgnet – Kennisbank-assistent']], ['slack', 'Slack', ['#zorgnet-kb-dev', '#zorgnet-klant (gedeeld)']], ['mail', 'Gmail', ['Label: Klanten/Zorgnet', '@zorgnetkempen.be']], ['cal', 'Agenda', ['Titel bevat “Zorgnet”', 'Stand-up KB-team']], ['drive', 'Drive', ['Klanten/Zorgnet Kempen/Kennisbank']], ['notion', 'Notion', ['Architectuur & datastromen', 'Sprintnotities KB']], ['canva', 'Canva', ['Chat UI-ontwerp v2']]],
      p3: [['asana', 'Asana', ['Maison Laure – Webshop']], ['slack', 'Slack', ['#maisonlaure-shop']], ['mail', 'Gmail', ['Label: Klanten/Maison Laure', '@maisonlaure.be']], ['cal', 'Agenda', ['Titel bevat “Maison Laure”', 'UAT', 'Go-live']], ['drive', 'Drive', ['Klanten/Maison Laure', 'Wintercollectie / foto’s']], ['notion', 'Notion', ['Livegang-checklist']], ['canva', 'Canva', ['Campagnebeelden lancering']]],
      p4: [['asana', 'Asana', ['Talentum – Onboarding']], ['slack', 'Slack', ['#talentum-onboarding']], ['mail', 'Gmail', ['Label: Klanten/Talentum', '@talentum.be']], ['cal', 'Agenda', ['Titel bevat “Talentum”']], ['drive', 'Drive', ['Klanten/Talentum Interim']], ['notion', 'Notion', ['Overdrachtsdocument']], ['canva', 'Canva', ['Flowdiagram onboarding']]]
    };
    this._db = { P, map };
    return this._db;
  }
  extras() {
    if (this._ex) return this._ex;
    const M = (aTo, aSubject, aBody) => ({ aType: 'mail', aTo, aSubject, aBody });
    const D = (aSubject, aLoc, aBody) => ({ aType: 'doc', aSubject, aLoc, aBody });
    const SL = (aTo, aBody) => ({ aType: 'slack', aTo, aBody });
    const I = (aSubject, aDate, aTime, aDur, aAttendees, aBody) => ({ aType: 'invite', aSubject, aDate, aTime, aDur, aAttendees, aBody, aMeet: true });
    this._ex = {
      p2s1: { conf: 'Hoog', why: ['De blokkade staat al 11 dagen open en raakt de start van Testing.', 'Karen meldt zelf dat de security officer pas op 8/10 terug is.', 'Een export van testdocumenten laat Jens verder werken zonder op de consent te wachten.'], excerpt: 'Hoi Lucas,\nonze security officer is pas terug op 8/10. Dan bekijken we de admin consent voor jullie app-registratie. Sorry voor het oponthoud!\nGroeten, Karen', action: M('karen.jacobs@zorgnetkempen.be', 'Toegang SharePoint – voorstel tijdelijke workaround', 'Dag Karen,\n\nBedankt voor de update. Omdat de admin consent pas na 8 oktober bekeken kan worden, stellen we een tijdelijke workaround voor: kunnen jullie een vijftigtal representatieve procedures (PDF/Word) in een gedeelde map zetten? Zo kan Jens de ingest-pipeline verder testen en blijft de start van Testing op 19 oktober haalbaar.\n\nZodra de consent rond is, schakelen we over op de live-koppeling.\n\nAlvast bedankt!\nLucas') },
      p2s2: { conf: 'Middel', why: ['De start van Testing (19 okt) komt onder druk.', 'Jens, Thomas en jij zijn dinsdag vrij tussen 10:30 en 11:30.'], excerpt: 'Agenda KB-team · di 6 okt\n09:30–09:45 Stand-up\nGeen afspraken voor Jens, Thomas en Lucas tussen 10:30 en 11:30.', action: I('Testplanning herschikken – Kennisbank', '2026-10-06', '10:30', '30', ['Jens Peeters', 'Thomas Wouters'], '1. Impact van de SharePoint-blokkade op de planning\n2. Wat kunnen we al testen met de lokale testset?\n3. Nieuwe datum voor de start van Testing') },
      p2s3: { conf: 'Hoog', why: ['De klant vroeg tijdens de sprint review om Engelstalige antwoorden.', 'Dit zit niet in de offerte; op 1 okt werd beslist dat er een change request nodig is.'], excerpt: 'Sprint review 1 okt (transcript)\n“Een deel van onze nachtploeg is anderstalig. Kan de assistent ook in het Engels antwoorden?” — Karen Jacobs', action: D('Change request – Engelstalige antwoorden', 'Notion › Zorgnet › Change requests', 'Aanleiding\nTijdens de sprint review van 1 oktober vroeg Zorgnet om ook Engelstalige antwoorden.\n\nScope\n• Vertaalde systeemprompts en fallback-teksten\n• Engelstalige testset (40 vragen)\n• UI-labels in het Engels\n\nInschatting\n24 uur · impact op planning: +3 werkdagen\n\nBeslissing gevraagd vóór de stuurgroep van 8 oktober.') },
      p2s4: { conf: 'Middel', why: ['“Bronvermelding in antwoorden” is 5 dagen te laat.', 'De laatste commit van Amira dateert van 29 september.'], excerpt: 'Asana · Bronvermelding in antwoorden\nDeadline 30 sep · In uitvoering\nLaatste activiteit: 29 sep (commit “source chips WIP”)', action: SL('@Amira El Idrissi', 'Hoi Amira! Hoe staat het met de bronvermelding in de antwoorden? De taak staat nog open sinds 30/9. Loop je ergens op vast of kan ik iets regelen? Dan werk ik de planning bij voor de stuurgroep van donderdag.') },
      p1s1: { conf: 'Hoog', why: ['De export was beloofd tegen 26 sep en is nog niet binnen.', 'Jens kan de data-inventaris pas starten na de export.'], excerpt: 'Pieter Dewaele · 24 sep\n“We trekken de export van de offertes deze week uit Navision. Jullie hebben ze tegen vrijdag.”', action: M('pieter@dewaele-bouw.be', 'ERP-export historische offertes', 'Dag Pieter,\n\nWe kijken uit naar de export van de historische offertes uit Navision. Om de analyse op 9 oktober te kunnen opleveren, hebben we ze graag deze week.\n\nWat we nodig hebben: offertenummer, datum, type project, artikelcodes, hoeveelheden, eenheidsprijzen en de status (aanvaard of niet).\n\nJe kunt de bestanden in deze gedeelde map zetten: [link Drive-map].\n\nBedankt!\nLucas') },
      p1s2: { conf: 'Middel', why: ['De workshop is woensdag en er is nog geen vragenlijst.', 'Drie open punten uit het intakeverslag zijn nog niet beantwoord.'], excerpt: 'Intakeverslag · open punten\n• Hoe worden meerwerken berekend?\n• Welke marges per type renovatie?\n• Wie keurt de offerte uiteindelijk goed?', action: D('Vragenlijst workshop calculatoren', 'Notion › Dewaele › Analyse', '1. Hoe start je vandaag een offerte?\n2. Welke documenten krijg je van de klant (plannen, bestek, foto’s)?\n3. Hoe bepaal je hoeveelheden?\n4. Hoe reken je meerwerken?\n5. Welke marges hanteer je per type renovatie?\n6. Wie keurt de offerte goed?') },
      p1s3: { conf: 'Middel', why: ['Geert vroeg naar actuele leveranciersprijzen.', 'Door het als optie te beschrijven blijft de basis-scope afgebakend.'], excerpt: 'Geert Vermeulen · 1 okt\n“Zou de tool ook dagprijzen van leveranciers kunnen ophalen? Dat zou ons veel opzoekwerk besparen.”', action: D('Analyse-rapport – sectie Opties', 'Notion › Dewaele › Analyse-rapport', 'Optie A – Actuele leveranciersprijzen\nKoppeling met prijslijsten van 2–3 vaste leveranciers.\nInschatting: 40–60 uur, afhankelijk van de beschikbare API’s.\nNiet in de basis-scope.') },
      p3s1: { conf: 'Hoog', why: ['De fix staat sinds gisteren op staging.', 'Bram heeft morgen om 10:00 een vrij blok.'], excerpt: 'Amira El Idrissi · #maisonlaure-shop\n“Fix voor Bancontact op iOS staat op staging. @Bram kan jij hertesten?”', action: I('Hertest Bancontact iOS', '2026-10-06', '10:00', '30', ['Bram De Smet', 'Amira El Idrissi'], 'Hertest checkout met Bancontact op iPhone (Safari + app-browser).') },
      p3s2: { conf: 'Hoog', why: ['Voor 23 producten ontbreken nog foto’s.', 'De livegang is binnen 16 dagen.'], excerpt: 'Drive · Wintercollectie / foto’s\nLijst ontbrekende foto’s (23 producten) aangemaakt door Lotte Claes, gisteren.', action: M('laure@maisonlaure.be', 'Foto’s wintercollectie – 23 producten', 'Dag Laure,\n\nVoor 23 producten uit de wintercollectie ontbreken nog productfoto’s. De lijst zit in bijlage. Kun je ze ons tegen 9 oktober bezorgen? Dan staan ze zeker online voor de lancering op 21 oktober.\n\nGroeten,\nLucas') },
      p3s3: { conf: 'Middel', why: ['De livegang-checklist voorziet een DNS-wijziging op 21 okt om 08:00.', 'De hostingpartner heeft nog niet bevestigd.'], excerpt: 'Notion · Livegang-checklist\n☐ DNS-wijziging bevestigd door hostingpartner\n☐ Cache-flush ingepland', action: M('support@hostingpartner.be', 'Livegang Maison Laure – 21 oktober 08:00', 'Hallo,\n\nGraag bevestiging voor de DNS-wijziging en cache-flush van maisonlaure.be op woensdag 21 oktober om 08:00.\n\nBedankt!\nLucas – The AI Platform') },
      p4s1: { conf: 'Hoog', why: ['Het incident van 1 okt werd door de klant gemeld, niet door ons.', 'Er is geen monitoring op de loonpakket-koppeling.'], excerpt: 'Wim Hermans · 1 okt\n“Vanochtend zat er 17 minuten vertraging op de koppeling met het loonpakket. Hadden jullie dat gezien?”', action: SL('@Jens Peeters', 'Hoi Jens! Kun jij uptime-monitoring zetten op de loonpakket-koppeling van Talentum? Alert naar #talentum-onboarding bij meer dan 5 minuten vertraging. Thanks!') },
      p4s2: { conf: 'Middel', why: ['Wim vroeg of dezelfde aanpak kan voor offboarding.', 'De huidige flows zijn grotendeels herbruikbaar.'], excerpt: 'Wim Hermans · #talentum-onboarding\n“Zouden we iets gelijkaardigs kunnen doen bij uitdiensttreding?”', action: D('Voorstel: offboarding-automatisatie', 'Notion › Talentum › Voorstellen', 'Doel\nUitdiensttreding van interimkrachten automatisch afhandelen.\n\nHerbruikbaar\n• Documentherkenning\n• Koppeling loonpakket\n\nNieuw\n• Checklist materiaal en toegang\n• Eindafrekening') },
      p2t1: { conf: 'Hoog', tags: ['QA', 'Data'], prio: 'Normaal', subs: ['Vragen verzamelen bij de hoofdverpleegkundige', 'Antwoorden laten valideren', 'Testset bijwerken in Sheets'], why: ['Thomas vraagt expliciet om meer echte vragen.', 'De fouten zitten vooral in nachtdienst-vragen.'], excerpt: 'Thomas Wouters · #zorgnet-kb-dev\n“Eval ronde 2: 84% correct. We hebben meer echte vragen van de vloer nodig, vooral over nachtdiensten.”' },
      p2t2: { conf: 'Hoog', tags: ['Privacy', 'Klant'], prio: 'Hoog', subs: ['Mail aan de DPO opstellen', 'DPIA bewaren in de projectmap'], why: ['Zonder DPIA kan de livegang niet doorgaan.', 'Karen vermeldt het in haar mail van vanochtend.'], excerpt: 'Karen Jacobs · vandaag 08:55\n“…en onze DPO wil de privacy-impactanalyse zien voor we live gaan.”' },
      p2t3: { conf: 'Middel', tags: ['Design'], prio: 'Normaal', subs: ['Drie varianten schetsen', 'Review met Thomas'], why: ['De vraag kwam van de klant tijdens de sprint review.', 'Er bestaat nog geen ontwerp voor dit scenario.'], excerpt: 'Sprint review 1 okt (transcript)\n“Wat ziet de gebruiker als de assistent het antwoord niet weet?”' },
      p1t1: { conf: 'Hoog', tags: ['Klant', 'Data'], prio: 'Hoog', subs: ['NDA-template aanpassen', 'Laten ondertekenen via e-sign'], why: ['De klant stuurt geen data zonder NDA.', 'De ERP-export blokkeert de analyse.'], excerpt: 'Pieter Dewaele · vr 2 okt 14:48\n“Onze juridische dienst wil eerst een NDA voor we klantdata doorsturen.”' },
      p1t2: { conf: 'Middel', tags: ['Klant'], prio: 'Normaal', subs: ['Offertes kiezen uit de Drive-map', 'Geanonimiseerde versie maken'], why: ['Nina vraagt dit voor de workshop van woensdag.'], excerpt: 'Nina Verbeke · #offerte-dewaele\n“Kunnen we op de workshop 3 echte offertes overlopen? Liefst renovatie.”' },
      p3t1: { conf: 'Hoog', tags: ['QA', 'Development'], prio: 'Normaal', subs: ['Top-50 URL’s testen', 'Statuscodes controleren'], why: ['Niemand heeft de redirects al getest.', 'Slechte redirects kosten zoekverkeer na de livegang.'], excerpt: 'Amira El Idrissi · #maisonlaure-shop\n“De mapping staat in de sheet, maar niemand heeft ze al getest.”' },
      p3t2: { conf: 'Middel', tags: ['Klant', 'Privacy'], prio: 'Laag', subs: [], why: ['Laure vraagt het expliciet in haar mail.'], excerpt: 'Laure Michiels · vr 2 okt 10:31\n“UAT op 12/10 is goed voor mij. Kunnen jullie de teksten van de cookiebanner nog even nalezen?”' },
      p4t1: { conf: 'Hoog', tags: ['Klant', 'Data'], prio: 'Normaal', subs: ['KPI’s afstemmen met Wim', 'Sjabloon maken in Sheets'], why: ['Wim vraagt een maandelijks overzicht.'], excerpt: 'Wim Hermans · #talentum-onboarding\n“Kunnen we elke maand een overzicht krijgen van het aantal onboardings en de doorlooptijd?”' },
      p4t2: { conf: 'Middel', tags: ['Documentatie'], prio: 'Normaal', subs: ['Nieuwe stap beschrijven', 'Screenshot toevoegen'], why: ['Het HR-team kende de nieuwe controle-stap niet.'], excerpt: 'Wim Hermans · wo 30 sep 15:40\n“Het team wist niet dat ze het contract nog moeten nakijken.”' }
    };
    return this._ex;
  }
  hhmm() { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
  ini(n) { return String(n || '').split(' ').filter((w) => w[0] && w[0] === w[0].toUpperCase()).map((w) => w[0]).slice(0, 2).join(''); }
  proj(id) { return this.db().P.find((x) => x.id === id); }
  toast(text, ids) {
    clearTimeout(this._tt);
    this.setState({ toast: { text, ids: ids || null } });
    this._tt = setTimeout(() => this.setState({ toast: null }), 5000);
  }
  src(s) {
    return { icon: this.IC[s.t], type: this.TL[s.t], label: s.l, meta: s.m, open: (e) => { this.stop(e); this.toast('Opent het origineel in ' + this.TL[s.t] + ': ' + s.l); } };
  }
  allProps() {
    const out = []; const ed = this.state.edits;
    this.db().P.forEach((p) => {
      p.steps.forEach((s) => out.push({ ...s, ...(ed[s.id] && ed[s.id].title ? { title: ed[s.id].title } : {}), kind: 'step', project: p }));
      p.todos.forEach((t) => out.push({ ...t, ...(ed[t.id] || {}), kind: 'todo', project: p }));
    });
    return out;
  }
  openCount(pid) { const d = this.state.decided; return this.allProps().filter((x) => x.project.id === pid && !d[x.id]).length; }

  decide(ids, mode) {
    const all = this.allProps();
    const decided = { ...this.state.decided }; const sel = { ...this.state.sel };
    ids.forEach((id) => {
      const it = all.find((x) => x.id === id); if (!it) return;
      if (mode === 'asana') decided[id] = 'asana';
      else if (mode === 'approve') decided[id] = it.kind === 'todo' ? 'asana' : 'done';
      else if (mode === 'snooze') decided[id] = 'snoozed';
      else decided[id] = it.kind === 'todo' ? 'rejected' : 'ignored';
      delete sel[id];
    });
    this.setState({ decided, sel });
    let msg;
    if (mode === 'snooze') msg = (ids.length > 1 ? ids.length + ' voorstellen' : 'Voorstel') + ' komt morgen om 09:00 terug';
    else if (ids.length > 1) msg = ids.length + ' voorstellen afgehandeld';
    else {
      const it = all.find((x) => x.id === ids[0]); if (!it) return;
      if (decided[it.id] === 'asana') msg = '“' + it.title + '” staat nu in Asana';
      else if (decided[it.id] === 'done') msg = it.exec;
      else msg = it.kind === 'todo' ? 'To-do afgewezen' : 'Voorstel genegeerd';
    }
    this.toast(msg, ids);
  }
  undo(ids) { const decided = { ...this.state.decided }; ids.forEach((id) => delete decided[id]); this.setState({ decided, toast: null }); }

  toISO(s) {
    const mm = { jan: 1, feb: 2, mrt: 3, apr: 4, mei: 5, jun: 6, jul: 7, aug: 8, sep: 9, okt: 10, nov: 11, dec: 12 };
    const pr = String(s || '').trim().split(' '); const n = parseInt(pr[0], 10); const m = mm[pr[1]];
    if (!n || !m) return '2026-10-09';
    return '2026-' + String(m).padStart(2, '0') + '-' + String(n).padStart(2, '0');
  }
  fmtDate(iso, withDay) {
    const d = new Date((iso || '2026-10-09') + 'T12:00:00'); if (isNaN(d.getTime())) return iso || '';
    const days = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za']; const mons = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
    return (withDay ? days[d.getDay()] + ' ' : '') + d.getDate() + ' ' + mons[d.getMonth()];
  }
  buildForm(it) {
    const ex = this.extras()[it.id] || {};
    const asana = (this.db().map[it.project.id] || [])[0];
    if (it.kind === 'todo') {
      return { title: it.title, owner: it.owner, due: this.toISO(it.due), prio: ex.prio || 'Normaal', section: 'Te doen', asanaProject: asana ? asana[2][0] : '', tags: (ex.tags || []).slice(),
        followers: it.owner === 'Lucas Galle' ? [] : ['Lucas Galle'], subs: (ex.subs || []).map((t) => ({ text: t, done: false })), newSub: '', remind: true,
        desc: 'Context: “' + it.quote + '”\n\nBron: ' + this.TL[it.src.t] + ' · ' + it.src.l + ' (' + it.src.m + ')\nAangemaakt via de Project Hub na goedkeuring.' };
    }
    const a = ex.action || { aType: 'mail', aTo: '', aSubject: it.title, aBody: '' };
    return { title: it.title, desc: '', aType: a.aType, aTo: a.aTo || '', aSubject: a.aSubject || it.title, aBody: a.aBody || '', aDate: a.aDate || '2026-10-06', aTime: a.aTime || '10:00', aDur: a.aDur || '30',
      aAttendees: (a.aAttendees || []).slice(), aMeet: a.aMeet !== false, aLoc: a.aLoc || 'Notion › ' + it.project.client, delivery: 'concept', alsoTask: false, taskOwner: 'Lucas Galle', taskDue: '2026-10-09' };
  }
  openDetail(id, ctx) {
    const it = this.allProps().find((x) => x.id === id); if (!it) return;
    const forms = { ...this.state.forms }; if (!forms[id]) forms[id] = this.buildForm(it);
    const s = { forms, detail: id, detailCtx: ctx || this.state.detailCtx || 'inbox', rejectOpen: false, snoozeOpen: false };
    if (ctx === 'inbox' && this._raw) { const i = this._raw.indexOf(id); if (i >= 0) s.focus = i; }
    this.setState(s);
  }
  closeDetail() { this.setState({ detail: null, rejectOpen: false, snoozeOpen: false }); }
  setF(patch) { const id = this.state.detail; if (!id) return; const forms = { ...this.state.forms }; forms[id] = { ...forms[id], ...patch }; this.setState({ forms }); }
  navDetail(dir) { const list = this._raw || []; const i = list.indexOf(this.state.detail); const n = list[i + dir]; if (n && this.state.detailCtx === 'inbox') this.openDetail(n, 'inbox'); }
  advance(fromId) {
    if (this.state.detailCtx !== 'inbox' || !this._raw) { this.closeDetail(); return; }
    const list = this._raw; const i = list.indexOf(fromId); const rest = list.filter((x) => x !== fromId);
    const next = rest[Math.min(Math.max(i, 0), rest.length - 1)];
    if (next) this.openDetail(next, 'inbox'); else this.closeDetail();
  }
  commitEdits(id, f, it) {
    const edits = { ...this.state.edits };
    if (it.kind === 'todo') edits[id] = { title: f.title, owner: f.owner, due: this.fmtDate(f.due), prio: f.prio };
    else edits[id] = { title: f.title, alsoTask: f.alsoTask, taskOwner: f.taskOwner, taskDue: this.fmtDate(f.taskDue) };
    return edits;
  }
  primaryLabel(it, f) {
    if (it.kind === 'todo') return 'Goedkeuren → Asana';
    if (f.aType === 'mail') return f.delivery === 'send' ? 'Mail versturen' : 'Concept klaarzetten';
    if (f.aType === 'slack') return 'Versturen in Slack';
    if (f.aType === 'invite') return 'Uitnodiging versturen';
    return 'Pagina aanmaken';
  }
  approveDetail(asanaOnly) {
    const id = this.state.detail; if (!id) return;
    const it = this.allProps().find((x) => x.id === id); const f = this.state.forms[id]; if (!it || !f) return;
    const edits = this.commitEdits(id, f, it); const decided = { ...this.state.decided }; let msg;
    if (it.kind === 'todo') { decided[id] = 'asana'; msg = '“' + f.title + '” staat in Asana bij ' + f.owner.split(' ')[0] + (f.remind ? ' · verwittigd in Slack' : ''); }
    else if (asanaOnly) { decided[id] = 'asana'; msg = '“' + f.title + '” staat nu in Asana'; }
    else {
      decided[id] = 'done';
      msg = { mail: f.delivery === 'send' ? 'Mail verstuurd naar ' + f.aTo : 'Concept-mail klaargezet in Gmail', slack: 'Bericht verstuurd naar ' + f.aTo, invite: 'Uitnodiging verstuurd: ' + f.aSubject + ' (' + this.fmtDate(f.aDate, true) + ' ' + f.aTime + ')', doc: 'Notion-pagina aangemaakt: ' + f.aSubject }[f.aType] + (f.alsoTask ? ' · opvolgtaak in Asana' : '');
    }
    this.setState({ edits, decided }); this.toast(msg, [id]); this.advance(id);
  }
  saveDetail() {
    const id = this.state.detail; if (!id) return;
    const it = this.allProps().find((x) => x.id === id); const f = this.state.forms[id]; if (!it || !f) return;
    const forms = { ...this.state.forms }; forms[id] = { ...f, savedAt: this.hhmm() };
    this.setState({ edits: this.commitEdits(id, f, it), forms }); this.toast('Wijzigingen bewaard. Het voorstel blijft open staan.');
  }
  rejectDetail(reason) {
    const id = this.state.detail; if (!id) return; const it = this.allProps().find((x) => x.id === id); if (!it) return;
    const decided = { ...this.state.decided }; decided[id] = it.kind === 'todo' ? 'rejected' : 'ignored';
    this.setState({ decided, rejectOpen: false }); this.toast('Afgewezen: ' + reason.toLowerCase() + '. De agent houdt hier rekening mee.', [id]); this.advance(id);
  }
  snoozeDetail(label) {
    const id = this.state.detail; if (!id) return;
    const decided = { ...this.state.decided }; decided[id] = 'snoozed';
    this.setState({ decided, snoozeOpen: false }); this.toast('Komt terug: ' + label.toLowerCase() + '.', [id]); this.advance(id);
  }
  onDetailKey(e) {
    const tag = (e.target && e.target.tagName) || ''; const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    if (e.key === 'Escape') { e.preventDefault(); if (this.state.rejectOpen || this.state.snoozeOpen) this.setState({ rejectOpen: false, snoozeOpen: false }); else this.closeDetail(); return; }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); this.approveDetail(); return; }
    if (typing) return;
    const k = (e.key || '').toLowerCase();
    if (k === 'j' || e.key === 'ArrowRight') { e.preventDefault(); this.navDetail(1); }
    else if (k === 'k' || e.key === 'ArrowLeft') { e.preventDefault(); this.navDetail(-1); }
    else if (k === 'r') { e.preventDefault(); this.setState({ rejectOpen: !this.state.rejectOpen, snoozeOpen: false }); }
    else if (k === 's') { e.preventDefault(); this.setState({ snoozeOpen: !this.state.snoozeOpen, rejectOpen: false }); }
  }

  doSync() {
    if (this.state.syncing) return;
    this.setState({ syncing: true });
    setTimeout(() => { this.setState({ syncing: false, lastSync: this.hhmm() }); this.toast('Alle bronnen gelezen. Niets nieuws sinds de vorige sync.'); }, 1800);
  }
  curScreen() { return this.state.screen || this.props.startScreen || 'vandaag'; }
  go(screen, pid, extra) {
    const s = { screen, detail: null, ...(extra || {}) }; if (pid) s.projectId = pid;
    const change = screen !== this.curScreen() || (pid && pid !== this.state.projectId);
    if (change) { s.transit = true; s.flip = !this.state.flip; if (screen === 'hub') { s.hubTab = (extra && extra.hubTab) || 0; s.moreOpen = false; } }
    this.setState(s);
    if (change) { clearTimeout(this._tr); this._tr = setTimeout(() => this.setState({ transit: false }), 360); }
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
  }
  goInboxFor(pid, e) { this.stop(e); this.go('inbox', null, { inboxProject: pid || 'alle', inboxKind: 'alle', focus: 0, sel: {} }); }
  startFocus(step) {
    this.go('focus', null, { focusStep: step || 0, stepFlip: !this.state.stepFlip, focusStart: Object.keys(this.state.decided).length, sentStart: Object.keys(this.state.sent).length, followDone: {}, fireDone: {}, dayOpen: false });
  }
  fGo(step) { this.setState({ focusStep: Math.max(0, Math.min(4, step)), stepFlip: !this.state.stepFlip, leaving: null }); try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {} }
  stackAct(id, mode) {
    if (!id || this.state.leaving) return;
    const cls = mode === 'reject' ? 'leave-l' : mode === 'snooze' ? 'leave-d' : 'leave-r';
    this.setState({ leaving: { id, cls } });
    clearTimeout(this._lv);
    this._lv = setTimeout(() => { this.setState({ leaving: null, flip: !this.state.flip }); this.decide([id], mode); }, 430);
  }
  onStackKey(e) {
    if (this.state.detail) return;
    const tag = (e.target && e.target.tagName) || ''; if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    const id = this._top; const k = (e.key || '').toLowerCase();
    if (!id) { if (e.key === 'Enter') { e.preventDefault(); this.fGo(2); } return; }
    if (k === 'a') { e.preventDefault(); this.stackAct(id, 'approve'); }
    else if (k === 'r') { e.preventDefault(); this.stackAct(id, 'reject'); }
    else if (k === 's') { e.preventDefault(); this.stackAct(id, 'snooze'); }
    else if (k === 'e' || e.key === 'Enter') { e.preventDefault(); this.openDetail(id, 'focus'); }
  }
  onKey(e, items) {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') { if (!(tag === 'INPUT' && e.target.type === 'checkbox')) return; }
    if (!items.length) return;
    const k = (e.key || '').toLowerCase(); const f = Math.min(this.state.focus, items.length - 1); const cur = items[f];
    const selIds = Object.keys(this.state.sel).filter((id) => this.state.sel[id] && items.some((x) => x.id === id));
    if (k === 'j' || e.key === 'ArrowDown') { this.setState({ focus: Math.min(f + 1, items.length - 1) }); e.preventDefault(); }
    else if (k === 'k' || e.key === 'ArrowUp') { this.setState({ focus: Math.max(f - 1, 0) }); e.preventDefault(); }
    else if (k === 'x') { const sel = { ...this.state.sel }; sel[cur.id] = !sel[cur.id]; this.setState({ sel }); e.preventDefault(); }
    else if (k === 'a' && e.shiftKey) { const sel = {}; items.forEach((x) => { sel[x.id] = true; }); this.setState({ sel }); e.preventDefault(); }
    else if (k === 'a') { this.decide(selIds.length ? selIds : [cur.id], 'approve'); e.preventDefault(); }
    else if (k === 'r' || e.key === 'Delete' || e.key === 'Backspace') { this.decide(selIds.length ? selIds : [cur.id], 'reject'); e.preventDefault(); }
    else if (k === 's') { this.decide(selIds.length ? selIds : [cur.id], 'snooze'); e.preventDefault(); }
    else if (k === 'e' || e.key === 'Enter') { this.openDetail(cur.id, 'inbox'); e.preventDefault(); }
    else if (k === 'o') { this.go('hub', cur.project.id); e.preventDefault(); }
  }
  renderVals() {
    const st = this.state;
    const screen = this.curScreen();
    const theme = st.theme || this.props.theme || 'light';
    const { P, map } = this.db();
    const decided = st.decided;
    const all = this.allProps();
    const open = all.filter((x) => !decided[x.id]);
    const IC = this.IC, UI = this.UI;
    const hOrder = { crit: 0, warn: 1, ok: 2 };
    const flipCls = st.flip ? 'fb' : '';
    const progressOf = (p) => Math.round(p.phases.reduce((a, b) => a + b[0], 0) / 7);
    const teamOf = (p) => { const o = []; p.tasks.forEach((t) => { if (o.indexOf(t.owner) < 0) o.push(t.owner); }); return o.slice(0, 4).map((n) => ({ name: n, ini: this.ini(n) })); };
    const tasksOf = (p) => {
      const extra = p.todos.filter((t) => decided[t.id] === 'asana').map((t) => { const e = st.edits[t.id] || {}; const fm = st.forms[t.id]; return { title: e.title || t.title, owner: e.owner || t.owner, due: e.due || t.due, status: (fm && fm.section) || 'Te doen', overdue: false, isNew: true }; });
      const stepTasks = p.steps.filter((s) => decided[s.id] === 'asana' || (decided[s.id] === 'done' && st.edits[s.id] && st.edits[s.id].alsoTask)).map((s) => { const e = st.edits[s.id] || {}; return { title: (decided[s.id] === 'done' ? 'Opvolgen: ' : '') + (e.title || s.title), owner: e.taskOwner || 'Lucas Galle', due: e.taskDue || 'deze week', status: 'Te doen', overdue: false, isNew: true }; });
      return p.tasks.map((t) => ({ ...t, isNew: false })).concat(extra, stepTasks);
    };
    const sortedP = P.slice().sort((a, b) => hOrder[a.health] - hOrder[b.health]);
    const doneLabels = { asana: 'In Asana', done: 'Uitgevoerd', ignored: 'Genegeerd', rejected: 'Afgewezen', snoozed: 'Later' };
    const pCur = this.proj(st.projectId);

    // ---- loader + shell
    const noLoader = this.props.showLoader === false;
    const loaderSrc = ['asana', 'slack', 'mail', 'cal', 'drive', 'canva', 'notion'].map((t, i) => ({ icon: IC[t], name: this.TL[t], delay: 200 + i * 180 }));

    // ---- nav
    const navIdx = { vandaag: 0, focus: 0, inbox: 1, projecten: 2, bronnen: 3 }[screen];
    const mainNav = [['vandaag', 'Vandaag', UI.sun], ['inbox', 'Inbox', UI.inbox], ['projecten', 'Projecten', UI.grid], ['bronnen', 'Bronnen', UI.link]].map(([id, label, icon], i) => ({
      label, icon, on: navIdx === i ? 'on' : '', cur: navIdx === i ? 'page' : 'false', go: () => this.go(id),
      hasBadge: (id === 'inbox' && open.length > 0) || (id === 'bronnen' && !st.canvaOk), badge: id === 'inbox' ? open.length : '!', badgeCls: id === 'bronnen' ? 'badge-soft' : ''
    }));
    const navProjects = sortedP.map((p) => { const n = this.openCount(p.id); return { name: p.name, health: p.health, open: n, hasOpen: n > 0, on: screen === 'hub' && st.projectId === p.id ? 'on' : '', go: () => this.go('hub', p.id) }; });
    const crumbB = { vandaag: 'Vandaag', focus: 'Focusronde', projecten: 'Projecten', hub: pCur.name, inbox: 'Inbox', bronnen: 'Bronnen' }[screen];

    // ---- vandaag
    const doneOf = (id) => decided[id];
    const fireDefs = [
      { id: 'f1', pid: 'p2', action: 'p2s1', title: 'SharePoint-toegang Zorgnet ontbreekt al 11 dagen', sub: 'Jens kan de ingest-pipeline niet testen met echte documenten. De start van Testing op 19 oktober komt in gevaar.', tag: 'Blokkade', tagCls: 'crit', icCls: '', actLabel: 'Escaleren met workaround' },
      { id: 'f2', pid: 'p1', action: 'p1s1', title: 'ERP-export van Dewaele laat op zich wachten', sub: 'Beloofd op 24 september. Zonder export is de analyse niet klaar tegen 9 oktober.', tag: 'Aandacht', tagCls: 'warn', icCls: 'warn', actLabel: 'Herinnering klaarzetten' }
    ];
    const fires = fireDefs.map((f, i) => {
      const pr = this.proj(f.pid); const dd = doneOf(f.action); const handled = !!dd || !!st.fireDone[f.id];
      return { ...f, icon: UI.fire, project: pr.name, health: pr.health, delay: 250 + i * 120, cls: handled ? 'handled' : '', handled, open: !handled,
        doneLabel: dd ? (dd === 'snoozed' ? 'Later ingepland' : dd === 'ignored' ? 'Genegeerd' : 'Aangepakt · ' + doneLabels[dd].toLowerCase()) : 'Bewust opzij gezet voor later',
        act: () => this.openDetail(f.action, 'focus'), view: () => this.go('hub', f.pid), later: () => { const fireDone = { ...this.state.fireDone }; fireDone[f.id] = true; this.setState({ fireDone }); } };
    });
    const firesOpen = fires.filter((f) => f.open).length;
    const followDefs = [];
    P.forEach((p) => p.devs.forEach((d) => { if (d.fresh !== 'ok') followDefs.push({ p, d }); }));
    followDefs.sort((a, b) => (a.d.fresh === 'stale' ? -1 : 0) - (b.d.fresh === 'stale' ? -1 : 0));
    const askOf = (p, d) => () => this.setState({ slack: { key: p.id + '-' + d.name, name: d.name, text: 'Hoi ' + d.name.split(' ')[0] + '! Korte check voor ' + p.name + ' (' + p.client + '): hoe staat het met “' + d.working + '”? Loop je ergens tegenaan of kan ik iets voor je regelen? Thanks!' } });
    const follows = followDefs.map(({ p, d }, i) => {
      const key = p.id + '-' + d.name; const sentAt = st.sent[key]; const fine = st.followDone[key]; const handled = !!sentAt || !!fine;
      return { name: d.name, initials: this.ini(d.name), working: d.working, project: p.name, last: d.last, fresh: d.fresh === 'stale' ? 'warn' : '', tagCls: d.fresh === 'stale' ? 'warn' : '',
        delay: 250 + i * 110, cls: handled ? 'handled' : '', handled, open: !handled, doneLabel: sentAt ? 'Statusvraag verstuurd om ' + sentAt : 'Alles ok, overgeslagen',
        ask: askOf(p, d), fine: () => { const followDone = { ...this.state.followDone }; followDone[key] = true; this.setState({ followDone }); } };
    });
    const followsOpen = follows.filter((f) => f.open).length;
    const meetingsToday = [['09:30', 'Stand-up The AI Platform', 'Intern · 15 min', null], ['11:00', 'Korte klantcall Dewaele', 'Offerte-assistent · Pieter Dewaele', 'p1'], ['14:00', 'Weekplanning projecten', 'Intern · Nina, Jens, Thomas', null], ['16:00', 'Bug-triage Maison Laure', 'Webshop & aanbevelingen', 'p3']]
      .map(([time, title, sub, pid], i) => ({ time, short: time, title, sub, delay: 200 + i * 90, go: () => pid ? this.go('hub', pid, { hubTab: 4 }) : this.toast('Opent de meeting in Google Calendar') }));
    const deadlinesWeek = [['2 okt', 'Ingest-pipeline SharePoint', 'Kennisbank · achterstallig', 'over', 'p2'], ['di 6 okt', 'Admin-dashboard wireframes', 'Kennisbank · Lotte', '', 'p2'], ['di 6 okt', 'Hertest Bancontact iOS', 'Webshop · Bram', '', 'p3'], ['wo 7 okt', 'Training HR-team deel 2', 'Onboarding · Lucas', '', 'p4'], ['vr 9 okt', 'Analyse-rapport naar klant', 'Offerte-assistent · Lucas', '', 'p1']]
      .map(([day, title, sub, cls, pid]) => ({ day, title, sub, cls, go: () => this.go('hub', pid, { hubTab: 2 }) }));
    const flowSteps = [
      ['Wat brandt', 'Blokkades die je team tegenhouden', firesOpen ? firesOpen + ' open' : 'Niets', firesOpen ? 'crit' : 'ok', '±3 min', UI.fire, firesOpen === 0],
      ['Beslissen', 'Voorstellen van de agent, één voor één', open.length ? open.length + ' voorstellen' : 'Alles beslist', open.length ? 'acc' : 'ok', '±' + Math.max(1, Math.ceil(open.length * .7)) + ' min', UI.decide, open.length === 0],
      ['Opvolgen', 'Teamleden die al even stil zijn', followsOpen ? followsOpen + ' mensen' : 'Iedereen ok', followsOpen ? 'warn' : 'ok', '±2 min', UI.people, followsOpen === 0],
      ['Je dag', 'Meetings en deadlines op een rij', '4 meetings', '', '1 min', UI.cal, false]
    ].map(([title, sub, count, tagCls, time, icon, done], i) => ({ num: i + 1, title, sub, count, tagCls, time, icon, cls: done ? 'done' : '', delay: 780 + i * 90, go: () => this.startFocus(i) }));
    const glance = sortedP.map((p) => ({ name: p.name, health: p.health, phase: this.PHASES[p.phase], progress: progressOf(p), go: () => this.go('hub', p.id) }));
    const focusMins = Math.max(5, Math.ceil(open.length * .7) + 6);
    const heroLede = open.length
      ? 'De agent las 164 berichten, mails en meetings. Daaruit kwamen ' + open.length + ' voorstellen, ' + (firesOpen === 1 ? 'één ding dat brandt' : firesOpen + ' dingen die branden') + ' en ' + (followsOpen === 1 ? 'één collega' : followsOpen + ' collega’s') + ' om even op te volgen. We lopen ze samen stap voor stap door.'
      : 'Alles is bij. De agent houdt de bronnen in het oog en laat het weten als er iets nieuws binnenkomt.';

    // ---- focusronde
    const step = st.focusStep;
    const stepLabels = ['Wat brandt', 'Beslissen', 'Opvolgen', 'Je dag'];
    const fSteps = stepLabels.map((label, i) => ({ label, notFirst: i > 0, cls: i === step ? 'on' : i < step ? 'done' : '', mark: i < step ? '✓' : String(i + 1), cur: i === step ? 'step' : 'false', go: () => this.fGo(i) }));
    const queue = open.slice().sort((a, b) => hOrder[a.project.health] - hOrder[b.project.health]);
    this._top = queue[0] ? queue[0].id : null;
    const qDone = Math.max(0, Object.keys(decided).length - (st.focusStart || 0));
    const qTotal = qDone + queue.length;
    const stackCards = queue.slice(0, 3).map((x, i) => {
      const fm = st.forms[x.id]; const ex = this.extras()[x.id] || {};
      return { id: x.id, title: x.title, detail: x.kind === 'todo' ? x.quote : x.detail, src: this.src(x.src), projectName: x.project.name, health: x.project.health,
        kindLabel: x.kind === 'todo' ? 'Nieuwe to-do' : 'Volgende stap', kindCls: x.kind === 'todo' ? 'acc' : '', isTodo: x.kind === 'todo', isStep: x.kind === 'step',
        owner: x.owner || '', initials: x.owner ? this.ini(x.owner) : '', due: x.due || '', actLabel: x.kind === 'step' ? this.ACT[(fm && fm.aType) || (ex.action || {}).aType || 'mail'].label : '',
        isTop: i === 0, hidden: i > 0 ? 'true' : 'false', pos: (qDone + 1) + ' / ' + qTotal,
        cls: i === 0 ? 'top ' + flipCls + ' ' + (st.leaving && st.leaving.id === x.id ? st.leaving.cls : '') : 'b' + i,
        approveLabel: x.kind === 'todo' ? 'Goedkeuren → Asana' : 'Uitvoeren', rejectLabel: x.kind === 'todo' ? 'Afwijzen' : 'Negeren',
        approve: () => this.stackAct(x.id, 'approve'), reject: () => this.stackAct(x.id, 'reject'), later: () => this.stackAct(x.id, 'snooze'), edit: () => this.openDetail(x.id, 'focus') };
    });
    const qText = queue.length ? qDone + ' van ' + qTotal + ' beslist. Neem je tijd: bekijk, pas aan of zet iets bewust opzij.' : 'Er wacht niets meer op jou.';
    const palette = ['#6C5CF5', '#1DB57F', '#F2A23C', '#EE5A63', '#2E8BDB', '#C7BEFF'];
    const confetti = step === 4 ? Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; const r = 120 + (i % 4) * 45; return { c: palette[i % palette.length], x: Math.round(Math.cos(a) * r), y: Math.round(Math.sin(a) * r * .7 - 40), d: 150 + (i % 7) * 25 }; }) : [];
    const sentSession = Math.max(0, Object.keys(st.sent).length - (st.sentStart || 0));
    const summary = [[qDone, 'beslissingen genomen'], [sentSession + Object.keys(st.followDone).length, 'collega’s opgevolgd'], [fires.filter((f) => f.handled).length, 'brandjes aangepakt']].map(([n, l], i) => ({ n, l, d: 500 + i * 120 }));

    // ---- projecten
    const fl = st.fPhase, fhh = st.fHealth, fc = st.fClient;
    const cards = P.filter((p) => (fl === 'alle' || String(p.phase) === fl) && (fhh === 'alle' || p.health === fhh) && (fc === 'alle' || p.client === fc))
      .sort((a, b) => hOrder[a.health] - hOrder[b.health])
      .map((p, i) => { const n = this.openCount(p.id); const prog = progressOf(p); return {
        name: p.name, client: p.client, health: p.health, healthLabel: this.HEALTH[p.health], phaseNum: p.phase + 1, phaseName: this.PHASES[p.phase], progress: prog,
        ringOff: (175.93 * (1 - prog / 100)).toFixed(2), delay: 220 + i * 90, team: teamOf(p), mini: p.phases.map((x, j) => ({ cls: j < p.phase ? 'done' : j === p.phase ? 'cur' : '' })),
        deadline: p.deadline, deadlineDate: p.deadlineDate, open: n, hasOpen: n > 0, noOpen: n === 0,
        go: (e) => { this.stop(e); this.go('hub', p.id); }, goInbox: (e) => this.goInboxFor(p.id, e) }; });
    const mkChips = (defs, cur, key) => defs.map(([v, l, dot], i) => ({ label: l, on: cur === v ? 'on' : '', pressed: cur === v ? 'true' : 'false', hasDot: !!dot, dot: dot || '', delay: 60 + i * 35, pick: () => this.setState({ [key]: v, flip: !this.state.flip }) }));
    const healthChips = mkChips([['alle', 'Alle'], ['ok', 'Op schema', 'ok'], ['warn', 'Aandacht nodig', 'warn'], ['crit', 'Kritiek', 'crit']], fhh, 'fHealth');
    const phaseChips = mkChips([['alle', 'Alle fases']].concat(this.PHASES.map((n, i) => [String(i), n])), fl, 'fPhase');
    const clientChips = mkChips([['alle', 'Alle klanten']].concat(P.map((p) => [p.client, p.client])), fc, 'fClient');
    const filterCount = (fl !== 'alle' ? 1 : 0) + (fhh !== 'alle' ? 1 : 0) + (fc !== 'alle' ? 1 : 0);

    // ---- hub
    const p = pCur; const phaseIdx = p.phase; const prog = progressOf(p);
    const hoursPct = Math.round(p.hours[0] / p.hours[1] * 100); const hoursWarn = hoursPct > prog + 10;
    const tasks = tasksOf(p);
    const mkTask = (t) => ({ ...t, initials: this.ini(t.owner), newCls: t.isNew ? 'isnew' : '', statusCls: t.status === 'Geblokkeerd' ? 'crit' : t.status === 'In uitvoering' ? 'acc' : '', dueCls: t.overdue ? 'over' : '', dueLabel: t.overdue ? t.due + ' · te laat' : t.due });
    let groups;
    if (st.groupBy === 'status') groups = ['Geblokkeerd', 'In uitvoering', 'Review', 'Te doen'].map((s) => ({ name: s, isPerson: false, ini: '', items: tasks.filter((t) => t.status === s).map(mkTask) })).filter((g) => g.items.length);
    else { const owners = []; tasks.forEach((t) => { if (owners.indexOf(t.owner) < 0) owners.push(t.owner); }); groups = owners.map((o) => ({ name: o, isPerson: true, ini: this.ini(o), items: tasks.filter((t) => t.owner === o).sort((a, b) => (b.overdue ? 1 : 0) - (a.overdue ? 1 : 0)).map(mkTask) })); }
    groups = groups.map((g) => ({ ...g, count: g.items.length }));
    const statusStack = [['Geblokkeerd', 'sb-crit'], ['In uitvoering', 'sb-acc'], ['Review', 'sb-mid'], ['Te doen', 'sb-low']].map(([label, cls]) => ({ label, cls, n: tasks.filter((t) => t.status === label).length })).filter((s) => s.n > 0);
    const CHECK = 'M5 12.5l4.5 4.5L19 7.5', XP = 'M6 6l12 12M18 6 6 18', CLK = 'M12 7v5l3 2';
    const okOf = (id) => (decided[id] === 'ignored' || decided[id] === 'rejected') ? { okCls: 'neutral', okIcon: XP } : decided[id] === 'snoozed' ? { okCls: 'neutral', okIcon: CLK } : { okCls: '', okIcon: CHECK };
    const steps = p.steps.map((s0, i) => { const s = { ...s0, ...(st.edits[s0.id] && st.edits[s0.id].title ? { title: st.edits[s0.id].title } : {}) }; return { ...s, num: i + 1, src: this.src(s0.src), pending: !decided[s.id], done: !!decided[s.id], doneLabel: doneLabels[decided[s.id]] || '', ...okOf(s.id),
      exec: () => this.decide([s.id], 'approve'), asana: () => this.decide([s.id], 'asana'), ignore: () => this.decide([s.id], 'reject'), undo: () => this.undo([s.id]), open: () => this.openDetail(s.id, 'hub') }; });
    const todos = p.todos.map((t0) => { const t = { ...t0, ...(st.edits[t0.id] || {}) }; return { ...t, src: this.src(t0.src), initials: this.ini(t.owner), pending: !decided[t.id], done: !!decided[t.id], doneLabel: doneLabels[decided[t.id]] || '', ...okOf(t.id),
      approve: () => this.decide([t.id], 'approve'), reject: () => this.decide([t.id], 'reject'), edit: () => this.openDetail(t.id, 'hub'), undo: () => this.undo([t.id]) }; });
    const devs = p.devs.map((d, i) => { const key = p.id + '-' + d.name; const sentAt = st.sent[key]; return { ...d, delay: 80 + i * 90, initials: this.ini(d.name), cls: d.fresh === 'stale' && !sentAt ? 'stale' : '', freshCls: d.fresh === 'stale' ? 'warn' : d.fresh === 'aging' ? '' : 'ok',
      askCls: d.fresh === 'stale' ? 'btn-primary' : '', hasBlocker: !!d.blocker, isSent: !!sentAt, notSent: !sentAt, sentAt: sentAt || '', ask: askOf(p, d) }; });
    const feedKinds = [['alle', 'Alles'], ['slack', 'Slack'], ['mail', 'Gmail'], ['cal', 'Meetings'], ['asana', 'Asana'], ['drive', 'Drive'], ['notion', 'Notion'], ['canva', 'Canva']];
    const feedChips = feedKinds.map(([v, l]) => ({ label: l, on: st.feed === v ? 'on' : '', pressed: st.feed === v ? 'true' : 'false', pick: () => this.setState({ feed: v, flip: !this.state.flip }) }));
    const feed = p.feed.filter((f) => st.feed === 'alle' || f[0] === st.feed).map(([t, when, who, text], i) => ({ icon: IC[t], type: this.TL[t], when, who, text, delay: i * 60, open: () => this.toast('Opent het origineel in ' + this.TL[t]) }));
    const pOpen = this.openCount(p.id);
    const hubP = { ...p, healthLabel: this.HEALTH[p.health], phaseNum: phaseIdx + 1, phaseName: this.PHASES[phaseIdx], progress: prog,
      ringOff: (320.44 * (1 - prog / 100)).toFixed(2), trackPct: Math.min(100, (phaseIdx + p.phases[phaseIdx][0] / 100) / 6 * 100).toFixed(1), team: teamOf(p),
      phases: p.phases.map(([pct, end], i) => ({ num: i + 1, name: this.PHASES[i], pct, delay: 150 + i * 90, isDone: i < phaseIdx, notDone: i >= phaseIdx, isCurrent: i === phaseIdx, cls: i < phaseIdx ? 'done' : i === phaseIdx ? 'cur' : 'todo', endLabel: i === phaseIdx ? '→ ' + end : end })),
      hoursUsed: p.hours[0], hoursBudget: p.hours[1], hoursPct, hoursRing: hoursWarn ? 'warn' : '', hoursOff: (119.38 * (1 - Math.min(hoursPct, 100) / 100)).toFixed(2), hoursNote: hoursWarn ? 'Loopt voor op de voortgang (' + prog + '%)' : 'In lijn met de voortgang',
      statusStack, blockerCount: p.blockers.length, blockerText: p.blockers[0] || 'Niets houdt het team tegen', blockTile: p.blockers.length ? 'crit' : '',
      notes: p.notes.map((n) => ({ text: n.text, src: this.src(n.src) })), risks: p.risks.map(([level, cls, text]) => ({ level, cls, text })),
      steps, todos, stepsOpen: steps.filter((s) => s.pending).length, todosOpen: todos.filter((t) => t.pending).length, hasStepsOpen: steps.some((s) => s.pending), hasTodosOpen: todos.some((t) => t.pending),
      hasOpenAll: pOpen > 0, openAllText: pOpen === 1 ? 'Eén voorstel wacht op je beslissing.' : pOpen + ' voorstellen wachten op je beslissing.',
      goDecide: () => this.setState({ hubTab: 1, tabFlip: !this.state.tabFlip }), goInbox: () => this.goInboxFor(p.id),
      groups, devs, feed, feedEmpty: feed.length === 0,
      meetings: p.meetings.map(([day, time, title, who]) => { const pr = day.split(' '); return { dow: pr[0], dnum: pr[1], time, title, who, todayCls: day === 'Ma 5 okt' ? 'today' : '' }; }),
      docs: p.docs.map(([t, title, meta]) => ({ icon: IC[t], title, meta, open: () => this.toast('Opent “' + title + '” in ' + this.TL[t]) })),
      decisions: p.decisions.map(([date, text, s]) => ({ date, short: date.split(' ')[0], text, src: this.src(s) })), decCount: p.decisions.length,
      openAsana: () => this.toast('Opent het project in Asana') };
    const tabs = ['Overzicht', 'Beslissen', 'Taken', 'Team', 'Context'].map((label, i) => ({ label, on: st.hubTab === i ? 'on' : '', sel: st.hubTab === i ? 'true' : 'false', hasN: i === 1 && pOpen > 0, n: pOpen, pick: () => this.setState({ hubTab: i, tabFlip: !this.state.tabFlip, moreOpen: false }) }));

    // ---- inbox
    const kindsOf = (arr) => { const t = arr.filter((x) => x.kind === 'todo').length; const s = arr.length - t; return (t ? t + ' to-do' + (t > 1 ? '’s' : '') : '') + (t && s ? ' · ' : '') + (s ? s + ' stap' + (s > 1 ? 'pen' : '') : '') || 'Niets open'; };
    const inboxProjChips = [{ id: 'alle', label: 'Alle projecten', client: 'Overzicht', health: 'all', n: open.length, sub: kindsOf(open) }]
      .concat(sortedP.map((x) => { const arr = open.filter((o) => o.project.id === x.id); return { id: x.id, label: x.name, client: x.client, health: x.health, n: arr.length, sub: kindsOf(arr) }; }))
      .map((c, i) => ({ ...c, delay: 120 + i * 70, share: open.length ? Math.round(c.n / open.length * 100) : 0, on: st.inboxProject === c.id ? 'on' : '', pressed: st.inboxProject === c.id ? 'true' : 'false',
        pick: () => this.setState({ inboxProject: st.inboxProject === c.id && c.id !== 'alle' ? 'alle' : c.id, focus: 0, sel: {}, flip: !this.state.flip }) }));
    const projScope = open.filter((x) => st.inboxProject === 'alle' || x.project.id === st.inboxProject);
    const kindDefs = [['alle', 'Alles'], ['todo', 'To-do’s'], ['step', 'Stappen']];
    const inboxKindChips = kindDefs.map(([v, l]) => ({ label: l, n: v === 'alle' ? projScope.length : projScope.filter((x) => x.kind === v).length, on: st.inboxKind === v ? 'on' : '', pressed: st.inboxKind === v ? 'true' : 'false', pick: () => this.setState({ inboxKind: v, focus: 0, flip: !this.state.flip }) }));
    const kindX = Math.max(0, kindDefs.findIndex((k) => k[0] === st.inboxKind)) * 100;
    const ipRaw = st.inboxProject !== 'alle' ? this.proj(st.inboxProject) : null;
    const ip = ipRaw ? { name: ipRaw.name, health: ipRaw.health, healthLabel: this.HEALTH[ipRaw.health].toLowerCase(), phase: this.PHASES[ipRaw.phase], goHub: () => this.go('hub', ipRaw.id), clear: () => this.setState({ inboxProject: 'alle', focus: 0, flip: !this.state.flip }) } : { name: '', health: '', healthLabel: '', phase: '' };
    const raw = projScope.filter((x) => st.inboxKind === 'alle' || x.kind === st.inboxKind).sort((a, b) => hOrder[a.project.health] - hOrder[b.project.health]);
    const focusI = Math.min(st.focus, Math.max(raw.length - 1, 0));
    const inboxItems = raw.map((x, i) => { const selected = !!st.sel[x.id]; return {
      id: x.id, title: x.title, detail: x.kind === 'todo' ? x.quote : x.detail, src: this.src(x.src), isTodo: x.kind === 'todo', isStep: x.kind === 'step',
      kindLabel: x.kind === 'todo' ? 'Nieuwe to-do' : 'Volgende stap', kindCls: x.kind === 'todo' ? 'acc' : '', kindIcon: x.kind === 'todo' ? 'M12 5v14M5 12h14' : 'M5 12h14M13 6l6 6-6 6', delay: 300 + Math.min(i, 10) * 45,
      owner: x.owner || '', initials: x.owner ? this.ini(x.owner) : '', due: x.due || '', selected, rowCls: (i === focusI ? 'focus ' : '') + (selected ? 'selected' : ''),
      toggle: (e) => { this.stop(e); const sel = { ...this.state.sel }; sel[x.id] = !sel[x.id]; this.setState({ sel }); },
      approve: (e) => { this.stop(e); this.decide([x.id], 'approve'); }, reject: (e) => { this.stop(e); this.decide([x.id], 'reject'); }, open: (e) => { this.stop(e); this.openDetail(x.id, 'inbox'); },
      edited: !!(st.edits[x.id] || (st.forms[x.id] && st.forms[x.id].savedAt)),
      actLabel: x.kind === 'step' ? this.ACT[(st.forms[x.id] && st.forms[x.id].aType) || ((this.extras()[x.id] || {}).action || {}).aType || 'mail'].label : '', pid: x.project.id }; });
    this._raw = raw.map((x) => x.id);
    const inboxGroups = sortedP.map((pp) => ({ name: pp.name, client: pp.client, health: pp.health, items: inboxItems.filter((it) => it.pid === pp.id) })).filter((g) => g.items.length).map((g) => ({ ...g, count: g.items.length }));
    const selIds = raw.filter((x) => st.sel[x.id]).map((x) => x.id);
    const projectsWithOpen = P.filter((x) => open.some((o) => o.project.id === x.id)).length;

    // ---- detail-pop-up
    let d = null; const fhd = {};
    const dIt = st.detail ? all.find((x) => x.id === st.detail) : null;
    if (dIt && st.forms[dIt.id]) {
      const f = st.forms[dIt.id]; const ex = this.extras()[dIt.id] || {}; const pp = dIt.project; const isTodo = dIt.kind === 'todo';
      const list = this._raw; const pos = list.indexOf(dIt.id); const inNav = st.detailCtx === 'inbox' && pos >= 0;
      ['title', 'desc', 'owner', 'due', 'section', 'asanaProject', 'newSub', 'aTo', 'aSubject', 'aBody', 'aDate', 'aTime', 'aDur', 'aLoc', 'taskOwner', 'taskDue'].forEach((n) => { fhd[n] = (e) => this.setF({ [n]: e.target.value }); });
      const cf = () => this.state.forms[this.state.detail];
      const toggleIn = (key, val) => () => { const arr = (cf()[key] || []).slice(); const i = arr.indexOf(val); if (i >= 0) arr.splice(i, 1); else arr.push(val); this.setF({ [key]: arr }); };
      const addSub = () => { const t = (cf().newSub || '').trim(); if (!t) return; this.setF({ subs: cf().subs.concat([{ text: t, done: false }]), newSub: '' }); };
      const confN = { Hoog: 3, Middel: 2, Laag: 1 }[ex.conf || 'Middel'];
      const hist = [{ text: 'Gespot door de agent in ' + this.TL[dIt.src.t], meta: dIt.src.m, cls: '' }, { text: 'Voorstel opgesteld · zekerheid ' + (ex.conf || 'Middel').toLowerCase(), meta: 'vandaag 09:42', cls: '' }];
      if (f.savedAt) hist.push({ text: 'Bewerkt en bewaard door jou', meta: 'vandaag ' + f.savedAt, cls: 'acc' });
      const subsDone = (f.subs || []).filter((s) => s.done).length;
      const chipOn = (arr, v) => (arr || []).indexOf(v) >= 0;
      d = {
        f, isTodo, isStep: !isTodo, kindLabel: isTodo ? 'Nieuwe to-do' : 'Volgende stap', kindCls: isTodo ? 'acc' : '', kindIcon: isTodo ? 'M12 5v14M5 12h14' : 'M5 12h14M13 6l6 6-6 6',
        projectName: pp.name, client: pp.client, health: pp.health, healthLabel: this.HEALTH[pp.health], phaseName: this.PHASES[pp.phase], progress: progressOf(pp),
        goProject: () => { this.closeDetail(); this.go('hub', pp.id); }, when: dIt.src.m, isEdited: !!f.savedAt,
        hasNav: inNav, pos: pos + 1, total: list.length, noPrev: !inNav || pos <= 0, noNext: !inNav || pos >= list.length - 1, progPct: inNav ? ((pos + 1) / list.length * 100).toFixed(1) : 100,
        prev: () => this.navDetail(-1), next: () => this.navDetail(1), close: () => this.closeDetail(), onKey: (e) => this.onDetailKey(e),
        src: this.src(dIt.src), excerpt: ex.excerpt || dIt.quote || dIt.detail, why: ex.why || ['Gevonden in ' + this.TL[dIt.src.t] + '.'], conf: ex.conf || 'Middel',
        confBars: [1, 2, 3].map((n) => ({ cls: n <= confN ? 'on' : '' })), hist, asanaMain: ((this.db().map[pp.id] || [])[0] || [0, 0, ['']])[2][0],
        prioChips: ['Laag', 'Normaal', 'Hoog', 'Urgent'].map((v) => ({ label: v, pressed: f.prio === v ? 'true' : 'false', cls: (f.prio === v ? 'on ' : '') + 'prio-' + v.toLowerCase(), pick: () => this.setF({ prio: v }) })),
        tagChips: this.TAGS.map((v) => ({ label: v, on: chipOn(f.tags, v) ? 'on' : '', pressed: chipOn(f.tags, v) ? 'true' : 'false', pick: toggleIn('tags', v) })),
        followerChips: this.TEAM.filter((n) => n !== f.owner).map((n) => ({ label: n.split(' ')[0], ini: this.ini(n), on: chipOn(f.followers, n) ? 'on' : '', pressed: chipOn(f.followers, n) ? 'true' : 'false', pick: toggleIn('followers', n) })),
        subs: (f.subs || []).map((s, i) => ({ ...s, cls: s.done ? 'done' : '', toggle: () => { const subs = cf().subs.slice(); subs[i] = { ...subs[i], done: !subs[i].done }; this.setF({ subs }); }, remove: () => this.setF({ subs: cf().subs.filter((x, j) => j !== i) }) })),
        subLabel: subsDone + '/' + (f.subs || []).length, addSub, subKey: (e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); addSub(); } },
        ownerFirst: (f.owner || '').split(' ')[0], remindCls: f.remind ? 'on' : '', remindAria: f.remind ? 'true' : 'false', toggleRemind: () => this.setF({ remind: !cf().remind }),
        typeTabs: ['mail', 'slack', 'invite', 'doc'].map((t) => ({ label: this.ACT[t].label, icon: this.ACT[t].icon, on: f.aType === t ? 'on' : '', pressed: f.aType === t ? 'true' : 'false', pick: () => this.setF({ aType: t }) })),
        typeIcon: (this.ACT[f.aType] || this.ACT.mail).icon, typeTitle: (this.ACT[f.aType] || this.ACT.mail).title,
        isMail: f.aType === 'mail', isSlack: f.aType === 'slack', isInvite: f.aType === 'invite', isDoc: f.aType === 'doc',
        deliveryTabs: [['concept', 'Als concept klaarzetten'], ['send', 'Meteen versturen']].map(([v, l]) => ({ label: l, on: f.delivery === v ? 'on' : '', pressed: f.delivery === v ? 'true' : 'false', pick: () => this.setF({ delivery: v }) })),
        attendeeChips: this.TEAM.filter((n) => n !== 'Lucas Galle').map((n) => ({ label: n.split(' ')[0], ini: this.ini(n), on: chipOn(f.aAttendees, n) ? 'on' : '', pressed: chipOn(f.aAttendees, n) ? 'true' : 'false', pick: toggleIn('aAttendees', n) })),
        meetCls: f.aMeet ? 'on' : '', meetAria: f.aMeet ? 'true' : 'false', toggleMeet: () => this.setF({ aMeet: !cf().aMeet }),
        alsoTask: !!f.alsoTask, alsoCls: f.alsoTask ? 'on' : '', alsoAria: f.alsoTask ? 'true' : 'false', toggleAlso: () => this.setF({ alsoTask: !cf().alsoTask }),
        rejectOpen: st.rejectOpen, snoozeOpen: st.snoozeOpen, rejectLabel: isTodo ? 'Afwijzen' : 'Negeren',
        toggleReject: () => this.setState({ rejectOpen: !this.state.rejectOpen, snoozeOpen: false }), toggleSnooze: () => this.setState({ snoozeOpen: !this.state.snoozeOpen, rejectOpen: false }),
        reasons: ['Niet relevant', 'Al gedaan', 'Dubbel voorstel', 'Verkeerd project', 'Niet mijn beslissing'].map((r) => ({ label: r, pick: () => this.rejectDetail(r) })),
        snoozes: ['Vanmiddag 14:00', 'Morgen 09:00', 'Maandag 12 okt', 'Na de stuurgroep (8 okt)'].map((r) => ({ label: r, pick: () => this.snoozeDetail(r) })),
        save: () => this.saveDetail(), approve: () => this.approveDetail(false), toAsana: () => this.approveDetail(true), primaryLabel: this.primaryLabel(dIt, f)
      };
    }

    // ---- bronnen
    const ss = st.lastSync;
    const sources = [
      ['asana', 'Asana', 'Source of truth voor taken', '4 projecten · 32 open taken', 'Lezen + schrijven', true],
      ['slack', 'Slack', 'Teamcommunicatie', '7 kanalen · 126 berichten gelezen vandaag', 'Lezen + concepten', true],
      ['mail', 'Gmail', 'Klantcommunicatie', '4 labels · 18 nieuwe mails sinds vrijdag', 'Lezen + concepten', true],
      ['cal', 'Google Calendar', 'Meetings en deadlines', '14 meetings deze week', 'Lezen', true],
      ['drive', 'Google Drive', 'Analyses, sheets en exports', '5 mappen · 212 bestanden', 'Lezen', true],
      ['canva', 'Canva', 'Ontwerpen en campagnebeelden', st.canvaOk ? '3 designs gekoppeld' : 'Token verlopen: designs worden niet meer gelezen', 'Lezen', st.canvaOk],
      ['notion', 'Notion', 'Verslagen, specs en checklists', '11 pagina’s · 2 databases', 'Lezen + pagina’s', true]
    ].map(([t, name, role, stat, scope, ok], i) => ({ icon: IC[t], name, role, stat, scope, ok, bad: !ok, cls: ok ? '' : 'warn', status: ok ? 'Verbonden' : 'Actie nodig', delay: 200 + i * 70,
      spin: st.syncing && ok ? 'spin' : '', statusCls: ok ? 'ok' : 'warn', last: !ok ? 'gisteren 18:05' : (st.srcSync[t] || ss),
      sync: () => { const srcSync = { ...this.state.srcSync }; srcSync[t] = this.hhmm(); this.setState({ srcSync }); this.toast(name + ' gesynchroniseerd'); },
      settings: () => this.toast('Instellingen voor ' + name + ' openen'),
      reconnect: () => { this.setState({ canvaOk: true }); this.toast('Canva opnieuw verbonden.'); } }));
    const mp = st.mapProject;
    const mapChips = sortedP.map((x) => ({ label: x.name, health: x.health, on: mp === x.id ? 'on' : '', pressed: mp === x.id ? 'true' : 'false', pick: () => this.setState({ mapProject: x.id, flip: !this.state.flip }) }));
    const mapRows = map[mp].map(([t, name, items], i) => ({ icon: IC[t], name, items, delay: i * 50, edit: () => this.toast('Koppeling voor ' + name + ' wijzigen') }));
    const [hh, mm] = ss.split(':').map(Number); const nm = hh * 60 + mm + 15;
    const nextSync = String(Math.floor(nm / 60) % 24).padStart(2, '0') + ':' + String(nm % 60).padStart(2, '0');

    return {
      theme, isDark: theme === 'dark', isLight: theme !== 'dark', themeLabel: theme === 'dark' ? 'Licht thema' : 'Donker thema', toggleTheme: () => this.setState({ theme: theme === 'dark' ? 'light' : 'dark' }),
      rootRef: this.rootRef, dlgRef: this.dlgRef, focusRef: this.focusRef, onPar: this.onPar, tilt: this.tilt, tiltOut: this.tiltOut, magnet: this.magnet, magnetOut: this.magnetOut, stop: this.stop,
      showLoader: !noLoader && st.boot !== 'done', loaderCls: st.boot === 'out' ? 'out' : '', showShell: noLoader || st.boot !== 'on', loaderSrc,
      sideCls: st.rail ? 'rail' : '', toggleRail: () => this.setState({ rail: !this.state.rail }), railLabel: st.rail ? 'Menu uitklappen' : 'Menu inklappen', railIcon: st.rail ? UI.expand : UI.collapse,
      mainNav, navY: (navIdx === undefined ? 0 : navIdx) * 44, navO: navIdx === undefined ? 0 : 1, navProjects, crumbA: 'The AI Platform', crumbB,
      transit: st.transit, showScreens: !st.transit,
      isVandaag: screen === 'vandaag', isFocus: screen === 'focus', isProjecten: screen === 'projecten', isHub: screen === 'hub', isInbox: screen === 'inbox', isBronnen: screen === 'bronnen',
      goVandaag: () => this.go('vandaag'), goProjecten: () => this.go('projecten'), goInbox: () => this.go('inbox'),
      syncing: st.syncing, notSyncing: !st.syncing, spinCls: st.syncing ? 'spin' : '', lastSync: st.lastSync, onSync: () => this.doSync(), nextSync,
      openTotal: open.length, hasOpen: open.length > 0, focusMins, heroLede, flowSteps, glance, meetingsToday, deadlinesWeek,
      dayOpen: st.dayOpen, toggleDay: () => this.setState({ dayOpen: !this.state.dayOpen }), startFocus: () => this.startFocus(0), startDecide: () => this.startFocus(1),
      prepMeeting: () => this.go('hub', 'p1', { hubTab: 4 }),
      fSteps, fs0: step === 0, fs1: step === 1, fs2: step === 2, fs3: step === 3, fs4: step === 4, stepFlip: st.stepFlip ? 'fb' : '',
      fNext: () => this.fGo(step + 1), fPrev: () => this.fGo(step - 1), pauseFocus: () => this.go('vandaag'),
      fires, follows, stackCards, hasQueue: queue.length > 0, noQueue: queue.length === 0, qText, onStackKey: (e) => this.onStackKey(e),
      nextBtnCls: queue.length ? 'btn-ghost' : 'btn-primary btn-lg', skipLabel: queue.length ? 'Rest later, ga verder' : 'Verder naar opvolgen', confetti, summary,
      cards, noCards: cards.length === 0, cardCount: cards.length === 1 ? '1 project' : cards.length + ' projecten', listFlip: flipCls,
      healthChips, phaseChips, clientChips, filtersActive: filterCount > 0, filterCount, fpanelCls: st.filtersOpen ? 'open' : '', filtersAria: st.filtersOpen ? 'true' : 'false', filterBtnCls: st.filtersOpen ? 'btn-ink' : '',
      toggleFilters: () => this.setState({ filtersOpen: !this.state.filtersOpen }), clearFilters: () => this.setState({ fPhase: 'alle', fHealth: 'alle', fClient: 'alle', flip: !this.state.flip }),
      p: hubP, tabs, tabX: st.hubTab * 128, tab0: st.hubTab === 0, tab1: st.hubTab === 1, tab2: st.hubTab === 2, tab3: st.hubTab === 3, tab4: st.hubTab === 4, tabFlip: st.tabFlip ? 'fb' : '',
      moreOpen: st.moreOpen, toggleMore: () => this.setState({ moreOpen: !this.state.moreOpen }), moreLabel: st.moreOpen ? 'Minder tonen' : 'Wat opvalt en risico’s', moreCls: st.moreOpen ? 'open' : '', moreAria: st.moreOpen ? 'true' : 'false',
      feedChips, groupPersoon: st.groupBy === 'persoon' ? 'on' : '', groupStatus: st.groupBy === 'status' ? 'on' : '',
      byPersoon: () => this.setState({ groupBy: 'persoon' }), byStatus: () => this.setState({ groupBy: 'status' }),
      inboxProjChips, inboxKindChips, kindX, ip, hasInboxProj: !!ipRaw, inboxGroups, inboxEmpty: inboxItems.length === 0,
      inboxSummary: open.length ? open.length + ' voorstellen over ' + projectsWithOpen + ' projecten. Kies een project of handel ze één voor één af.' : 'Alles is afgehandeld. Mooi werk.',
      onInboxKey: (e) => this.onKey(e, raw), anySel: selIds.length > 0, selCount: selIds.length,
      bulkApprove: () => this.decide(selIds, 'approve'), bulkReject: () => this.decide(selIds, 'reject'), bulkSnooze: () => this.decide(selIds, 'snooze'), clearSel: () => this.setState({ sel: {} }),
      bulkOwner: (e) => {
        const v = e.target.value; if (!v) return;
        const ids = selIds.filter((id) => (all.find((x) => x.id === id) || {}).kind === 'todo');
        const edits = { ...this.state.edits }; const forms = { ...this.state.forms };
        ids.forEach((id) => { edits[id] = { ...(edits[id] || {}), owner: v }; if (forms[id]) forms[id] = { ...forms[id], owner: v }; });
        this.setState({ edits, forms }); this.toast(ids.length ? ids.length + ' to-do’s toegewezen aan ' + v : 'Selecteer eerst een of meer to-do’s');
      },
      hasDetail: !!d, d: d || { f: {}, src: {} }, fh: fhd,
      sources, mapChips, mapRows,
      hasSlack: !!st.slack, slack: st.slack || { name: '', text: '' },
      onSlackText: (e) => this.setState({ slack: { ...this.state.slack, text: e.target.value } }), closeSlack: () => this.setState({ slack: null }),
      sendSlack: () => { const sl = this.state.slack; const sent = { ...this.state.sent }; sent[sl.key] = this.hhmm(); this.setState({ sent, slack: null }); this.toast('Bericht verstuurd naar ' + sl.name + ' in Slack'); },
      hasToast: !!st.toast, toastText: st.toast ? st.toast.text : '', toastUndo: !!(st.toast && st.toast.ids), onToastUndo: () => { if (this.state.toast && this.state.toast.ids) this.undo(this.state.toast.ids); }
    };
  }
}
