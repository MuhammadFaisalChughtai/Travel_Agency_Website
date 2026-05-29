const fs = require('fs');
const path = require('path');

// 1. Copy Hero
const srcHero = path.join(__dirname, 'src/components/ui/Hero.tsx');
const destHero = path.join(__dirname, 'src/components/roadtoumrah/Hero.tsx');
let heroContent = fs.readFileSync(srcHero, 'utf8');

// Replace colors in Hero
heroContent = heroContent.replace(/bg-\[#382626\]/g, 'bg-[#064e3b]');
heroContent = heroContent.replace(/bg-\[#2a1a1a\]/g, 'bg-[#064e3b]');
heroContent = heroContent.replace(/border-\[#eed6c4\]/g, 'border-[#d4af37]');
heroContent = heroContent.replace(/bg-\[#eed6c4\]/g, 'bg-[#d4af37]');
heroContent = heroContent.replace(/text-\[#eed6c4\]/g, 'text-[#d4af37]');
heroContent = heroContent.replace(/shadow-\[0_2px_10px_rgba\(238,214,196,0\\\.2\)\]/g, 'shadow-[0_2px_10px_rgba(212,175,55,0.2)]');

fs.writeFileSync(destHero, heroContent, 'utf8');
console.log("Hero component for RoadToUmrah created successfully.");

// 2. Replace imports in road-to-umrah
function processDir(d) {
  if (!fs.existsSync(d)) return;
  const files = fs.readdirSync(d);
  for (const f of files) {
    const full = path.join(d, f);
    if (fs.statSync(full).isDirectory()) processDir(full);
    else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      let content = fs.readFileSync(full, 'utf8');
      if (content.includes('@/components/ui/Hero')) {
        content = content.replace(/@\/components\/ui\/Hero/g, '@/components/roadtoumrah/Hero');
        fs.writeFileSync(full, content, 'utf8');
        console.log(`Updated import in ${full}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'src/app/road-to-umrah'));
processDir(path.join(__dirname, 'src/components/roadtoumrah'));

console.log("Done!");
