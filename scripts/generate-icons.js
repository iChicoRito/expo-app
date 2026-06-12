const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SVG_PATH        = path.join(__dirname, '..', 'assets', 'svg', 'icon.svg');
const SPLASH_SVG_PATH = path.join(__dirname, '..', 'assets', 'svg', 'Spillr.svg');
const OUT_DIR         = path.join(__dirname, '..', 'assets', 'images');
const SIZE            = 1024;

function atSize(svg, size) {
  return svg
    .replace(/width="500"/, `width="${size}"`)
    .replace(/height="500"/, `height="${size}"`);
}

function stripBackground(svg) {
  // Remove the white background rect that sits inside <g clip-path="...">
  // The identical rect inside <defs><clipPath> must stay (it defines the clip shape).
  const needle = `<g clip-path="url(#clip0_754_2146)">\n<rect width="500" height="500" rx="100" fill="white"/>`;
  if (!svg.includes(needle)) throw new Error('stripBackground: background rect not found — SVG may have changed');
  return svg.replace(needle, `<g clip-path="url(#clip0_754_2146)">`);
}

async function writePng(svgString, filename) {
  const buf = Buffer.from(svgString, 'utf8');
  await sharp(buf).resize(SIZE, SIZE).png().toFile(path.join(OUT_DIR, filename));
  console.log(`  ✓ ${filename}`);
}

async function writeSplashPng(svgBuffer, filename) {
  // Spillr wordmark is 47×22 — resize to 1024px wide, auto height (maintains aspect ratio)
  await sharp(svgBuffer).resize(1024, null).png().toFile(path.join(OUT_DIR, filename));
  console.log(`  ✓ ${filename}`);
}

async function main() {
  const src = fs.readFileSync(SVG_PATH, 'utf8');

  console.log('Generating icon PNGs from assets/svg/icon.svg …');

  // 1. Full icon — used as app icon
  const full = atSize(src, SIZE);
  await writePng(full, 'icon.png');

  // 2. Splash — Spillr wordmark rasterized at 1024px wide
  const splashSrc = fs.readFileSync(SPLASH_SVG_PATH);
  await writeSplashPng(splashSrc, 'splash-icon.png');

  // 2. Foreground (transparent background) — adaptive icon foreground
  const fg = atSize(stripBackground(src), SIZE);
  await writePng(fg, 'android-icon-foreground.png');

  // 3. Background — solid white 1024×1024
  await sharp({
    create: { width: SIZE, height: SIZE, channels: 4,
               background: { r: 255, g: 255, b: 255, alpha: 1 } }
  }).png().toFile(path.join(OUT_DIR, 'android-icon-background.png'));
  console.log('  ✓ android-icon-background.png');

  // 4. Monochrome — foreground paths all filled white (used for themed icons on Android 13+)
  const mono = atSize(
    stripBackground(src)
      .replace(/fill="#14B8A6"/g, 'fill="white"')
      .replace(/fill="#115E59"/g, 'fill="white"')
      .replace(/stroke="#115E59"/g, 'stroke="white"'),
    SIZE
  );
  await writePng(mono, 'android-icon-monochrome.png');

  console.log('Done.');
}

main().catch((err) => { console.error(err); process.exit(1); });
