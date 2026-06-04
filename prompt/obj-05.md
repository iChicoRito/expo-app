# Objective

## On-boarding screen: first-time only display, name saving, and snackbar removal

---

## Description

The on-boarding screen must only appear the first time a user opens the app. Once the user completes the on-boarding flow by entering their name, the name is saved on the device and the user is automatically navigated to the Play Page. On subsequent app launches, the on-boarding screen is skipped entirely. Additionally, the Snackbar message that currently appears when the user presses the "Let's Go" button on the last on-boarding page must be removed.

---

## Objectives Breakdown

### 1. Primary Objective

Ensure the on-boarding screen is shown only once — on the user's very first time opening the app — and never repeated on subsequent launches.

---

### 2. Secondary Objectives

- Save the user's entered name to the device upon completion of on-boarding.
- Automatically navigate the user to the Play Page after completing on-boarding, without requiring manual back navigation.
- Remove the Snackbar message triggered by the "Let's Go" button on the last on-boarding screen.

---

## Supporting Tasks

### 3.1 On-boarding visibility control

- Check on app launch whether the user has previously completed on-boarding
- Show the on-boarding screen only if it is the user's first time opening the app
- Skip the on-boarding screen entirely on all subsequent app launches

### 3.2 Name input and device storage

- Accept the user's name input during on-boarding
- Save the entered name to local device storage upon submission
- Ensure the saved name persists across app sessions

### 3.3 Navigation after on-boarding

- Automatically redirect the user to the Play Page after the name is saved
- Remove any requirement for the user to navigate back manually to reach the Play Page

### 3.4 Snackbar removal

- Locate the Snackbar message tied to the "Let's Go" button on the last on-boarding page
- Remove the Snackbar message trigger from that button action

---

## Detailed Breakdown

### 4.1 First-time detection

A flag must be stored on the device to track whether the user has completed on-boarding. On every app launch, this flag is checked before deciding whether to display the on-boarding screen.

### 4.2 Name persistence

The user's name entered during on-boarding must be saved to the device's local storage. This saved name must remain available across all future app sessions.

### 4.3 Automatic navigation to Play Page

Upon saving the user's name, the app must automatically navigate the user directly to the Play Page. This must happen without requiring any additional user action or back-stack navigation.

### 4.4 Snackbar removal on "Let's Go" button

The Snackbar message currently displayed when the user taps "Let's Go" on the final on-boarding page must be removed. No replacement message or alternative feedback is mentioned — the action should complete silently.

---
