/**
 * One column of the profile stat row (`profile-screen.png`): a rounded square
 * holding a colored number, with a grey caption below. Used for Cards Played
 * (teal), Cards Answered (orange) and Cards Passed (red).
 */
import { StyleSheet, Text, View } from "react-native";

import type { ColorScaleKey } from "@/components/deck-card";
import { Tokens } from "@/constants/tokens";

type Props = {
  value: number;
  label: string;
  colorKey: ColorScaleKey;
};

export function StatBadge({ value, label, colorKey }: Props) {
  const scale = Tokens.colors[colorKey];
  return (
    <View style={styles.column}>
      <View style={[styles.badge, { backgroundColor: scale[50] }]}>
        <Text style={[styles.value, { color: scale[500] }]}>{value}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
    alignItems: "center",
    gap: Tokens.spacing[2],
  },
  badge: {
    minWidth: 48,
    paddingHorizontal: Tokens.spacing[2],
    paddingVertical: Tokens.spacing[1],
    borderRadius: Tokens.layout.borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: Tokens.typography.fontSize.lg,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  label: {
    fontSize: Tokens.typography.fontSize.xs,
    color: Tokens.colors.neutral[400],
    textAlign: "center",
  },
});
