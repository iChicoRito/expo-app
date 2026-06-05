/**
 * One row inside a settings card on the profile screen: a left glyph + label,
 * and either a chevron (navigates) or a custom right element (e.g. a toggle).
 * Mirrors the visual language of `deck-list-item.tsx`.
 */
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Tokens } from "@/constants/tokens";

type Props = {
  icon: IconSvgElement;
  label: string;
  right?: "chevron" | React.ReactNode;
  onPress?: () => void;
};

export function SettingsRow({ icon, label, right = "chevron", onPress }: Props) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      style={styles.row}
      {...(onPress ? { activeOpacity: 0.7, onPress } : {})}
    >
      <HugeiconsIcon icon={icon} size={20} color={Tokens.colors.neutral[800]} />
      <Text style={styles.label}>{label}</Text>
      {right === "chevron" ? (
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={20}
          color={Tokens.colors.neutral[400]}
        />
      ) : (
        right
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing[4],
    paddingVertical: Tokens.spacing[3],
  },
  label: {
    flex: 1,
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.normal,
    color: Tokens.colors.neutral[800],
  },
});
