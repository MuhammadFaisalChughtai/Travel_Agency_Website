const fs = require('fs');
const path = require('path');

const dirsToProcess = [
  path.join(__dirname, 'src/app/road-to-umrah'),
  path.join(__dirname, 'src/components/roadtoumrah')
];

// Color Mapping
// Terrific Travel -> Road to Umrah
const colorMap = {
  '#483434': '#1A472A', // Dark Brown -> Deep Emerald Green
  '#6b4f4f': '#B8860B', // Medium Brown -> Dark Goldenrod
  '#eed6c4': '#D4AF37', // Beige/Light Gold -> True Gold
  '#fff3e4': '#F9F6F0', // Cream -> Pearl White/Cream
  '483434': '1A472A',
  '6b4f4f': 'B8860B',
  'eed6c4': 'D4AF37',
  'fff3e4': 'F9F6F0',
};

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      // Replace colors case-insensitively just in case
      for (const [oldColor, newColor] of Object.entries(colorMap)) {
        const regex = new RegExp(oldColor, 'gi');
        content = content.replace(regex, newColor);
      }
      
      if (original !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated theme colors in: ${fullPath}`);
      }
    }
  }
}

dirsToProcess.forEach(processDirectory);
console.log("Theme replacement complete!");
