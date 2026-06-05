/**
 * Renders a selected profile avatar at a given size. The source SVGs use a
 * non-square viewBox (185x133), so we render the component scaled to cover a
 * square box and clip it — callers wrap this in a circle/rounded square with
 * `overflow: "hidden"`. Single source of truth for both the profile header and
 * the Edit-Profile grid.
 */
import { View } from "react-native";

import { getAvatarComponent, type AvatarId } from "@/constants/avatars";

type Props = {
  id: AvatarId;
  size: number;
};

export function Avatar({ id, size }: Props) {
  const Svg = getAvatarComponent(id);
  // The art sits in the upper portion of the 185x133 viewBox; scale to the box
  // width and center vertically so the face is framed inside the container.
  const artHeight = size * (133 / 185);
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Svg width={size} height={artHeight} />
    </View>
  );
}
