# Objective

## Profile Page and Manageable Profile Settings

---

## Description

This objective covers the implementation of a fully designed profile page and its associated settings and options for a card-based gameplay application. The profile page must strictly follow the provided Figma design screenshots as the sole visual reference — covering layout, colors, typography, spacing, and component structure. Users will be able to view their stats, edit their profile (including avatar and background color selection), and access various settings options such as play history, deck management, and audio controls. The overall goal is to deliver a functional and visually accurate profile experience with prototype-level interactivity for certain features.

---

## Objectives Breakdown

### 1. Primary Objective

Implement a profile page that strictly and accurately matches the provided Figma design screenshot references (`profile-screen.png`, `profile-screens.png`), including user avatar display, username, gameplay stats, and a navigable settings options list.

---

### 2. Secondary Objectives

- Implement an Edit Profile drawer/sheet that strictly matches `edit-profile.png`, allowing users to update their name, select from 18 provided SVG avatars, and choose an avatar background color.
- Implement a Play History page that strictly matches `play-history.png`, with a timeline-style layout reflecting deck session outcomes.
- Implement a Decks and Cards page that strictly matches `decks-lists.png`, showing created decks with a delete option via a three-dot context menu.
- Implement a Music and Sound drawer/sheet that strictly matches `music-sound-option.png`, with functional prototype sliders for volume controls.
- Implement functional toggle switches for Notification and Dark Mode (prototype-level only; no backend functionality yet).

---

## Objectives Breakdown

### 3. Supporting Tasks

#### 3.1 Profile Page UI — Reference: `profile-screen.png`, `profile-screens.png`

- Display user avatar placeholder and username exactly as laid out in the Figma reference
- Display three-column stat row: Cards Played, Cards Answered, Cards Passed — matching the design's positioning, colors, and typography
- Render settings options list: Play History, Dex and Cards, Notification, Dark Mode, Music and Sound — using the same visual style, icons, and spacing as shown
- Add "Edit Profile" button below the username, matching the button style in the reference

#### 3.2 Edit Profile Drawer — Reference: `edit-profile.png`

- Open a drawer/sheet on "Edit Profile" button tap, matching the drawer design, handle, and layout from the reference
- Allow user to edit their profile name using the input field style shown
- Display and allow selection of all 18 SVG avatars from `assets\svg\avatars\` in the grid/scroll layout shown in the design
- Allow selection of avatar background color using the color picker/swatch layout shown in the reference

#### 3.3 Play History Page — Reference: `play-history.png`

- Navigate to Play History page from the settings list
- Display header title matching the reference
- Implement a timeline-style layout of all played decks exactly as shown in the design
- Show deck outcome per session: outlined circle (incomplete/auto-ended round) or filled solid circle (all cards answered/spilled) — using the exact visual style from the reference

#### 3.4 Decks and Cards Page — Reference: `decks-lists.png`

- Navigate to Decks and Cards page from the settings list
- Display a list of all user-created decks using the card/list style shown in the reference
- Show a three-dot icon per deck that opens a delete context menu, matching the design

#### 3.5 Music and Sound Drawer — Reference: `music-sound-option.png`

- Open a drawer/sheet on "Music and Sound" option tap, matching the drawer design from the reference
- Include a functional slider for Master Volume styled as shown
- Include a functional slider for Background Music styled as shown
- Include a functional slider for Sound Effects styled as shown
- Sliders are prototype-level only; no actual audio system is connected yet

#### 3.6 Prototype Toggles — Reference: `profile-screen.png`

- Render a functional toggle switch for Notification matching the toggle style in the reference (no backend behavior)
- Render a functional toggle switch for Dark Mode matching the toggle style in the reference (no backend behavior)

---

### 4. Detailed Breakdown

#### 4.1 Figma Design Screenshot Compliance

All six provided images are the **sole and authoritative visual reference** for this implementation:

| Screen                 | Reference File                              |
| ---------------------- | ------------------------------------------- |
| Main Profile Page      | `profile-screen.png`, `profile-screens.png` |
| Edit Profile Drawer    | `edit-profile.png`                          |
| Play History Page      | `play-history.png`                          |
| Decks and Cards Page   | `decks-lists.png`                           |
| Music and Sound Drawer | `music-sound-option.png`                    |

Every screen, drawer, and component must match its corresponding reference file exactly in terms of layout, color palette, typography, spacing, iconography, and visual hierarchy. No visual deviations, assumptions, or creative liberties are permitted.

#### 4.2 Avatar Selection System

There are exactly 18 SVG avatar files located at `assets\svg\avatars\user-avatar (1).svg` through `user-avatar (18).svg`. These must be presented as selectable options within the Edit Profile drawer using the exact grid or scrollable layout visible in `edit-profile.png`. The user must also be able to choose an avatar background color using the color selection UI shown in the same reference.

#### 4.3 Play History Timeline Logic

The timeline display must reflect the user's gameplay outcome per deck session, using the exact visual style from `play-history.png`. Two visual states are defined:

##### Nested Details

- **Outlined circle** — the user ended the round without answering all cards (incomplete/auto-ended session)
- **Filled solid circle** — the user answered and spilled all cards (complete session)
- No other states are mentioned; do not add additional indicators beyond what is shown in the reference

#### 4.4 Decks and Cards Interaction

The Decks and Cards page is list-only, as shown in `decks-lists.png`. The only interactive element explicitly stated is a three-dot icon that opens a delete context menu per deck. No editing, reordering, or other actions are specified.

#### 4.5 Music and Sound Prototype Scope

The sliders for Master Volume, Background Music, and Sound Effects must be interactive and movable by the user, using the exact slider style shown in `music-sound-option.png`. They do not need to control any actual audio output at this stage, as no background music or sound effects system is implemented yet.

> Notification and Dark Mode backend functionality: _Not applicable based on provided input — explicitly deferred for later implementation._

---

## Design Reference Files

> ⚠️ These files are the **strict visual authority** for this entire objective. Implementation must not deviate from them.

```
image\figma\profile-screens\profile-screen.png
image\figma\profile-screens\profile-screens.png
image\figma\profile-screens\edit-profile.png
image\figma\profile-screens\play-history.png
image\figma\profile-screens\decks-lists.png
image\figma\profile-screens\music-sound-option.png
```
