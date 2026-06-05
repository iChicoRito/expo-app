import {
  ArrowLeft01Icon,
  ArrowReloadHorizontalIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { BlurView } from "expo-blur";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
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
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Dialog } from "@/components/dialog";
import { DiamondGrid } from "@/components/diamond-grid";
import { SpillrLogo } from "@/components/spillr-logo";
import { EndRoundButton } from "@/components/svg-buttons/end-round-button";
import { PassButton } from "@/components/svg-buttons/pass-button";
import { SpilledButton } from "@/components/svg-buttons/spilled-button";
import { getDeckColorScale } from "@/constants/decks";
import { Tokens } from "@/constants/tokens";
import { useAudioStore } from "@/contexts/audio-store";
import { useDeckStore } from "@/contexts/deck-store";
import { useProfileStore } from "@/contexts/profile-store";
import { resolveScenario } from "@/lib/scenario";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.82;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.6;
const TIMER_SECONDS = 120; // fixed 2-minute round
const DIAGONAL_SCALE = 1.6;
const DIAGONAL_ANGLE = 30; // degrees — must be ≥25 per spec

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function GameScreen() {
  const router = useRouter();
  const { getDeckById, getQuestions } = useDeckStore();
  const { recordSession } = useProfileStore();
  const { deckId, name } = useLocalSearchParams<{
    deckId?: string;
    name?: string;
  }>();
  const deck = getDeckById(deckId);
  const accent = deck?.bgColor ?? Tokens.colors.teal[500];
  const colorScale = deck
    ? getDeckColorScale(deck)
    : {
        c300: Tokens.colors.teal[300],
        c400: Tokens.colors.teal[400],
        c500: Tokens.colors.teal[500],
        c600: Tokens.colors.teal[600],
      };
  const questions = getQuestions(deckId);
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { onGameFocus, onGameBlur, playSfx } = useAudioStore();
  const [showExitDialog, setShowExitDialog] = useState(false);

  useFocusEffect(
    useCallback(() => {
      onGameFocus();
      return () => {
        onGameBlur();
      };
    }, [onGameFocus, onGameBlur]),
  );

  const anyCardFlipped = flipped || answeredCount > 0 || passedCount > 0;
  const anyCardFlippedRef = useRef(anyCardFlipped);
  useEffect(() => {
    anyCardFlippedRef.current = anyCardFlipped;
  }, [anyCardFlipped]);

  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        if (anyCardFlippedRef.current) {
          setShowExitDialog(true);
          playSfx("confirmation-dialog");
        } else {
          router.replace({ pathname: "/play", params: { name } });
        }
        return true;
      };
      const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
      return () => sub.remove();
    }, [name, router, playSfx]),
  );

  // Card slide transition: 0 = on-screen, negative = above screen, positive = below screen.
  const cardTranslateY = useSharedValue(0);

  // Card flip: 0 = front (unflipped), 1 = back (question revealed).
  const flip = useSharedValue(0);

  // Progress bar animation: 0 to total (responsive to currentIndex).
  const progressValue = useSharedValue(0);
  useEffect(() => {
    progressValue.value = withTiming(currentIndex + 1, { duration: 300 });
  }, [currentIndex, progressValue]);

  // Card group slides up when flipped to make room for the action buttons.
  const cardGroupOffset = useSharedValue(0);

  // Button entrance: Spilled rises first, End Round + Pass follow 130ms later.
  const spilledTY = useSharedValue(36);
  const spilledOpacity = useSharedValue(0);
  const sidesTY = useSharedValue(36);
  const sidesOpacity = useSharedValue(0);
  useEffect(() => {
    if (flipped) {
      cardGroupOffset.value = withTiming(-50, {
        duration: 340,
        easing: Easing.out(Easing.cubic),
      });
      spilledTY.value = withTiming(0, {
        duration: 340,
        easing: Easing.out(Easing.cubic),
      });
      spilledOpacity.value = withTiming(1, { duration: 280 });
      sidesTY.value = withDelay(
        130,
        withTiming(0, { duration: 340, easing: Easing.out(Easing.cubic) }),
      );
      sidesOpacity.value = withDelay(130, withTiming(1, { duration: 280 }));
    } else {
      cardGroupOffset.value = withTiming(0, {
        duration: 340,
        easing: Easing.out(Easing.cubic),
      });
      spilledTY.value = 36;
      spilledOpacity.value = 0;
      sidesTY.value = 36;
      sidesOpacity.value = 0;
    }
  }, [
    flipped,
    cardGroupOffset,
    spilledTY,
    spilledOpacity,
    sidesTY,
    sidesOpacity,
  ]);

  const cardGroupStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardGroupOffset.value }],
  }));
  const spilledAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: spilledTY.value }],
    opacity: spilledOpacity.value,
  }));
  const sidesAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sidesTY.value }],
    opacity: sidesOpacity.value,
  }));

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flip.value, [0, 1, 2], [0, 180, 360])}deg` },
    ],
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flip.value, [0, 1, 2], [180, 360, 540])}deg` },
    ],
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progressValue.value, [0, total], [0, 100])}%`,
  }));

  const cardSlideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const cardBlurStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      cardTranslateY.value,
      [0, -SCREEN_HEIGHT * 0.3, -SCREEN_HEIGHT],
      [0, 0.7, 1],
    ),
  }));

  const goToResults = useCallback(
    (answered: number, passed: number) => {
      // Record the real session + roll up stats before leaving the game. This
      // is the single funnel for all end paths (deck finished, End Round,
      // timeout-pass), so every completed round lands in Play History.
      if (deck) {
        const displayName = name?.trim() || "Friend";
        const { title, node } = resolveScenario(answered, passed, displayName);
        recordSession({
          deckId: deck.id,
          deckTitle: deck.title,
          colorKey: deck.colorKey,
          subtitle: title,
          node,
          answered,
          passed,
        });
      }
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
    [router, deckId, name, deck, recordSession],
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
      flip.value = withTiming(2, {
        duration: 350,
        easing: Easing.in(Easing.cubic),
      });
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

  const handleFlip = useCallback(() => {
    if (flipped) return;
    playSfx("flipping-card");
    setFlipped(true);
    flip.value = withTiming(1, { duration: 500 });
  }, [flipped, playSfx, flip]);

  const handleBack = useCallback(() => {
    if (anyCardFlippedRef.current) {
      setShowExitDialog(true);
      playSfx("confirmation-dialog");
    } else {
      router.replace({ pathname: "/play", params: { name } });
    }
  }, [name, router, playSfx]);

  const handleEnd = useCallback(
    () => goToResults(answeredCount, passedCount),
    [goToResults, answeredCount, passedCount],
  );

  const handleAnswered = useCallback(() => {
    playSfx("card-answered");
    advance(answeredCount + 1, passedCount);
  }, [playSfx, advance, answeredCount, passedCount]);
  const handlePass = useCallback(() => {
    playSfx("card-pass");
    advance(answeredCount, passedCount + 1);
  }, [advance, answeredCount, passedCount, playSfx]);

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
        <View style={styles.bgClip}>
          <View style={styles.bgRotated}>
            <DiamondGrid
              width={SCREEN_WIDTH * DIAGONAL_SCALE}
              height={SCREEN_HEIGHT * DIAGONAL_SCALE}
              opacity={0.1}
              animated
              scrollDuration={16000}
            />
          </View>
        </View>
      </View>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
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
        {flipped && (
          <View style={styles.timerPill}>
            <HugeiconsIcon icon={Clock01Icon} size={16} color={accent} />
            <Text style={[styles.timerText, { color: accent }]}>
              {formatTime(secondsLeft)}
            </Text>
          </View>
        )}
      </View>

      {/* ── Center group: card + progress hug each other ── */}
      <View style={styles.centerGroup}>
        <Animated.View style={[styles.cardGroup, cardGroupStyle]}>
          {/* Flip card */}
          <Animated.View style={cardSlideStyle}>
            <Pressable
              onPress={handleFlip}
              disabled={flipped || isTransitioning}
            >
              <View style={styles.cardSizer}>
                {/* Front — unflipped */}
                <Animated.View
                  style={[styles.cardFace, styles.cardFront, frontStyle]}
                >
                  <View
                    style={[styles.cardInnerBorder, { borderColor: accent }]}
                    pointerEvents="none"
                  />
                  <View style={styles.cardCenter}>
                    <View
                      style={[
                        styles.deckPill,
                        { backgroundColor: deck.bgLight },
                      ]}
                    >
                      <HugeiconsIcon
                        icon={deck.icon}
                        size={14}
                        color={accent}
                      />
                      <Text style={[styles.deckPillText, { color: accent }]}>
                        {deck.title}
                      </Text>
                    </View>
                    <View style={styles.questionTitleGroup}>
                      <Text style={styles.questionLabel}>Question</Text>
                      <Text style={styles.questionNumber}>
                        No. {currentIndex + 1}
                      </Text>
                    </View>
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
                  <View
                    style={[styles.cardInnerBorder, { borderColor: accent }]}
                    pointerEvents="none"
                  />
                  <Text style={styles.questionText}>
                    {questions[currentIndex]}
                  </Text>
                </Animated.View>
              </View>
            </Pressable>
            {isTransitioning && (
              <Animated.View
                style={[styles.blurOverlay, cardBlurStyle]}
                pointerEvents="none"
              >
                <BlurView intensity={30} />
              </Animated.View>
            )}
          </Animated.View>

          {/* Progress bar */}
          <View style={styles.progressWrapper}>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[styles.progressBarFill, progressBarStyle]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {currentIndex + 1} of {total}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* ── Actions (visible once flipped) ── */}
      <View style={styles.actionsSlot}>
        <View
          style={styles.actionsRow}
          pointerEvents={isTransitioning || !flipped ? "none" : "auto"}
        >
          <Animated.View style={sidesAnimStyle}>
            <EndRoundButton
              colorScale={colorScale}
              onPress={handleEnd}
              label="End Round"
            />
          </Animated.View>
          <Animated.View style={spilledAnimStyle}>
            <SpilledButton
              colorScale={colorScale}
              onPress={handleAnswered}
              label="Spilled"
            />
          </Animated.View>
          <Animated.View style={sidesAnimStyle}>
            <PassButton
              colorScale={colorScale}
              onPress={handlePass}
              label="Pass"
            />
          </Animated.View>
        </View>
      </View>

      <Dialog
        visible={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        dismissOnBackdrop
        title="Leave game?"
        message="Are you sure you want to leave? Your progress will be lost."
      >
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginTop: 16,
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={[
              styles.dialogBtn,
              { flex: 1, backgroundColor: Tokens.colors.neutral[100] },
            ]}
            onPress={() => setShowExitDialog(false)}
            activeOpacity={0.8}
          >
            <Text
              style={{
                fontSize: Tokens.typography.fontSize.base,
                fontWeight: Tokens.typography.fontWeight.semibold,
                color: Tokens.colors.neutral[700],
                textAlign: "center",
              }}
            >
              Stay
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dialogBtn, { flex: 1, backgroundColor: accent }]}
            onPress={() => {
              setShowExitDialog(false);
              router.replace({ pathname: "/play", params: { name } });
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{
                fontSize: Tokens.typography.fontSize.base,
                fontWeight: Tokens.typography.fontWeight.semibold,
                color: Tokens.colors.white,
                textAlign: "center",
              }}
            >
              Leave
            </Text>
          </TouchableOpacity>
        </View>
      </Dialog>
    </SafeAreaView>
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
  cardGroup: {
    alignItems: "center",
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
  timerPill: {
    position: "absolute",
    right: Tokens.spacing[5],
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
  cardFront: {
    justifyContent: "center",
  },
  cardInnerBorder: {
    position: "absolute",
    top: 12,
    right: 12,
    bottom: 12,
    left: 12,
    borderWidth: 4,
    borderRadius: 24,
  },
  cardBack: {
    alignItems: "center",
    justifyContent: "center",
  },
  blurOverlay: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 28,
    overflow: "hidden",
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
    gap: Tokens.spacing[2],
  },
  questionTitleGroup: {
    alignItems: "center",
  },
  questionLabel: {
    fontSize: Tokens.typography.fontSize["6xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.zinc[900],
  },
  questionNumber: {
    fontSize: Tokens.typography.fontSize["2xl"],
    fontWeight: Tokens.typography.fontWeight.semibold,
    color: Tokens.colors.zinc[900],
  },
  flipHint: {
    position: "absolute",
    bottom: Tokens.spacing[10],
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: Tokens.spacing[3],
    paddingBottom: Tokens.spacing[8],
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: Tokens.spacing[6],
  },
  // ── Dialog ──
  dialogBtn: {
    paddingVertical: Tokens.spacing[3],
    paddingHorizontal: Tokens.spacing[4],
    borderRadius: Tokens.layout.borderRadius.xl,
    alignItems: "center" as const,
    justifyContent: "center" as const,
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
  bgClip: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  bgRotated: {
    position: "absolute",
    top: -(SCREEN_HEIGHT * ((DIAGONAL_SCALE - 1) / 2)),
    left: -(SCREEN_WIDTH * ((DIAGONAL_SCALE - 1) / 2)),
    transform: [{ rotate: `${DIAGONAL_ANGLE}deg` }],
  },
});
