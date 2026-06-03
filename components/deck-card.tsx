import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Tokens } from "@/constants/tokens";

export type DeckData = {
  id: string;
  title: string;
  bgColor: string;
  bgLight: string;
  icon: IconSvgElement;
};

type Props = {
  deck: DeckData;
  width: number;
  height: number;
  isActive: boolean;
};

export function DeckCard({ deck, width, height, isActive }: Props) {
  const upperHeight = height * 0.55;
  const lowerHeight = height * 0.45;

  return (
    <View
      style={[styles.card, { width, height, backgroundColor: deck.bgColor }]}
    >
      {/* Upper section — title + count badge */}
      <View style={[styles.upper, { height: upperHeight }]}>
        <Text style={styles.title}>{deck.title}</Text>
        <View style={styles.badge}>
          <Text style={[styles.badgeText, { color: deck.bgColor }]}>
            x16 cards
          </Text>
        </View>
      </View>

      {/* Lower section — icon circle + optional Play button */}
      <View
        style={[
          styles.lower,
          { height: lowerHeight, backgroundColor: deck.bgLight },
        ]}
      >
        <View style={[styles.iconCircle, { borderColor: deck.bgColor }]}>
          <HugeiconsIcon icon={deck.icon} size={24} color={deck.bgColor} />
        </View>

        {isActive && (
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: deck.bgColor }]}
            activeOpacity={0.8}
          >
            <Text style={styles.playText}>Play</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: "hidden",
  },
  upper: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Tokens.spacing[5],
    paddingTop: Tokens.spacing[6],
    gap: Tokens.spacing[3],
  },
  title: {
    fontSize: Tokens.typography.fontSize["4xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.white,
    textAlign: "center",
  },
  badge: {
    backgroundColor: Tokens.colors.white,
    borderRadius: Tokens.layout.borderRadius.full,
    paddingVertical: Tokens.spacing[1],
    paddingHorizontal: Tokens.spacing[4],
  },
  badgeText: {
    fontSize: Tokens.typography.fontSize.sm,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  lower: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: Tokens.spacing[5],
    paddingHorizontal: Tokens.spacing[5],
    gap: Tokens.spacing[4],
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Tokens.colors.white,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -28, // straddle the boundary between the two sections
  },
  playButton: {
    width: "100%",
    paddingVertical: Tokens.spacing[3],
    borderRadius: Tokens.layout.borderRadius.xl,
    alignItems: "center",
  },
  playText: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
});
