const fs = require('fs');
const path = require('path');

const dirsToProcess = [
  path.join(__dirname, 'src/app/road-to-umrah'),
  path.join(__dirname, 'src/components/roadtoumrah')
];

// Color Mapping
const colorMap = {
  '#454E63': '#0d47a1',
  '454E63': '0d47a1',
  '#009F75': '#e91e63',
  '009F75': 'e91e63',
  '#DFDE7D': '#453d25',
  'DFDE7D': '453d25',
  '#63B76C': '#607d8b',
  '63B76C': '607d8b',
  
  // Also mapping lowercase to lowercase just in case
  '#454e63': '#0d47a1',
  '454e63': '0d47a1',
  '#009f75': '#e91e63',
  '009f75': 'e91e63',
  '#dfde7d': '#453d25',
  'dfde7d': '453d25',
  '#63b76c': '#607d8b',
  '63b76c': '607d8b'
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
