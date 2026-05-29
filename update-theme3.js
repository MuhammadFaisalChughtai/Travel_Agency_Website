const fs = require('fs');
const path = require('path');

const dirsToProcess = [
  path.join(__dirname, 'src/app/road-to-umrah'),
  path.join(__dirname, 'src/components/roadtoumrah')
];

// Color Mapping
const colorMap = {
  '#0d47a1': '#522258',
  '0d47a1': '522258',
  '#e91e63': '#c63c51',
  'e91e63': 'c63c51',
  '#453d25': '#8c3061',
  '453d25': '8c3061',
  '#607d8b': '#d95f59',
  '607d8b': 'd95f59',
  
  // Also mapping lowercase to lowercase just in case
  '#0d47a1': '#522258',
  '0d47a1': '522258',
  '#e91e63': '#c63c51',
  'e91e63': 'c63c51',
  '#453d25': '#8c3061',
  '453d25': '8c3061',
  '#607d8b': '#d95f59',
  '607d8b': 'd95f59'
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
