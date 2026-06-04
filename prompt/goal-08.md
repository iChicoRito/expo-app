# Objective

## Deck and Questions Creation with AI Integration Using Gemini

---

## Description

This objective covers the development of a two-part feature: a Deck Creation system and a Question Creation system with both manual and AI-powered input. Users can view built-in decks and create their own custom decks stored locally via localStorage. Questions are managed per deck, with the ability to add, edit, view, and delete entries. AI-generated questions are powered by the Gemini API, with category-aware generation and a rate-limiting mechanism. All UI components must follow the provided Figma design references across the updated image paths.

---

## Objectives Breakdown

### 1. Primary Objective

Build a Deck and Question Creation system with Gemini AI integration, following the provided Figma designs, where users can create and manage custom decks and questions — including AI-assisted question generation — stored locally on their devices.

---

### 2. Secondary Objectives

- Implement reusable Drawer/Sheet and Modal/Dialog components usable across all pages.
- Enforce AI usage rate limiting (15 questions per hour per user).
- Ensure built-in decks are protected from modification or deletion.
- Handle offline/no-internet state gracefully with appropriate UI feedback.

---

### 3. Supporting Tasks

#### 3.1 Deck Management

- Display all built-in and user-created decks on the Deck Creation Page.
- Implement header title, filter chips, and deck list with icons, deck name, and card count.
- Implement "Create Deck" drawer/sheet with fields: Deck Name, Icon (HugeIcons), and Color.
- Save user-created decks to localStorage on the device.
- Show a success snackbar upon deck creation.
- Prevent editing or deletion of built-in decks.

#### 3.2 Question Management

- Redirect users to the Questions Page upon clicking a deck.
- Display a list of questions with a 3-dot context menu per item (Edit, View, Delete).
- Implement Edit and View question actions as a Drawer/Sheet.
- Implement Delete confirmation using a Modal/Dialog.

#### 3.3 Question Input — Manual

- Provide a manual input field inside the Add Question drawer/sheet.
- Validate that manual questions do not exceed 16 words.

#### 3.4 Question Input — AI (Gemini)

- Integrate Gemini API using the provided API key.
- Generate questions strictly related to the selected deck's category.
- Limit AI-generated questions to a maximum of 12 words each.
- Enforce a per-user rate limit of 15 AI generations per hour; block further use until the 1-hour window resets.
- Show a "Question Generating..." dialog while AI is processing.
- Show a no-internet dialog if offline state is detected before an AI request.
- Display the generated question in a dialog with "Accept" and "Re-generate" options.
- On acceptance, populate the question input field with the generated question for optional user editing.

---

### 4. Detailed Breakdown

#### 4.1 Deck Creation Page Layout

The page must match the Figma design found at:

- `image\figma\deck-questions\deck-screens.png`

It includes a header title, filter chips for categorization, and a list of decks — each showing an icon, deck name, and the number of cards. User-created decks are stored in localStorage and displayed alongside built-in decks.

#### 4.2 Create Deck Drawer/Sheet

Triggered by a "Create Deck" button, the drawer/sheet form collects three inputs: Deck Name (text), Icon (selected from HugeIcons), and a color picker for the deck's preferred color. Upon successful submission, a snackbar notification confirms the creation.

#### 4.3 Questions Page Layout

The page layout must follow the Figma designs across all frames:

| Path                                                                 | Purpose                       |
| -------------------------------------------------------------------- | ----------------------------- |
| `image\figma\deck-questions\questions-screens.png`                   | Overall questions page layout |
| `image\figma\deck-questions\questions-creation-figma-frames (1).png` | Frame 1 reference             |
| `image\figma\deck-questions\questions-creation-figma-frames (2).png` | Frame 2 reference             |
| `image\figma\deck-questions\questions-creation-figma-frames (3).png` | Frame 3 reference             |
| `image\figma\deck-questions\questions-creation-figma-frames (4).png` | Frame 4 reference             |
| `image\figma\deck-questions\questions-creation-figma-frames (5).png` | Frame 5 reference             |
| `image\figma\deck-questions\questions-creation-figma-frames (6).png` | Frame 6 reference             |
| `image\figma\deck-questions\questions-creation-figma-frames (7).png` | Frame 7 reference             |
| `image\figma\deck-questions\questions-creation-figma-frames (8).png` | Frame 8 reference             |

The page contains a header title and a list of questions. The sub-title explicitly mentioned in the Figma is to be excluded from the implementation. Each question item has a 3-dot vertical menu with Edit, View, and Delete options.

#### 4.4 AI Generation Rules and Rate Limiting

The Gemini API must be prompted to generate questions that are strictly relevant to the selected deck's category — not random. Each generated question must not exceed 12 words. A counter stored per user tracks the number of AI generations; once 15 is reached, the AI feature is locked until 1 hour has elapsed from the first generation in that window.

#### 4.5 Reusable UI Components

A reusable Drawer/Sheet component and a reusable Modal/Dialog component must be built and used consistently across all pages in the system. These components cover:

- Create Deck form
- Add / Edit / View Question form
- Delete confirmation dialog
- AI generating progress dialog
- AI result dialog (Accept / Re-generate)
- No-internet connection dialog

#### 4.6 Gemini API Configuration

The Gemini API key to be used is: `AQ.Ab8RN6Jk6u61pT8dedM0SDlqDJotxdtwjVGjf4KLYPrPn9l3Dg`. This key must be configured in the AI integration layer for all Gemini API requests.
