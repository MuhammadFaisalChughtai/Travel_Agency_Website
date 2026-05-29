const fs = require('fs');

const filePath = 'src/app/api/enquiry/route.ts';
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace colors
  content = content.replace(/#6b4f4f/gi, '#064e3b'); // old brown -> emerald
  content = content.replace(/#eed6c4/gi, '#d4af37'); // beige -> gold
  content = content.replace(/#fff8f0/gi, '#f8fafc'); // peach bg -> slate-50

  // Replace Brand Name
  content = content.replace(/Terrific Travel Ltd/g, 'Road To Umrah');
  content = content.replace(/Terrific Travel/g, 'Road To Umrah');
  content = content.replace(/terrifictravel.co.uk/g, 'roadtoumrah.co.uk');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
} else {
  console.log('File not found');
}
