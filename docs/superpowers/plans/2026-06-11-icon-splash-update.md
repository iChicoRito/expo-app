# App Icon and Splash Screen Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all native app icon and splash screen PNG assets by rasterizing `assets/svg/icon.svg`, and expose a dynamic-sized `AppIcon` component for in-app use.

**Architecture:** A one-off Node.js script (`scripts/generate-icons.js`) uses `sharp` to rasterize five PNG variants from `assets/svg/icon.svg`. The existing `app.json` icon paths are kept identical so only the file content changes. A thin `components/app-icon.tsx` wraps the SVG import (already handled by `react-native-svg-transformer`) and exposes a `size` prop for runtime dynamic sizing.

**Tech Stack:** Expo SDK 54 · React Native 0.81 · `react-native-svg` 15.12.1 · `react-native-svg-transformer` 1.5.3 · `sharp` (dev-only, for PNG generation)

---

## File Structure

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `scripts/generate-icons.js` | Rasterize `icon.svg` → 5 PNG variants |
| Overwrite | `assets/images/icon.png` | Full icon, 1024×1024 |
| Overwrite | `assets/images/android-icon-foreground.png` | Icon without white background rect, 1024×1024 |
| Overwrite | `assets/images/android-icon-background.png` | Solid white PNG, 1024×1024 |
| Overwrite | `assets/images/android-icon-monochrome.png` | All paths rendered white, 1024×1024 |
| Overwrite | `assets/images/splash-icon.png` | Same as `icon.png`, 1024×1024 |
| Modify | `app.json` | Update adaptive icon `backgroundColor` from `#E6F4FE` → `#FFFFFF` |
| Create | `components/app-icon.tsx` | Dynamic-sized icon component via `size` prop |

---

## Task 1: Install `sharp`

**Files:**
- Modify: `package.json` (devDependencies)

- [ ] **Step 1: Install sharp as a dev dependency**

```bash
npm install --save-dev sharp
```

Expected output: `added N packages` with no errors. `sharp` downloads prebuilt Windows binaries automatically.

- [ ] **Step 2: Verify installation**

```bash
node -e "require('sharp'); console.log('sharp OK')"
```

Expected: `sharp OK`

---

## Task 2: Create the icon generation script

**Files:**
- Create: `scripts/generate-icons.js`

- [ ] **Step 1: Create the script**

Create `scripts/generate-icons.js` with this exact content:

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SVG_PATH = path.join(__dirname, '..', 'assets', 'svg', 'icon.svg');
const OUT_DIR  = path.join(__dirname, '..', 'assets', 'images');
const SIZE     = 1024;

function atSize(svg, size) {
  return svg
    .replace(/width="500"/, `width="${size}"`)
    .replace(/height="500"/, `height="${size}"`);
}

function stripBackground(svg) {
  // Remove the white background rect that sits inside <g clip-path="...">
  // The identical rect inside <defs><clipPath> must stay (it defines the clip shape).
  return svg.replace(
    `<g clip-path="url(#clip0_754_2146)">\n<rect width="500" height="500" rx="100" fill="white"/>`,
    `<g clip-path="url(#clip0_754_2146)">`
  );
}

async function writePng(svgString, filename) {
  const buf = Buffer.from(svgString, 'utf8');
  await sharp(buf).resize(SIZE, SIZE).png().toFile(path.join(OUT_DIR, filename));
  console.log(`  ✓ ${filename}`);
}

async function main() {
  const src = fs.readFileSync(SVG_PATH, 'utf8');

  console.log('Generating icon PNGs from assets/svg/icon.svg …');

  // 1. Full icon — used as app icon and splash
  const full = atSize(src, SIZE);
  await writePng(full, 'icon.png');
  await writePng(full, 'splash-icon.png');

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
```

- [ ] **Step 2: Run the script**

```bash
node scripts/generate-icons.js
```

Expected output:
```
Generating icon PNGs from assets/svg/icon.svg …
  ✓ icon.png
  ✓ splash-icon.png
  ✓ android-icon-foreground.png
  ✓ android-icon-background.png
  ✓ android-icon-monochrome.png
Done.
```

- [ ] **Step 3: Verify files were written**

```bash
node -e "
const fs = require('fs'), p = require('path');
const dir = 'assets/images';
['icon.png','splash-icon.png','android-icon-foreground.png',
 'android-icon-background.png','android-icon-monochrome.png'].forEach(f => {
  const s = fs.statSync(p.join(dir,f));
  console.log(f, s.size, 'bytes');
});"
```

Expected: each file has a non-zero size (typically 100 KB – 600 KB for a 1024×1024 PNG).

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-icons.js assets/images/icon.png assets/images/splash-icon.png assets/images/android-icon-foreground.png assets/images/android-icon-background.png assets/images/android-icon-monochrome.png
git commit -m "feat(assets): rasterize icon.svg to PNG for native app icon and splash

Main changes:
- Add scripts/generate-icons.js to convert icon.svg → 5 PNG variants via sharp
- Replace icon.png and splash-icon.png with SVG-derived renders at 1024x1024
- Replace adaptive icon PNGs (foreground, background, monochrome) with SVG-derived renders"
```

---

## Task 3: Update `app.json` adaptive icon backgroundColor

**Files:**
- Modify: `app.json`

The adaptive icon `backgroundColor` is the fallback color shown before the background image loads and is used when a solid color is specified instead of an image. The SVG has a white background, so this should be `#FFFFFF`.

- [ ] **Step 1: Update backgroundColor in app.json**

In `app.json`, find the `adaptiveIcon` block:

```json
"adaptiveIcon": {
  "backgroundColor": "#E6F4FE",
  "foregroundImage": "./assets/images/android-icon-foreground.png",
  "backgroundImage": "./assets/images/android-icon-background.png",
  "monochromeImage": "./assets/images/android-icon-monochrome.png"
},
```

Change it to:

```json
"adaptiveIcon": {
  "backgroundColor": "#FFFFFF",
  "foregroundImage": "./assets/images/android-icon-foreground.png",
  "backgroundImage": "./assets/images/android-icon-background.png",
  "monochromeImage": "./assets/images/android-icon-monochrome.png"
},
```

- [ ] **Step 2: Commit**

```bash
git add app.json
git commit -m "chore(config): update adaptive icon backgroundColor to white to match SVG

Main changes:
- Change adaptiveIcon.backgroundColor from #E6F4FE to #FFFFFF to match the
  white background in the new icon.svg design"
```

---

## Task 4: Create the `AppIcon` dynamic-sized component

**Files:**
- Create: `components/app-icon.tsx`

The SVG is already handled by `react-native-svg-transformer` (configured in `metro.config.js`). Importing it yields a React component that accepts all `SvgProps` including `width` and `height`, scaled via the SVG's `viewBox="0 0 500 500"`.

- [ ] **Step 1: Create the component**

Create `components/app-icon.tsx`:

```tsx
import IconSvg from '@/assets/svg/icon.svg';

interface AppIconProps {
  size?: number;
}

export function AppIcon({ size = 64 }: AppIconProps) {
  return <IconSvg width={size} height={size} />;
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors. The `declarations.d.ts` file already declares `declare module "*.svg"` with `React.FC<SvgProps>`, so `width`/`height` are valid props.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/app-icon.tsx
git commit -m "feat(components): add AppIcon component with dynamic size prop

Main changes:
- Add components/app-icon.tsx that wraps assets/svg/icon.svg via SVG transformer
- Accepts optional size prop (default 64) passed as width/height to the SVG component
- Enables in-app icon rendering at any size without rasterization"
```

---

## Task 5: Verify build

- [ ] **Step 1: Type check**

```bash
npx tsc --noEmit
```

Expected: exit 0, no errors.

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: exit 0, no errors.

- [ ] **Step 3: Expo doctor**

```bash
npx expo-doctor
```

Expected: no critical issues (warnings about unrelated packages are acceptable).

- [ ] **Step 4: Expo export (full Android build verification)**

```bash
npx expo export --platform android --clear
```

Expected: successful bundle output under `dist/`. The adaptive icon PNG paths in `app.json` haven't changed, so Expo's asset bundler will pick up the new PNG content automatically.

- [ ] **Step 5: Commit verification result (if any fixes were needed)**

If any lint/type errors required fixes in Tasks 1–4, commit those fixes:

```bash
git add -A
git commit -m "fix: address lint/type issues from icon update"
```

---

## Self-Review Checklist

### Spec Coverage
| Requirement | Covered by |
|-------------|-----------|
| Replace app icon with `icon.svg` | Task 2: `icon.png` generated from SVG |
| Replace adaptive icon assets | Task 2: foreground/background/monochrome PNGs |
| Replace splash screen icon | Task 2: `splash-icon.png` generated from SVG |
| Dynamic sizing for app icon | Task 4: `AppIcon` component with `size` prop |
| Single SVG source for all icons | Tasks 2 & 4 both source `assets/svg/icon.svg` |

### No Placeholders
- All code is complete and concrete — no TBD items.

### Type Consistency
- `AppIcon` takes `size?: number` and passes `width={size}` / `height={size}` to `SvgProps` — consistent with `declarations.d.ts`.
- `generate-icons.js` uses `sharp` with `resize(SIZE, SIZE)` — `SIZE` is defined once as `1024` and used throughout.
