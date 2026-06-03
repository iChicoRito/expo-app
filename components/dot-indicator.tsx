import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
  Extrapolation,
} from "react-native-reanimated";

import { Tokens } from "@/constants/tokens";

type Props =
  | {
      // Simple mode: for onboarding and static use
      active: boolean;
      index?: never;
      scrollX?: never;
      itemSize?: never;
      totalItems?: never;
    }
  | {
      // Animated mode: for carousel real-time tracking
      active?: never;
      index: number;
      scrollX: SharedValue<number>;
      itemSize: number;
      totalItems: number;
    };

/** Pill-style page dot: expands and turns teal when active. */
export function DotIndicator(props: Props) {
  const isSimpleMode = 'active' in props && props.active !== undefined;

  if (isSimpleMode) {
    // Simple mode: static animation based on active prop
    const { active } = props as { active: boolean };
    const progress = useSharedValue(active ? 1 : 0);

    useEffect(() => {
      progress.value = withTiming(active ? 1 : 0, { duration: 300 });
    }, [active, progress]);

    const animatedStyle = useAnimatedStyle(() => ({
      width: interpolate(progress.value, [0, 1], [8, 24]),
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [Tokens.colors.zinc[300], Tokens.colors.teal[500]],
      ),
    }));

    return <Animated.View style={[styles.dot, animatedStyle]} />;
  }

  // Animated mode: real-time tracking based on scroll
  const { index, scrollX, itemSize } = props as {
    index: number;
    scrollX: SharedValue<number>;
    itemSize: number;
    totalItems: number;
  };

  const animatedStyle = useAnimatedStyle(() => {
    const activePosition = scrollX.value / itemSize;
    const distance = Math.abs(activePosition - index);
    const progress = interpolate(
      distance,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return {
      width: interpolate(progress, [0, 1], [8, 24]),
      backgroundColor: interpolateColor(
        progress,
        [0, 1],
        [Tokens.colors.zinc[300], Tokens.colors.teal[500]],
      ),
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  dot: {
    height: 8,
    borderRadius: Tokens.layout.borderRadius.full,
  },
});
