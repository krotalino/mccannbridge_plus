const fs = require('fs');
const bundle = fs.readFileSync('/tmp/remote_bundle.js', 'utf8');

// Find where pS is defined
let match = bundle.match(/function pS\s*\([^)]*\)\s*\{/);
if (!match) match = bundle.match(/const pS\s*=\s*/);
console.log("pS match:", match ? match[0] + " at " + match.index : "not found");
if (match) {
  console.log(bundle.slice(match.index, match.index + 2000));
}

// Find Xc
let xcMatch = bundle.match(/const Xc\s*=\s*/);
if (!xcMatch) xcMatch = bundle.match(/var Xc\s*=\s*/);
console.log("Xc match:", xcMatch ? xcMatch[0] + " at " + xcMatch.index : "not found");
if (xcMatch) {
  console.log(bundle.slice(xcMatch.index, xcMatch.index + 1000));
}
