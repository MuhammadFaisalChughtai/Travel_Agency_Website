const { Jimp, intToRGBA } = require('jimp');

async function removeBackground() {
  const image = await Jimp.read('public/roadtoumrah-logo.png');
  const width = image.bitmap.width;
  const height = image.bitmap.height;

  // Assume the top-left pixel is the background color
  const bgColor = intToRGBA(image.getPixelColor(0, 0));
  
  const threshold = 35; // distance in RGB space

  image.scan(0, 0, width, height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // Calculate distance from background color
    const dist = Math.abs(r - bgColor.r) + Math.abs(g - bgColor.g) + Math.abs(b - bgColor.b);
    
    if (dist < threshold) {
      // Set to fully transparent
      this.bitmap.data[idx + 3] = 0;
    } else if (dist < threshold + 35) {
      // Partial transparency for anti-aliasing edge softening
      const alpha = ((dist - threshold) / 35) * 255;
      this.bitmap.data[idx + 3] = alpha;
    }
  });

  await image.write('public/roadtoumrah-logo-transparent.png');
  console.log('Successfully created transparent logo');
}

removeBackground().catch(console.error);
