# Objective: Background Animation for Deck Cards and In-Game Play Page

---

## Description

This objective adds looping background animations to two surfaces in the Spillr app: the deck cards on the home/selection screen (each with a diamond pattern background), and the in-game play page background. Both animations use the same diamond pattern SVG, which must loop infinitely with no visible cut, seam, or interruption — the animation must continue scrolling without ever resetting in a way that is perceptible to the user. The two surfaces differ in scroll direction — the card animation scrolls vertically, while the play page animation scrolls downward at a diagonal rotation of at least 25°. Additionally, the play page intro sequence is fixed so that the CTA button only becomes visible and interactive after the text-by-text animation has fully completed.

---

## Objectives Breakdown

### 1. Primary Objective

Animate the existing diamond pattern SVG backgrounds on both the deck cards and the in-game play page with infinitely looping, seamless scroll animations that produce no visible cut or restart — and gate the play page's CTA button so it only appears after the intro text animation finishes.

---

### 2. Secondary Objectives

- Ensure the diamond pattern SVG tile is extended vertically so the loop has no visible seam, cut, or restart at any point during continuous playback.
- The animation must run indefinitely — it should never stop, pause, or visibly reset.
- Differentiate the card background animation from the play page background animation through direction (straight vertical vs. diagonal/rotated).

---

### 3. Supporting Tasks

#### 3.1 Deck Card Background Animation

- Animate the diamond pattern SVG background of each deck card on the selection screen.
- The animation direction must be vertical (scrolling downward).
- Extend the vertical size of the SVG pattern asset or tile to eliminate any seam or cut during the loop transition.
- The animation must loop infinitely — the end frame must connect directly and imperceptibly back to the start frame, with no visible jump, cut, or pause at any point.

#### 3.2 Play Page Background Animation

- Apply the same diamond pattern SVG background animation to the in-game play page background.
- The animation must scroll downward but at a diagonal — rotated at a minimum of 25°.
- The same seamless, no-cut, infinite looping requirement applies — the animation must continue without interruption or any perceptible reset.

#### 3.3 Play Page Intro — Button Visibility Gating

- The play page currently displays an intro text animation that reveals text word-by-word or character-by-character (e.g., _"You are about to play the deck."_).
- The CTA button must **not** be visible or interactive until the full text animation sequence has completed.
- Once the animation finishes, the button should appear (e.g., fade in or render into view).

---

### 4. Detailed Breakdown

#### 4.1 Seamless Infinite Loop — SVG Extension Requirement

The diamond pattern SVG background must loop **infinitely with no visible cut, seam, or perceptible restart**. To achieve this, the SVG pattern must be extended vertically so that when the scroll animation reaches its end position and resets to the start, the transition is completely imperceptible to the user — the pattern should appear to scroll continuously without ever stopping or jumping. This applies equally to both the deck card and the play page backgrounds. The specific technique (e.g., doubling the SVG height, using CSS `background-repeat` with a perfectly tileable pattern, or a translate keyframe that snaps back at the exact repeat point) is an implementation detail, but the outcome — an infinite, cut-free loop — is a hard requirement.

#### 4.2 Diagonal Direction — Play Page Specific

The play page background animation must differ from the card animation by introducing a rotation of **at least 25°** from vertical. The scrolling motion should still read as "moving downward" overall, but with a noticeable diagonal slant. The exact angle may be tuned during implementation as long as it meets the 25° minimum threshold.

#### 4.3 CTA Button Gating — Timing Logic

The button's appearance must be tied to the completion of the intro text animation sequence, not to a fixed timer or page mount event. The button should only enter the rendered/interactive state after the last character or word of the intro text has finished animating. Until that point, the button must be fully hidden — not merely disabled or visually suppressed while remaining in the layout.

---
