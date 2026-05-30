const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    // Only copy if it doesn't already exist or if we want to overwrite
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
  }
}

const componentsToCopy = ['hajj', 'flights', 'holiday', 'book', 'contact', 'ui'];
const srcBase = path.join(__dirname, 'src', 'components');
const destBase = path.join(__dirname, 'src', 'components', 'roadtoumrah');

componentsToCopy.forEach(comp => {
  copyRecursiveSync(path.join(srcBase, comp), path.join(destBase, comp));
  console.log(`Copied ${comp} to roadtoumrah/${comp}`);
});

// Also replace the old theme colors with the new theme colors in the newly copied files!
function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
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
componentsToCopy.forEach(comp => {
  walkDir(path.join(destBase, comp), (filePath) => {
    if (filePath.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;

      // Reverse of reverse-align: Terrific Travel -> Road to Umrah
      content = content.replace(/#6b4f4f/gi, '#064e3b'); 
      content = content.replace(/#382626/gi, '#043427'); 
      
      content = content.replace(/#fff3e4/gi, 'emerald-50'); 
      content = content.replace(/#eed6c4/gi, '#d4af37'); 
      content = content.replace(/#f5f0eb/gi, 'slate-50'); 

      content = content.replace(/Terrific Travel Ltd/g, 'Road To Umrah');
      content = content.replace(/Terrific Travel/g, 'Road To Umrah');

      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Themed ${filePath}`);
        count++;
      }
    }
  });
});
console.log(`Total files themed: ${count}`);
