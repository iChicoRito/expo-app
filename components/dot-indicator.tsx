import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Tokens } from "@/constants/tokens";

type Props = { active: boolean };

/** Pill-style page dot: expands and turns teal when active. */
export function DotIndicator({ active }: Props) {
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

const styles = StyleSheet.create({
  dot: {
    height: 8,
    borderRadius: Tokens.layout.borderRadius.full,
  },
});
