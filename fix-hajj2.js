const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/components/hajj/FaqAccordion.tsx',
  'src/components/hajj/HajjBlogSection.tsx',
  'src/components/hajj/HajjInfoSection.tsx',
];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace #eed6c4 with #d4af37
    content = content.replace(/#eed6c4/g, '#d4af37');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
