/**
 * A single row on the Deck page: colored icon badge + deck name + card count +
 * chevron. Tapping opens the deck's Questions page.
 */
import { ArrowRight01Icon, Cards02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Tokens } from "@/constants/tokens";
import type { StoreDeck } from "@/contexts/deck-store";

type Props = {
  deck: StoreDeck;
  cardCount: number;
  onPress: () => void;
  onLongPress?: () => void;
};

export const DeckListItem = memo(function DeckListItem({
  deck,
  cardCount,
  onPress,
  onLongPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={[styles.iconBadge, { backgroundColor: deck.bgColor }]}>
        <HugeiconsIcon icon={Cards02Icon} size={22} color={Tokens.colors.white} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{deck.title}</Text>
        <Text style={styles.count}>x{cardCount} Cards</Text>
      </View>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={20}
        color={Tokens.colors.neutral[400]}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Tokens.spacing[3],
    paddingHorizontal: Tokens.spacing[3],
    borderRadius: Tokens.layout.borderRadius["3xl"],
    borderWidth: Tokens.effects.borderWidth.default,
    borderColor: Tokens.colors.neutral[100],
    gap: Tokens.spacing[3],
    backgroundColor: Tokens.colors.white,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: Tokens.layout.borderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1, gap: 2 },
  title: {
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.neutral[900],
  },
  count: {
    fontSize: Tokens.typography.fontSize.xs,
    color: Tokens.colors.neutral[400],
  },
});
