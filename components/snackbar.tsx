import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Tokens } from '@/constants/tokens';

type Props = {
  visible: boolean;
  message: string;
};

export function Snackbar({ visible, message }: Props) {
  const translateY = useSharedValue(80);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300 });
      const timer = setTimeout(() => {
        translateY.value = withTiming(80, { duration: 300 });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Tokens.colors.teal[700],
    paddingVertical: Tokens.spacing[4],
    paddingHorizontal: Tokens.spacing[6],
    borderTopLeftRadius: Tokens.layout.borderRadius['2xl'],
    borderTopRightRadius: Tokens.layout.borderRadius['2xl'],
  },
  message: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.sm,
    textAlign: 'center',
  },
});
