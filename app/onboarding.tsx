import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Tokens } from '@/constants/tokens';
import { Snackbar } from '@/components/snackbar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Step = {
  key: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  buttonText: string;
  emoji: string;
};

const STEPS: Step[] = [
  {
    key: '1',
    titleLine1: 'Vibe',
    titleLine2: 'Check',
    subtitle: "Awkward silence gets cancelled before it even starts, bestie.",
    buttonText: 'Okay',
    emoji: '👋',
  },
  {
    key: '2',
    titleLine1: 'Tea',
    titleLine2: 'Time',
    subtitle: "Pick a card and let the group reveal their funniest, weirdest lore.",
    buttonText: 'It sounds fun',
    emoji: '🫖',
  },
  {
    key: '3',
    titleLine1: 'Main',
    titleLine2: 'Character',
    subtitle: "Play with friends, dates, or anyone brave enough to answer.",
    buttonText: "Let's Go",
    emoji: '⭐',
  },
];

function DotIndicator({ active }: { active: boolean }) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 300 });
  }, [active, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [8, 24]),
    backgroundColor: interpolateColor(progress.value, [0, 1], [
      Tokens.colors.zinc[300],
      Tokens.colors.cyan[700],
    ]),
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const flatListRef = useRef<FlatList<Step>>(null);

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      const next = currentStep + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentStep(next);
    } else {
      setSnackbarVisible(true);
    }
  }, [currentStep]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Step>) => (
    <View style={styles.step}>
      <View style={styles.mascotArea}>
        <Text style={styles.mascotEmoji}>{item.emoji}</Text>
      </View>
      <View style={styles.textArea}>
        <Text style={styles.titleLine1}>{item.titleLine1}</Text>
        <Text style={styles.titleLine2}>{item.titleLine2}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={STEPS}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
      />
      <View style={styles.controls}>
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <DotIndicator key={i} active={i === currentStep} />
          ))}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>{STEPS[currentStep].buttonText}</Text>
        </TouchableOpacity>
      </View>
      <Snackbar visible={snackbarVisible} message="You're on the last page" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Tokens.colors.white,
  },
  flatList: {
    flex: 1,
  },
  step: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  mascotArea: {
    flex: 0.55,
    backgroundColor: Tokens.colors.zinc[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotEmoji: {
    fontSize: 80,
  },
  textArea: {
    paddingHorizontal: Tokens.spacing[8],
    paddingTop: Tokens.spacing[6],
    alignItems: 'center',
  },
  titleLine1: {
    fontSize: Tokens.typography.fontSize['4xl'],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.zinc[900],
    textAlign: 'center',
  },
  titleLine2: {
    fontSize: Tokens.typography.fontSize['4xl'],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.cyan[700],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Tokens.typography.fontSize.sm,
    color: Tokens.colors.zinc[500],
    textAlign: 'center',
    marginTop: Tokens.spacing[3],
    lineHeight: Tokens.typography.lineHeight[3],
  },
  controls: {
    paddingHorizontal: Tokens.spacing[6],
    paddingBottom: Tokens.spacing[6],
    gap: Tokens.spacing[6],
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Tokens.spacing[2],
  },
  dot: {
    height: 8,
    borderRadius: Tokens.layout.borderRadius.full,
  },
  button: {
    backgroundColor: Tokens.colors.cyan[700],
    borderRadius: Tokens.layout.borderRadius['3xl'],
    paddingVertical: Tokens.spacing[4],
    alignItems: 'center',
  },
  buttonText: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
});
