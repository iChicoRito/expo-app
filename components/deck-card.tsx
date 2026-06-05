import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react-native";
import { memo, useEffect, useMemo } from "react";
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
import Svg, { Path } from "react-native-svg";

import { DiamondGrid } from "@/components/diamond-grid";
import { getCardHolder } from "@/constants/card-holders";
import { Tokens } from "@/constants/tokens";

export type ColorScaleKey =
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose';

export type DeckData = {
  id: string;
  title: string;
  bgColor: string;
  bgLight: string;
  icon: IconSvgElement;
  colorKey: ColorScaleKey;
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
  /** Called when the (active) card's Play button is pressed. */
  onPlay?: () => void;
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

export const DeckCard = memo(function DeckCard({
  deck,
  width,
  height,
  index,
  itemSize,
  scrollX,
  isActive,
  onPlay,
}: Props) {
  const CardHolder = getCardHolder(deck.colorKey);
  const holderSize = width * 0.62;

  const visual = useMemo(() => {
    const waveHeight = height * 0.42;
    const dip = height * 0.05;

    return {
      borderColor: mix(deck.bgColor, 0.3),
      darkBand: mix(deck.bgColor, -0.12),
      waveLine: mix(deck.bgColor, 0.18),
      waveHeight,
      wavePath: `M0 0 Q${width / 2} ${dip} ${width} 0 L${width} ${waveHeight} L0 ${waveHeight} Z`,
      waveLinePath: `M0 0 Q${width / 2} ${dip} ${width} 0`,
    };
  }, [deck.bgColor, height, width]);

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
  const inputRange = useMemo(
    () => [
      (index - 1) * itemSize,
      index * itemSize,
      (index + 1) * itemSize,
    ],
    [index, itemSize],
  );

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
      <View
        style={[
          styles.card,
          { backgroundColor: deck.bgColor, borderColor: visual.borderColor },
        ]}
      >
        {/* Diamond-grid texture */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <DiamondGrid width={width} height={height} />
        </View>

        {/* Curved darker band near the bottom */}
        <Svg
          width={width}
          height={visual.waveHeight}
          style={styles.wave}
          pointerEvents="none"
        >
          <Path d={visual.wavePath} fill={visual.darkBand} />
          <Path
            d={visual.waveLinePath}
            stroke={visual.waveLine}
            strokeWidth={3}
            fill="none"
          />
        </Svg>

        {/* Card holder illustration — centered above wave */}
        <View style={styles.holderCenter} pointerEvents="none">
          <CardHolder width={holderSize} height={holderSize * 1.1} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.iconBadge}>
              <HugeiconsIcon icon={deck.icon} size={20} color={deck.bgColor} />
            </View>
          </View>

          <View style={styles.bottomContent}>
            <Text style={styles.title}>{deck.title}</Text>
            <Animated.View
              style={buttonAnimatedStyle}
              pointerEvents={isActive ? "auto" : "none"}
            >
              <TouchableOpacity
                style={styles.playButton}
                activeOpacity={0.85}
                onPress={onPlay}
              >
                <Text style={[styles.playText, { color: deck.bgColor }]}>
                  Play
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

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
    borderWidth: 6,
  },
  wave: {
    position: "absolute",
    left: 0,
    bottom: 0,
  },
  holderCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    padding: Tokens.spacing[5],
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  bottomContent: {
    gap: Tokens.spacing[3],
  },
  title: {
    fontSize: Tokens.typography.fontSize["2xl"],
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
