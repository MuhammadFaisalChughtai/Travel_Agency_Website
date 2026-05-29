const fs = require('fs');
const path = require('path');

const dirsToProcess = [
  path.join(__dirname, 'src/app/road-to-umrah'),
  path.join(__dirname, 'src/components/roadtoumrah')
];

// Color Mapping
const colorMap = {
  // Light Blue -> Deep Emerald Green
  '#89c4e1': '#064e3b',
  '89c4e1': '064e3b',
  
  // Beige -> Rich Gold
  '#f5edce': '#d4af37',
  'f5edce': 'd4af37',
  
  // Also mapping uppercase to lowercase just in case
  '#89C4E1': '#064e3b',
  '89C4E1': '064e3b',
  '#F5EDCE': '#d4af37',
  'F5EDCE': 'd4af37'
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
      
      for (const [oldColor, newColor] of Object.entries(colorMap)) {
        // Use a global regex
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
