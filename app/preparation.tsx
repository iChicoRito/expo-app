import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Tokens } from "@/constants/tokens";
import { useAudioStore } from "@/contexts/audio-store";
import { useDeckStore } from "@/contexts/deck-store";

export default function PreparationScreen() {
  const router = useRouter();
  const { getDeckById } = useDeckStore();
  const { deckId, name } = useLocalSearchParams<{
    deckId?: string;
    name?: string;
  }>();
  const deck = getDeckById(deckId);
  const accent = deck?.bgColor ?? Tokens.colors.teal[500];
  const starColorDark = deck
    ? Tokens.colors[deck.colorKey][500]
    : Tokens.colors.teal[500];
  const starColorLight = deck
    ? Tokens.colors[deck.colorKey][400]
    : Tokens.colors.teal[400];
  const deckTitle = deck?.title ?? "Spillr";

  const prefix = "You are about to play the ";
  const fullText = prefix + deckTitle;
  const [revealed, setRevealed] = useState(0);
  const textDone = revealed >= fullText.length;

  const buttonOpacity = useSharedValue(0);
  useEffect(() => {
    if (textDone) {
      buttonOpacity.value = withTiming(1, { duration: 400 });
    }
  }, [textDone, buttonOpacity]);

  const buttonAnimStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const { playSfx } = useAudioStore();

  useEffect(() => {
    if (textDone) {
      playSfx("preparation-star");
    }
  }, [textDone, playSfx]);

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
        {textDone && (
          <LottieView
            source={require("@/assets/lottie/star-lottie.json")}
            autoPlay
            loop={false}
            style={styles.starLottie}
            colorFilters={[
              { keypath: "Star.Group 1.Fill 1", color: starColorDark },
              { keypath: "Star.Group 2.Fill 1", color: starColorLight },
              { keypath: "Star-stroke", color: starColorDark },
              { keypath: "BG-Circle", color: starColorLight },
              ...Array.from({ length: 8 }, (_, i) => ({
                keypath: `circle ${i + 1}`,
                color: starColorLight,
              })),
            ]}
          />
        )}
        <Text style={styles.headline}>
          {prefix.substring(0, Math.min(revealed, prefix.length))}
          {revealed > prefix.length ? (
            <Text style={{ color: accent }}>
              {deckTitle.substring(0, revealed - prefix.length)}
            </Text>
          ) : null}
        </Text>
      </View>

      {textDone && (
        <Animated.View style={[styles.buttonContainer, buttonAnimStyle]}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: accent }]}
            onPress={handleStart}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Let&apos;s Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
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
  starLottie: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginBottom: -40,
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
