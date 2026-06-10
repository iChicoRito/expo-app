# Objective

## Add Sound Effects for Specific Pages

---

## Description

This objective focuses on integrating audio sound effects (SFX) into three specific pages of the application: the Preparation page, the Streak page, and the Ending Result page. Each page has a designated `.mp3` asset to be played at a precise moment tied to existing animations or page visibility. The goal is to ensure audio playback is synchronized with visual events — neither premature nor delayed. Sound behavior must also account for looping animations, where audio plays only once regardless of loop count.

---

## Objectives Breakdown

### 1. Primary Objective

Attach specific sound effect assets to designated pages, triggering playback in sync with existing animations or page display events — using the exact assets and timing rules provided.

---

### 2. Secondary Objectives

- Prevent sound from playing outside the defined trigger window (not before, not after — only _during_ animation).
- Ensure looping Lottie animations on the Ending Result page only trigger the sound **once**, not on every loop iteration.

---

### 3. Supporting Tasks

#### 3.1 Preparation Page — Star Lottie SFX

- Identify the point in the page where the text animation completes and the star Lottie animation begins
- Trigger `assets\sounds\preparation-star.mp3` **during** the star Lottie animation only
- Ensure sound does not play before the text animation ends or after the star animation completes

#### 3.2 Streak Page — Spill Result SFX

- Detect when the Streak page is shown/displayed
- Play `assets\sounds\spill-result.mp3` upon Streak page appearance

#### 3.3 Ending Result Page — Spill Result SFX with Loop Guard

- Identify the Lottie animation on the Ending Result page
- Play `assets\sounds\spill-result.mp3` during the animation
- Implement a **one-time playback guard** — sound plays once only, even if the Lottie animation is set to loop

---

### 4. Detailed Breakdown

#### 4.1 Preparation Page Timing Constraint

The sound must be triggered strictly _during_ the star Lottie animation — after the preceding text animation has finished. This implies the trigger must be bound to the **start event of the star Lottie**, not the page load or the text animation start.

#### 4.2 Streak Page Trigger

No animation-specific timing is mentioned for this page. The sound `spill-result.mp3` should play when the **Streak page becomes visible or is entered**.

#### 4.3 Ending Result Page — Loop Animation Behavior

The Ending Result page contains a Lottie animation that may be configured to loop. Despite this, the SFX `spill-result.mp3` must only play **once per page visit**.

##### Nested Details _(loop guard requirement)_

- Sound playback must be gated — play on first animation start only
- Subsequent loop iterations must **not** re-trigger the sound
- No additional edge cases mentioned in the input

---
