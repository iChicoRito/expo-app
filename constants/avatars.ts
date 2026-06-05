/**
 * Registry for the 18 selectable profile avatars. Each SVG under
 * `assets/svg/avatars/` is imported as a React component via
 * react-native-svg-transformer (see metro.config.js) and exposed by a stable
 * string id so the selected avatar can be persisted (AsyncStorage-safe) and
 * rendered identically in the profile header and the Edit-Profile grid.
 *
 * NOTE: the source SVGs use a non-square viewBox (185x133), so render them
 * centered inside a square/circular container with `overflow: "hidden"`.
 */
import type React from "react";
import type { SvgProps } from "react-native-svg";

import Avatar1 from "@/assets/svg/avatars/user-avatar-1.svg";
import Avatar2 from "@/assets/svg/avatars/user-avatar-2.svg";
import Avatar3 from "@/assets/svg/avatars/user-avatar-3.svg";
import Avatar4 from "@/assets/svg/avatars/user-avatar-4.svg";
import Avatar5 from "@/assets/svg/avatars/user-avatar-5.svg";
import Avatar6 from "@/assets/svg/avatars/user-avatar-6.svg";
import Avatar7 from "@/assets/svg/avatars/user-avatar-7.svg";
import Avatar8 from "@/assets/svg/avatars/user-avatar-8.svg";
import Avatar9 from "@/assets/svg/avatars/user-avatar-9.svg";
import Avatar10 from "@/assets/svg/avatars/user-avatar-10.svg";
import Avatar11 from "@/assets/svg/avatars/user-avatar-11.svg";
import Avatar12 from "@/assets/svg/avatars/user-avatar-12.svg";
import Avatar13 from "@/assets/svg/avatars/user-avatar-13.svg";
import Avatar14 from "@/assets/svg/avatars/user-avatar-14.svg";
import Avatar15 from "@/assets/svg/avatars/user-avatar-15.svg";
import Avatar16 from "@/assets/svg/avatars/user-avatar-16.svg";
import Avatar17 from "@/assets/svg/avatars/user-avatar-17.svg";
import Avatar18 from "@/assets/svg/avatars/user-avatar-18.svg";

export type AvatarId =
  | "avatar-1"
  | "avatar-2"
  | "avatar-3"
  | "avatar-4"
  | "avatar-5"
  | "avatar-6"
  | "avatar-7"
  | "avatar-8"
  | "avatar-9"
  | "avatar-10"
  | "avatar-11"
  | "avatar-12"
  | "avatar-13"
  | "avatar-14"
  | "avatar-15"
  | "avatar-16"
  | "avatar-17"
  | "avatar-18";

/** Avatar id → component, in the grid order shown in `edit-profile.png`. */
export const AVATARS: Record<AvatarId, React.FC<SvgProps>> = {
  "avatar-1": Avatar1,
  "avatar-2": Avatar2,
  "avatar-3": Avatar3,
  "avatar-4": Avatar4,
  "avatar-5": Avatar5,
  "avatar-6": Avatar6,
  "avatar-7": Avatar7,
  "avatar-8": Avatar8,
  "avatar-9": Avatar9,
  "avatar-10": Avatar10,
  "avatar-11": Avatar11,
  "avatar-12": Avatar12,
  "avatar-13": Avatar13,
  "avatar-14": Avatar14,
  "avatar-15": Avatar15,
  "avatar-16": Avatar16,
  "avatar-17": Avatar17,
  "avatar-18": Avatar18,
};

export const AVATAR_IDS = Object.keys(AVATARS) as AvatarId[];

export const DEFAULT_AVATAR_ID: AvatarId = "avatar-1";

/** Resolve an avatar component for an id, falling back to the default. */
export function getAvatarComponent(id: AvatarId): React.FC<SvgProps> {
  return AVATARS[id] ?? AVATARS[DEFAULT_AVATAR_ID];
}
