const fs = require('fs');
const path = require('path');

const dirsToProcess = [
  path.join(__dirname, 'src/app/road-to-umrah'),
  path.join(__dirname, 'src/components/roadtoumrah')
];

// Color Mapping
const colorMap = {
  // Primary Dark -> Light Blue
  '#1a1a1d': '#89c4e1',
  '1a1a1d': '89c4e1',
  
  // Primary Button -> Light Blue
  '#a64d79': '#89c4e1',
  'a64d79': '89c4e1',
  
  // Secondary Dark -> Beige
  '#3b1c32': '#f5edce',
  '3b1c32': 'f5edce',
  
  // Secondary Accent -> Beige
  '#6a1e55': '#f5edce',
  '6a1e55': 'f5edce',
  
  // Also mapping uppercase to lowercase just in case
  '#1A1A1D': '#89c4e1',
  '1A1A1D': '89c4e1',
  '#A64D79': '#89c4e1',
  'A64D79': '89c4e1',
  '#3B1C32': '#f5edce',
  '3B1C32': 'f5edce',
  '#6A1E55': '#f5edce',
  '6A1E55': 'f5edce'
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
