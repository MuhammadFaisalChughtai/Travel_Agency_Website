const fs = require('fs');

const filesToFix = [
  'src/components/roadtoumrah/Navbar.tsx',
  'src/components/roadtoumrah/umrah/FaqAccordion.tsx',
  'src/components/roadtoumrah/umrah/PackageCard.tsx',
  'src/components/roadtoumrah/umrah/UmrahBlogSection.tsx'
];

for (const file of filesToFix) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Restore Button import if it's missing
  if (!content.includes('import { Button }')) {
    content = content.replace(/import Link from "next\/link";/, 'import Link from "next/link";\nimport { Button } from "@/components/ui/Button";');
  }

  // Restore <button asChild
  content = content.replace(/<button(\s*(?:variant=".*?")?\s*asChild[^>]*)>/g, '<Button$1>');
  
  // Since we don't know exactly which </button> to replace with </Button>, 
  // we'll look for blocks that have <Button ...> ... </button>
  let lines = content.split('\n');
  let inButton = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<Button') && !lines[i].includes('</Button>')) {
      inButton = true;
    }
    if (inButton && lines[i].includes('</button>')) {
      lines[i] = lines[i].replace('</button>', '</Button>');
      inButton = false;
    }
  }
  
  // FaqAccordion and UmrahBlogSection might not have used asChild. Let's check them manually if this fails.
  
  fs.writeFileSync(file, lines.join('\n'), 'utf8');
  console.log('Fixed', file);
}
