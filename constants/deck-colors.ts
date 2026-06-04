/**
 * Color palette for custom decks. Each swatch is a `ColorScaleKey` that maps to
 * a real Tailwind scale in `constants/tokens.ts`, so custom decks reuse the same
 * `getDeckColorScale` / `bgColor` / `bgLight` derivation as the built-in decks.
 */
import type { ColorScaleKey } from "@/components/deck-card";
import { Tokens } from "@/constants/tokens";

/** Ordered swatches shown in the Create Deck color picker (mirrors the Figma row). */
export const DECK_COLOR_SWATCHES: ColorScaleKey[] = [
  "blue",
  "orange",
  "teal",
  "red",
  "violet",
  "pink",
  "purple",
  "cyan",
];

/** The solid (500) hex for a color key — used for swatch fills and accents. */
export function colorKeyToHex(colorKey: ColorScaleKey): string {
  return Tokens.colors[colorKey][500];
}
