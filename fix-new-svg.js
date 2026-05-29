const fs = require('fs');

let svg = fs.readFileSync('public/roadtoumrah.svg', 'utf8');

// 1. Remove the beige background path
svg = svg.replace(/<path[^>]*fill="#F7F5E8"[^>]*\/>/gi, '');

// 2. Add a viewBox if not present
if (!svg.includes('viewBox=')) {
  svg = svg.replace(/<svg([^>]*)width="2816" height="1536"([^>]*)>/, '<svg$1viewBox="0 0 2816 1536" width="100%" height="100%"$2>');
}

fs.writeFileSync('public/roadtoumrah.svg', svg, 'utf8');
console.log('Fixed roadtoumrah.svg: removed background and added viewBox');
