# Objective

## Fix Incorrect Back Button Redirection Behavior

---

## Description

The back button in the application is incorrectly redirecting users to previous pages even after their intended actions have been completed. Instead of exiting the app or navigating to a logically appropriate screen, it routes users back through intermediate or preparation pages that are no longer relevant. The goal is to correct the navigation stack behavior so that the back button responds contextually and accurately based on the user's current state and completed actions.

---

## Objectives Breakdown

### 1. Primary Objective

Fix the back button navigation so it no longer redirects users to unnecessary or already-completed pages, and instead performs the correct action based on the current screen context.

---

### 2. Secondary Objectives

- Ensure the back button on the Play Page exits the app instead of returning to the Preparation Page.
- Correct all instances of incorrect back action redirection across the application.

---

### 3. Supporting Tasks

#### 3.1 Navigation Stack Investigation

- Identify how the navigation stack is being built when transitioning from the Preparation Page to the Play Page.
- Determine why the Preparation Page remains in the back stack after the user reaches the Play Page.

#### 3.2 Back Action Correction

- Fix the Play Page so that pressing the back button exits the app rather than returning to the Preparation Page.
- Review and correct other pages where the back action may route to an unnecessary or already-completed page.

---

### 4. Detailed Breakdown

#### 4.1 Identified Incorrect Behavior

When a user navigates to the Play Page, pressing the back button redirects them to the Preparation Page. This is incorrect — by the time the user is on the Play Page, the preparation flow is already completed and should not be accessible via back navigation.

#### 4.2 Expected Correct Behavior

On the Play Page, pressing the back button should exit the application entirely, not return to the Preparation Page. The back action must reflect the logical completion state of the user's flow.

#### 4.3 Scope of Fix

Correct the incorrect back redirection starting with the Play Page as the confirmed affected screen. Additional screens with the same incorrect redirection behavior should also be identified and fixed.

---
