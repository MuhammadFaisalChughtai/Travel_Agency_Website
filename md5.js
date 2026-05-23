const crypto = require('crypto');
const files = [
  'Emirates_logo.svg',
  'Saudia_logo.svg',
  'Etihad-airways-logo.svg',
  'Turkish_Airlines_logo.svg',
  'Oman_Air_Logo.svg',
  'Qatar_Airways_Logo.svg',
  'British_Airways_Logo.svg'
];

files.forEach(f => {
  const hash = crypto.createHash('md5').update(f).digest('hex');
  const path = `${hash[0]}/${hash.substring(0, 2)}/${f}`;
  console.log(`${f}: https://upload.wikimedia.org/wikipedia/commons/${path}`);
});
