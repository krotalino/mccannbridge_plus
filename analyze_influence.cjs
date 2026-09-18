const fs = require('fs');
const bundle = fs.readFileSync('/tmp/remote_bundle.js', 'utf8');

// Search for M9 definition (Cockpit view)
let m9Idx = bundle.indexOf('function M9(');
if (m9Idx === -1) m9Idx = bundle.indexOf('const M9=');
console.log("M9 index:", m9Idx);
if (m9Idx !== -1) {
  console.log("=== M9 Component (Cockpit) ===");
  console.log(bundle.slice(m9Idx, m9Idx + 1500));
}

// Search for L9 definition (Talents view)
let l9Idx = bundle.indexOf('function L9(');
if (l9Idx === -1) l9Idx = bundle.indexOf('const L9=');
console.log("L9 index:", l9Idx);
if (l9Idx !== -1) {
  console.log("=== L9 Component (Talents) ===");
  console.log(bundle.slice(l9Idx, l9Idx + 1500));
}
