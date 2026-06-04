/**
 * Reusable bottom Drawer/Sheet. Slides up from the bottom over a fading backdrop;
 * tap the backdrop to dismiss. Used for the Create Deck and Add/Edit/View Question
 * forms. A visual drag handle is shown (no pan gesture, to avoid requiring a root
 * GestureHandlerRootView).
 */
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Tokens } from "@/constants/tokens";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const SHEET_OFFSET = 600;

export function Sheet({ visible, onClose, children }: Props) {
  const insets = useSafeAreaInsets();
  // Keep the Modal mounted through the exit animation, then unmount.
  const [mounted, setMounted] = useState(visible);
  const translateY = useSharedValue(SHEET_OFFSET);
  const backdrop = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      backdrop.value = withTiming(1, { duration: 250 });
    } else if (mounted) {
      backdrop.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(
        SHEET_OFFSET,
        { duration: 250, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(setMounted)(false);
        },
      );
    }
  }, [visible, mounted, translateY, backdrop]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));

  if (!mounted) return null;

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.kav}
          pointerEvents="box-none"
        >
          <Animated.View
            style={[
              styles.sheet,
              { paddingBottom: insets.bottom + Tokens.spacing[6] },
              sheetStyle,
            ]}
          >
            <View style={styles.handle} />
            {children}
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  kav: { justifyContent: "flex-end" },
  sheet: {
    backgroundColor: Tokens.colors.white,
    borderTopLeftRadius: Tokens.layout.borderRadius["3xl"],
    borderTopRightRadius: Tokens.layout.borderRadius["3xl"],
    paddingHorizontal: Tokens.spacing[6],
    paddingTop: Tokens.spacing[3],
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: Tokens.layout.borderRadius.full,
    backgroundColor: Tokens.colors.neutral[300],
    marginBottom: Tokens.spacing[5],
  },
});
