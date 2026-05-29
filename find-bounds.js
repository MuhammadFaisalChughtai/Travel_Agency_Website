const fs = require('fs');
const svg = fs.readFileSync('public/roadtoumrah.svg', 'utf8');

let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;

const regex = /transform="translate\(([^,]+),([^)]+)\)"/g;
let match;

while ((match = regex.exec(svg)) !== null) {
  const x = parseFloat(match[1]);
  const y = parseFloat(match[2]);
  if (x < minX) minX = x;
  if (y < minY) minY = y;
  if (x > maxX) maxX = x;
  if (y > maxY) maxY = y;
}

console.log(`Min X: ${minX}, Min Y: ${minY}, Max X: ${maxX}, Max Y: ${maxY}`);
