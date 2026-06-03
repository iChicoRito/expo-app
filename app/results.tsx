import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DiamondGrid } from "@/components/diamond-grid";
import { SpillrLogo } from "@/components/spillr-logo";
import { getDeckById } from "@/constants/decks";
import { Tokens } from "@/constants/tokens";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * Pick the end-game result purely from the answered/passed tallies:
 * - answered 0          → "Certified Dodger" (ended without answering anything)
 * - some answered + any pass → "Almost Spilled Everything"
 * - answered, zero passes    → "You Spilled Everything"
 */
function resolveScenario(answered: number, passed: number, name: string) {
  if (answered === 0) {
    return {
      title: `Certified Dodger, ${name}`,
      subtitle: "You passed every question. Suspicious, but we'll allow it.",
    };
  }
  if (passed > 0) {
    return {
      title: `Almost Spilled Everything, ${name}`,
      subtitle: "You finished the deck, but some tea stayed unspilled.",
    };
  }
  return {
    title: `You Spilled Everything, ${name}`,
    subtitle: "You survived the questions. Honestly, iconic behavior.",
  };
}

export default function ResultsScreen() {
  const router = useRouter();
  const { deckId, name, answered, passed } = useLocalSearchParams<{
    deckId?: string;
    name?: string;
    answered?: string;
    passed?: string;
  }>();

  const deck = getDeckById(deckId);
  const accent = deck?.bgColor ?? Tokens.colors.teal[500];
  const displayName = name?.trim() || "Friend";
  const answeredCount = Number(answered ?? 0);
  const passedCount = Number(passed ?? 0);

  const { title, subtitle } = resolveScenario(
    answeredCount,
    passedCount,
    displayName,
  );

  const goHome = () =>
    router.replace({ pathname: "/play", params: { name: displayName } });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: accent }]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <DiamondGrid width={SCREEN_WIDTH} height={SCREEN_HEIGHT} opacity={0.1} />
      </View>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goHome}
          activeOpacity={0.7}
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={22}
            color={Tokens.colors.white}
          />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <SpillrLogo width={70} height={33} color={Tokens.colors.white} />
      </View>

      {/* ── Result ── */}
      <View style={styles.content}>
        {deck && (
          <>
            <View style={styles.iconBadge}>
              <HugeiconsIcon icon={deck.icon} size={32} color={accent} />
            </View>
            <View style={styles.deckPill}>
              <Text style={[styles.deckPillText, { color: accent }]}>
                {deck.title}
              </Text>
            </View>
          </>
        )}
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

  // ── Result ──
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Tokens.spacing[8],
    gap: Tokens.spacing[3],
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Tokens.colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Tokens.spacing[1],
  },
  deckPill: {
    backgroundColor: Tokens.colors.white,
    borderRadius: Tokens.layout.borderRadius.full,
    paddingVertical: Tokens.spacing[1],
    paddingHorizontal: Tokens.spacing[3],
    marginBottom: Tokens.spacing[2],
  },
  deckPillText: {
    fontSize: Tokens.typography.fontSize.sm,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  title: {
    fontSize: Tokens.typography.fontSize["4xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.white,
    textAlign: "center",
    lineHeight: Tokens.typography.lineHeight[6],
  },
  subtitle: {
    fontSize: Tokens.typography.fontSize.base,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: Tokens.typography.lineHeight[3],
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
