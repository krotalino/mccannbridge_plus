const fs = require('fs');
const bundle = fs.readFileSync('/tmp/remote_bundle.js', 'utf8');

// Let us find the exact character boundaries of M9, L9, U9, G9, z9, H9, gS, Vp, etc.
function extractComponent(name) {
  let idx = bundle.indexOf(`function ${name}(`);
  if (idx === -1) idx = bundle.indexOf(`const ${name}=`);
  if (idx === -1) return null;

  // Let's find where next function starts or find matching braces
  return bundle.slice(idx, idx + 10000);
}

const comps = {
  M9: extractComponent('M9'),
  L9: extractComponent('L9'),
  U9: extractComponent('U9'),
  G9: extractComponent('G9'),
  z9: extractComponent('z9'),
  H9: extractComponent('H9'),
  gS: extractComponent('gS'),
  Jo: extractComponent('Jo')
};

for (const [k, v] of Object.entries(comps)) {
  if (v) {
    fs.writeFileSync(`/tmp/comp_${k}.txt`, v.slice(0, 15000));
    console.log(`Saved /tmp/comp_${k}.txt (length: ${v.length})`);
  } else {
    console.log(`Component ${k} not found`);
  }
}
