import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import Svg, { Path } from "react-native-svg";

import { DiamondGrid } from "@/components/diamond-grid";
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

/** Blend a #rrggbb color toward black (amt<0) or white (amt>0) by |amt| (0..1). */
function mix(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const target = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  const ch = (c: number) => Math.round((target - c) * p) + c;
  return `rgb(${ch(r)}, ${ch(g)}, ${ch(b)})`;
}

export function DeckCard({
  deck,
  width,
  height,
  index,
  itemSize,
  scrollX,
  isActive,
}: Props) {
  const darkBand = mix(deck.bgColor, -0.12);
  const waveLine = mix(deck.bgColor, 0.18);
  const waveHeight = height * 0.42;
  const dip = height * 0.05;
  const wavePath = `M0 0 Q${width / 2} ${dip} ${width} 0 L${width} ${waveHeight} L0 ${waveHeight} Z`;
  const waveLinePath = `M0 0 Q${width / 2} ${dip} ${width} 0`;

  // Button slide-up + fade animation: starts 60px below with 0 opacity, animates to 0 translateY and 1 opacity when active
  const buttonTranslateY = useSharedValue(60);
  const buttonOpacity = useSharedValue(0);
  useEffect(() => {
    buttonTranslateY.value = withTiming(isActive ? 0 : 60, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
    buttonOpacity.value = withTiming(isActive ? 1 : 0, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, [isActive, buttonTranslateY, buttonOpacity]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonTranslateY.value }],
    opacity: buttonOpacity.value,
  }));

  // The card is centered when scrollX === index * itemSize. We interpolate scale
  // and opacity against the same input range so both share one continuous ease.
  const inputRange = [
    (index - 1) * itemSize,
    index * itemSize,
    (index + 1) * itemSize,
  ];

  const animatedWrapperStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1.05, 0.8],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.45, 1, 0.45],
      Extrapolation.CLAMP,
    );
    const rotate = interpolate(
      scrollX.value,
      inputRange,
      [-8, 0, 8],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ scale }, { rotateZ: `${rotate}deg` }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[styles.wrapper, { width, height }, animatedWrapperStyle]}
    >
      <View style={[styles.card, { backgroundColor: deck.bgColor }]}>
        {/* Diamond-grid texture */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <DiamondGrid width={width} height={height} />
        </View>

        {/* Curved darker band near the bottom */}
        <Svg
          width={width}
          height={waveHeight}
          style={styles.wave}
          pointerEvents="none"
        >
          <Path d={wavePath} fill={darkBand} />
          <Path
            d={waveLinePath}
            stroke={waveLine}
            strokeWidth={3}
            fill="none"
          />
        </Svg>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.title}>{deck.title.split(" ").join("\n")}</Text>
            <View style={styles.iconBadge}>
              <HugeiconsIcon icon={deck.icon} size={20} color={deck.bgColor} />
            </View>
          </View>

          <Animated.View
            style={buttonAnimatedStyle}
            pointerEvents={isActive ? "auto" : "none"}
          >
            <TouchableOpacity style={styles.playButton} activeOpacity={0.85}>
              <Text style={[styles.playText, { color: deck.bgColor }]}>
                Play
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Outer wrapper carries the scale animation; the inner card clips its texture,
  // wave and rounded corners via overflow:hidden.
  wrapper: {
    borderRadius: 28,
  },
  card: {
    flex: 1,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: Tokens.colors.white,
    shadowColor: Tokens.colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  wave: {
    position: "absolute",
    left: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    padding: Tokens.spacing[5],
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    flexShrink: 1,
    fontSize: Tokens.typography.fontSize["6xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.white,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Tokens.colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Tokens.spacing[2],
  },
  playButton: {
    width: "100%",
    backgroundColor: Tokens.colors.white,
    paddingVertical: Tokens.spacing[4],
    borderRadius: Tokens.layout.borderRadius["2xl"],
    alignItems: "center",
  },
  playText: {
    fontSize: Tokens.typography.fontSize.lg,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
});
