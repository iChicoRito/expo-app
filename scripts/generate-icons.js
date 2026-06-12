const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SVG_PATH        = path.join(__dirname, '..', 'assets', 'svg', 'icon.svg');
const SPLASH_SVG_PATH = path.join(__dirname, '..', 'assets', 'svg', 'Spillr.svg');
const APP_ICON_PATH   = path.join(__dirname, '..', 'assets', 'images', 'app-icon.png');
const OUT_DIR         = path.join(__dirname, '..', 'assets', 'images');
const SIZE            = 1024;

function atSize(svg, size) {
  return svg
    .replace(/width="500"/, `width="${size}"`)
    .replace(/height="500"/, `height="${size}"`);
}

function stripBackground(svg) {
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
  // Render wordmark at 840px wide, then extend with 92px whitespace each side → 1024 total.
  // Prevents the letters from touching the canvas edge and appearing clipped on device.
  const resized = await sharp(svgBuffer).resize(840, null).png().toBuffer();
  const { height } = await sharp(resized).metadata();
  await sharp(resized)
    .extend({ top: 0, bottom: 0, left: 92, right: 92,
              background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(OUT_DIR, filename));
  console.log(`  ✓ ${filename}`);
}

async function generateAdaptiveIconForeground(filename) {
  // Android adaptive icon safe zone: 72/108 ≈ 66.7% of canvas.
  // Scale mascot to 65% so it stays fully within any mask shape (circle, squircle, etc.).
  const CONTENT = Math.round(SIZE * 0.65); // 666px
  const PAD     = Math.round((SIZE - CONTENT) / 2); // 179px each side
  await sharp(APP_ICON_PATH)
    .resize(CONTENT, CONTENT, { fit: 'contain',
                                background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD,
              background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(OUT_DIR, filename));
  console.log(`  ✓ ${filename}`);
}

async function main() {
  const src = fs.readFileSync(SVG_PATH, 'utf8');

  console.log('Generating icon PNGs …');

  // 1. Full icon (legacy / non-adaptive contexts)
  const full = atSize(src, SIZE);
  await writePng(full, 'icon.png');

  // 2. Splash — Spillr wordmark with padding so letters aren't edge-to-edge
  const splashSrc = fs.readFileSync(SPLASH_SVG_PATH);
  await writeSplashPng(splashSrc, 'splash-icon.png');

  // 3. Adaptive icon foreground — mascot scaled to safe zone, centered on white
  await generateAdaptiveIconForeground('android-icon-foreground.png');

  // 4. Adaptive icon background — solid white
  await sharp({
    create: { width: SIZE, height: SIZE, channels: 4,
               background: { r: 255, g: 255, b: 255, alpha: 1 } }
  }).png().toFile(path.join(OUT_DIR, 'android-icon-background.png'));
  console.log('  ✓ android-icon-background.png');

  console.log('Done.');
}

main().catch((err) => { console.error(err); process.exit(1); });
