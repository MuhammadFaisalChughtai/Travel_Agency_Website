const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

let count = 0;

walkDir(path.join(__dirname, 'src', 'components'), (filePath) => {
  if (filePath.endsWith('Form.tsx') || filePath.endsWith('Sidebar.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // text and backgrounds
    content = content.replace(/#6b4f4f/gi, '#064e3b'); // old brown -> emerald
    content = content.replace(/#382626/gi, '#043427'); // old dark brown -> darker emerald
    
    // backgrounds/borders
    content = content.replace(/#fff3e4/gi, 'emerald-50'); // peach -> emerald-50 (tailwind) OR '#ecfdf5'
    content = content.replace(/#eed6c4/gi, '#d4af37'); // beige -> gold
    content = content.replace(/#f5f0eb/gi, 'slate-50'); // bg
    
    // Also change specific Tailwind classes if they used literal colors:
    content = content.replace(/bg-emerald-50\/40/g, 'bg-emerald-50/40'); // just to be safe
    content = content.replace(/text-\[#043427\]/g, 'text-[#064e3b]'); // fix if 382626 was used for text but we want 064e3b. Actually, dark brown for hover is good, but for text maybe 064e3b is better. Let's fix that below:

    content = content.replace(/text-\[#043427\]/g, 'text-[#064e3b]');
    
    // Fix `bg-emerald-50` being substituted inside a hex like `#emerald-50`
    content = content.replace(/#emerald-50/g, 'emerald-50'); // If there was a raw replacement

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
      count++;
    }
  }
});

console.log(`Total forms updated: ${count}`);
