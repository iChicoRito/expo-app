import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

import { useDeckStore } from "@/contexts/deck-store";
import { Tokens } from "@/constants/tokens";

export default function PreparationScreen() {
  const router = useRouter();
  const { getDeckById } = useDeckStore();
  const { deckId, name } = useLocalSearchParams<{
    deckId?: string;
    name?: string;
  }>();
  const deck = getDeckById(deckId);
  const accent = deck?.bgColor ?? Tokens.colors.teal[500];
  const deckTitle = deck?.title ?? "Spillr";

  const prefix = "You are about to play the ";
  const fullText = prefix + deckTitle;
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed >= fullText.length) return;
    const timer = setTimeout(() => setRevealed((r) => r + 1), 40);
    return () => clearTimeout(timer);
  }, [revealed, fullText.length]);

  const handleStart = () => {
    router.push({ pathname: "/game", params: { deckId, name } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headline}>
          {prefix.substring(0, Math.min(revealed, prefix.length))}
          {revealed > prefix.length ? (
            <Text style={{ color: accent }}>
              {deckTitle.substring(0, revealed - prefix.length)}
            </Text>
          ) : null}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: accent }]}
          onPress={handleStart}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Let&apos;s Get Started</Text>
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
    justifyContent: "center",
    paddingHorizontal: Tokens.spacing[8],
  },
  headline: {
    fontSize: Tokens.typography.fontSize["5xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.zinc[900],
    lineHeight: Tokens.typography.lineHeight[8],
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: Tokens.spacing[8],
    paddingBottom: Tokens.spacing[6],
  },
  button: {
    borderRadius: Tokens.layout.borderRadius["2xl"],
    paddingVertical: Tokens.spacing[4],
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
});
