const fs = require('fs');
const bundle = fs.readFileSync('/tmp/remote_bundle.js', 'utf8');

function getFullFunction(fnName) {
  let start = bundle.indexOf(`function ${fnName}(`);
  if (start === -1) start = bundle.indexOf(`const ${fnName}=`);
  if (start === -1) return null;

  // find first '{'
  let braceStart = bundle.indexOf('{', start);
  if (braceStart === -1) return null;

  let depth = 1;
  let i = braceStart + 1;
  let inString = false;
  let strChar = '';
  let inRegex = false;

  while (i < bundle.length && depth > 0) {
    const ch = bundle[i];
    const prev = bundle[i - 1];

    if (inString) {
      if (ch === strChar && prev !== '\\') {
        inString = false;
      }
    } else {
      if (ch === '"' || ch === "'" || ch === '`') {
        inString = true;
        strChar = ch;
      } else if (ch === '{') {
        depth++;
      } else if (ch === '}') {
        depth--;
      }
    }
    i++;
  }

  return bundle.slice(start, i);
}

const names = ['PV', 'M9', 'L9', 'U9', 'G9', 'z9', 'H9', 'gS', 'i9', 'Vp', 'Jo', 'R9', 'O9', 'Ei', 'I9', 'cV', 'sV', 'X9', 'Ri', 'Xa', 'st', 'pS', 'fS', 'r0', 'A9', 'D9'];

names.forEach(n => {
  const code = getFullFunction(n);
  if (code) {
    fs.writeFileSync(`/tmp/full_${n}.js`, code);
    console.log(`Saved /tmp/full_${n}.js (${code.length} chars)`);
  } else {
    console.log(`Could not get full function for ${n}`);
  }
});
