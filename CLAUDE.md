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

### Key Configs

- `app.json`: New Architecture (`newArchEnabled: true`), React Compiler (`reactCompiler: true`), typed routes enabled.
- `eslint.config.js`: Uses `eslint-config-expo`.
- No test runner is configured in this project yet.
