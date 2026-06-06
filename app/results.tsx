import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { SafeAreaView } from "react-native-safe-area-context";

import { SpillrLogo } from "@/components/spillr-logo";
import { Tokens } from "@/constants/tokens";
import { useAudioStore } from "@/contexts/audio-store";
import { useDeckStore } from "@/contexts/deck-store";
import { useProfileStore } from "@/contexts/profile-store";
import { resolveScenario } from "@/lib/scenario";

function getResultLottie(
  answeredCount: number,
  passedCount: number,
  totalCount: number,
) {
  if (answeredCount === 0 && passedCount === totalCount)
    return require("@/assets/lottie/ghosted-lottie.json");
  if (answeredCount === 0) return require("@/assets/lottie/clap-lottie.json");
  if (answeredCount < totalCount)
    return require("@/assets/lottie/trophy-lottie.json");
  return require("@/assets/lottie/star-lottie.json");
}

export default function ResultsScreen() {
  const router = useRouter();
  const { getDeckById } = useDeckStore();
  const { name: storeName } = useProfileStore();
  const { deckId, name, answered, passed, total } = useLocalSearchParams<{
    deckId?: string;
    name?: string;
    answered?: string;
    passed?: string;
    total?: string;
  }>();

  const deck = getDeckById(deckId);
  const accent = deck?.bgColor ?? Tokens.colors.teal[600];
  const sunburstColor = deck
    ? Tokens.colors[deck.colorKey][200]
    : Tokens.colors.teal[200];
  const displayName = name?.trim() || storeName?.trim() || "Friend";
  const answeredCount = Number(answered ?? 0);
  const passedCount = Number(passed ?? 0);
  const totalCount = Number(total ?? 0);
  const isGhosted = answeredCount === 0 && passedCount === totalCount;

  const { title, subtitle } = resolveScenario(
    answeredCount,
    passedCount,
    totalCount,
    displayName,
  );

  const { playSfx, stopIngameBgm } = useAudioStore();

  useFocusEffect(
    useCallback(() => {
      stopIngameBgm();
    }, [stopIngameBgm]),
  );

  useEffect(() => {
    playSfx("yehey");
  }, [playSfx]);

  const goHome = () =>
    router.replace({ pathname: "/play", params: { name: displayName } });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: accent }]}>
      {/* ── Sunburst background ── */}
      <View
        style={[StyleSheet.absoluteFill, { opacity: 0.25 }]}
        pointerEvents="none"
      >
        <LottieView
          source={require("@/assets/lottie/sunburts-lottie.json")}
          autoPlay
          loop
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
          colorFilters={[
            { keypath: "star", color: sunburstColor },
            ...Array.from({ length: 19 }, (_, i) => ({
              keypath: `star ${i + 2}`,
              color: sunburstColor,
            })),
          ]}
        />
      </View>

      {/* ── Header ── */}
      <View style={styles.header}>
        <SpillrLogo width={70} height={33} color={Tokens.colors.white} />
      </View>

      {/* ── Result ── */}
      <View style={styles.content}>
        <LottieView
          source={getResultLottie(answeredCount, passedCount, totalCount)}
          autoPlay
          loop={answeredCount === 0 || answeredCount === totalCount}
          style={isGhosted ? styles.resultLottieGhosted : styles.resultLottie}
        />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* ── Back to Home ── */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={goHome}
          activeOpacity={0.85}
        >
          <Text style={[styles.buttonText, { color: accent }]}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>

      <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} autoStart fadeOut />
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

  // ── Result ──
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Tokens.spacing[8],
    gap: Tokens.spacing[3],
  },
  resultLottie: {
    width: 400,
    height: 400,
    marginBottom: -90,
  },
  resultLottieGhosted: {
    width: 250,
    height: 250,
    marginBottom: -10,
  },
  title: {
    fontSize: Tokens.typography.fontSize["4xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.white,
    textAlign: "center",
    lineHeight: Tokens.typography.lineHeight[8],
    textShadowColor: "rgba(0,0,0,0.18)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 14,
  },
  subtitle: {
    fontSize: Tokens.typography.fontSize.base,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: Tokens.typography.lineHeight[3],
    textShadowColor: "rgba(0,0,0,0.12)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },

  // ── Button ──
  buttonContainer: {
    paddingHorizontal: Tokens.spacing[8],
    paddingBottom: Tokens.spacing[6],
  },
  button: {
    backgroundColor: Tokens.colors.white,
    borderRadius: Tokens.layout.borderRadius["2xl"],
    paddingVertical: Tokens.spacing[4],
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
});
