const fs = require('fs');

// Print first 2000 chars of Cockpit
console.log("=== Cockpit (M9) ===");
console.log(fs.readFileSync('/tmp/chunk_function_M9_.js', 'utf8').slice(0, 2500));
