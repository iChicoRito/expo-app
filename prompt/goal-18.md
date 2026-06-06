# Objective: Minor Revision — End-Screen Result Logic for Partial Answer Detection

---

## Description

A logic bug exists on the end-game result screen where a user who has answered only some questions — not all — is incorrectly shown the "You Spilled Everything" result. The expected behavior is that "You Spilled Everything" should only appear when the user has answered every question in the deck. If the user ends the round early with unanswered questions still remaining, the result must reflect that not everything was spilled. This is a minor revision to the result classification logic on the end screen.

---

## Objectives Breakdown

### 1. Primary Objective

Fix the end-screen result classification so that "You Spilled Everything" is only shown when the user has answered **all** questions in the deck — and the correct partial-completion result is shown when unanswered questions remain at the time the round ends.

---

### 2. Secondary Objectives

- Ensure the result state accurately reflects the true ratio of answered questions versus the total questions in the deck at the moment the user ends the round.

---

### 3. Supporting Tasks

#### 3.1 Result Logic Fix

- Locate where the end-screen result state is determined in the codebase.
- Update the condition so "You Spilled Everything" only triggers when `answeredCount === totalQuestions`.
- Ensure ending the round early — with only a subset of questions answered — routes to the correct partial-completion result (e.g., "Almost Spilled Everything").

#### 3.2 Verify Affected Result States

- Confirm which result state should display when the user has answered some but not all questions.
- Verify the correct Lottie animation is paired with the partial-completion result, consistent with prior implementation.

---

### 4. Detailed Breakdown

#### 4.1 Bug Description

**Steps to reproduce:**

1. Start a game.
2. Flip the first card and answer only that one question.
3. Click "End Round" while remaining questions are still unanswered in the deck.
4. The end screen incorrectly shows **"You Spilled Everything."**

**Expected behavior:**

- Since only one question was answered and more remain, the result should show the **partial-completion state** (e.g., "Almost Spilled Everything"), not "You Spilled Everything."

#### 4.2 Correct Result Classification Table

| Condition                                                | Correct Result            |
| -------------------------------------------------------- | ------------------------- |
| `answeredCount === 0`                                    | Certified Dodger          |
| `answeredCount > 0` AND `answeredCount < totalQuestions` | Almost Spilled Everything |
| `answeredCount === totalQuestions`                       | You Spilled Everything    |

#### 4.3 Root Cause

The result condition for "You Spilled Everything" is likely evaluating a **flipped count** or **reached count** rather than **answered count** compared against **total question count**. The fix must ensure:

- `totalQuestions` reflects the **full deck size** at round start — not how many cards the user reached or flipped.
- `answeredCount` reflects only questions the user **explicitly answered** — not cards viewed or flipped.
- The final comparison is strictly `answeredCount === totalQuestions`.

---
