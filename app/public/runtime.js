// Kleine runtime die het Claude Design-template (x-dc) van het prototype rendert met Preact.
// Ondersteunt wat het prototype gebruikt: {{pad}}-gaten in tekst en attributen, <sc-if value>,
// <sc-for list as>, event-handlers, ref, en DCLogic (= class component met setState en renderVals).
import { h, Fragment, Component } from './vendor/preact-10.27.2.module.js';

export class DCLogic extends Component {
  render() { return renderTemplate(this.renderVals()); }
}

const HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
const ONLY_HOLE = /^\{\{\s*([^}]+?)\s*\}\}$/;
let compiled = null;

// Template één keer omzetten naar een boom van gewone objecten.
function compile(node) {
  if (node.nodeType === 3) {
    const text = node.nodeValue;
    return text.includes('{{') ? { t: 'text', parts: split(text) } : { t: 'static', text };
  }
  if (node.nodeType !== 1) return null;
  const tag = node.localName;
  const kids = [...node.childNodes].map(compile).filter(Boolean);
  if (tag === 'sc-if') return { t: 'if', value: path(node.getAttribute('value')), kids };
  if (tag === 'sc-for') return { t: 'for', list: path(node.getAttribute('list')), as: node.getAttribute('as'), kids };
  const attrs = [];
  for (const a of node.attributes) {
    if (a.name.startsWith('hint-')) continue;
    const only = a.value.match(ONLY_HOLE);
    attrs.push({ name: propName(a.name, node), raw: only ? only[1] : null, parts: only ? null : (a.value.includes('{{') ? split(a.value) : null), value: a.value });
  }
  return { t: 'el', tag: node.namespaceURI === 'http://www.w3.org/2000/svg' ? node.tagName : tag, attrs, kids };
}

// De HTML-parser zet attribuutnamen in kleine letters; zet ze om naar wat Preact verwacht.
function propName(name, node) {
  if (name === 'onchange') {
    const type = (node.getAttribute('type') || 'text').toLowerCase();
    const textual = node.localName === 'textarea' || (node.localName === 'input' && !['checkbox', 'radio', 'date', 'file'].includes(type));
    return textual ? 'oninput' : 'onchange'; // React-onChange vuurt bij elke toets
  }
  if (name === 'tabindex') return 'tabIndex';
  return name;
}

function split(text) {
  const parts = []; let last = 0;
  text.replace(HOLE, (m, p, i) => { if (i > last) parts.push(text.slice(last, i)); parts.push({ p: path(p) }); last = i + m.length; });
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
const path = (s) => s.trim().replace(/^\{\{\s*|\s*\}\}$/g, '').split('.');

function lookup(p, scope) {
  let v = scope;
  for (const k of p) { if (v == null) return undefined; v = v[k]; }
  return v;
}
const str = (v) => (v == null || v === false ? '' : String(v));
const interp = (parts, scope) => parts.map((x) => (typeof x === 'string' ? x : str(lookup(x.p, scope)))).join('');

function build(n, scope, key) {
  switch (n.t) {
    case 'static': return n.text;
    case 'text': return interp(n.parts, scope);
    case 'if': return lookup(n.value, scope) ? h(Fragment, { key }, n.kids.map((k, i) => build(k, scope, i))) : null;
    case 'for': {
      const list = lookup(n.list, scope) || [];
      return h(Fragment, { key }, list.map((item, idx) => {
        const s = Object.create(scope); s[n.as] = item;
        return h(Fragment, { key: idx }, n.kids.map((k, i) => build(k, s, i)));
      }));
    }
    case 'el': {
      const props = { key };
      for (const a of n.attrs) {
        let v = a.raw ? lookup(path(a.raw), scope) : a.parts ? interp(a.parts, scope) : a.value;
        if (a.name.startsWith('aria-') && typeof v === 'boolean') v = String(v);
        if (a.name === 'class') props.class = v; else props[a.name] = v;
      }
      return h(n.tag, props, n.kids.map((k, i) => build(k, scope, i)));
    }
  }
  return null;
}

function renderTemplate(vals) {
  if (!compiled) {
    const tpl = document.getElementById('dc-template').content;
    compiled = [...tpl.childNodes].map(compile).filter(Boolean);
  }
  const roots = compiled.map((n, i) => build(n, vals, i)).filter((x) => x != null && x !== '' && !(typeof x === 'string' && !x.trim()));
  return roots.length === 1 ? roots[0] : h(Fragment, null, roots);
}
