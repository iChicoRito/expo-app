/**
 * Reusable centered Modal/Dialog. Fades + scales in over a backdrop, with an
 * optional circular icon, title, message, optional close (X), and a `children`
 * slot for action buttons. Drives the Delete confirm, AI "Generating",
 * AI "Question Ready", and "No Internet" dialogs.
 */
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react-native";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Tokens } from "@/constants/tokens";

type Props = {
  visible: boolean;
  onClose?: () => void;
  /** Tapping the backdrop dismisses. Defaults to true. */
  dismissOnBackdrop?: boolean;
  /** Show an X button in the top-right corner. */
  showClose?: boolean;
  icon?: IconSvgElement;
  iconColor?: string;
  iconBg?: string;
  title?: string;
  message?: React.ReactNode;
  children?: React.ReactNode;
};

export function Dialog({
  visible,
  onClose,
  dismissOnBackdrop = true,
  showClose = false,
  icon,
  iconColor = Tokens.colors.teal[500],
  iconBg = Tokens.colors.teal[100],
  title,
  message,
  children,
}: Props) {
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.value = withTiming(1, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      });
    } else if (mounted) {
      progress.value = withTiming(0, { duration: 160 }, (finished) => {
        if (finished) runOnJS(setMounted)(false);
      });
    }
  }, [visible, mounted, progress]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.92 + progress.value * 0.08 }],
  }));

  if (!mounted) return null;

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={dismissOnBackdrop ? onClose : undefined}
          />
        </Animated.View>

        <Animated.View style={[styles.card, cardStyle]}>
          {showClose && (
            <Pressable
              style={styles.closeBtn}
              hitSlop={10}
              onPress={onClose}
              accessibilityLabel="Close"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={22}
                color={Tokens.colors.neutral[400]}
              />
            </Pressable>
          )}

          {icon && (
            <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
              <HugeiconsIcon icon={icon} size={32} color={iconColor} />
            </View>
          )}

          {title && <Text style={styles.title}>{title}</Text>}
          {message != null &&
            (typeof message === "string" ? (
              <Text style={styles.message}>{message}</Text>
            ) : (
              message
            ))}

          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Tokens.spacing[8],
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: Tokens.colors.white,
    borderRadius: Tokens.layout.borderRadius["3xl"],
    padding: Tokens.spacing[6],
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    top: Tokens.spacing[4],
    right: Tokens.spacing[4],
    zIndex: 1,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Tokens.spacing[4],
  },
  title: {
    fontSize: Tokens.typography.fontSize["xl"],
    fontWeight: Tokens.typography.fontWeight.semibold,
    color: Tokens.colors.neutral[900],
    textAlign: "center",
    marginBottom: Tokens.spacing[2],
  },
  message: {
    fontSize: Tokens.typography.fontSize.base,
    color: Tokens.colors.neutral[400],
    textAlign: "center",
    lineHeight: Tokens.typography.lineHeight[3],
  },
});
