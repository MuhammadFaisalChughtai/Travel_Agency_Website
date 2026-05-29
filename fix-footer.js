const fs = require('fs');
const path = require('path');

// Fix Footer.tsx
const footerPath = path.join(__dirname, 'src/components/roadtoumrah/Footer.tsx');
let f = fs.readFileSync(footerPath, 'utf8');

// 1. Headers
f = f.replace(/text-\[#064e3b\] font-heading/g, 'text-[#d4af37] font-heading');

// 2. Decorative underlines
f = f.replace(/<span className="h-\[1\.5px\] w-8 bg-\[#064e3b\]"><\/span>/g, '<span className="h-[1.5px] w-8 bg-[#d4af37]"></span>');
f = f.replace(/<span className="w-1\.5 h-1\.5 rounded-full bg-\[#064e3b\]"><\/span>/g, '<span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>');
f = f.replace(/<span className="h-\[1\.5px\] w-4 bg-\[#064e3b\]\/30"><\/span>/g, '<span className="h-[1.5px] w-4 bg-[#d4af37]/30"></span>');

// 3. Link hover colors and Chevrons
f = f.replace(/hover:text-\[#064e3b\] flex/g, 'hover:text-[#d4af37] flex');
f = f.replace(/text-\[#064e3b\] group-hover:translate-x-0\.5/g, 'text-[#d4af37] group-hover:translate-x-0.5');
f = f.replace(/text-\[#064e3b\] mt-0\.5 group-hover:translate-x-0\.5/g, 'text-[#d4af37] mt-0.5 group-hover:translate-x-0.5');

// 4. Contact Us Icons and borders
f = f.replace(/MapPin className="w-4 h-4 text-\[#064e3b\]/g, 'MapPin className="w-4 h-4 text-[#d4af37]');
f = f.replace(/Mail className="w-4 h-4 text-\[#064e3b\]/g, 'Mail className="w-4 h-4 text-[#d4af37]');
f = f.replace(/Phone className="w-4 h-4 text-\[#064e3b\]/g, 'Phone className="w-4 h-4 text-[#d4af37]');
f = f.replace(/border-t border-\[#064e3b\]\/15/g, 'border-t border-[#d4af37]/30');

fs.writeFileSync(footerPath, f, 'utf8');

// Fix TrustpilotWidget.tsx
const tpPath = path.join(__dirname, 'src/components/roadtoumrah/TrustpilotWidget.tsx');
let tp = fs.readFileSync(tpPath, 'utf8');
tp = tp.replace(/text-\[#483434\]\/70/g, 'text-slate-300');
fs.writeFileSync(tpPath, tp, 'utf8');

console.log("Footer fixed!");
