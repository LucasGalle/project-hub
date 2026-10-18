// Doorklik-test van alle schermen (M2, AC-002/AC-003). Vereist Playwright met Chromium.
// Gebruik: start een server op app/public (bv. `python3 -m http.server 8790` in app/public), dan:
//   node app/tests/screens.test.cjs [basis-url] [map-voor-schermafbeeldingen]
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const base = process.argv[2] || 'http://localhost:8790/';
const out = process.argv[3];

(async () => {
  const b = await chromium.launch(); const errors = []; const failed = [];
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.on('pageerror', (e) => errors.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const check = async (name, text) => {
    await p.waitForTimeout(1500);
    const ok = await p.getByText(text, { exact: false }).first().isVisible().catch(() => false);
    console.log(`${ok ? '✓' : '✗'} ${name}`); if (!ok) failed.push(name);
    if (out) await p.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  };
  await p.goto(base); await p.waitForTimeout(3000);
  await check('vandaag', 'Je ronde in vier stappen');
  await p.getByText('Start je focusronde').first().click(); await check('focus-wat-brandt', 'Eerst wat brandt');
  await p.getByText('Verder naar beslissen').first().click(); await check('focus-beslissen', 'Beslis één voor één');
  await p.locator('aside').getByRole('button', { name: 'Projecten', exact: true }).click(); await check('projecten', 'Je projecten');
  await p.locator('aside').getByRole('button', { name: /Kennisbank-assistent/ }).click(); await check('project-hub', 'Wat de agent ziet');
  await p.locator('[role=tab]').nth(2).click(); await check('project-hub-taken', 'Openstaande taken');
  await p.locator('aside').getByRole('button', { name: /^Inbox/ }).click(); await check('inbox', 'Over alle projecten heen');
  await p.locator('aside').getByRole('button', { name: /^Bronnen/ }).click(); await check('bronnen', 'Koppelingen per project');
  const leftover = await p.evaluate(() => document.getElementById('root').innerHTML.includes('{{'));
  console.log(leftover ? '✗ onopgeloste {{gaten}} in de pagina' : '✓ geen onopgeloste {{gaten}}'); if (leftover) failed.push('gaten');
  console.log(errors.length ? `✗ fouten in de console:\n${errors.join('\n')}` : '✓ geen fouten in de console');
  await b.close();
  process.exit(failed.length || errors.length ? 1 : 0);
})();
