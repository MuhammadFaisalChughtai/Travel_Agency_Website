const fs = require('fs');
const path = require('path');

const dirsToProcess = [
  path.join(__dirname, 'src/app/road-to-umrah'),
  path.join(__dirname, 'src/components/roadtoumrah')
];

// Color Mapping
const colorMap = {
  // Primary Dark
  '#522258': '#1a1a1d',
  '522258': '1a1a1d',
  
  // Primary Button
  '#c63c51': '#a64d79',
  'c63c51': 'a64d79',
  
  // Secondary Dark
  '#8c3061': '#3b1c32',
  '8c3061': '3b1c32',
  
  // Secondary Accent
  '#d95f59': '#6a1e55',
  'd95f59': '6a1e55',
  
  // Also mapping lowercase to lowercase just in case
  '#522258': '#1a1a1d',
  '522258': '1a1a1d',
  '#c63c51': '#a64d79',
  'c63c51': 'a64d79',
  '#8c3061': '#3b1c32',
  '8c3061': '3b1c32',
  '#d95f59': '#6a1e55',
  'd95f59': '6a1e55'
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
        const regex = new RegExp(oldColor, 'g');
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
