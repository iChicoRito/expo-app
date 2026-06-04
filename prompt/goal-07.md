# Objective

## Replace SVG Buttons on In-Game Page

---

## Description

The goal is to replace the existing SVG buttons on the In-Game Page with a new set of SVG assets that include distinct default and pressed states. The new buttons must support dynamic color changes based on the deck color selected by the player, following the `[Color]/600` token pattern currently in use. Both the visual states (default/pressed) and the dynamic color behavior must function correctly after the replacement.

---

## Objectives Breakdown

### 1. Primary Objective

Replace the current SVG buttons on the In-Game Page with the new SVG assets provided, ensuring all button states and dynamic color behavior are preserved.

---

### 2. Secondary Objectives

- Maintain dynamic color theming using the `[Color]/600` token pattern tied to the selected deck color.
- Ensure both the default and pressed states of each button are correctly implemented and triggered.

---

### 3. Supporting Tasks

#### 3.1 Asset Integration

- Locate and reference the new SVG assets from the specified paths:
  - `assets/svg/end-default-state.svg`
  - `assets/svg/end-pressed-state.svg`
  - `assets/svg/pass-default-state.svg`
  - `assets/svg/pass-pressed-state.svg`
  - `assets/svg/spilled-default-state.svg`
  - `assets/svg/spilled-pressed-state.svg`
- Replace the current SVG buttons on the In-Game Page with the new assets above.

#### 3.2 State Management

- Implement logic to switch between the **default state** SVG and the **pressed state** SVG when a player holds or presses each button.
- Apply this state-switching behavior to all three buttons: **End**, **Pass**, and **Spilled**.

#### 3.3 Dynamic Color Theming

- Retain the existing dynamic color logic that applies the `[Color]/600` token to the buttons based on the selected deck color.
- Ensure the color token is applied correctly to both the default and pressed state variants of each new SVG.

---

### 4. Detailed Breakdown

#### 4.1 Button Asset Structure

Each of the three buttons — **End**, **Pass**, and **Spilled** — has two SVG variants:

- A **default state** (unpressed/idle appearance)
- A **pressed state** (active/held appearance)

All six asset paths are explicitly defined and located under `assets/svg/`.

#### 4.2 Pressed State Behavior

The pressed state SVG should render when the player **holds or presses** the button. The default state SVG should render at all other times. This toggle must be implemented for all three buttons independently.

#### 4.3 Dynamic Color Application

The current buttons use a `teal/600` color token. The color portion (`teal`) is dynamic and changes based on the deck color selected by the player, always following the `[Color]/600` format. This dynamic color substitution must continue to work with the new SVG assets for both button states.

> All other implementation details not explicitly stated in the input are out of scope for this breakdown.
