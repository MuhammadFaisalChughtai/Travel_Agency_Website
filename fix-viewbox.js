const fs = require('fs');
const svgPathBbox = require('svg-path-bounding-box');

let svg = fs.readFileSync('public/roadtoumrah.svg', 'utf8');

const regex = /<path\s+d="([^"]+)"[^>]*transform="translate\(([^,]+),([^)]+)\)"/g;
let match;

let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;

while ((match = regex.exec(svg)) !== null) {
  const d = match[1];
  const tx = parseFloat(match[2]);
  const ty = parseFloat(match[3]);
  
  const bbox = svgPathBbox(d);
  
  // bbox has minX, minY, maxX, maxY
  const actualMinX = bbox.minX + tx;
  const actualMinY = bbox.minY + ty;
  const actualMaxX = bbox.maxX + tx;
  const actualMaxY = bbox.maxY + ty;
  
  if (actualMinX < minX) minX = actualMinX;
  if (actualMinY < minY) minY = actualMinY;
  if (actualMaxX > maxX) maxX = actualMaxX;
  if (actualMaxY > maxY) maxY = actualMaxY;
}

console.log(`Computed BBox: minX=${minX}, minY=${minY}, maxX=${maxX}, maxY=${maxY}`);

const width = maxX - minX;
const height = maxY - minY;

console.log(`New ViewBox: ${minX} ${minY} ${width} ${height}`);

// Replace the old viewBox
svg = svg.replace(/viewBox="[^"]+"/, `viewBox="${minX} ${minY} ${width} ${height}"`);

fs.writeFileSync('public/roadtoumrah.svg', svg, 'utf8');
console.log('Fixed roadtoumrah.svg viewBox successfully!');
