import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  Text,
  TextInput,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MASCOT_HEIGHT = SCREEN_HEIGHT * 0.52;
const INTRO_COUNT = 3;

// ─── Data ────────────────────────────────────────────────────────────────────

type IntroStep   = { key: string; type: 'intro'; titleLine1: string; titleLine2: string; subtitle: string; buttonText: string };
type NameStep    = { key: string; type: 'name' };
type WelcomeStep = { key: string; type: 'welcome' };
type Step        = IntroStep | NameStep | WelcomeStep;

const STEPS: Step[] = [
  { key: '1', type: 'intro', titleLine1: 'Vibe',  titleLine2: 'Check',     subtitle: "Awkward silence gets cancelled before it even starts, bestie.",          buttonText: 'Okay' },
  { key: '2', type: 'intro', titleLine1: 'Tea',   titleLine2: 'Time',      subtitle: "Pick a card and let the group reveal their funniest, weirdest lore.",    buttonText: 'It sounds fun' },
  { key: '3', type: 'intro', titleLine1: 'Main',  titleLine2: 'Character', subtitle: "Play with friends, dates, or anyone brave enough to answer.",             buttonText: 'Start Spilling' },
  { key: 'name',    type: 'name' },
  { key: 'welcome', type: 'welcome' },
];

// ─── Dot indicator ────────────────────────────────────────────────────────────

function DotIndicator({ active }: { active: boolean }) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 300 });
  }, [active, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [8, 24]),
    backgroundColor: interpolateColor(progress.value, [0, 1], [
      Tokens.colors.zinc[300],
      Tokens.colors.teal[500],
    ]),
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

// ─── Step cards ──────────────────────────────────────────────────────────────

function IntroCard({ item, currentStep, onNext }: { item: IntroStep; currentStep: number; onNext: () => void }) {
  return (
    <View style={styles.step}>
      <View style={styles.mascotArea} />
      <View style={styles.introContent}>
        <Text style={styles.titleLine1}>{item.titleLine1}</Text>
        <Text style={styles.titleLine2}>{item.titleLine2}</Text>
        <Text style={styles.introSubtitle}>{item.subtitle}</Text>
        <View style={styles.dotsRow}>
          {Array.from({ length: INTRO_COUNT }).map((_, i) => (
            <DotIndicator key={i} active={i === currentStep} />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={onNext} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{item.buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function NameCard({ name, onNameChange, onSubmit }: { name: string; onNameChange: (v: string) => void; onSubmit: () => void }) {
  return (
    <KeyboardAvoidingView style={styles.step} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.nameContent}>
        <Text style={styles.nameTitle}>What should we call you?</Text>
        <Text style={styles.nameSubtitle}>Your name personalizes your Spillr</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your name"
          placeholderTextColor={Tokens.colors.zinc[400]}
          value={name}
          onChangeText={onNameChange}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
          autoCorrect={false}
          autoCapitalize="words"
        />
        <TouchableOpacity
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={onSubmit}
          activeOpacity={0.8}
          disabled={!name.trim()}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function WelcomeCard({ name, onFinish }: { name: string; onFinish: () => void }) {
  return (
    <View style={[styles.step, styles.welcomeStep]}>
      <View style={styles.welcomeContent}>
        <Text style={styles.welcomeTitle}>
          {"Let's Start\nSpilling, "}
          <Text style={styles.welcomeName}>{name.trim() || 'Friend'}</Text>
        </Text>
        <Text style={styles.welcomeSubtitle}>
          Pull a card, answer with confidence, and let the chaos begin.
        </Text>
        <TouchableOpacity style={[styles.button, styles.welcomeButton]} onPress={onFinish} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Let's Go!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep]       = useState(0);
  const [name, setName]                     = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const flatListRef = useRef<FlatList<Step>>(null);

  const goToStep = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentStep(index);
  }, []);

  const handleNext    = useCallback(() => goToStep(currentStep + 1), [currentStep, goToStep]);
  const handleSubmit  = useCallback(() => { if (name.trim()) goToStep(currentStep + 1); }, [name, currentStep, goToStep]);
  const handleFinish  = useCallback(() => setSnackbarVisible(true), []);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Step>) => {
    if (item.type === 'intro')   return <IntroCard   item={item} currentStep={currentStep} onNext={handleNext} />;
    if (item.type === 'name')    return <NameCard    name={name} onNameChange={setName} onSubmit={handleSubmit} />;
    if (item.type === 'welcome') return <WelcomeCard name={name} onFinish={handleFinish} />;
    return null;
  }, [currentStep, name, handleNext, handleSubmit, handleFinish]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={STEPS}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        extraData={{ currentStep, name }}
        getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
      />
      <Snackbar visible={snackbarVisible} message="You're on the last page" />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Tokens.colors.white,
  },
  flatList: {
    flex: 1,
  },

  // ── Shared ──
  step: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  button: {
    backgroundColor: Tokens.colors.teal[500],
    borderRadius: Tokens.layout.borderRadius['2xl'],
    paddingVertical: Tokens.spacing[4],
    alignItems: 'center',
    width: '100%',
  },
  buttonDisabled: {
    opacity: Tokens.effects.opacity[40],
  },
  buttonText: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },

  // ── Intro step ──
  mascotArea: {
    height: MASCOT_HEIGHT,
    backgroundColor: Tokens.colors.teal[50],
  },
  introContent: {
    flex: 1,
    paddingHorizontal: Tokens.spacing[8],
    paddingTop: Tokens.spacing[6],
    paddingBottom: Tokens.spacing[6],
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
    color: Tokens.colors.teal[500],
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: Tokens.typography.fontSize.sm,
    color: Tokens.colors.zinc[500],
    textAlign: 'center',
    marginTop: Tokens.spacing[3],
    lineHeight: Tokens.typography.lineHeight[3],
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Tokens.spacing[2],
    marginTop: Tokens.spacing[5],
    marginBottom: Tokens.spacing[5],
    flex: 1,
    alignItems: 'flex-start',
  },
  dot: {
    height: 8,
    borderRadius: Tokens.layout.borderRadius.full,
  },

  // ── Name input step ──
  nameContent: {
    flex: 1,
    paddingHorizontal: Tokens.spacing[8],
    paddingTop: Tokens.spacing[32],
    paddingBottom: Tokens.spacing[8],
    justifyContent: 'center',
  },
  nameTitle: {
    fontSize: Tokens.typography.fontSize['3xl'],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.zinc[900],
    lineHeight: Tokens.typography.lineHeight[7],
    marginBottom: Tokens.spacing[2],
  },
  nameSubtitle: {
    fontSize: Tokens.typography.fontSize.sm,
    color: Tokens.colors.zinc[500],
    marginBottom: Tokens.spacing[8],
  },
  textInput: {
    fontSize: Tokens.typography.fontSize.base,
    color: Tokens.colors.zinc[900],
    borderBottomWidth: Tokens.effects.borderWidth.default,
    borderBottomColor: Tokens.colors.zinc[300],
    paddingVertical: Tokens.spacing[3],
    marginBottom: Tokens.spacing[8],
  },

  // ── Welcome step ──
  welcomeStep: {
    justifyContent: 'center',
  },
  welcomeContent: {
    paddingHorizontal: Tokens.spacing[8],
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: Tokens.typography.fontSize['4xl'],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.zinc[900],
    textAlign: 'center',
    lineHeight: Tokens.typography.lineHeight[8],
    marginBottom: Tokens.spacing[4],
  },
  welcomeName: {
    color: Tokens.colors.teal[500],
  },
  welcomeSubtitle: {
    fontSize: Tokens.typography.fontSize.sm,
    color: Tokens.colors.zinc[500],
    textAlign: 'center',
    lineHeight: Tokens.typography.lineHeight[3],
  },
  welcomeButton: {
    marginTop: Tokens.spacing[10],
  },
});
