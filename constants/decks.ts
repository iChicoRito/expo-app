import {
  BookOpen01Icon,
  DropletIcon,
  FavouriteIcon,
  FireIcon,
  Mic01Icon,
  WinkIcon,
} from "@hugeicons/core-free-icons";

import type { DeckData } from "@/components/deck-card";
import { Tokens } from "@/constants/tokens";

export type DeckColorScale = {
  c300: string;
  c400: string;
  c500: string;
  c600: string;
};

/**
 * Single source of truth for the playable decks. Each screen in the game loop
 * (Play → Preparation → In-Game → End-Game) looks decks up from here by id so
 * colors, titles and icons stay consistent across the flow.
 */
export const DECKS: DeckData[] = [
  {
    id: "deep-spill",
    title: "Deep Spill",
    bgColor: "#3B82F6",
    bgLight: "#EFF6FF",
    icon: DropletIcon,
    colorKey: "blue",
  },
  {
    id: "no-dead-air",
    title: "No Dead Air",
    bgColor: "#A855F7",
    bgLight: "#FAF5FF",
    icon: Mic01Icon,
    colorKey: "purple",
  },
  {
    id: "drop-lore",
    title: "Drop Lore",
    bgColor: "#F97316",
    bgLight: "#FFF7ED",
    icon: BookOpen01Icon,
    colorKey: "orange",
  },
  {
    id: "chaos-mode",
    title: "Chaos Mode",
    bgColor: "#14B8A6",
    bgLight: "#F0FDFA",
    icon: WinkIcon,
    colorKey: "teal",
  },
  {
    id: "hot-seat",
    title: "Hot Seat",
    bgColor: "#EF4444",
    bgLight: "#FEF2F2",
    icon: FireIcon,
    colorKey: "red",
  },
  {
    id: "date-mode",
    title: "Date Mode",
    bgColor: "#EC4899",
    bgLight: "#FDF2F8",
    icon: FavouriteIcon,
    colorKey: "pink",
  },
];

/** Look up a deck by its id. Returns `undefined` for unknown ids. */
export function getDeckById(id: string | undefined): DeckData | undefined {
  return DECKS.find((deck) => deck.id === id);
}

/** Resolve the color scale tokens for a deck's color key. */
export function getDeckColorScale(deck: DeckData): DeckColorScale {
  const s = Tokens.colors[deck.colorKey];
  return { c300: s[300], c400: s[400], c500: s[500], c600: s[600] };
}
