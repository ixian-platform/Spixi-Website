/*
 * scripts/optimize-svgs.js
 * Losslessly optimize SVG files using SVGO programmatically.
 *
 * Usage:
 *   1. Install SVGO: `npm install svgo`
 *   2. Run: `node scripts/optimize-svgs.js`
 *
 * Note: this script overwrites optimized SVGs into `assets/images/optimized/svg/` to keep originals intact.
 */

const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');

const projectRoot = path.resolve(__dirname, '..');
const imagesDir = path.join(projectRoot, 'assets', 'images');
const outDir = path.join(imagesDir, 'optimized', 'svg');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const svgs = fs.readdirSync(imagesDir).filter(f => f.toLowerCase().endsWith('.svg'));

for (const file of svgs) {
  const inputPath = path.join(imagesDir, file);
  const outPath = path.join(outDir, file);
  try {
    const source = fs.readFileSync(inputPath, 'utf8');
    const result = optimize(source, { path: inputPath, multipass: true });
    fs.writeFileSync(outPath, result.data, 'utf8');
    console.log('Optimized', file, '->', outPath);
  } catch (err) {
    console.warn('Failed optimizing', file, err.message);
  }
}

console.log('SVG optimization complete.');
