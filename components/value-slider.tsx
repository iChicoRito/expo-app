/**
 * Prototype draggable slider with a value bubble above the thumb, matching
 * `music-sound-option.png`. Built on PanResponder (from react-native) because
 * react-native-gesture-handler is not installed and the sheet deliberately
 * avoids a GestureHandlerRootView. No audio is wired — value is reported via
 * `onChange` only.
 */
import { useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Tokens } from "@/constants/tokens";

type Props = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  accent?: string;
};

const THUMB_SIZE = 22;

export function ValueSlider({
  value,
  min = 0,
  max = 100,
  onChange,
  accent = Tokens.colors.teal[500],
}: Props) {
  const [trackWidth, setTrackWidth] = useState(0);
  const widthRef = useRef(0);
  const startXRef = useRef(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    widthRef.current = w;
    setTrackWidth(w);
  };

  const clampToValue = (x: number) => {
    const w = widthRef.current || 1;
    const ratio = Math.max(0, Math.min(1, x / w));
    return Math.round(min + ratio * (max - min));
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          startXRef.current = evt.nativeEvent.locationX;
          onChange(clampToValue(evt.nativeEvent.locationX));
        },
        onPanResponderMove: (_evt, gesture) => {
          onChange(clampToValue(startXRef.current + gesture.dx));
        },
      }),
    // clampToValue/onChange are stable enough for the gesture lifetime; recreate
    // only if the range changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [min, max, onChange],
  );

  const ratio = (value - min) / (max - min || 1);
  const thumbLeft = ratio * trackWidth;

  return (
    <View style={styles.container}>
      {/* Value bubble */}
      <View
        style={[
          styles.bubbleWrap,
          { left: thumbLeft, transform: [{ translateX: -18 }] },
        ]}
        pointerEvents="none"
      >
        <View style={[styles.bubble, { backgroundColor: accent }]}>
          <Text style={styles.bubbleText}>{value}</Text>
        </View>
      </View>

      {/* Track (the pan surface) */}
      <View
        style={styles.touchArea}
        onLayout={onLayout}
        {...panResponder.panHandlers}
      >
        <View style={styles.track}>
          <View
            style={[styles.fill, { width: thumbLeft, backgroundColor: accent }]}
          />
        </View>
        <View
          style={[
            styles.thumb,
            { left: thumbLeft, transform: [{ translateX: -THUMB_SIZE / 2 }] },
          ]}
          pointerEvents="none"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Tokens.spacing[7],
  },
  bubbleWrap: {
    position: "absolute",
    top: 0,
    alignItems: "center",
  },
  bubble: {
    minWidth: 36,
    borderRadius: Tokens.layout.borderRadius.md,
    paddingVertical: 2,
    paddingHorizontal: Tokens.spacing[2],
    alignItems: "center",
  },
  bubbleText: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.xs,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  touchArea: {
    height: THUMB_SIZE,
    justifyContent: "center",
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Tokens.colors.teal[100],
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 2,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: Tokens.colors.white,
    borderWidth: 2,
    borderColor: Tokens.colors.teal[500],
  },
});
