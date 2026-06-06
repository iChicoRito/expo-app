# Objective: Fix Username Display Inconsistency Across Screens

---

## Description

After the onboarding screen, users are prompted to input their name. However, the name entered during onboarding is not being correctly carried over and displayed on subsequent screens. Instead of showing the user's actual inputted name, the app falls back to displaying the placeholder word "Friend." This occurs on at least two confirmed screens: the Play page and the Profile page. The fix requires ensuring the user's inputted name is correctly stored during onboarding and consistently retrieved and displayed wherever the name is referenced throughout the app.

---

## Objectives Breakdown

### 1. Primary Objective

Ensure the name entered by the user during the onboarding screen is correctly persisted and displayed — replacing all instances of the fallback word "Friend" — on the Play page, the Profile page, and any other screen that references the user's name.

---

### 2. Secondary Objectives

- Audit all screens and components that display the user's name to identify any additional instances where "Friend" may appear instead of the actual name.
- Improve overall user experience consistency by guaranteeing the user's identity is reflected accurately throughout the app post-onboarding.

---

### 3. Supporting Tasks

#### 3.1 Name Input — Onboarding Screen

- Verify that the name input field on the onboarding screen correctly captures and saves the user's input.
- Confirm the inputted name is persisted to the appropriate local or remote state/storage after onboarding is completed.

#### 3.2 Name Display — Play Page

- Locate the component or variable on the Play page currently rendering the word "Friend."
- Replace the hardcoded or fallback "Friend" string with the actual stored user name value.

#### 3.3 Name Display — Profile Page

- Locate the component or variable on the Profile page currently rendering the word "Friend."
- Replace the hardcoded or fallback "Friend" string with the actual stored user name value.

#### 3.4 Global Audit

- Search the codebase for all instances where "Friend" is used as a display name fallback.
- Confirm whether "Friend" is a global default/fallback and, if so, fix the root cause rather than patching individual screens.

---

### 4. Detailed Breakdown

#### 4.1 Root Cause Investigation

The likely causes are one or more of the following:

| Possible Cause                               | Description                                                                                                                                        |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name not saved after onboarding**          | The input value is captured in local state but not persisted to storage or global state before navigation.                                         |
| **Name not read correctly on other screens** | The Play and Profile pages are reading from the wrong variable, key, or state slice — defaulting to "Friend" when the value is empty or undefined. |
| **Hardcoded fallback not guarded**           | A fallback of "Friend" is used when the name is falsy, but the name is never actually being passed in.                                             |

#### 4.2 Confirmed Affected Screens

| Screen           | Issue                                                  |
| ---------------- | ------------------------------------------------------ |
| **Play Page**    | Displays "Friend" instead of the user's inputted name. |
| **Profile Page** | Displays "Friend" instead of the user's inputted name. |

#### 4.3 Expected Behavior After Fix

| Scenario                                 | Expected Result                                     |
| ---------------------------------------- | --------------------------------------------------- |
| User inputs "James" during onboarding    | All screens display "James," not "Friend."          |
| User returns to the app after closing it | Name persists and is still displayed correctly.     |
| Any screen referencing the user's name   | Shows actual name, never the literal word "Friend." |

##### Nested Details

- The fix must address the **storage/persistence layer** (e.g., AsyncStorage, context, Redux, or equivalent), not just the UI display layer, to prevent regression on app restart.
- If "Friend" is used as a legitimate fallback for users who have not yet entered a name (e.g., skipped onboarding), it must only appear in that specific case — **never** when a name has been inputted.
- After the fix, test the full onboarding-to-play flow end-to-end to confirm the name propagates correctly to all screens.

---
