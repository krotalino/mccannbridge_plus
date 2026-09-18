const fs = require('fs');
const bundle = fs.readFileSync('/tmp/remote_bundle.js', 'utf8');

// Find start of PV, M9, L9, U9, G9, z9, H9, gS, Vp, cV, etc.
const targets = [
  'function Jo(',
  'function R9(',
  'function O9(',
  'function M9(',
  'function L9(',
  'function U9(',
  'function gS(',
  'function G9(',
  'function z9(',
  'function H9(',
  'function Vp(',
  'function i9(',
  'function sV(',
  'function cV(',
  'const OV=',
  'function PV('
];

const found = [];
targets.forEach(t => {
  const idx = bundle.indexOf(t);
  found.push({ target: t, idx });
});

found.sort((a, b) => a.idx - b.idx);
found.forEach((item, i) => {
  const nextIdx = i < found.length - 1 ? found[i + 1].idx : item.idx + 15000;
  console.log(`\n=== [${item.target}] at ${item.idx} (length ${nextIdx - item.idx}) ===`);
  const chunk = bundle.slice(item.idx, nextIdx);
  const name = item.target.replace(/[^a-zA-Z0-9]/g, '_');
  fs.writeFileSync(`/tmp/chunk_${name}.js`, chunk);
});
