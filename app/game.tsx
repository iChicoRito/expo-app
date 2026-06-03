import {
  ArrowLeft01Icon,
  ArrowReloadHorizontalIcon,
  ArrowRight01Icon,
  Cancel01Icon,
  Clock01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { DiamondGrid } from "@/components/diamond-grid";
import { SpillrLogo } from "@/components/spillr-logo";
import { getDeckById } from "@/constants/decks";
import { getQuestionsForDeck } from "@/constants/questions";
import { Tokens } from "@/constants/tokens";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.82;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.5;
const TIMER_SECONDS = 120; // fixed 2-minute round

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function GameScreen() {
  const router = useRouter();
  const { deckId, name } = useLocalSearchParams<{
    deckId?: string;
    name?: string;
  }>();
  const deck = getDeckById(deckId);
  const accent = deck?.bgColor ?? Tokens.colors.teal[500];
  const questions = getQuestionsForDeck(deckId);
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Card slide transition: 0 = on-screen, negative = above screen, positive = below screen.
  const cardTranslateY = useSharedValue(0);

  // Card flip: 0 = front (unflipped), 1 = back (question revealed).
  const flip = useSharedValue(0);

  // Progress bar animation: 0 to total (responsive to currentIndex).
  const progressValue = useSharedValue(0);
  useEffect(() => {
    progressValue.value = withTiming(currentIndex + 1, { duration: 300 });
  }, [currentIndex, progressValue]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flip.value, [0, 1], [0, 180])}deg` },
    ],
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flip.value, [0, 1], [180, 360])}deg` },
    ],
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progressValue.value, [0, total], [0, 100])}%`,
  }));

  const cardSlideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const goToResults = useCallback(
    (answered: number, passed: number) => {
      router.replace({
        pathname: "/results",
        params: {
          deckId,
          name,
          answered: String(answered),
          passed: String(passed),
        },
      });
    },
    [router, deckId, name],
  );

  // Advance to the next question, or end the game if the deck is finished.
  // `answered`/`passed` are the running totals *after* this question's outcome.
  const advance = useCallback(
    (answered: number, passed: number) => {
      if (currentIndex + 1 >= total) {
        goToResults(answered, passed);
        return;
      }

      setIsTransitioning(true);

      // Exit: slide up + continue flip simultaneously so the card spins as it leaves.
      flip.value = withTiming(2, { duration: 350, easing: Easing.in(Easing.cubic) });
      cardTranslateY.value = withTiming(
        -SCREEN_HEIGHT,
        { duration: 350, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (!finished) return;

          // Card is off-screen — reset flip and reposition below screen instantly.
          flip.value = 0;
          cardTranslateY.value = SCREEN_HEIGHT;

          // Advance state on JS thread.
          runOnJS(setAnsweredCount)(answered);
          runOnJS(setPassedCount)(passed);
          runOnJS(setCurrentIndex)(currentIndex + 1);
          runOnJS(setFlipped)(false);
          runOnJS(setSecondsLeft)(TIMER_SECONDS);

          // Entrance: slide next card up from below into center (ease-out = decelerates to stop).
          cardTranslateY.value = withTiming(
            0,
            { duration: 280, easing: Easing.out(Easing.cubic) },
            (entranceFinished) => {
              if (entranceFinished) runOnJS(setIsTransitioning)(false);
            },
          );
        },
      );
    },
    [currentIndex, total, goToResults, flip, cardTranslateY],
  );

  const handleFlip = () => {
    if (flipped) return;
    setFlipped(true);
    flip.value = withTiming(1, { duration: 500 });
  };

  const handleEnd = () => goToResults(answeredCount, passedCount);
  const handleAnswered = () => advance(answeredCount + 1, passedCount);
  const handlePass = useCallback(
    () => advance(answeredCount, passedCount + 1),
    [advance, answeredCount, passedCount],
  );

  // Countdown — only runs while a question is revealed.
  useEffect(() => {
    if (!flipped || secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [flipped, secondsLeft]);

  // Time's up → auto-advance, counting the question as a Pass.
  useEffect(() => {
    if (flipped && secondsLeft === 0) {
      handlePass();
    }
  }, [flipped, secondsLeft, handlePass]);

  // Guard against a missing/empty deck (e.g. deep-link with a bad id).
  if (!deck || total === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: accent }]}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>This deck has no questions yet.</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() =>
              router.replace({ pathname: "/play", params: { name } })
            }
            activeOpacity={0.85}
          >
            <Text style={[styles.emptyButtonText, { color: accent }]}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: accent }]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <DiamondGrid
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          opacity={0.1}
        />
      </View>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={22}
            color={Tokens.colors.white}
          />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <SpillrLogo width={52} height={25} color={Tokens.colors.white} />
      </View>

      {/* ── Center group: timer + card + progress hug each other ── */}
      <View style={styles.centerGroup}>
        {/* Timer (visible once flipped) */}
        <View style={styles.timerSlot}>
          {flipped && (
            <View style={styles.timerPill}>
              <HugeiconsIcon icon={Clock01Icon} size={16} color={accent} />
              <Text style={[styles.timerText, { color: accent }]}>
                {formatTime(secondsLeft)}
              </Text>
            </View>
          )}
        </View>

        {/* Flip card */}
        <Animated.View style={cardSlideStyle}>
        <Pressable onPress={handleFlip} disabled={flipped || isTransitioning}>
          <View style={styles.cardSizer}>
            {/* Front — unflipped */}
            <Animated.View style={[styles.cardFace, frontStyle]}>
              <View
                style={[styles.deckPill, { backgroundColor: deck.bgLight }]}
              >
                <HugeiconsIcon icon={deck.icon} size={14} color={accent} />
                <Text style={[styles.deckPillText, { color: accent }]}>
                  {deck.title}
                </Text>
              </View>
              <View style={styles.cardCenter}>
                <Text style={styles.questionLabel}>Question</Text>
                <Text style={styles.questionNumber}>
                  No. {currentIndex + 1}
                </Text>
              </View>
              <View style={styles.flipHint}>
                <Text style={[styles.flipHintText, { color: accent }]}>
                  Tap to flip
                </Text>
                <HugeiconsIcon
                  icon={ArrowReloadHorizontalIcon}
                  size={16}
                  color={accent}
                />
              </View>
            </Animated.View>

            {/* Back — question revealed */}
            <Animated.View
              style={[styles.cardFace, styles.cardBack, backStyle]}
            >
              <Text style={styles.questionText}>
                {questions[currentIndex]}
              </Text>
            </Animated.View>
          </View>
        </Pressable>
        </Animated.View>

        {/* Progress bar */}
        <View style={styles.progressWrapper}>
          <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBarFill, progressBarStyle]} />
          </View>
          <Text style={styles.progressLabel}>
            {currentIndex + 1} of {total}
          </Text>
        </View>
      </View>

      {/* ── Actions (visible once flipped) ── */}
      <View style={styles.actionsSlot}>
        {flipped && (
          <View style={styles.actionsRow} pointerEvents={isTransitioning ? "none" : "auto"}>
            <ActionButton
              icon={Cancel01Icon}
              label="End Round"
              accent={accent}
              onPress={handleEnd}
            />
            <ActionButton
              icon={Tick02Icon}
              label="Spilled"
              accent={accent}
              onPress={handleAnswered}
            />
            <ActionButton
              icon={ArrowRight01Icon}
              label="Pass"
              accent={accent}
              onPress={handlePass}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function ActionButton({
  icon,
  label,
  accent,
  onPress,
}: {
  icon: IconSvgElement;
  label: string;
  accent: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.action}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.actionCircle}>
        <HugeiconsIcon icon={icon} size={24} color={accent} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ── Header ──
  header: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Tokens.spacing[5],
    paddingTop: Tokens.spacing[2],
  },
  backButton: {
    position: "absolute",
    left: Tokens.spacing[5],
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing[1],
  },
  backText: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },

  // ── Center group ──
  centerGroup: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Progress bar ──
  progressWrapper: {
    alignItems: "center",
    gap: Tokens.spacing[2],
    marginTop: Tokens.spacing[8],
  },
  progressBarContainer: {
    width: CARD_WIDTH * 0.6,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Tokens.colors.white,
    borderRadius: 2,
  },
  progressLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: Tokens.typography.fontSize.sm,
    fontWeight: Tokens.typography.fontWeight.medium,
  },

  // ── Timer ──
  timerSlot: {
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Tokens.spacing[3],
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing[1],
    backgroundColor: Tokens.colors.white,
    borderRadius: Tokens.layout.borderRadius.full,
    paddingVertical: Tokens.spacing[1],
    paddingHorizontal: Tokens.spacing[3],
  },
  timerText: {
    fontSize: Tokens.typography.fontSize.sm,
    fontWeight: Tokens.typography.fontWeight.bold,
  },

  // ── Card ──
  cardSizer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  cardFace: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Tokens.colors.white,
    borderRadius: 28,
    padding: Tokens.spacing[6],
    backfaceVisibility: "hidden",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardBack: {
    alignItems: "center",
    justifyContent: "center",
  },
  deckPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing[1],
    borderRadius: Tokens.layout.borderRadius.full,
    paddingVertical: Tokens.spacing[1],
    paddingHorizontal: Tokens.spacing[3],
  },
  deckPillText: {
    fontSize: Tokens.typography.fontSize.sm,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  cardCenter: {
    alignItems: "center",
  },
  questionLabel: {
    fontSize: Tokens.typography.fontSize["5xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.zinc[900],
  },
  questionNumber: {
    fontSize: Tokens.typography.fontSize["2xl"],
    fontWeight: Tokens.typography.fontWeight.semibold,
    color: Tokens.colors.zinc[900],
  },
  flipHint: {
    alignItems: "center",
    gap: Tokens.spacing[1],
  },
  flipHintText: {
    fontSize: Tokens.typography.fontSize.sm,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  questionText: {
    fontSize: Tokens.typography.fontSize["2xl"],
    fontWeight: Tokens.typography.fontWeight.semibold,
    color: Tokens.colors.zinc[900],
    textAlign: "center",
    lineHeight: Tokens.typography.lineHeight[7],
  },

  // ── Actions ──
  actionsSlot: {
    height: 96,
    justifyContent: "center",
    paddingBottom: Tokens.spacing[4],
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Tokens.spacing[10],
  },
  action: {
    alignItems: "center",
    gap: Tokens.spacing[2],
  },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Tokens.colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.sm,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },

  // ── Empty state ──
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Tokens.spacing[6],
    paddingHorizontal: Tokens.spacing[8],
  },
  emptyText: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.lg,
    fontWeight: Tokens.typography.fontWeight.semibold,
    textAlign: "center",
  },
  emptyButton: {
    backgroundColor: Tokens.colors.white,
    borderRadius: Tokens.layout.borderRadius["2xl"],
    paddingVertical: Tokens.spacing[4],
    paddingHorizontal: Tokens.spacing[8],
  },
  emptyButtonText: {
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
});
