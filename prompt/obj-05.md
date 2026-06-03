# Objective

## In-Game Page — Card Transition Animation

---

## Description

This objective focuses on enhancing the In-Game Page of the flipping card game by introducing smooth transition animations when the player interacts with the **Answered** or **Pass** buttons. The existing flip animation remains unchanged. The enhancement introduces a sequential exit and entrance animation to create a more fluid and polished gameplay experience.

---

## Objectives Breakdown

### 1. Main Objective Area

Implement a smooth two-part card transition animation triggered when the user presses **Answered** or **Pass** — where the current card exits upward and the next card enters from below.

---

### 2. Secondary Objective Area

Preserve the existing flip animation behavior on card tap while layering the new slide transition on top of the action button interactions only.

---

### 3. Supporting Tasks

#### 3.1 Exit Animation (Current Card)

- When **Answered** or **Pass** is pressed, the current/previous question card slides **upward and out of the screen**
- The exit motion uses an **ease-in** animation curve
- The card should feel like it is being dismissed naturally upward

#### 3.2 Entrance Animation (Next Card)

- After or during the exit, the next **unflipped card** slides **up from below the screen** into the center position
- The card enters from **outside the bottom of the screen** and settles at the center
- The entrance should feel smooth and natural, ready for the user to flip again

#### 3.3 Preserve Existing Flip Behavior

- The tap-to-flip card animation remains untouched and continues to function as before
- The slide transition only triggers on **Answered** or **Pass** button press, not on card tap

---

### 4. Detailed Breakdown

#### 4.1 Exit Animation Specification

The current question card — whether in its flipped (question visible) state — must animate out when the player makes a choice.

##### Animation Properties

- **Direction:** Slides upward, out of the visible screen
- **Easing:** Ease-in (starts slow, accelerates as it exits)
- **Trigger:** Pressing **Answered** or **Pass** button only

#### 4.2 Entrance Animation Specification

Immediately following or overlapping with the exit, the next unflipped card enters the screen.

##### Animation Properties

- **Origin:** Starts from outside the bottom edge of the screen
- **Destination:** Settles to the center of the screen (same position as the previous card)
- **State on Arrival:** Card is in its default **unflipped state**, displaying Question No. # and the _"Tap to Flip"_ indicator label
- **Easing:** Smooth, natural slide-up into position

#### 4.3 Animation Sequencing

The two animations must be coordinated to feel seamless.

##### Nested Details

- Exit animation plays first or simultaneously with the entrance animation
- The next card should not appear or be interactable until it has fully settled into position
- No overlap of two visible cards in their final resting positions
- The flip animation on the newly entered card remains independent and is only triggered by a user tap

---
