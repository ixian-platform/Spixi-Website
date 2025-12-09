# Image Optimization Scripts

This folder contains scripts to optimize raster images and SVGs used by the site. The scripts are non-destructive: they write outputs into `assets/images/optimized/` while leaving originals in place.

Prerequisites
- Node.js (LTS) installed locally
- From the repo root run:

```bash
npm install sharp svgo
```

Usage

1. Generate AVIF/WebP/JPEG responsive variants for selected raster images:

```bash
node scripts/optimize-images.js
```

- Outputs: `assets/images/optimized/<name>-<width>.(avif|webp|jpg)`
- Edit `scripts/optimize-images.js` to change `imagesToProcess` or resize `sizes`.

2. Optimize SVGs (lossless) into `assets/images/optimized/svg/`:

```bash
node scripts/optimize-svgs.js
```

Tips
- After generating optimized variants, update HTML to use `<picture>` + `srcset` to serve AVIF/WebP with a JPEG fallback.
- Consider using a CDN (Cloudflare, Netlify, Bunny) for automatic format negotiation and on-the-fly transforms.
- When happy, you can remove large originals or replace references with optimized files. Keep backups or commit changes before removing originals.
