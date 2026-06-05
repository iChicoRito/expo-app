# Objective: Deck Creation Revision & Play Page Card Design Update

---

## Description

This objective covers two interconnected revisions to the Spillr app. The first targets the **deck creation flow**, replacing the oversized icon picker with a new set of five custom SVG icons whose colors respond dynamically to the user's color selection. The second targets the **play page**, replacing the current card visuals with a new set of color-matched card holder SVGs that correspond to whichever color was chosen at deck creation time. Together, these changes establish a cohesive, token-driven visual system where a deck's chosen color propagates consistently across the creation UI and the in-game card presentation.

---

## Objectives Breakdown

### 1. Primary Objective

Replace the current icon picker in the deck creation screen and the existing play-page card visuals with a new, color-token-driven SVG asset system — ensuring that a deck's selected color is reflected in both the creation UI (icon tinting) and the play experience (card holder visuals).

---

### 2. Secondary Objectives

- Maintain existing card badge/icon behavior (the "huge icon" decks icon) for all non-creation contexts such as the deck list badges.
- Establish a clear, file-name-based mapping between color selections and their corresponding card holder SVG assets.
- Ensure the icon color system derives from the existing color token constants already defined in the codebase.

---

### 3. Supporting Tasks

#### 3.1 Deck Creation — Icon Picker Revision

- Remove the current large/oversized icon picker from the deck creation screen.
- Integrate the five new custom SVG icons (`decks-icon (1–5).svg`) as the selectable card icon options.
- Wire each icon's color to the active color selection so that when a color is chosen, all five icon previews re-render using that color's token values (e.g., `blue-500`, `blue-400`, `blue-200` for the blue token set).
- Ensure the color token mapping references the existing constants folder — no hardcoded hex values should be introduced.

#### 3.2 Deck Badge — Preservation of Existing Behavior

- The icon displayed on the deck badge (list view, card headers, etc.) must continue using the existing "huge icon" deck icon asset.
- Clarify in implementation that the new small SVG icons (picker) and the badge/huge icon are **separate assets serving separate roles** and must not be conflated.

#### 3.3 Play Page — Card Visual Revision

- Replace the current card container visuals in the play page with the new color-matched card holder SVGs.
- Implement a mapping from the deck's stored color selection to its corresponding card holder file:

| Color Selection | Card Holder Asset                    |
| --------------- | ------------------------------------ |
| Amber / Orange  | `amber-orange-card-holder.svg`       |
| Black / Neutral | `black-neutral-card-holder.svg`      |
| Cyan / Sky Blue | `cyan-sky-blue-card-holder.svg`      |
| Fuchsia         | `fuchsia-card-holder.svg`            |
| Indigo          | `indigo-card-holder.svg`             |
| Lime            | `lime-card-holder.svg`               |
| Pink            | `pink-card-holder.svg`               |
| Purple / Violet | `purple-violet-card-holder.svg`      |
| Red / Rose      | `red-rose-card-holder.svg`           |
| Teal / Emerald  | `teal-emerald-green-card-holder.svg` |
| Yellow          | `yellow-card-holder.svg`             |

- Load the correct card holder SVG at runtime based on the deck's `colorSelection` value.

#### 3.4 Asset Registration

- Register all new SVG assets in the project under their designated paths:
  - Card holders → `assets/svg/cards-holder/`
  - Deck icons → `assets/svg/cards-icons/`
- Verify asset names match exactly with file-name-based lookup logic (case-sensitive, hyphen-delimited).

---

### 4. Detailed Breakdown

#### 4.1 Color Token System for SVG Icon Tinting

Each of the five new deck icons in the picker is designed with multi-shade paths. When a color is selected, the icon paths should be recolored using the corresponding shades from the color token constants (e.g., for blue: `blue-200` → lightest fill, `blue-400` → mid fill, `blue-500` → primary fill). This must be driven by the existing constants/tokens folder — no new hardcoded color definitions should be added. The initial/default icon state is blue.

#### 4.2 Card Holder SVG — File Naming Convention

The card holder SVGs follow a `{color-name}-card-holder.svg` naming convention. The color name in the filename must exactly match the color key used in the deck creation's color selection (or map to it unambiguously). For example, selecting "amber" or "orange" at creation time resolves to `amber-orange-card-holder.svg`. This mapping must be defined explicitly in code (e.g., a lookup object or switch statement) to avoid fragile string interpolation.

#### 4.3 Separation of Icon Roles

Two distinct icon types exist within this system and must never be substituted for each other:

- **Picker Icons** (`decks-icon (1).svg` – `decks-icon (5).svg`): Small, stylized SVGs used only within the deck creation color/icon picker. Their color is dynamic, tied to the color token selection.
- **Badge / Huge Icons**: The existing large icons already used on deck list items, headers, and other badge surfaces. These remain unchanged and are not affected by this revision.

##### Asset Path Reference _(as specified)_

```
assets/svg/cards-holder/amber-orange-card-holder.svg
assets/svg/cards-holder/black-neutral-card-holder.svg
assets/svg/cards-holder/cyan-sky-blue-card-holder.svg
assets/svg/cards-holder/fuchsia-card-holder.svg
assets/svg/cards-holder/indigo-card-holder.svg
assets/svg/cards-holder/lime-card-holder.svg
assets/svg/cards-holder/pink-card-holder.svg
assets/svg/cards-holder/purple-violet-card-holder.svg
assets/svg/cards-holder/red-rose-card-holder.svg
assets/svg/cards-holder/teal-emerald-green-card-holder.svg
assets/svg/cards-holder/yellow-card-holder.svg

assets/svg/cards-icons/decks-icon (1).svg
assets/svg/cards-icons/decks-icon (2).svg
assets/svg/cards-icons/decks-icon (3).svg
assets/svg/cards-icons/decks-icon (4).svg
assets/svg/cards-icons/decks-icon (5).svg
```

#### 4.4 Figma Design References

Figma layout references for both the revised deck creation screen and the updated play page card designs are to be provided separately by the designer and linked to this objective. The uploaded reference images (`card-new-style-reference.png`, `play-page-frame.png`, `DeckScreens.png`) serve as the visual specification baseline.

---
