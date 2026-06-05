import type React from "react";
import type { SvgProps } from "react-native-svg";

import type { ColorScaleKey } from "@/components/deck-card";

import AmberOrange from "@/assets/svg/cards-holder/amber-orange-card-holder.svg";
import CyanSkyBlue from "@/assets/svg/cards-holder/cyan-sky-blue-card-holder.svg";
import Fuchsia from "@/assets/svg/cards-holder/fuchsia-card-holder.svg";
import Indigo from "@/assets/svg/cards-holder/indigo-card-holder.svg";
import Lime from "@/assets/svg/cards-holder/lime-card-holder.svg";
import Pink from "@/assets/svg/cards-holder/pink-card-holder.svg";
import PurpleViolet from "@/assets/svg/cards-holder/purple-violet-card-holder.svg";
import RedRose from "@/assets/svg/cards-holder/red-rose-card-holder.svg";
import TealEmeraldGreen from "@/assets/svg/cards-holder/teal-emerald-green-card-holder.svg";
import Yellow from "@/assets/svg/cards-holder/yellow-card-holder.svg";

// black-neutral-card-holder.svg exists in assets but is not mapped to any current deck color.
const CARD_HOLDER_MAP: Record<ColorScaleKey, React.FC<SvgProps>> = {
  red: RedRose,
  rose: RedRose,
  orange: AmberOrange,
  amber: AmberOrange,
  yellow: Yellow,
  lime: Lime,
  green: TealEmeraldGreen,
  emerald: TealEmeraldGreen,
  teal: TealEmeraldGreen,
  cyan: CyanSkyBlue,
  sky: CyanSkyBlue,
  blue: Indigo,
  indigo: Indigo,
  violet: PurpleViolet,
  purple: PurpleViolet,
  fuchsia: Fuchsia,
  pink: Pink,
};

export function getCardHolder(colorKey: ColorScaleKey): React.FC<SvgProps> {
  return CARD_HOLDER_MAP[colorKey] ?? Indigo;
}
