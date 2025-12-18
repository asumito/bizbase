// generate-manifest.js - Fixed recursive version for subfolders
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const outputFile = path.join(assetsDir, 'manifest.json');

function getAllPdfs(currentDir, basePath = '') {
  let pdfs = [];

  if (!fs.existsSync(currentDir)) {
    console.error('assets folder not found!');
    return pdfs;
  }

  const items = fs.readdirSync(currentDir);

  for (const item of items) {
    const fullPath = path.join(currentDir, item);
    const relativePath = basePath ? path.join(basePath, item).replace(/\\/g, '/') : item;

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recurse into subfolder
      pdfs = pdfs.concat(getAllPdfs(fullPath, relativePath));
    } else if (stat.isFile() && item.toLowerCase().endsWith('.pdf')) {
      pdfs.push(relativePath);
      console.log(`Found: ${relativePath}`); // Helpful debug log
    }
  }

  return pdfs;
}

const files = getAllPdfs(assetsDir);
files.sort((a, b) => a.localeCompare(b));

fs.writeFileSync(outputFile, JSON.stringify(files, null, 2));
console.log(`\nmanifest.json created with ${files.length} PDFs`);
