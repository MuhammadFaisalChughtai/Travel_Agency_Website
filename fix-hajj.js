const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/road-to-umrah/hajj/page.tsx',
  'src/components/hajj/HajjBookingForm.tsx',
  'src/components/hajj/HajjInfoSection.tsx',
  'src/components/hajj/HajjBlogSection.tsx',
  'src/components/hajj/FaqAccordion.tsx',
];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Backgrounds
    content = content.replace(/bg-\[#f5f0eb\]/g, 'bg-slate-50');
    content = content.replace(/bg-\[#fff3e4\]/g, 'bg-emerald-50');
    
    // Text colors
    content = content.replace(/text-\[#6b4f4f\]/g, 'text-[#064e3b]');
    content = content.replace(/text-\[#382626\]/g, 'text-[#064e3b]');
    
    // Background colors (buttons/labels)
    content = content.replace(/bg-\[#6b4f4f\]/g, 'bg-[#064e3b]');
    content = content.replace(/hover:bg-\[#382626\]/g, 'hover:bg-[#043427]');
    
    // Borders
    content = content.replace(/border-\[#eed6c4\]\/60/g, 'border-[#d4af37]/40');
    content = content.replace(/border-\[#eed6c4\]/g, 'border-[#d4af37]/40');
    
    // Focus rings
    content = content.replace(/focus:ring-\[#6b4f4f\]/g, 'focus:ring-[#064e3b]');
    content = content.replace(/focus:border-\[#6b4f4f\]/g, 'focus:border-[#064e3b]');

    // Special text
    content = content.replace(/Why Terrific Travel Ltd/g, 'Why Road To Umrah');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
