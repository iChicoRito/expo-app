# Objective: UI/UX Revisions, Smooth Animations & Audio System Integration

## Description

This objective covers major and minor revisions to the application's UI/UX across multiple pages — the play page, preparation page, in-game screen, and end game screen — along with the integration of a full audio system including background music and sound effects. Navigation and back-button behavior is being refined for better logical flow, and visual polish is being added through text animations and confetti. The overall goal is to create a more immersive, interactive, and polished experience for the end user.

---

## Objectives Breakdown

### 1. Primary Objective

Revise UI/UX interactions and flows across key pages and implement a fully dynamic audio system with volume controls tied to user actions, page context, and game state.

---

### 2. Secondary Objectives

- Add smooth text animations to the preparation page.
- Implement confetti on the end game screen regardless of result.
- Make existing music and sound effect volume sliders fully functional.

---

### 3. Supporting Tasks

#### 3.1 Navigation & Back Button Logic

- Redirect from the play page's play button to the preparation page.
- On the in-game page: if no card has been flipped, pressing back redirects to the play page.
- On the in-game page: if at least one card has been flipped, pressing back shows a confirmation dialog — _"Are you sure you want to leave the game?"_

#### 3.2 End Game Screen Cleanup

- Remove the back button from the end game screen (redundant with the existing "Back to Home" button).
- Install/integrate a confetti library and trigger confetti on the end game screen for all outcomes.

#### 3.3 Audio Integration

- Dynamically attach sound effects to specific user actions using the mapped assets below.
- Add two lobby music tracks to the play page that randomize on each application reopen.
- Add two in-game background music tracks that randomize each time the in-game screen is entered.
- Implement dynamic volume behavior: full volume on the lobby/play page; lowered volume when navigating to other pages.

#### 3.4 Audio Settings / Volume Controls

- Wire up the master volume slider to control all audio (background music + sound effects).
- Wire up the music slider to control background music only.
- Wire up the sound effects slider to control sound effects only.

---

### 4. Detailed Breakdown

#### 4.1 Preparation Page Text Animation

When the user is redirected to the preparation page after pressing play, the text "You are about to play" and the category deck name should appear using a character-by-character or word-by-word reveal animation (text rendered progressively, not all at once).

#### 4.2 In-Game Back Button Behavior

Two distinct behaviors are required based on game state:

- **No card flipped yet:** Back button skips the preparation page and goes directly to the play page.
- **At least one card flipped:** Back button triggers a confirmation dialog before any navigation occurs.

#### 4.3 Confetti on End Game Screen

A confetti effect must display on the end game screen unconditionally — it fires regardless of the player's result (win or loss). A third-party confetti library or package is to be installed to handle this effect.

#### 4.4 Dynamic Audio Volume by Page Context

- **Lobby / Play page:** Background music plays at default (full) volume.
- **Any other page:** Volume automatically lowers to create an immersive, dynamic feel.
- This behavior is applied to both the lobby music (play page) and in-game music (in-game screen) independently.

#### 4.5 Audio Randomization Logic

- **Lobby music:** 2 tracks available; one is selected randomly each time the application is reopened.
- **In-game music:** 2 tracks available; one is selected randomly each time the in-game screen is entered.

#### 4.6 Volume Control Hierarchy

- **Master volume:** Affects all audio output globally (both background music and sound effects).
- **Music volume:** Affects background music tracks only; does not impact sound effects.
- **Sound effects volume:** Affects sound effects only; does not impact background music.

---

### 5. Audio Asset Reference

#### 5.1 Background Music

| Asset Path                          | Purpose                                    | Behavior                                                                                         |
| ----------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `assets/sounds/lobby-bgm (1).m4a`   | Lobby/play page background music — Track 1 | Randomly selected on app reopen; plays at full volume on lobby/play page, lowered on other pages |
| `assets/sounds/lobby-bgm (2).m4a`   | Lobby/play page background music — Track 2 | Randomly selected on app reopen; plays at full volume on lobby/play page, lowered on other pages |
| `assets/sounds/in-game-bgm (1).m4a` | In-game screen background music — Track 1  | Randomly selected each time the in-game screen is entered; volume lowers when leaving the screen |
| `assets/sounds/in-game-bgm (2).m4a` | In-game screen background music — Track 2  | Randomly selected each time the in-game screen is entered; volume lowers when leaving the screen |

#### 5.2 Sound Effects

| Asset Path                              | Purpose                            | Trigger                                                                      |
| --------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------- |
| `assets/sounds/flipping-card.mp3`       | Card flip sound effect             | Fires when the player flips any card during the in-game screen               |
| `assets/sounds/card-answered.mp3`       | Correct/answered card sound effect | Fires when the player successfully answers a card (spill action confirmed)   |
| `assets/sounds/card-pass.mp3`           | Pass card sound effect             | Fires when the player passes on a card                                       |
| `assets/sounds/confirmation-dialog.mp3` | Confirmation dialog sound effect   | Fires when the back-button confirmation dialog appears during an active game |
| `assets/sounds/ending-screen.mp3`       | End game screen sound effect       | Fires when the end game screen is displayed, regardless of result            |

> **Note:** All sound effects are controlled by the **Sound Effects** volume slider. All background music tracks are controlled by the **Music** volume slider. Both categories are affected by the **Master Volume** slider.
