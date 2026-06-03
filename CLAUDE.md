# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npx expo start          # Start dev server (scan QR with Expo Go, or press a/i/w for emulators)
npx expo start --android
npx expo start --ios
npx expo start --web
npm run lint            # Run ESLint (expo lint)
npm run reset-project   # Move starter code to app-example/ and create blank app/
```

TypeScript checking: `npx tsc --noEmit`

## Commit Message Guidelines

Format commit messages to clearly document the "what" and "why" of changes. When creating commits, follow this structure:

**Format:**
```
<type>(<scope>): <subject (50 chars max, imperative mood)>

Main changes:
• <point 1 — what changed and why>
• <point 2 — what changed and why>
• <point 3 — what changed and why>
```

**Type:** Choose one:
- `feat` — New feature or capability
- `fix` — Bug fix
- `refactor` — Code restructuring without behavior changes
- `docs` — Documentation updates
- `style` — Formatting, linting (no functional changes)
- `test` — Adding or updating tests
- `perf` — Performance improvements
- `chore` — Dependencies, build config, maintenance

**Scope:** Optional. Use component/file name when relevant (e.g., `feat(game)`, `fix(carousel)`). Omit if not applicable.

**Subject:** Imperative mood ("add", not "added" or "adds"). Max 50 characters.

**Main changes:** 3–5 bullet points capturing the significant changes. Focus on intent, not implementation details.

**Example:**
```
feat(game): implement card transition animations

Main changes:
• Exit animation: card slides upward 350ms (ease-in) while flipping, with motion blur overlay
• Entrance animation: next card slides up from below 280ms (ease-out) into center position
• Interaction blocking: isTransitioning flag prevents taps during sequence
• Motion blur: expo-blur overlay fades in as card exits for visual richness
```

## Architecture

This is an **Expo SDK 54** app using **Expo Router v6** (file-based routing), **React 19**, and **React Native 0.81** with the New Architecture enabled.

### Routing

- `app/_layout.tsx` — Root layout; wraps the app in React Navigation's `ThemeProvider` with auto dark/light theming. Defines a Stack navigator with `(tabs)` and `modal` screens.
- `app/(tabs)/_layout.tsx` — Tab navigator with two tabs: Home (`index`) and Explore.
- `app/(tabs)/index.tsx`, `app/(tabs)/explore.tsx` — Tab screen content.
- `app/modal.tsx` — Modal screen presented over the tab navigator.
- `unstable_settings.anchor` is set to `(tabs)` so deep links land on the tabs group.

### Theming

- `constants/theme.ts` — Exports `Colors` (light/dark palettes) and `Fonts` (platform-specific font stacks via `Platform.select`).
- `hooks/use-color-scheme.ts` — Wraps React Native's `useColorScheme`; `.web.ts` variant overrides for web.
- `hooks/use-theme-color.ts` — Resolves a color token from `Colors` for the current scheme, with per-component light/dark overrides.
- `components/themed-text.tsx` / `components/themed-view.tsx` — Base components that consume `useThemeColor`. Use these instead of raw `Text`/`View` for theme-aware text and backgrounds.

### Path Aliases

`@/` maps to the repo root (configured in `tsconfig.json`). All internal imports use this alias.

### Game Screen (In-Game Page)

- `app/game.tsx` — Main game screen for flipping card gameplay. Manages card state, animations, and player actions.
  - **Card Flip Animation**: 3D Y-axis rotation (500ms) when tapped; uses `flip` shared value with `rotateY` interpolation.
  - **Card Transitions**: When Answered/Pass buttons are pressed:
    - Exit: Current card slides upward (350ms, ease-in cubic) while continuing to flip (rotation 1→2), triggering motion blur overlay (intensity 30, opacity fade).
    - Entrance: Next card slides up from below (280ms, ease-out cubic) into center, lands in unflipped state.
    - Interaction: `isTransitioning` flag blocks card taps and button presses during ~500ms sequence; `pointerEvents="none"` on blur overlay.
  - **Animations**: Uses React Native Reanimated v4.1.1 (`useSharedValue`, `useAnimatedStyle`, `withTiming`, `interpolate`, `Easing`, `runOnJS`).
  - **Motion Blur**: `expo-blur` BlurView with animated opacity tied to exit animation progress.
  - **Header**: Centered Spillr logo with back button absolutely positioned on left.
- `app/results.tsx` — Results/end-game screen with same header layout (centered logo).

### Key Configs

- `app.json`: New Architecture (`newArchEnabled: true`), React Compiler (`reactCompiler: true`), typed routes enabled.
- `eslint.config.js`: Uses `eslint-config-expo`.
- `package.json`: Includes `expo-blur` for motion blur effects.
- No test runner is configured in this project yet.
