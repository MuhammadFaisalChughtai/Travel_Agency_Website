const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    
    // Skip roadtoumrah directory!
    if (dirPath.includes('roadtoumrah')) return;

    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

let count = 0;

walkDir(path.join(__dirname, 'src', 'components'), (filePath) => {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // text and backgrounds
    content = content.replace(/#064e3b/gi, '#6b4f4f'); 
    content = content.replace(/#043427/gi, '#382626'); 
    
    // backgrounds/borders
    content = content.replace(/emerald-50/gi, '#fff3e4'); 
    content = content.replace(/#d4af37/gi, '#eed6c4'); 
    content = content.replace(/slate-50/gi, '#f5f0eb'); 

    // Revert text in HajjInfoSection
    content = content.replace(/Road To Umrah/g, 'Terrific Travel Ltd');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Reverted ${filePath}`);
      count++;
    }
  }
});

console.log(`Total files reverted: ${count}`);
