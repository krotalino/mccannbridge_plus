const fs = require('fs');
const bundle = fs.readFileSync('/tmp/remote_bundle.js', 'utf8');

// Find Xc
let idx = 0;
const results = [];
while ((idx = bundle.indexOf('Xc', idx)) !== -1) {
  const sub = bundle.slice(Math.max(0, idx - 20), Math.min(bundle.length, idx + 40));
  if (sub.includes('=Xc') || sub.includes('Xc=') || sub.includes('const Xc') || sub.includes('let Xc') || sub.includes('var Xc')) {
    results.push({ idx, sub });
  }
  idx += 2;
}
console.log("Xc results:", results);
if (results.length > 0) {
  const p = results[0].idx;
  console.log("Context around Xc:", bundle.slice(Math.max(0, p - 50), Math.min(bundle.length, p + 500)));
}
