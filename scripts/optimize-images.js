/*
 * scripts/optimize-images.js
 * Batch-generate AVIF, WebP and JPEG responsive variants for large raster images.
 * Non-destructive: writes to `assets/images/optimized/`.
 *
 * Usage:
 *   1. Install dependencies: `npm install sharp`
 *   2. Run: `node scripts/optimize-images.js`
 *
 * Notes:
 * - Adjust `imagesToProcess` and `sizes` to match your needs.
 * - AVIF output requires libvips support in your environment (sharp handles this).
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
const imagesDir = path.join(projectRoot, 'assets', 'images');
const outDir = path.join(imagesDir, 'optimized');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Top raster images discovered in audit (adjust if you want different set)
const imagesToProcess = [
  'miniapps-desktop.png',
  'chat-app.png',
  'dl-hero.png',
  'wallet.png',
  'help-center-page.png',
  'chats.png',
  'everyday.png',
  'miniapps.png'
];

// Responsive widths to generate
const sizes = [320, 480, 720, 1024, 1366, 1920];

async function processImage(filename) {
  const inputPath = path.join(imagesDir, filename);
  if (!fs.existsSync(inputPath)) {
    console.warn(`Skipping missing file: ${inputPath}`);
    return;
  }

  const name = path.parse(filename).name;
  const ext = path.parse(filename).ext.toLowerCase();

  for (const w of sizes) {
    const resizeOptions = { width: w };
    const outBase = `${name}-${w}`;

    // AVIF
    const avifPath = path.join(outDir, `${outBase}.avif`);
    try {
      await sharp(inputPath)
        .resize(resizeOptions)
        .avif({ quality: 50 })
        .toFile(avifPath);
    } catch (err) {
      console.warn(`AVIF generation failed for ${filename} @ ${w}px:`, err.message);
    }

    // WebP
    const webpPath = path.join(outDir, `${outBase}.webp`);
    try {
      await sharp(inputPath)
        .resize(resizeOptions)
        .webp({ quality: 80 })
        .toFile(webpPath);
    } catch (err) {
      console.warn(`WebP generation failed for ${filename} @ ${w}px:`, err.message);
    }

    // JPEG fallback (for broad compatibility)
    const jpgPath = path.join(outDir, `${outBase}.jpg`);
    try {
      await sharp(inputPath)
        .resize(resizeOptions)
        .jpeg({ quality: 80, progressive: true })
        .toFile(jpgPath);
    } catch (err) {
      console.warn(`JPEG generation failed for ${filename} @ ${w}px:`, err.message);
    }
  }
}

(async () => {
  console.log('Starting image optimization...');
  for (const img of imagesToProcess) {
    try {
      console.log('Processing', img);
      await processImage(img);
    } catch (err) {
      console.error('Failed processing', img, err);
    }
  }
  console.log('Image optimization complete. Outputs are in assets/images/optimized/');
})();
