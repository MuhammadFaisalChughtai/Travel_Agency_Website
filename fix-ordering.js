const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  "src/app/actions/flights.ts",
  "src/app/api/flights/route.ts",
  "src/app/road-to-umrah/hajj/page.tsx",
  "src/app/road-to-umrah/page.tsx",
  "src/app/road-to-umrah/umrah/page.tsx",
  "src/app/terrific-travel/flights/page.tsx",
  "src/app/terrific-travel/hajj/page.tsx",
  "src/app/terrific-travel/holiday/page.tsx",
  "src/app/terrific-travel/page.tsx",
  "src/app/terrific-travel/umrah/page.tsx"
];

for (const relPath of filesToUpdate) {
  const filePath = path.join(__dirname, relPath);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace all occurrences
    content = content.replace(/orderBy:\s*\{\s*price:\s*"asc"\s*\}/g, 'orderBy: { createdAt: "desc" }');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${relPath}`);
  } else {
    console.log(`File not found: ${relPath}`);
  }
}
