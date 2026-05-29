const fs = require('fs');
const path = require('path');

const dirsToProcess = [
  path.join(__dirname, 'src/app/road-to-umrah'),
  path.join(__dirname, 'src/components/roadtoumrah')
];

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
      
      // Text replacement
      content = content.replace(/Terrific Travel Ltd/g, 'Road To Umrah');
      content = content.replace(/Terrific Travel/g, 'Road To Umrah');
      content = content.replace(/terrifictravel\.co\.uk/g, 'roadtoumrah.co.uk');
      content = content.replace(/terrifictravel/g, 'roadtoumrah');
      
      // There's a case of inquires@terrifictravel.co.uk becoming inquires@roadtoumrah.co.uk
      // There's a case of Terrific Travel Ltd becoming Road To Umrah Ltd (but I replaced Terrific Travel Ltd -> Road To Umrah so it won't be Road To Umrah Ltd)
      
      // Color replacements for muddy brown / unreadable buttons
      content = content.replace(/text-\[#382626\]/g, 'text-[#064e3b]');
      content = content.replace(/bg-\[#382626\]/g, 'bg-[#064e3b]');
      content = content.replace(/hover:bg-\[#382626\]/g, 'hover:bg-[#d4af37]');
      content = content.replace(/text-\[#6b4c4a\]/g, 'text-[#064e3b]');
      content = content.replace(/bg-\[#6b4c4a\]/g, 'bg-[#064e3b]');
      
      if (original !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated text in: ${fullPath}`);
      }
    }
  }
}

dirsToProcess.forEach(processDirectory);
console.log("Text and color replacement complete!");
