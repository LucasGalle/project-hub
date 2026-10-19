// Haalt stijl, template en logica letterlijk uit het prototype (SRC-DES-001) zodat de app
// een getrouwe kopie van het design is (PH-DEC-017). Niets wordt herschreven.
// Gebruik: node app/tools/extract-design.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = readFileSync(join(root, '02-sources/raw/project-hub-prototype-v8.dc.html'), 'utf8');
const out = (f) => join(root, 'app/public', f);

const between = (a, b) => {
  const i = src.indexOf(a), j = src.indexOf(b, i + a.length);
  if (i < 0 || j < 0) throw new Error(`Niet gevonden: ${a} … ${b}`);
  return src.slice(i + a.length, j);
};

const helmet = between('<helmet>', '</helmet>');
const css = helmet.slice(helmet.indexOf('<style>') + 7, helmet.lastIndexOf('</style>'));
const fonts = helmet.slice(0, helmet.indexOf('<style>')).trim();
const template = between('</helmet>', '</x-dc>').trim();
const scriptOpen = src.indexOf('<script type="text/x-dc"');
const props = JSON.parse(src.slice(src.indexOf("data-props='", scriptOpen) + 12, src.indexOf("'>", scriptOpen)));
const logic = src.slice(src.indexOf('>', scriptOpen) + 1, src.lastIndexOf('</script>')).trim();

const defaults = Object.fromEntries(Object.entries(props).filter(([k]) => !k.startsWith('$')).map(([k, v]) => [k, v.default]));

writeFileSync(out('styles.css'), `/* Letterlijk overgenomen uit het prototype v8 (SRC-DES-001). Niet met de hand wijzigen: pas het design aan en draai app/tools/extract-design.mjs. */\n${css.trim()}\n`);
writeFileSync(out('component.js'), `// Letterlijk overgenomen uit het prototype v8 (SRC-DES-001), op de import/export na.\nimport { DCLogic } from './runtime.js';\n\nexport const defaultProps = ${JSON.stringify(defaults)};\n\nexport ${logic}\n`);

const head = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Project Hub</title>
${fonts}
<link rel="stylesheet" href="styles.css">
</head>
<body>
<!-- Template letterlijk overgenomen uit het prototype v8 (SRC-DES-001). -->
<template id="dc-template">
${template}
</template>
<div id="root"></div>
<script type="module" src="main.js"></script>
</body>
</html>
`;
writeFileSync(out('index.html'), head);
console.log(`✓ styles.css (${css.length} tekens), component.js (${logic.length}), index.html met template (${template.length}); props: ${JSON.stringify(defaults)}`);
