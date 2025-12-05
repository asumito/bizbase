// generate-manifest.js
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const outputFile = path.join(assetsDir, 'manifest.json');

const files = fs.readdirSync(assetsDir)
  .filter(f => f.toLowerCase().endsWith('.pdf'))
  .sort((a, b) => a.localeCompare(b));

fs.writeFileSync(outputFile, JSON.stringify(files, null, 2));
console.log(`manifest.json created with ${files.length} PDFs`);
