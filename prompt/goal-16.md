# Objective: Dynamic Lottie Animations for End-Game Screen

---

## Description

This objective covers implementing dynamic Lottie-based animations on the end-game result screen of the Spillr app. Each possible result state — "You Spilled Everything," "Almost Spilled Everything," and "Certified Dodger" — should render a distinct Lottie animation above the result title, using the pre-existing JSON files in the lottie assets folder. Additionally, a looping sunburst Lottie animation should render full-screen in the background. A logic fix is also required to correctly assign the "Certified Dodger" result when the user has not answered even a single question, regardless of how many cards were flipped.

---

## Objectives Breakdown

### 1. Primary Objective

Implement result-based dynamic Lottie animations on the end-game screen, ensuring the correct animation file plays per result state, positioned above the result title, with a full-screen rotating sunburst in the background.

---

### 2. Secondary Objectives

- Fix the result classification logic so that "Certified Dodger" is correctly assigned when the user answered zero questions (even if cards were flipped).
- Integrate the sunburst Lottie as a large-scale, looping background element on the end-game screen.

---

### 3. Supporting Tasks

#### 3.1 Lottie Animation Mapping

- Map the `clap-lottie.json` animation to the **"Certified Dodger"** result state.
- Map the `star-lottie.json` animation to the **"You Spilled Everything"** result state.
- Map the `trophy-lottie.json` animation to the **"Almost Spilled Everything"** result state.
- Source all Lottie JSON files exclusively from `assets/lottie/`.

#### 3.2 Layout Placement

- Position the result-specific Lottie animation **above** the result title (e.g., above "You Spilled Everything", "Almost Spilled Everything", "Certified Dodger").
- Maintain the existing layout order below the animation: title → username → description.
- Reference screen layouts from:
  - `image/figma/end-screen/AllPassedDeck.png`
  - `image/figma/end-screen/AnsweredAllDeck.png`
  - `image/figma/end-screen/AnsweredAllDeck-1.png`
  - `image/figma/end-screen/SomePassedDeck.png`

#### 3.3 Sunburst Background

- Integrate `sunburst-lottie.json` as a **full-screen background** on the end-game screen.
- Set the sunburst animation to **loop indefinitely** (rotating loop).
- Scale the sunburst to be **large** — it should cover the full screen background area.

#### 3.4 Result Logic Fix

- Correct the result classification logic to ensure that **"Certified Dodger" is only assigned when the user has answered zero questions**.
- A user who flipped at least one card but answered zero questions must **not** be classified as "You Spilled Everything."
- The classification trigger for "Certified Dodger" must be: **answered count = 0**, regardless of flipped count.

---

### 4. Detailed Breakdown

#### 4.1 Animation File References

Use only the following files from `assets/lottie/`:

| Result State              | Lottie File            |
| ------------------------- | ---------------------- |
| Certified Dodger          | `clap-lottie.json`     |
| You Spilled Everything    | `star-lottie.json`     |
| Almost Spilled Everything | `trophy-lottie.json`   |
| Background (all states)   | `sunburst-lottie.json` |

Do not use any other Lottie files present in the folder.

#### 4.2 Screen Layout Reference

The end-game screen layout, as shown in the Figma design references, consists of the following stacked elements from top to bottom:

1. **Background** — Sunburst Lottie (full-screen, looping, large scale)
2. **Lottie Animation** — Result-specific icon animation (above the title)
3. **Result Title** — e.g., "You Spilled Everything, Chico"
4. **Description** — e.g., "You survived the questions. Honestly, iconic behavior."
5. **Back to Home** — CTA button at the bottom

#### 4.3 Result Classification Logic

The three result states and their conditions are:

| Result                        | Condition                                                |
| ----------------------------- | -------------------------------------------------------- |
| **Certified Dodger**          | User answered **0 questions** (regardless of flip count) |
| **Almost Spilled Everything** | User answered **some but not all** questions             |
| **You Spilled Everything**    | User answered **all questions**                          |

> **Bug to fix:** Currently, flipping even one card without answering triggers "You Spilled Everything." The fix requires checking `answeredCount === 0` as the gate for "Certified Dodger," not `flippedCount`.

##### Nested Details

- The logic check must evaluate **answered** questions, not flipped or viewed cards.
- Edge case: a user who flips every card but answers none must still receive "Certified Dodger."
- This logic fix applies to the same screen where the Lottie animations are rendered.

---
