import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Tokens } from "@/constants/tokens";
import { useAudioStore } from "@/contexts/audio-store";
import { useProfileStore } from "@/contexts/profile-store";
import { getStreakSubtitle } from "@/lib/streak";

export default function StreakScreen() {
  const router = useRouter();
  const { name: storeName } = useProfileStore();
  const { count: countParam } = useLocalSearchParams<{ count?: string }>();
  const count = Number(countParam ?? 0);
  const displayName = storeName?.trim() || "Friend";
  const subtitle = getStreakSubtitle(count);

  const { playSfx } = useAudioStore();

  useFocusEffect(
    useCallback(() => {
      playSfx("streak");
    }, [playSfx]),
  );

  const goHome = () =>
    router.replace({ pathname: "/play", params: { name: displayName } });

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Flame Animation ── */}
      <View style={styles.content}>
        <LottieView
          source={require("@/assets/lottie/streak-lottie.json")}
          autoPlay
          loop
          style={styles.lottie}
        />

        {/* ── Streak Count ── */}
        <Text style={styles.count}>{count}</Text>

        {/* ── Title ── */}
        <Text style={styles.title}>Spilled Streak</Text>

        {/* ── Subtitle ── */}
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* ── Got It Button ── */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={goHome}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Got It</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Tokens.colors.white,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Tokens.spacing[8],
    gap: Tokens.spacing[3],
  },
  lottie: {
    width: 220,
    height: 220,
    marginBottom: Tokens.spacing[2],
  },
  count: {
    fontSize: Tokens.typography.fontSize["8xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.teal[500],
    lineHeight: Tokens.typography.lineHeight[11],
  },
  title: {
    fontSize: Tokens.typography.fontSize["3xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.neutral[800],
    textAlign: "center",
  },
  subtitle: {
    fontSize: Tokens.typography.fontSize.lg,
    color: Tokens.colors.neutral[400],
    textAlign: "center",
    lineHeight: Tokens.typography.lineHeight[3],
    paddingHorizontal: Tokens.spacing[4],
  },
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
  buttonText: {
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
    color: Tokens.colors.white,
  },
});
