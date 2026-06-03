# Objective

## Playable Flipping Cards Game

---

## Description

This objective focuses on implementing a fully functional flipping card game across four interconnected pages: Play, Preparation, In-Game, and End-Game. The goal is to bring existing non-functional UI elements to life by enabling navigation flows, game mechanics, a timer system, and dynamic result screens — all based on provided Figma designs and strictly using content defined in the input.

---

## Objectives Breakdown

### 1. Main Objective Area

Enable a complete and playable flipping card game experience starting from the Play Page through to the End-Game results screen, following the provided Figma layouts and defined content.

---

### 2. Secondary Objective Area

Ensure smooth page-to-page navigation and dynamic content rendering based on user interaction — including deck selection, card flipping, answer tracking, and conditional result display.

---

### 3. Supporting Tasks

#### 3.1 Play Page

- Activate the currently non-functional **Play** button on the Play Page
- Redirect the user to the **Preparation Page** upon clicking Play

#### 3.2 Preparation Page

- Display the selected deck name dynamically: _"You are about to play the [SelectedDeck]"_
- Apply a dynamic color to the selected deck name based on the deck the user chose
- Redirect the user to the **In-Game Page** when the button is pressed

#### 3.3 In-Game Page

- Display an unflipped card showing the **Question No. #** and a _"Tap to Flip"_ indicator label
- On flip, reveal the question and **start the 2-minute timer**
- Provide three action buttons: **End**, **Answered**, and **Pass**
  - **End** → redirects to the End-Game Page
  - **Answered** → proceeds to the next question
  - **Pass** → proceeds to the next question

#### 3.4 End-Game Page

- Display results screen based on player's performance using conditional titles and subtitles
- Refer to the Figma design at `image\figma\flip-card-ending-screen.png` for layout

---

### 4. Detailed Breakdown

#### 4.1 Play Page Functionality

The Play Page already has decks displayed but the Play button is currently non-functional. The required implementation is to wire the Play button to navigate the user to the Preparation Page.

#### 4.2 Preparation Page Content & Behavior

The page must display the exact phrase _"You are about to play the [SelectedDeck]"_ where `[SelectedDeck]` is replaced dynamically with the chosen deck. The deck name must reflect a dynamic color tied to the selected deck. A button on this page redirects to the In-Game Page.

> **Design Reference:** `image\figma\preparation-screen.png`

#### 4.3 In-Game Page Mechanics

The game page hosts the core flipping card gameplay with the following defined behaviors:

##### Card States

- **Unflipped State:** Shows Question No. # and a _"Tap to Flip"_ indicator label
- **Flipped State:** Reveals the question and starts the fixed **2-minute timer**

##### Player Actions

- **End** — Terminates the game and redirects to the End-Game Page
- **Answered** — Marks question as answered and moves to the next question
- **Pass** — Skips the question and moves to the next question

> **Design Reference:** `image\figma\flip-card-screen.png`

#### 4.4 End-Game Page Conditional Results

Results are displayed conditionally based on how the player performed:

##### Scenario A — Player ends the game early without answering

- **Title:** Certified Dodger, [Name]
- **Subtitle:** You passed every question. Suspicious, but we'll allow it.

##### Scenario B — Player answered and passed some questions

- **Title:** Almost Spilled Everything, [Name]
- **Subtitle:** You finished the deck, but some tea stayed unspilled.

##### Scenario C — Player answered all questions without passing

- **Title:** You Spilled Everything, [Name]
- **Subtitle:** You survived the questions. Honestly, iconic behavior.

> **Design Reference:** `image\figma\flip-card-ending-screen.png`

---
