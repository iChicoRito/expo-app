import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import Mascot1 from "@/assets/svg/on-boarding/1st.svg";
import Mascot2 from "@/assets/svg/on-boarding/2nd.svg";
import Mascot3 from "@/assets/svg/on-boarding/3rd.svg";
import { DotIndicator } from "@/components/dot-indicator";
import { Tokens } from "@/constants/tokens";
import { useProfileStore } from "@/contexts/profile-store";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const INTRO_MASCOTS = [Mascot1, Mascot2, Mascot3] as const;
const MASCOT_OFFSETS = [-8, 8, 0];
const MASCOT_OFFSET_Y = 40;
const MASCOT_HEIGHT = SCREEN_HEIGHT * 0.5;
const INTRO_COUNT = 3;

// ─── Data ────────────────────────────────────────────────────────────────────

type IntroStep = {
  key: string;
  type: "intro";
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  buttonText: string;
};
type NameStep = { key: string; type: "name" };
type WelcomeStep = { key: string; type: "welcome" };
type Step = IntroStep | NameStep | WelcomeStep;

const STEPS: Step[] = [
  {
    key: "1",
    type: "intro",
    titleLine1: "Vibe",
    titleLine2: "Check",
    subtitle: "Awkward silence gets cancelled before it even starts, bestie.",
    buttonText: "Okay",
  },
  {
    key: "2",
    type: "intro",
    titleLine1: "Tea",
    titleLine2: "Time",
    subtitle:
      "Pick a card and let the group reveal their funniest, weirdest lore.",
    buttonText: "It sounds fun",
  },
  {
    key: "3",
    type: "intro",
    titleLine1: "Main",
    titleLine2: "Character",
    subtitle: "Play with friends, dates, or anyone brave enough to answer.",
    buttonText: "Start Spilling",
  },
  { key: "name", type: "name" },
  { key: "welcome", type: "welcome" },
];

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
  const router = useRouter();
  const { updateProfile } = useProfileStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState("");

  const step = STEPS[currentStep];

  const getButtonText = useCallback(() => {
    if (step.type === "intro") return (step as IntroStep).buttonText;
    if (step.type === "name") return "Submit";
    return "Let's Go!";
  }, [step]);

  const getButtonDisabled = useCallback(() => {
    return step.type === "name" && !name.trim();
  }, [step, name]);

  const handleButtonPress = useCallback(() => {
    if (step.type === "name" && !name.trim()) return;
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const trimmedName = name.trim();
      updateProfile({ name: trimmedName })
        .catch(() => {})
        .finally(() => {
          router.replace({ pathname: "/play", params: { name: trimmedName } });
        });
    }
  }, [currentStep, step, name, router, updateProfile]);

  const renderContent = () => {
    if (step.type === "intro") {
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

    if (step.type === "name") {
      return (
        <FadeContent key={step.key}>
          <View style={styles.nameFormWrapper}>
            <View style={styles.nameFormContainer}>
              <Text style={styles.nameTitle}>
                What should{" "}
                <Text style={styles.nameTitleAccent}>we call you?</Text>
              </Text>
              <Text style={styles.nameSubtitle}>
                Your name personalizes your Spillr
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your name"
                placeholderTextColor={Tokens.colors.zinc[400]}
                value={name}
                onChangeText={setName}
                returnKeyType="done"
                autoCorrect={false}
                autoCapitalize="words"
                textAlign="left"
              />
            </View>
          </View>
        </FadeContent>
      );
    }

    if (step.type === "welcome") {
      return (
        <FadeContent key={step.key}>
          <Text style={styles.welcomeTitle}>
            {"Let's Start\nSpilling, "}
            <Text style={styles.welcomeName}>{name.trim() || "Friend"}</Text>
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Pull a card, answer with confidence, and let the chaos begin.
          </Text>
        </FadeContent>
      );
    }

    return null;
  };

  const swipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .activeOffsetX([-20, 20])
        .onEnd((e) => {
          const isSwipeRight = e.translationX > 60 || e.velocityX > 500;
          const isSwipeLeft = e.translationX < -60 || e.velocityX < -500;
          if (isSwipeRight && currentStep > 0) {
            setCurrentStep((s) => s - 1);
          } else if (isSwipeLeft) {
            handleButtonPress();
          }
        }),
    [currentStep, handleButtonPress]
  );

  const isIntro = step.type === "intro";
  const isName = step.type === "name";
  const isWelcome = step.type === "welcome";

  return (
    <GestureDetector gesture={swipeGesture}>
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Mascot area — only on intro screens */}
        {isIntro && (
          <View style={styles.mascotArea}>
            {(() => {
              const MascotSvg = INTRO_MASCOTS[currentStep];
              const offsetX = MASCOT_OFFSETS[currentStep];
              return (
                <MascotSvg
                  width={SCREEN_WIDTH}
                  height={MASCOT_HEIGHT}
                  style={{
                    transform: [
                      { translateX: offsetX },
                      { translateY: MASCOT_OFFSET_Y },
                    ],
                  }}
                />
              );
            })()}
          </View>
        )}

        {/* Content area */}
        <View
          style={[
            styles.contentArea,
            isIntro && styles.introContentArea,
            isName && styles.nameContentArea,
            isWelcome && styles.welcomeContentArea,
          ]}
        >
          {renderContent()}
        </View>

        {/* Button — always fixed */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              getButtonDisabled() && styles.buttonDisabled,
            ]}
            onPress={handleButtonPress}
            activeOpacity={0.8}
            disabled={getButtonDisabled()}
          >
            <Text style={styles.buttonText}>{getButtonText()}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </GestureDetector>
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
    alignItems: "center",
    overflow: "hidden",
  },

  // ── Content areas ──
  contentArea: {
    flex: 1,
    paddingHorizontal: Tokens.spacing[8],
  },
  introContentArea: {
    paddingTop: Tokens.spacing[6],
    alignItems: "center",
    justifyContent: "center",
  },
  nameContentArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeContentArea: {
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Button ──
  buttonContainer: {
    paddingHorizontal: Tokens.spacing[8],
    paddingBottom: Tokens.spacing[6],
  },
  button: {
    backgroundColor: Tokens.colors.teal[500],
    borderRadius: Tokens.layout.borderRadius["2xl"],
    paddingVertical: Tokens.spacing[4],
    alignItems: "center",
    width: "100%",
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
    fontSize: Tokens.typography.fontSize["5xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.zinc[900],
    textAlign: "center",
  },
  titleLine2: {
    fontSize: Tokens.typography.fontSize["5xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.teal[500],
    textAlign: "center",
  },
  introSubtitle: {
    fontSize: Tokens.typography.fontSize.lg,
    fontWeight: Tokens.typography.fontWeight.normal,
    color: Tokens.colors.zinc[500],
    textAlign: "center",
    marginTop: Tokens.spacing[3],
    lineHeight: Tokens.typography.lineHeight[3],
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Tokens.spacing[2],
    marginTop: Tokens.spacing[5],
  },

  // ── Name content ──
  nameFormWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  nameFormContainer: {
    width: "100%",
    alignItems: "flex-start",
  },
  nameTitle: {
    fontSize: Tokens.typography.fontSize["4xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.zinc[900],
    marginBottom: Tokens.spacing[2],
    textAlign: "left",
  },
  nameTitleAccent: {
    color: Tokens.colors.teal[500],
  },
  nameSubtitle: {
    fontSize: Tokens.typography.fontSize.lg,
    fontWeight: Tokens.typography.fontWeight.normal,
    color: Tokens.colors.neutral[400],
    marginBottom: Tokens.spacing[6],
    textAlign: "left",
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
    width: "100%",
    textAlign: "left",
  },

  // ── Welcome content ──
  welcomeTitle: {
    fontSize: Tokens.typography.fontSize["5xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.zinc[900],
    textAlign: "center",
    lineHeight: Tokens.typography.lineHeight[8],
    marginBottom: Tokens.spacing[4],
  },
  welcomeName: {
    color: Tokens.colors.teal[500],
  },
  welcomeSubtitle: {
    fontSize: Tokens.typography.fontSize.lg,
    color: Tokens.colors.zinc[500],
    textAlign: "center",
    lineHeight: Tokens.typography.lineHeight[3],
  },
});
