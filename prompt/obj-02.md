# Objective

## On-Boarding Screen with User Name Input and Welcome Screen

---

## Description

The objective is to create a multi-step onboarding screen experience consisting of 3 distinct screens with specific titles and subtitles. The onboarding will feature animated indicators and smooth transitions between screens. The design and visual elements must strictly follow the referenced Figma design layout provided in `[image\figma\on-boarding-screen.png]` and utilize design constants from `constants\theme.ts` and `constants\tokens.ts` to ensure system-wide consistency. Upon reaching the final onboarding step and clicking the "Let's Go" button, the system will display a snackbar notification confirming the user is on the last page.

---

## Objectives Breakdown

### 1. Main Objective Area

Design and implement a 3-step onboarding screen with predefined content, smooth animations, and a user confirmation flow for the final step, while maintaining consistency through established design constants.

---

### 2. Secondary Objective Area

Ensure visual consistency and user experience through animated indicators, smooth screen transitions, adherence to the specified Figma design reference, and consistent application of design system constants.

---

### 3. Supporting Tasks

#### 3.1 Onboarding Screen Structure

- Create onboarding screen with exactly 3 steps
- Assign the specified title and subtitle to each step:
  - Step 1: "Vibe Check" with subtitle "Awkward silence gets cancelled before it even starts, bestie."
  - Step 2: "Tea Time" with subtitle "Pick a card and let the group reveal their funniest, weirdest lore."
  - Step 3: "Main Character" with subtitle "Play with friends, dates, or anyone brave enough to answer."

#### 3.2 Animation and Transitions

- Add smooth animation indicators below each subtitle
- Implement smooth transitions and animations when navigating to the next screen

#### 3.3 Design Reference and Implementation

- Reference the Figma design layout located at `[image\figma\on-boarding-screen.png]`
- Strictly follow the exact layout and design specifications from the reference

#### 3.4 Design System Constants Implementation

- Apply constants from `constants\theme.ts` for theme-related values (colors, spacing, typography)
- Apply constants from `constants\tokens.ts` for design tokens
- Ensure all design elements utilize these constants for better consistency across the system design

#### 3.5 Final Step Interaction

- Display a snackbar notification when the user presses the "Let's Go" button on the last page
- The snackbar message: "You're on the last page"

---

### 4. Detailed Breakdown

#### 4.1 Onboarding Screen Content

The onboarding consists of three distinct screens, each with a title, subtitle, and contextual messaging for different user interaction types (vibes, card reveals, and multiplayer gameplay).

#### 4.2 Visual and Animation Requirements

Indicators with smooth animation must appear below the subtitle on each screen. Screen transitions must include smooth animations when the user navigates forward through the onboarding steps.

#### 4.3 Design Compliance

The exact layout, design elements, and color scheme must be strictly followed from the Figma reference provided at `[image\figma\on-boarding-screen.png]`. No deviations from this reference are permitted.

#### 4.4 Design Constants and System Consistency

All design values must be derived from and reference the established constants:

##### Theme Constants

- Use `constants\theme.ts` for theme-related design values including colors, spacing, typography, and other theme-specific properties to maintain consistency across the system design.

##### Token Constants

- Use `constants\tokens.ts` for design tokens to ensure unified design token implementation and prevent inconsistencies in the visual design system.

#### 4.5 Final Step Behavior

When the user reaches the third and final onboarding step and clicks the "Let's Go" button, a snackbar notification must appear displaying the placeholder message "You're on the last page" to confirm the user has reached the end of the onboarding flow.

---
