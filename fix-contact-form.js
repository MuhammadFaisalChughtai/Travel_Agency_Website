const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "src/components/contact/ContactForm.tsx");
let content = fs.readFileSync(file, "utf8");

content = content.replace(/bg-\[#fff8f0\]/g, "bg-white");
content = content.replace(/shadow-\[#483434\]\/5/g, "shadow-[#064e3b]/10");
content = content.replace(/border-\[#eed6c4\]\/60/g, "border-[#d4af37]/30");
content = content.replace(/text-\[#2a1a1a\]/g, "text-[#064e3b]");
content = content.replace(/ring-\[#eed6c4\]\/80/g, "ring-[#d4af37]/40");
content = content.replace(
  /placeholder:text-\[#6b4f4f\]\/50/g,
  "placeholder:text-slate-400",
);
content = content.replace(/focus:ring-\[#6b4f4f\]/g, "focus:ring-[#064e3b]");
content = content.replace(/bg-\[#f5f0eb\]\/50/g, "bg-slate-50");

// Fix the Button to match other forms
content = content.replace(
  /import \{ Button \} from "@\/components\/ui\/Button";\n/,
  "",
);
content = content.replace(/<Button/g, "<button");
content = content.replace(/<\/Button>/g, "</button>");
content = content.replace(
  /className="w-full h-12 text-md flex justify-center items-center gap-2"/g,
  'className="w-full h-12 text-md flex justify-center items-center gap-2 bg-[#064e3b] hover:bg-[#d4af37] text-white hover:text-[#064e3b] rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-bold tracking-widest uppercase"',
);

fs.writeFileSync(file, content, "utf8");
console.log("Fixed ContactForm.tsx");
