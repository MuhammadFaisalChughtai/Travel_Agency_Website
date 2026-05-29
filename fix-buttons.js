const fs = require('fs');
const path = require('path');

const forms = [
  'src/components/roadtoumrah/umrah/UmrahBookingForm.tsx',
  'src/components/roadtoumrah/flights/FlightBookingForm.tsx', // Actually it's in src/components/flights/FlightBookingForm.tsx? Wait, is it?
  'src/components/roadtoumrah/holiday/HolidaysBookingForm.tsx',
  'src/components/roadtoumrah/transport/TransportBookingForm.tsx',
  'src/components/roadtoumrah/visa/VisaBookingForm.tsx'
];

// Let's just find all forms in src/components/roadtoumrah
function fixButtons(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) fixButtons(full);
    else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      let content = fs.readFileSync(full, 'utf8');
      let original = content;
      
      // Fix duplicate useState in UmrahBookingForm
      content = content.replace(/import { useState } from "react";\nimport { useState } from "react";/g, 'import { useState } from "react";');
      
      // Change <Button to <button and </Button> to </button> where we have bg-[#064e3b]
      if (content.includes('<Button') && content.includes('bg-[#064e3b]')) {
        content = content.replace(/<Button\n/g, '<button\n');
        content = content.replace(/<Button /g, '<button ');
        content = content.replace(/<\/Button>/g, '</button>');
        
        // Remove import { Button } if it exists and <Button is no longer used
        if (!content.includes('<Button')) {
          content = content.replace(/import { Button } from "@\/components\/ui\/Button";\n/g, '');
        }
        
        // Add the correct hover styles
        content = content.replace(/bg-\[#064e3b\] hover:bg-\[#064e3b\] text-white/g, 'bg-[#064e3b] hover:bg-[#d4af37] text-white hover:text-[#064e3b]');
      }
      
      if (original !== content) {
        fs.writeFileSync(full, content, 'utf8');
        console.log(`Updated buttons in ${full}`);
      }
    }
  }
}

fixButtons(path.join(__dirname, 'src/components/roadtoumrah'));
console.log('Button fix completed.');
