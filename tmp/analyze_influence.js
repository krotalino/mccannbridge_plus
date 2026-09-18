const fs = require('fs');
const bundle = fs.readFileSync('/tmp/remote_bundle.js', 'utf8');

console.log("Bundle length:", bundle.length);

// Look for occurrences of "/influence" or "Influence"
let idx = 0;
const occurrences = [];
while ((idx = bundle.indexOf('/influence', idx)) !== -1) {
  occurrences.push(idx);
  idx += 10;
}

console.log("Found /influence at indices:", occurrences);
occurrences.forEach(pos => {
  console.log("--- Context at", pos, "---");
  console.log(bundle.slice(Math.max(0, pos - 200), Math.min(bundle.length, pos + 300)));
});
