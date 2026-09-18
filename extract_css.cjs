const fs = require('fs');
const css = fs.readFileSync('/tmp/remote_style.css', 'utf8');

// Find all CSS rules containing ifx-
let pos = 0;
const ifxRules = [];
while ((pos = css.indexOf('.ifx-', pos)) !== -1) {
  // find matching rule
  const start = css.lastIndexOf('}', pos) !== -1 ? css.lastIndexOf('}', pos) + 1 : 0;
  const end = css.indexOf('}', pos);
  if (end !== -1) {
    const rule = css.slice(start, end + 1).trim();
    if (!ifxRules.includes(rule)) {
      ifxRules.push(rule);
    }
    pos = end + 1;
  } else {
    break;
  }
}

console.log("Total ifx rules found:", ifxRules.length);
fs.writeFileSync('/tmp/ifx_styles.css', ifxRules.join('\n\n'));
console.log("Written to /tmp/ifx_styles.css");
