const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'api', 'enquiry', 'route.ts');
let content = fs.readFileSync(filePath, 'utf8');

// The write_to_file tool literally wrote \` instead of just a backtick
content = content.replace(/\\`/g, '`');
// It also literally wrote \${ instead of ${
content = content.replace(/\\\${/g, '${');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed route.ts');
