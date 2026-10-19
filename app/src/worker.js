// Worker van de app (M2b): laat alleen ingelogde gebruikers binnen (PH-DEC-016, PH-DEC-018).
// Inloggen met Google via OpenID Connect (state + PKCE). Sessie = ondertekende cookie, geen database.
// Geheimen (Cloudflare, Settings › Variables and Secrets): GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
// SESSION_SECRET, ALLOWED_EMAILS. Zie 12-roadmap/M2-schermen.md.

const GOOGLE_AUTH = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO = 'https://openidconnect.googleapis.com/v1/userinfo';
const SESSION_COOKIE = 'ph_session';
const FLOW_COOKIE = 'ph_login';
const SESSION_DAYS = 30;
const FLOW_MINUTES = 10;

// Bestanden die het loginscherm nodig heeft; bereikbaar zonder sessie.
const PUBLIC_ASSETS = new Set(['/login.css', '/styles.css']);

const MESSAGES = {
  config: 'De login is nog niet ingesteld. De app blijft dicht tot de Google-gegevens in Cloudflare staan.',
  denied: 'Dit Google-account heeft geen toegang tot Project Hub.',
  failed: 'Inloggen is niet gelukt. Probeer opnieuw.',
  cancelled: 'Inloggen werd afgebroken.',
  out: 'Je bent uitgelogd.',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    switch (url.pathname) {
      case '/auth/login': return login(url, env);
      case '/auth/callback': return callback(request, url, env);
      case '/auth/logout': return logout(url);
    }
    if (PUBLIC_ASSETS.has(url.pathname)) return env.ASSETS.fetch(request);
    if (configured(env) && await readSession(request, env)) return env.ASSETS.fetch(request);
    return loginPage(request, url, env, configured(env) ? null : 'config', 401);
  },
};

function configured(env) {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.SESSION_SECRET && allowed(env).length);
}

function allowed(env) {
  return String(env.ALLOWED_EMAILS || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
}

async function login(url, env) {
  if (!configured(env)) return redirect(url, '/?melding=config');
  const state = randomToken();
  const verifier = randomToken();
  const challenge = base64url(await crypto.subtle.digest('SHA-256', utf8(verifier)));
  const target = new URL(GOOGLE_AUTH);
  target.search = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: `${url.origin}/auth/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    prompt: 'select_account',
  });
  const flow = await sign({ state, verifier, exp: Date.now() + FLOW_MINUTES * 60e3 }, env.SESSION_SECRET);
  return new Response(null, {
    status: 302,
    headers: { Location: target.toString(), 'Set-Cookie': cookie(FLOW_COOKIE, flow, FLOW_MINUTES * 60, '/auth/callback') },
  });
}

async function callback(request, url, env) {
  if (!configured(env)) return redirect(url, '/?melding=config');
  const clearFlow = cookie(FLOW_COOKIE, '', 0, '/auth/callback');
  if (url.searchParams.get('error')) return redirect(url, '/?melding=cancelled', clearFlow);

  const flow = await verify(readCookie(request, FLOW_COOKIE), env.SESSION_SECRET);
  const code = url.searchParams.get('code');
  if (!flow || !code || !safeEqual(flow.state, url.searchParams.get('state') || '')) {
    return redirect(url, '/?melding=failed', clearFlow);
  }

  const user = await googleUser(code, flow.verifier, `${url.origin}/auth/callback`, env);
  if (!user) return redirect(url, '/?melding=failed', clearFlow);
  const email = String(user.email || '').toLowerCase();
  if (user.email_verified !== true || !allowed(env).includes(email)) {
    return redirect(url, '/?melding=denied', clearFlow);
  }

  const session = await sign({ email, name: user.name || '', exp: Date.now() + SESSION_DAYS * 864e5 }, env.SESSION_SECRET);
  return redirect(url, '/', clearFlow, cookie(SESSION_COOKIE, session, SESSION_DAYS * 86400, '/'));
}

async function googleUser(code, verifier, redirectUri, env) {
  try {
    const tokenRes = await fetch(GOOGLE_TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code_verifier: verifier,
      }),
    });
    if (!tokenRes.ok) return null;
    const { access_token: accessToken } = await tokenRes.json();
    if (!accessToken) return null;
    // Rechtstreeks bij Google opgevraagd over TLS, dus geen eigen controle van de id_token-handtekening nodig.
    const infoRes = await fetch(GOOGLE_USERINFO, { headers: { Authorization: `Bearer ${accessToken}` } });
    return infoRes.ok ? await infoRes.json() : null;
  } catch {
    return null;
  }
}

function logout(url) {
  return redirect(url, '/?melding=out', cookie(SESSION_COOKIE, '', 0, '/'));
}

async function readSession(request, env) {
  return verify(readCookie(request, SESSION_COOKIE), env.SESSION_SECRET);
}

async function loginPage(request, url, env, reason, status) {
  // `/login` en niet `/login.html`: Cloudflare stuurt .html-adressen door naar hun korte vorm.
  const page = await env.ASSETS.fetch(new Request(new URL('/login', url), request));
  const key = reason || url.searchParams.get('melding');
  let html = await page.text();
  if (MESSAGES[key]) html = html.replace('<!--melding-->', `<p class="login-msg" role="status">${MESSAGES[key]}</p>`);
  if (!configured(env)) html = html.replace('class="btn btn-primary btn-lg login-btn"', 'class="btn btn-primary btn-lg login-btn" aria-disabled="true"');
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

// --- Ondertekende waarden: base64url(json).base64url(hmac) ---

async function sign(data, secret) {
  const body = base64url(utf8(JSON.stringify(data)));
  return `${body}.${base64url(await hmac(body, secret))}`;
}

async function verify(value, secret) {
  if (!value || !secret) return null;
  const [body, sig] = value.split('.');
  if (!body || !sig) return null;
  const expected = base64url(await hmac(body, secret));
  if (!safeEqual(sig, expected)) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(fromBase64url(body)));
    return typeof data.exp === 'number' && data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

async function hmac(text, secret) {
  const key = await crypto.subtle.importKey('raw', utf8(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', key, utf8(text));
}

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// --- Hulpjes ---

function redirect(url, to, ...cookies) {
  const headers = new Headers({ Location: new URL(to, url.origin).toString(), 'Cache-Control': 'no-store' });
  for (const c of cookies) headers.append('Set-Cookie', c);
  return new Response(null, { status: 302, headers });
}

function cookie(name, value, maxAge, path) {
  return `${name}=${value}; Max-Age=${maxAge}; Path=${path}; HttpOnly; Secure; SameSite=Lax`;
}

function readCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}

const utf8 = (s) => new TextEncoder().encode(s);
const randomToken = () => base64url(crypto.getRandomValues(new Uint8Array(32)));

function base64url(buf) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64url(s) {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}
