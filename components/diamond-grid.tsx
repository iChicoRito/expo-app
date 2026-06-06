import { memo, useEffect, useId } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, Path, Pattern, Rect } from "react-native-svg";

const DIAMOND_WIDTH = 19.3031;
const DIAMOND_HEIGHT = 24.1818;
const SCROLL_DISTANCE = DIAMOND_HEIGHT * 8;
const DIAMOND_PATH =
  "M9.65153 0L19.3031 12.0909L9.65153 24.1818L0 12.0909Z";
const DEG_TO_RAD = Math.PI / 180;

type Props = {
  width: number;
  height: number;
  color?: string;
  opacity?: number;
  animated?: boolean;
  scrollDuration?: number;
  patternScale?: number;
  movementAngleDeg?: number;
  patternRotationDeg?: number;
};

type PatternSvgProps = {
  width: number;
  height: number;
  color: string;
  patternScale: number;
  patternRotationDeg: number;
};

function DiamondPatternSvg({
  width,
  height,
  color,
  patternScale,
  patternRotationDeg,
}: PatternSvgProps) {
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const patternId = `diamondGrid${reactId}`;
  const diamondWidth = DIAMOND_WIDTH * patternScale;
  const diamondHeight = DIAMOND_HEIGHT * patternScale;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <Pattern
          id={patternId}
          x={0}
          y={0}
          width={diamondWidth}
          height={diamondHeight}
          patternUnits="userSpaceOnUse"
          patternTransform={`rotate(${patternRotationDeg})`}
        >
          <Path
            d={DIAMOND_PATH}
            fill={color}
            transform={`scale(${patternScale})`}
          />
        </Pattern>
      </Defs>
      <Rect width={width} height={height} fill={`url(#${patternId})`} />
    </Svg>
  );
}

export const DiamondGrid = memo(function DiamondGrid({
  width,
  height,
  color = "white",
  opacity = 0.6,
  animated = false,
  scrollDuration = 6000,
  patternScale = 1,
  movementAngleDeg = -90,
  patternRotationDeg = 0,
}: Props) {
  const progress = useSharedValue(0);
  const safePatternScale = Math.max(0.25, patternScale);
  const scrollDistance = SCROLL_DISTANCE * safePatternScale;
  const angleRad = movementAngleDeg * DEG_TO_RAD;
  const translateX = Math.cos(angleRad) * scrollDistance;
  const translateY = Math.sin(angleRad) * scrollDistance;
  const overscanX = Math.abs(translateX);
  const overscanY = Math.abs(translateY);
  const startX = translateX > 0 ? -overscanX : 0;
  const startY = translateY > 0 ? -overscanY : 0;

  useEffect(() => {
    cancelAnimation(progress);
    progress.value = 0;

    if (!animated) return;

    const cycleDuration = Math.max(
      1000,
      scrollDuration * (scrollDistance / Math.max(height, 1)),
    );

    progress.value = withRepeat(
      withTiming(1, {
        duration: cycleDuration,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    return () => cancelAnimation(progress);
  }, [animated, height, progress, scrollDistance, scrollDuration]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: startX + progress.value * translateX },
      { translateY: startY + progress.value * translateY },
    ],
  }));

  if (!animated) {
    return (
      <View style={{ opacity }}>
        <DiamondPatternSvg
          width={width}
          height={height}
          color={color}
          patternScale={safePatternScale}
          patternRotationDeg={patternRotationDeg}
        />
      </View>
    );
  }

  return (
    <View style={{ width, height, overflow: "hidden", opacity }}>
      <Animated.View style={animStyle}>
        <DiamondPatternSvg
          width={width + overscanX}
          height={height + overscanY}
          color={color}
          patternScale={safePatternScale}
          patternRotationDeg={patternRotationDeg}
        />
      </Animated.View>
    </View>
  );
});
