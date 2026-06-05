# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

@AGENTS.md

## Non-Negotiables

- This is an Expo SDK 54 project. Before writing Expo code, read the exact versioned docs: https://docs.expo.dev/versions/v54.0.0/
- Use the existing npm workflow and keep `package-lock.json`.
- Target Android first. Do not reintroduce removed Expo starter, web, or iOS demo surfaces unless explicitly requested.
- Avoid bringing back these removed starter artifacts: `app/(tabs)`, `app/modal.tsx`, React logo demo assets, starter themed components/hooks, and web/iOS-only demo dependencies.
- Keep changes scoped to the requested feature or fix. Do not delete files unless explicitly asked.

## Commands

```bash
npm install
npx expo start
npx expo start --android
npx tsc --noEmit
npm run lint
npx expo-doctor
npx expo export --platform android --clear
```

`npm run reset-project` exists, but do not use it as normal workflow because this app is no longer the Expo starter app.

## Commit Message Guidelines

Use this format:

```text
<type>(<scope>): <subject (50 chars max, imperative mood)>

Main changes:
- <point 1: what changed and why>
- <point 2: what changed and why>
- <point 3: what changed and why>
```

Types:
- `feat`: New feature or capability
- `fix`: Bug fix
- `refactor`: Code restructuring without behavior changes
- `docs`: Documentation updates
- `style`: Formatting, linting, no functional changes
- `test`: Adding or updating tests
- `perf`: Performance improvements
- `chore`: Dependencies, build config, maintenance

## Architecture

This is an Android-focused Expo SDK 54 app using Expo Router v6, React 19, React Native 0.81, New Architecture, typed routes, and React Compiler.

Root setup:
- `app/_layout.tsx` defines the Stack navigator and wraps the app with `DeckStoreProvider` and `ProfileStoreProvider`.
- `@/` maps to the repository root via `tsconfig.json`.
- `app.json` enables Android edge-to-edge, Expo Router, SecureStore, splash screen config, and `expo-build-properties`.
- `eas.json` keeps Android preview/development builds as APKs and production as an app bundle.
- `.easignore` excludes non-build folders such as Figma references, prompts, editor metadata, caches, and `node_modules`.

Current routes:
- `app/index.tsx`: SecureStore-based entry redirect
- `app/onboarding.tsx`: first-run name collection
- `app/play.tsx`: deck carousel and main play hub
- `app/preparation.tsx`: pre-game transition screen
- `app/game.tsx`: flip-card gameplay
- `app/results.tsx`: end-game result screen
- `app/decks.tsx`: deck list and custom deck creation
- `app/questions.tsx`: question list, CRUD, and AI generation
- `app/profile.tsx`: profile/settings hub
- `app/play-history.tsx`: completed session timeline
- `app/decks-cards.tsx`: built-in/custom deck management

## State And Data

- `contexts/deck-store.tsx` is the central deck/question store. It merges built-in decks with AsyncStorage-backed custom decks/questions.
- Built-in decks are read-only. Custom decks support create/delete and question CRUD.
- `lib/groq.ts` handles Groq question generation. Keep the current behavior unless the task is specifically about AI generation.
- `lib/rate-limit.ts` contains pure AI rate-limit helpers for the hourly generation window.
- `lib/network.ts` provides the Expo Network connectivity check before AI calls.
- `contexts/profile-store.tsx` owns profile state, settings, audio levels, game stats, and play history persistence.
- `lib/scenario.ts` resolves game-end title/subtitle/node values shared by results and history recording.

## Deck Card Visual System (Goal-14)

- `components/deck-card.tsx` renders carousel cards with color-matched card holder SVG and picker icon overlay.
- `constants/cards-icons.ts` stores 5 SVG picker icons (decks-icon-1 through decks-icon-5) as strings. `tintDeckIcon(svg, colorKey)` replaces blue shades with target color's Tokens shades (same pattern as svg-buttons).
- `constants/card-holders.ts` maps `ColorScaleKey` → card holder SVG component. Blue falls back to indigo (no blue file exists).
- `components/diamond-grid.tsx` renders `diamond-pattern-background.svg` tinted to deck's `color[400]` at 30% opacity. Backward compatible: defaults to white for game/results screens.
- `DeckData.iconKey?: string` carries the picker icon ID through the store to the card renderer. All 6 built-in decks use `iconKey: "decks-icon-2"`.
- Icon overlay logic: if `deck.iconKey` matches a picker icon ID → render tinted `SvgXml`; otherwise → fallback to `HugeiconsIcon` in white.
- Assets: `assets/svg/cards-holder/` (10 SVGs mapped by color), `assets/svg/cards-icons/` (5 picker SVGs), `assets/svg/background/diamond-pattern-background.svg`.

## UI System

- Use the existing React Native components, `constants/tokens.ts`, and `@hugeicons/react-native` icon pattern.
- Do not introduce a new UI framework unless explicitly requested.
- Lists that can grow should use `FlatList` with stable keys and render callbacks.
- Expensive repeated visuals should stay memoized where practical.
- `app/game.tsx` uses Reanimated for flip/transition behavior and mounts `BlurView` only during transition work.
- `components/sheet.tsx`, `components/dialog.tsx`, and related sheets/popovers are the shared modal patterns.

## Profile And Avatar System

- `components/avatar.tsx` renders selected SVG avatars.
- `components/edit-profile-sheet.tsx` edits name, avatar, and profile color.
- `components/music-sound-sheet.tsx`, `components/value-slider.tsx`, and `components/toggle-switch.tsx` implement profile settings controls.
- `components/stat-badge.tsx`, `components/settings-row.tsx`, and `components/timeline-row.tsx` are reusable profile/history rows.
- `assets/svg/avatars/` contains `user-avatar-1.svg` through `user-avatar-18.svg`.
- `constants/avatars.ts` is the avatar registry.
- `declarations.d.ts` declares SVG imports for TypeScript.
- `metro.config.js` must extend `expo/metro-config` and configure `react-native-svg-transformer` for avatar SVG imports.

## Build And Verification

- Android release shrinking is configured with `expo-build-properties`:
  - `enableMinifyInReleaseBuilds`
  - `enableShrinkResourcesInReleaseBuilds`
  - `enablePngCrunchInReleaseBuilds`
- Run `npx tsc --noEmit`, `npm run lint`, `npx expo-doctor`, and `npx expo export --platform android --clear` after meaningful code/config changes.
- No test runner is configured yet.
