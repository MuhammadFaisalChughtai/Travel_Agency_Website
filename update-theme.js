const fs = require('fs');
const path = require('path');

const dirsToProcess = [
  path.join(__dirname, 'src/app/road-to-umrah'),
  path.join(__dirname, 'src/components/roadtoumrah')
];

// Color Mapping
const colorMap = {
  '#1A472A': '#454E63', // Dark Slate Blue
  '1A472A': '454E63',
  '#B8860B': '#009F75', // Teal
  'B8860B': '009F75',
  '#D4AF37': '#DFDE7D', // Pale Gold
  'D4AF37': 'DFDE7D',
  '#F9F6F0': '#F9FAFB', // Light Grayish
  'F9F6F0': 'F9FAFB'
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
      
      // Replace colors case-insensitively
      for (const [oldColor, newColor] of Object.entries(colorMap)) {
        const regex = new RegExp(oldColor, 'gi');
        content = content.replace(regex, newColor);
      }
      
      // Remove button gradients
      content = content.replace(/bg-gradient-to-[a-z]+ from-\[[^\]]+\] (via-\[[^\]]+\] )?to-\[[^\]]+\]/g, 'bg-[#009F75]');
      content = content.replace(/hover:from-\[[^\]]+\] hover:to-\[[^\]]+\]/g, 'hover:bg-[#454E63]');
      
      if (original !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated theme colors in: ${fullPath}`);
      }
    }
  }
}

dirsToProcess.forEach(processDirectory);
console.log("Theme replacement complete!");
