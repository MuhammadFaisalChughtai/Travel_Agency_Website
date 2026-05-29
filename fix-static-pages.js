const fs = require('fs');
const path = require('path');

const files = [
  'src/app/road-to-umrah/about/page.tsx',
  'src/app/road-to-umrah/contact/page.tsx',
  'src/app/road-to-umrah/privacy-policy/page.tsx',
  'src/app/road-to-umrah/terms-and-conditions/page.tsx'
];

for (const relativePath of files) {
  const file = path.join(__dirname, relativePath);
  if (!fs.existsSync(file)) {
    console.log(`Skipping ${file}, not found.`);
    continue;
  }
  
  let content = fs.readFileSync(file, 'utf8');

  // Backgrounds
  content = content.replace(/bg-\[#f5f0eb\]/g, 'bg-slate-50');
  content = content.replace(/bg-\[#fff8f0\]/g, 'bg-white');

  // Headings color: from very dark brown to emerald green
  content = content.replace(/text-\[#2a1a1a\]/g, 'text-[#064e3b]');

  // Border and shadows
  content = content.replace(/border-\[#d4af37\]\/60/g, 'border-[#d4af37]/30');
  // Avoid duplicating shadow-lg if it already has shadow-xl
  content = content.replace(/shadow-xl shadow-\[#064e3b\]\/5/g, 'shadow-2xl shadow-[#064e3b]/10');
  
  // Body text color: from emerald green to slate-600 for better readability
  content = content.replace(/text-\[#064e3b\] font-medium/g, 'text-slate-600 font-medium');
  content = content.replace(/text-\[#064e3b\] leading-relaxed/g, 'text-slate-600 leading-relaxed');

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed', file);
}
