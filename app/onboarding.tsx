import { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
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

// ─── Animated content wrapper ─────────────────────────────────────────────────

function FadeContent({ children }: { children: React.ReactNode }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep]         = useState(0);
  const [name, setName]                       = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const step = STEPS[currentStep];

  const getButtonText = useCallback(() => {
    if (step.type === 'intro') return (step as IntroStep).buttonText;
    if (step.type === 'name') return 'Submit';
    return "Let's Go!";
  }, [step]);

  const getButtonDisabled = useCallback(() => {
    return step.type === 'name' && !name.trim();
  }, [step, name]);

  const handleButtonPress = useCallback(() => {
    if (step.type === 'name' && !name.trim()) return;
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setSnackbarVisible(true);
    }
  }, [currentStep, step, name]);

  const renderContent = () => {
    if (step.type === 'intro') {
      return (
        <>
          <FadeContent key={step.key}>
            <Text style={styles.titleLine1}>{step.titleLine1}</Text>
            <Text style={styles.titleLine2}>{step.titleLine2}</Text>
            <Text style={styles.introSubtitle}>{step.subtitle}</Text>
          </FadeContent>
          <View style={styles.dotsRow}>
            {Array.from({ length: INTRO_COUNT }).map((_, i) => (
              <DotIndicator key={i} active={i === currentStep} />
            ))}
          </View>
        </>
      );
    }

    if (step.type === 'name') {
      return (
        <FadeContent key={step.key}>
          <View style={styles.nameFormContainer}>
            <Text style={styles.nameTitle}>
              What should{' '}
              <Text style={styles.nameTitleAccent}>we call you?</Text>
            </Text>
            <Text style={styles.nameSubtitle}>Your name personalizes your Spillr</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your name"
              placeholderTextColor={Tokens.colors.zinc[400]}
              value={name}
              onChangeText={setName}
              returnKeyType="done"
              autoCorrect={false}
              autoCapitalize="words"
            />
          </View>
        </FadeContent>
      );
    }

    if (step.type === 'welcome') {
      return (
        <FadeContent key={step.key}>
          <Text style={styles.welcomeTitle}>
            {"Let's Start\nSpilling, "}
            <Text style={styles.welcomeName}>{name.trim() || 'Friend'}</Text>
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Pull a card, answer with confidence, and let the chaos begin.
          </Text>
        </FadeContent>
      );
    }

    return null;
  };

  const isIntro   = step.type === 'intro';
  const isName    = step.type === 'name';
  const isWelcome = step.type === 'welcome';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Mascot area — only on intro screens */}
        {isIntro && <View style={styles.mascotArea} />}

        {/* Content area */}
        <View style={[
          styles.contentArea,
          isIntro   && styles.introContentArea,
          isName    && styles.nameContentArea,
          isWelcome && styles.welcomeContentArea,
        ]}>
          {renderContent()}
        </View>

        {/* Button — always fixed */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, getButtonDisabled() && styles.buttonDisabled]}
            onPress={handleButtonPress}
            activeOpacity={0.8}
            disabled={getButtonDisabled()}>
            <Text style={styles.buttonText}>{getButtonText()}</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
  },

  // ── Mascot ──
  mascotArea: {
    height: MASCOT_HEIGHT,
    backgroundColor: Tokens.colors.white,
  },

  // ── Content areas ──
  contentArea: {
    flex: 1,
    paddingHorizontal: Tokens.spacing[8],
  },
  introContentArea: {
    paddingTop: Tokens.spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContentArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Button ──
  buttonContainer: {
    paddingHorizontal: Tokens.spacing[6],
    paddingBottom: Tokens.spacing[6],
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

  // ── Intro content ──
  titleLine1: {
    fontSize: Tokens.typography.fontSize['5xl'],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.zinc[900],
    textAlign: 'center',
  },
  titleLine2: {
    fontSize: Tokens.typography.fontSize['5xl'],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.teal[500],
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: Tokens.typography.fontSize.lg,
    fontWeight: Tokens.typography.fontWeight.normal,
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
  },
  dot: {
    height: 8,
    borderRadius: Tokens.layout.borderRadius.full,
  },

  // ── Name content ──
  nameFormContainer: {
    width: '100%',
    paddingHorizontal: Tokens.spacing[8],
    alignItems: 'center',
  },
  nameTitle: {
    fontSize: Tokens.typography.fontSize['4xl'],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.zinc[900],
    marginBottom: Tokens.spacing[2],
    textAlign: 'center',
  },
  nameTitleAccent: {
    color: Tokens.colors.teal[500],
  },
  nameSubtitle: {
    fontSize: Tokens.typography.fontSize.lg,
    fontWeight: Tokens.typography.fontWeight.normal,
    color: Tokens.colors.neutral[400],
    marginBottom: Tokens.spacing[6],
    textAlign: 'center',
  },
  textInput: {
    fontSize: Tokens.typography.fontSize.base,
    color: Tokens.colors.zinc[900],
    borderWidth: Tokens.effects.borderWidth.default,
    borderColor: Tokens.colors.zinc[300],
    borderRadius: Tokens.layout.borderRadius.xl,
    paddingVertical: Tokens.spacing[4],
    paddingHorizontal: Tokens.spacing[4],
    marginBottom: Tokens.spacing[8],
    width: '100%',
  },

  // ── Welcome content ──
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
});
