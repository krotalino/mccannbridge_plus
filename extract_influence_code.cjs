const fs = require('fs');
const bundle = fs.readFileSync('/tmp/remote_bundle.js', 'utf8');

// Let's inspect from index 1631000 to 1700000 to see all the influence components and helper functions
console.log("Chunk 1631000 to 1645000:");
console.log(bundle.slice(1631000, 1640000));
