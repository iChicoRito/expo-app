import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

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
  /** Index of this card in the carousel. */
  index: number;
  /** Distance (in px) between the centers of two adjacent cards (card width + gap). */
  itemSize: number;
  /** Live horizontal scroll offset, driven on the UI thread. */
  scrollX: SharedValue<number>;
  /** Whether this card is the resolved active (centered) card — drives the Play button. */
  isActive: boolean;
};

export function DeckCard({
  deck,
  width,
  height,
  index,
  itemSize,
  scrollX,
  isActive,
}: Props) {
  const upperHeight = height * 0.55;
  const lowerHeight = height * 0.45;

  // The card is centered when scrollX === index * itemSize. We interpolate every
  // visual property against the same input range so scale, opacity and shadow
  // all share one continuous, finger-tracking ease.
  const inputRange = [
    (index - 1) * itemSize,
    index * itemSize,
    (index + 1) * itemSize,
  ];

  const animatedWrapperStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.86, 1, 0.86],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.45, 1, 0.45],
      Extrapolation.CLAMP,
    );
    const shadowOpacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 0.28, 0],
      Extrapolation.CLAMP,
    );
    const elevation = interpolate(
      scrollX.value,
      inputRange,
      [0, 12, 0],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ scale }],
      opacity,
      shadowOpacity,
      elevation,
    };
  });

  return (
    <Animated.View
      style={[styles.wrapper, { width, height }, animatedWrapperStyle]}
    >
      <View style={[styles.card, { backgroundColor: deck.bgColor }]}>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Outer wrapper carries scale + animated shadow. Kept free of `overflow:hidden`
  // so the shadow is not clipped; the inner card clips its own rounded sections.
  wrapper: {
    borderRadius: 24,
    backgroundColor: Tokens.colors.white,
    shadowColor: Tokens.colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
  },
  card: {
    flex: 1,
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
