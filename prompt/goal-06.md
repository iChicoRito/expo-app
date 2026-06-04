# Objective

## On-boarding screen: first-time only display, name saving, and snackbar removal

---

## Description

The on-boarding screen must only appear the first time a user opens the app. Once the user completes the on-boarding flow by entering their name, the name is saved on the device and the user is automatically navigated to the Play Page. On subsequent app launches, the on-boarding screen is skipped entirely. Additionally, the Snackbar message that currently appears when the user presses the "Let's Go" button on the last on-boarding page must be removed.

---

## Objectives Breakdown

### 1. Primary Objective

Ensure the on-boarding screen is shown only once — on the user's very first time opening the app — and never repeated on subsequent launches.

---

### 2. Secondary Objectives

- Save the user's entered name to the device upon completion of on-boarding.
- Automatically navigate the user to the Play Page after completing on-boarding, without requiring manual back navigation.
- Remove the Snackbar message triggered by the "Let's Go" button on the last on-boarding screen.

---

## Supporting Tasks

### 3.1 On-boarding visibility control

- Check on app launch whether the user has previously completed on-boarding
- Show the on-boarding screen only if it is the user's first time opening the app
- Skip the on-boarding screen entirely on all subsequent app launches

### 3.2 Name input and device storage

- Accept the user's name input during on-boarding
- Save the entered name to local device storage upon submission
- Ensure the saved name persists across app sessions

### 3.3 Navigation after on-boarding

- Automatically redirect the user to the Play Page after the name is saved
- Remove any requirement for the user to navigate back manually to reach the Play Page

### 3.4 Snackbar removal

- Locate the Snackbar message tied to the "Let's Go" button on the last on-boarding page
- Remove the Snackbar message trigger from that button action

---

## Detailed Breakdown

### 4.1 First-time detection

A flag must be stored on the device to track whether the user has completed on-boarding. On every app launch, this flag is checked before deciding whether to display the on-boarding screen.

### 4.2 Name persistence

The user's name entered during on-boarding must be saved to the device's local storage. This saved name must remain available across all future app sessions.

### 4.3 Automatic navigation to Play Page

Upon saving the user's name, the app must automatically navigate the user directly to the Play Page. This must happen without requiring any additional user action or back-stack navigation.

### 4.4 Snackbar removal on "Let's Go" button

The Snackbar message currently displayed when the user taps "Let's Go" on the final on-boarding page must be removed. No replacement message or alternative feedback is mentioned — the action should complete silently.

---

## SVG Button Color Tokens

### 5.1 Overview

All three SVG buttons — `pass-btn.svg`, `spilled-btn.svg`, and `end-round-btn.svg` — share an identical layered structure. The colors applied to each layer must not be hardcoded to any fixed palette. Instead, they must be driven dynamically by the deck color the user has selected, using the corresponding color scale tokens from `constants/questions.ts`.

Each deck color has its own set of scale tokens (e.g. `/200`, `/400`, `/500`, `/600`). When a user selects a deck, the active deck's color scale must be resolved and passed down to the SVG buttons so that all layers update accordingly.

### 5.2 Layer-to-Token Mapping

All three SVGs are composed of the following layers in order. Each layer references a token slot from the active deck's color scale:

| Layer                                              | Element                                                  | Token Slot                      |
| -------------------------------------------------- | -------------------------------------------------------- | ------------------------------- |
| 1 — Outer shadow/base rectangle                    | `<rect width="244" height="244" .../>`                   | `[deckColor]/600`               |
| 2 — Main button surface rectangle                  | `<rect x="5.833" width="232.335" .../>`                  | `[deckColor]/400`               |
| 3 — Top-left highlight path (rounded corner gloss) | `<path d="M29 52.1149 ..."/>`                            | `[deckColor]/200`               |
| 4 — Icon inner fill / depth layer                  | Icon-specific `<path>` with mid-tone fill                | `[deckColor]/500`               |
| 5 — Icon foreground / outline shape                | Icon-specific `<path fill="white"/>`                     | `White`                         |
| 6 — Inner border stroke rectangle                  | `<rect x="22.357" stroke="..." stroke-width="7.77689"/>` | `[deckColor]/500` (stroke only) |

Where `[deckColor]` is the color scale identifier of the currently selected deck (e.g. `Teal`, `Rose`, `Violet`, `Amber`), resolved at runtime from `constants/questions.ts`.

### 5.3 Token Usage Rules

- **`[deckColor]/600`** — Applied to the outermost full-size rectangle. Creates the drop-shadow/depth effect visible beneath the raised button surface.
- **`[deckColor]/400`** — Applied to the main raised button surface rectangle. This is the primary visible background of the button.
- **`[deckColor]/500`** — Applied to the icon's depth/mid-layer path and to the inner border stroke, providing tonal depth between the surface and the icon foreground.
- **`[deckColor]/200`** — Applied to the top-left corner gloss highlight path. This is a visual surface effect and must follow the deck color scale.
- **`White`** — Applied to the icon's outermost foreground path only. This is the sole fixed color across all deck color themes and must remain `White` at all times to ensure contrast.

### 5.4 Dynamic Color Behavior

- When the user selects or changes a deck, the active deck's color scale must be resolved and the new token values must propagate to all three SVG buttons simultaneously.
- The SVG buttons must never retain a previously selected deck's colors after a deck change.
- The color scale resolution must happen at the component level — the SVG should receive the resolved token values as props or equivalent, rather than reading from `constants/questions.ts` directly.
- `White` is the only non-dynamic color in the button. All other layer colors must update when the deck color changes.

### 5.5 Implementation Notes

- All token values must be sourced exclusively from `constants/questions.ts`. No color values should be defined inline, hardcoded in the SVG, or duplicated elsewhere.
- The layering order of the SVG elements must be preserved. Reordering layers will break the depth and shadow effect of the button design.
- The stroke on the inner border rectangle uses `[deckColor]/500` as its `stroke` attribute — ensure the token is applied to `stroke`, not `fill`.
