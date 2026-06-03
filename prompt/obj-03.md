# Objective

## Play Page After On-Boarding Screen

---

## Description

The objective is to create a Play Page that serves as the home page and primary interface for users after completing the on-boarding process. The Play Page will redirect users from the final on-boarding step and display personalized content including a greeting, subtitle, and a carousel of deck cards. The design must strictly follow the Figma reference layout provided at `image\figma\play-page.png`, utilizing the Spillr logo and streak icon from the assets folder. The page will feature specific typography properties, a carousel of 6 predefined deck cards with individual designs based on the card design reference, and a cards counter badge. All icons throughout the page must use HugeIcons for consistency.

---

## Objectives Breakdown

### 1. Main Objective Area

Create a Play Page that serves as the user's home page after on-boarding, displaying personalized greeting, deck selection, and interactive card carousel with proper visual hierarchy and design consistency.

---

### 2. Secondary Objective Area

Ensure the Play Page adheres to the Figma design reference with specific typography properties, implements carousel functionality with active card state management, and utilizes consistent icon library throughout.

---

### 3. Supporting Tasks

#### 3.1 Page Navigation and Redirect

- Redirect users from the on-boarding page to the Play Page
- Designate the Play Page as the user's home page

#### 3.2 Asset Integration

- Integrate the Spillr logo from `assets\svg\Spillr.svg`
- Integrate the streak icon from `assets\svg\streak-icon.svg`
- Reference the Figma design layout at `image\figma\play-page.png`

#### 3.3 Page Content Structure

- Display title and subtitle sections
- Display a deck carousel with interactive cards
- Include a cards counter badge

#### 3.4 Icon Implementation

- Use HugeIcons for all icons throughout the page
- Ensure consistent icon implementation across all elements

#### 3.5 Final Step Interaction

- Display a snackbar notification when the user presses the "Let's Go" button on the last page
- The snackbar message: "You're on the last page"

---

### 4. Detailed Breakdown

#### 4.1 Title and Subtitle Section

##### Title Content

- Text: "Hey, [UserName] Ready to Spill?"
- Weight: Bold
- Font Size: 2xl
- Color: Teal/500 and Neutral/700

##### Subtitle Content

- Text: "Pick a deck and start the conversation."
- Weight: Normal
- Font Size: Base
- Color: Neutral/400

#### 4.2 Deck Selection Section

##### Section Title

- Text: "Choose Your Deck"
- Weight: SemiBold
- Font Size: Base
- Color: Neutral/700

#### 4.3 Card Carousel Design

##### Card Design Reference

- Reference the card design layout at `image\figma\card-design.png`
- Strictly follow the exact design, layout, and styling from the reference

##### Active Card Behavior

- The middle/center card in the carousel is considered the active card
- The active card displays a Play button
- Inactive cards (not centered in the carousel) do not display the Play button

##### Card Specifications

Create exactly 6 cards with the following titles:

- Deep Spill
- No Dead Air
- Drop Lore
- Chaos Mode
- Hot Seat
- Date Mode

##### Card Title Properties

- Weight: Bold
- Font Size: 4xl

#### 4.4 Cards Counter Badge

##### Badge Specifications

- Position: Below card titles
- Content: Placeholder counter showing "x16 cards"
- Purpose: Indicates the number of cards available in each deck

#### 4.5 Design Consistency

##### Figma Reference Adherence

- The exact design, layout, color scheme, and all visual elements must strictly follow the Figma reference at `image\figma\play-page.png`
- No deviations from the reference design are permitted

##### Icon Implementation

- All icons used throughout the Play Page must be sourced from HugeIcons
- Maintain consistency in icon style and implementation across all page elements

---
