/**
 * Icon registry for decks. Custom decks persist a serializable `iconKey` string
 * (icons are JS objects and cannot be stored as JSON), resolved back to a
 * HugeIcons `IconSvgElement` at runtime via `DECK_ICONS`.
 *
 * `DECK_ICON_KEYS` drives the icon picker grid in the Create Deck sheet and
 * mirrors the Figma layout (~16 options).
 */
import {
  BookOpen01Icon,
  CatIcon,
  Coffee01Icon,
  CrownIcon,
  DiceFaces01Icon,
  DrinkIcon,
  DropletIcon,
  FavouriteIcon,
  FireIcon,
  GameController01Icon,
  GhostIcon,
  GiftIcon,
  Leaf01Icon,
  MaskIcon,
  Mic01Icon,
  MusicNote01Icon,
  Pizza01Icon,
  Robot01Icon,
  RocketIcon,
  SmileIcon,
  StarIcon,
  UserIcon,
  WinkIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";

export const DECK_ICONS: Record<string, IconSvgElement> = {
  user: UserIcon,
  heart: FavouriteIcon,
  droplet: DropletIcon,
  leaf: Leaf01Icon,
  camera: Coffee01Icon,
  star: StarIcon,
  mic: Mic01Icon,
  smile: SmileIcon,
  ghost: GhostIcon,
  robot: Robot01Icon,
  cat: CatIcon,
  wink: WinkIcon,
  fire: FireIcon,
  book: BookOpen01Icon,
  dice: DiceFaces01Icon,
  crown: CrownIcon,
  mask: MaskIcon,
  rocket: RocketIcon,
  music: MusicNote01Icon,
  pizza: Pizza01Icon,
  drink: DrinkIcon,
  gift: GiftIcon,
  game: GameController01Icon,
};

/** Ordered keys shown in the Create Deck icon picker. */
export const DECK_ICON_KEYS: string[] = [
  "user",
  "heart",
  "droplet",
  "leaf",
  "star",
  "mic",
  "smile",
  "ghost",
  "robot",
  "cat",
  "wink",
  "fire",
  "book",
  "dice",
  "crown",
  "mask",
];

/** Resolve an icon key to its renderable icon, falling back to a sensible default. */
export function getDeckIcon(iconKey: string | undefined): IconSvgElement {
  return (iconKey && DECK_ICONS[iconKey]) || DECK_ICONS.star;
}
