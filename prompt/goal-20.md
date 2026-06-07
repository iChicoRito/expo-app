Based on the provided input, here is the structured objective document:

---

# Objective

## Deck Editing, Icon Standardization & Dynamic Profile Icon

---

## Description

This objective covers three areas of improvement for the application. The primary focus is enhancing deck management on the Deck Page by introducing long-press context menus, an edit sheet, input validation, and delete confirmation dialogs. A sub-objective standardizes all deck-related badge icons across the Deck Page and Play History to use HugeIcons' Deck or Card icon component. A second sub-objective ensures the profile icon on the Play Page reflects real-time profile updates and navigates the user to the Profile Page on tap.

---

## Objectives Breakdown

### 1. Primary Objective

Implement full deck editing capabilities on the Deck Page, including context menu interaction, an edit sheet for modifying deck properties, character-limited title validation, and a delete confirmation flow — while restricting deletion of built-in decks.

---

### 2. Secondary Objectives

- Standardize all deck badge icons across the Deck Page and Play History (Profile) to use the HugeIcons Deck or Card icon component instead of SVG icons.
- Dynamically sync the profile icon on the Play Page with the user's current profile data, and link it to the Profile Page.

---

### 3. Supporting Tasks

#### 3.1 Deck Context Menu & Interaction

- Implement a long-press (hold) gesture on deck items in the Deck Page to trigger a context menu.
- Context menu must expose two actions: **Edit** and **Delete**.
- Built-in decks must not display or allow the **Delete** action.

#### 3.2 Deck Edit Sheet

- Tapping **Edit** opens the same sheet used for adding new decks.
- The sheet must allow editing of the deck's **name**, **icon**, and **color**.
- Both built-in and user-created decks are editable via this sheet.

#### 3.3 Deck Title Validation

- Apply a maximum character limit of **20 characters** to the deck title/name field.
- Validation applies to both the **Add Deck** and **Edit Deck** flows.

#### 3.4 Deck Deletion Confirmation

- Tapping **Delete** in the context menu must show a confirmation dialog before proceeding.
- This applies only to user-created decks (built-in decks cannot be deleted).

#### 3.5 HugeIcons Icon Standardization

- Replace all deck badge icons on the **Deck Page** with the HugeIcons Deck or Card icon component.
- Replace all deck badge icons in **Profile → Play History** with the same HugeIcons component.
- This affects icon components, not SVG assets.

#### 3.6 Dynamic Profile Icon on Play Page

- The profile icon displayed on the top-right of the Play Page must dynamically update whenever the user updates their profile.
- Tapping the profile icon must navigate the user to the **Profile Page**.

---

### 4. Detailed Breakdown

#### 4.1 Context Menu Behavior

A long-press gesture on a deck item in the Deck Page surfaces a context menu with **Edit** and **Delete** options. For built-in decks, the **Delete** option must be absent or disabled — only **Edit** is permitted.

#### 4.2 Edit Sheet Reuse

The edit flow reuses the existing **Add New Deck** sheet component. The sheet must be pre-populated with the deck's current name, icon, and color when opened in edit mode. Both built-in and user-created decks support editing via this sheet.

#### 4.3 Title Character Limit Validation

The deck title input must enforce a **20-character maximum**. This validation is shared between the add and edit flows. No details on error messaging style are specified in the input.

#### 4.4 Delete Confirmation Dialog

Before a deck is deleted, a confirmation prompt must be shown to the user. This is explicitly for improved UX. No specific copy or dialog style is defined in the input.

#### 4.5 HugeIcons Replacement Scope

The icon replacement applies strictly to **icon components** (not SVG files). The two affected surfaces are:

- Deck badge icons on the **Deck Page**
- Deck badge icons in **Profile → Play History**

The target icon is the **HugeIcons Deck icon or Card icon**.

#### 4.6 Play Page Profile Icon Sync

The profile icon in the top-right of the Play Page must reactively reflect the user's latest profile data. On tap, the user is navigated to the **Profile Page**. No additional behavior on tap is specified in the input.
