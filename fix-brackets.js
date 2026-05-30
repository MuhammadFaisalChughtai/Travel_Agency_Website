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

walkDir(path.join(__dirname, 'src', 'components'), (filePath) => {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix invalid tailwind classes missing brackets
    content = content.replace(/(bg|text|border|ring|from|to)-#([0-9a-fA-F]{6})/g, '$1-[#$2]');
    
    // Also, handle cases with opacity, e.g., bg-#fff3e40/20 -> wait, fff3e40? Let's use generic match
    content = content.replace(/(bg|text|border|ring|from|to)-#([0-9a-fA-F]+)(\/[0-9]+)?/g, '$1-[#$2]$3');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed brackets in ${filePath}`);
    }
  }
});
