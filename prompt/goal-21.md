# Objective: Daily Streak System

---

## Description

This objective introduces a daily streak system to the Spillr app that tracks and rewards consecutive daily play. A streak increments by 1 each time a player completes at least one game in a calendar day, and resets to zero if 24 hours pass without any game played. The system includes contextual on-screen streak messages tied to the user's current streak level, a streak display on the play page, a celebratory screen shown after the first game of each day, a looping Lottie flame animation, and push notifications that warn the user before their streak expires. All design and layout must strictly follow the reference screen at `image/figma/streak/streak-screen.png`.

---

## Objectives Breakdown

### 1. Primary Objective

Implement a daily streak system that increments when the player completes at least one game per day, resets after 24 hours of inactivity, and surfaces the streak status across the play page and a dedicated post-game streak screen — all strictly following the provided Figma design reference.

---

### 2. Secondary Objectives

- Display contextual streak subtitle messages that change based on the user's current streak level.
- Notify users via push notification before their streak expires.
- Show a looping Lottie flame animation (`assets/lottie/streak-lottie.json`) on the streak screen.
- Display the user's current streak count on the play page.

---

### 3. Supporting Tasks

#### 3.1 Streak Logic

- Increment the streak counter by 1 when the player completes at least 1 game in a given day.
- Reset the streak counter to 0 if the player has not played any game within the last 24 hours.
- Streak increments must be limited to once per day — multiple games in the same day do not add additional streak counts.

#### 3.2 Streak Screen — Post-Game Display

- Show the streak screen to the user whenever they complete their first game of the day.
- The streak screen must display the user's current streak count.
- The streak screen must display the appropriate subtitle message based on the user's streak level (see Section 4.1).
- Use the Lottie animation file at `assets/lottie/streak-lottie.json` for the flame animation on this screen.
- The Lottie animation must be set to loop indefinitely — it must not play once and stop.
- Strictly follow the design, layout, colors, typography, and visual style defined in `image/figma/streak/streak-screen.png`.

#### 3.3 Play Page — Streak Display

- Display the user's current streak count on the play page.
- The display must reflect the live streak value at the time the play page is viewed.

#### 3.4 Push Notifications

- Send a push notification to warn the user when their streak is about to expire (before the 24-hour window closes).
- Send a push notification (or handle state update) when the streak has expired and been reset.
- Notification timing and copy are to be defined during implementation, as no specific values were provided in the input.

---

### 4. Detailed Breakdown

#### 4.1 Streak Level Messages

The streak screen subtitle must display one of the following messages based on the user's current streak count at the time of display:

| Streak Level | Subtitle                                                              |
| ------------ | --------------------------------------------------------------------- |
| **1–3 Days** | You're just getting started. One card at a time, bestie.              |
| **4–7 Days** | Okay consistency! Your Spill Streak is starting to look serious.      |
| **8+ Days**  | Main character behavior. Your streak is officially in its iconic era. |

- These messages are shown on the streak screen only.
- The correct message must be selected based on the streak count at the moment the screen is displayed.

#### 4.2 Streak Reset Condition

The streak resets if the user has not played any game within a 24-hour window. The 24-hour window is measured from the user's last completed game. If no game is played before the window closes, the streak is set back to 0. This must be enforced regardless of whether the user opens the app — the reset is time-based, not session-based.

#### 4.3 Lottie Flame Animation

The flame animation must use the Lottie file located at `assets/lottie/streak-lottie.json`. The animation must be configured to loop continuously — it must not play once and stop or freeze on the last frame. No alternative animation source or fallback asset was specified in the input.

#### 4.4 Design Compliance

All visual implementation for the streak screen must strictly follow the reference design at `image/figma/streak/streak-screen.png`. This includes layout, color usage, typography, spacing, component style, and any other visual properties shown in the reference. No deviations from the reference design are permitted unless explicitly approved.

---
