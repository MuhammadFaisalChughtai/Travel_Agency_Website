const fs = require('fs');

const file = 'public/Logo.svg';
let content = fs.readFileSync(file, 'utf8');

const images = content.match(/<image[^>]*>/g) || [];
images.forEach((img, i) => {
  const width = img.match(/width="([^"]*)"/)?.[1] || '';
  const height = img.match(/height="([^"]*)"/)?.[1] || '';
  console.log(`Image ${i}: width=${width}, height=${height}`);
});

// A background image typically has a large width and height, e.g., covering the whole viewport.
// If the first image has a large width/height matching the viewBox, we remove it.
const viewBox = content.match(/viewBox="([^"]*)"/)?.[1];
console.log('viewBox:', viewBox);

// Let's just remove the first image if it's the background. 
// Usually, the background is the very first <image> tag.
if (images.length > 0) {
  content = content.replace(images[0], '');
  fs.writeFileSync('public/Logo_transparent.svg', content, 'utf8');
  console.log('Saved public/Logo_transparent.svg without the first image');
}
