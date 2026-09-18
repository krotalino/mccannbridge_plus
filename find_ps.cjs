const fs = require('fs');
const bundle = fs.readFileSync('/tmp/remote_bundle.js', 'utf8');

let idx = 0;
const results = [];
while ((idx = bundle.indexOf('pS', idx)) !== -1) {
  // check if it looks like variable declaration or function definition
  const sub = bundle.slice(Math.max(0, idx - 20), Math.min(bundle.length, idx + 40));
  if (sub.includes('=pS') || sub.includes('pS=') || sub.includes('function pS') || sub.includes('let pS') || sub.includes('const pS')) {
    results.push({ idx, sub });
  }
  idx += 2;
}

console.log("pS results:", results);
if (results.length > 0) {
  const p = results[0].idx;
  console.log("Context around first match:", bundle.slice(Math.max(0, p - 200), Math.min(bundle.length, p + 1500)));
}
