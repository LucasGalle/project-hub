// Test van de login-Worker (M2b, AC-006 t/m AC-011) zonder netwerk: Google en de bestanden worden nagebootst.
// Gebruik: node app/tests/auth.test.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import worker from '../src/worker.js';

const ORIGIN = 'https://project-hub-app.example.dev';
const loginHtml = readFileSync(new URL('../public/login.html', import.meta.url), 'utf8');
const ASSETS = {
  fetch: async (req) => {
    const path = new URL(req.url).pathname;
    if (path === '/login') return new Response(loginHtml, { headers: { 'Content-Type': 'text/html' } });
    return new Response(`bestand ${path}`, { status: 200 });
  },
};
const ENV = {
  ASSETS,
  GOOGLE_CLIENT_ID: 'client-id',
  GOOGLE_CLIENT_SECRET: 'client-secret',
  SESSION_SECRET: 'een-lang-willekeurig-geheim-voor-de-test',
  ALLOWED_EMAILS: 'lucas@example.com, tweede@example.com',
};

const get = (path, { env = ENV, cookie } = {}) =>
  worker.fetch(new Request(ORIGIN + path, { headers: cookie ? { Cookie: cookie } : {} }), env);
const cookieValue = (res, name) => {
  const c = res.headers.getSetCookie().find((x) => x.startsWith(name + '='));
  return c ? c.split(';')[0] : null;
};

// Google nabootsen: token-uitwisseling en gebruikersinfo.
function mockGoogle(user, { tokenOk = true } = {}) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).startsWith('https://oauth2.googleapis.com/token')) {
      return tokenOk ? Response.json({ access_token: 'at-123' }) : new Response('nee', { status: 400 });
    }
    if (String(url).startsWith('https://openidconnect.googleapis.com/v1/userinfo')) return Response.json(user);
    throw new Error('onverwachte oproep ' + url);
  };
  return calls;
}

// Doorloopt login → Google → callback en geeft het antwoord van de callback terug.
async function loginAs(user, opts = {}) {
  const calls = mockGoogle(user, opts);
  const start = await get('/auth/login');
  const flow = cookieValue(start, 'ph_login');
  const state = new URL(start.headers.get('Location')).searchParams.get('state');
  const res = await get(`/auth/callback?code=abc&state=${opts.state ?? state}`, { cookie: flow });
  return { res, calls };
}

test('AC-006: zonder sessie toont elk adres het loginscherm', async () => {
  for (const path of ['/', '/index.html', '/component.js', '/main.js', '/vendor/preact-10.27.2.module.js']) {
    const res = await get(path);
    assert.equal(res.status, 401, path);
    const body = await res.text();
    assert.match(body, /Inloggen met Google/, path);
    assert.doesNotMatch(body, /bestand /, path);
  }
});

test('AC-006: het loginscherm en zijn stijl zijn publiek', async () => {
  for (const path of ['/login.css', '/styles.css']) assert.equal((await get(path)).status, 200, path);
});

test('AC-007: login stuurt naar Google met state en PKCE en enkel basisgegevens', async () => {
  const res = await get('/auth/login');
  assert.equal(res.status, 302);
  const to = new URL(res.headers.get('Location'));
  assert.equal(to.origin + to.pathname, 'https://accounts.google.com/o/oauth2/v2/auth');
  assert.equal(to.searchParams.get('client_id'), 'client-id');
  assert.equal(to.searchParams.get('redirect_uri'), ORIGIN + '/auth/callback');
  assert.equal(to.searchParams.get('scope'), 'openid email profile');
  assert.equal(to.searchParams.get('code_challenge_method'), 'S256');
  assert.ok(to.searchParams.get('state').length >= 32);
  const flow = res.headers.getSetCookie()[0];
  assert.match(flow, /HttpOnly/);
  assert.match(flow, /Secure/);
  assert.match(flow, /Path=\/auth\/callback/);
});

test('AC-007: een foute state wordt geweigerd zonder Google te contacteren', async () => {
  const { res, calls } = await loginAs({ email: 'lucas@example.com', email_verified: true }, { state: 'vervalst' });
  assert.equal(res.headers.get('Location'), ORIGIN + '/?melding=failed');
  assert.equal(cookieValue(res, 'ph_session'), null);
  assert.equal(calls.length, 0);
});

test('AC-007: een callback zonder login-cookie wordt geweigerd', async () => {
  mockGoogle({ email: 'lucas@example.com', email_verified: true });
  const res = await get('/auth/callback?code=abc&state=iets');
  assert.equal(res.headers.get('Location'), ORIGIN + '/?melding=failed');
});

test('AC-007: de PKCE-verifier past bij de challenge die naar Google ging', async () => {
  const calls = mockGoogle({ email: 'lucas@example.com', email_verified: true });
  const start = await get('/auth/login');
  const to = new URL(start.headers.get('Location'));
  await get(`/auth/callback?code=abc&state=${to.searchParams.get('state')}`, { cookie: cookieValue(start, 'ph_login') });
  const verifier = new URLSearchParams(calls[0].init.body.toString()).get('code_verifier');
  const digest = Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))).toString('base64url');
  assert.equal(digest, to.searchParams.get('code_challenge'));
});

test('AC-008: een account dat niet op de lijst staat komt niet binnen', async () => {
  const { res } = await loginAs({ email: 'iemand@example.com', email_verified: true });
  assert.equal(res.headers.get('Location'), ORIGIN + '/?melding=denied');
  assert.equal(cookieValue(res, 'ph_session'), null);
  const page = await (await get('/?melding=denied')).text();
  assert.match(page, /geen toegang/);
});

test('AC-008: een niet-bevestigd e-mailadres komt niet binnen', async () => {
  const { res } = await loginAs({ email: 'lucas@example.com', email_verified: false });
  assert.equal(res.headers.get('Location'), ORIGIN + '/?melding=denied');
});

test('AC-008: een mislukte token-uitwisseling geeft een foutmelding', async () => {
  const { res } = await loginAs({ email: 'lucas@example.com', email_verified: true }, { tokenOk: false });
  assert.equal(res.headers.get('Location'), ORIGIN + '/?melding=failed');
});

test('AC-008: afbreken bij Google geeft een melding', async () => {
  const res = await get('/auth/callback?error=access_denied');
  assert.equal(res.headers.get('Location'), ORIGIN + '/?melding=cancelled');
});

test('AC-009: een toegelaten account komt binnen en ziet de app', async () => {
  const { res } = await loginAs({ email: 'Lucas@Example.com', email_verified: true, name: 'Lucas' });
  assert.equal(res.headers.get('Location'), ORIGIN + '/');
  const session = cookieValue(res, 'ph_session');
  assert.ok(session);
  assert.match(res.headers.getSetCookie().find((c) => c.startsWith('ph_session')), /HttpOnly; Secure; SameSite=Lax/);
  const app = await get('/', { cookie: session });
  assert.equal(app.status, 200);
  assert.equal(await app.text(), 'bestand /');
});

test('AC-009: een vervalste of verlopen cookie wordt geweigerd', async () => {
  const { res } = await loginAs({ email: 'lucas@example.com', email_verified: true });
  const session = cookieValue(res, 'ph_session');
  const [body, sig] = session.slice('ph_session='.length).split('.');
  const other = JSON.parse(Buffer.from(body, 'base64url').toString());
  other.email = 'indringer@example.com';
  const forged = Buffer.from(JSON.stringify(other)).toString('base64url');
  assert.equal((await get('/', { cookie: `ph_session=${forged}.${sig}` })).status, 401);
  assert.equal((await get('/', { cookie: 'ph_session=rommel' })).status, 401);
  assert.equal((await get('/', { cookie: session, env: { ...ENV, SESSION_SECRET: 'ander-geheim' } })).status, 401);

  const realNow = Date.now;
  Date.now = () => realNow() + 31 * 864e5;
  try {
    assert.equal((await get('/', { cookie: session })).status, 401);
  } finally {
    Date.now = realNow;
  }
});

test('AC-010: uitloggen wist de sessie', async () => {
  const res = await get('/auth/logout');
  assert.equal(res.headers.get('Location'), ORIGIN + '/?melding=out');
  assert.match(res.headers.getSetCookie()[0], /^ph_session=; Max-Age=0/);
  assert.match(await (await get('/?melding=out')).text(), /uitgelogd/);
});

test('AC-011: zonder geheimen blijft de app dicht', async () => {
  const env = { ASSETS };
  const res = await get('/', { env });
  assert.equal(res.status, 401);
  const body = await res.text();
  assert.match(body, /nog niet ingesteld/);
  assert.match(body, /aria-disabled="true"/);
  assert.equal((await get('/auth/login', { env })).headers.get('Location'), ORIGIN + '/?melding=config');
  // Ook een geldige sessie helpt niet zolang de instellingen ontbreken.
  const { res: ok } = await loginAs({ email: 'lucas@example.com', email_verified: true });
  assert.equal((await get('/', { env: { ...ENV, ALLOWED_EMAILS: '' }, cookie: cookieValue(ok, 'ph_session') })).status, 401);
});

test('onbekende meldingen worden niet in de pagina gezet', async () => {
  const body = await (await get('/?melding=%3Cscript%3E')).text();
  assert.doesNotMatch(body, /<script>/);
  assert.doesNotMatch(body, /login-msg/);
});
