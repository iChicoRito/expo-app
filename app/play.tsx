import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Dimensions,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar } from "@/components/avatar";
import { BottomNav } from "@/components/bottom-nav";
import { DeckCard } from "@/components/deck-card";
import { DotIndicator } from "@/components/dot-indicator";
import { SpillrLogo } from "@/components/spillr-logo";
import { StreakIconSvg } from "@/components/streak-icon-svg";
import { useAudioStore } from "@/contexts/audio-store";
import { useDeckStore, type StoreDeck } from "@/contexts/deck-store";
import { useProfileStore } from "@/contexts/profile-store";
import { Tokens } from "@/constants/tokens";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.72;
const CARD_HEIGHT = CARD_WIDTH * 1.4;
const CARD_GAP = 8;
const ITEM_SIZE = CARD_WIDTH + CARD_GAP;
const SIDE_PAD = (SCREEN_WIDTH - CARD_WIDTH) / 2;
// Fixed track height with headroom so the scaled-up (1.1x) active card is not
// clipped, and so the list does not stretch to fill the column (which would
// push the dots down against the bottom nav).
const CAROUSEL_HEIGHT = CARD_HEIGHT * 1.14;

export default function PlayScreen() {
  const router = useRouter();
  const { decks } = useDeckStore();
  const { name: storeName, avatarId, colorKey } = useProfileStore();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const displayName = name?.trim() || storeName?.trim() || "Friend";
  const [activeIndex, setActiveIndex] = useState(0);

  // Live scroll offset, shared with each card so its scale/opacity/shadow can be
  // interpolated on the UI thread for jank-free, finger-tracking motion.
  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  // Audio: Start lobby BGM on focus, lower on blur
  const { onLobbyFocus, onLobbyBlur } = useAudioStore();
  useFocusEffect(
    useCallback(() => {
      onLobbyFocus();
      return () => {
        onLobbyBlur();
      };
    }, [onLobbyFocus, onLobbyBlur]),
  );

  // The active index is a discrete value (drives the Play button), so it only
  // needs to update once momentum settles on a snapped card.
  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / ITEM_SIZE);
      setActiveIndex(Math.max(0, Math.min(idx, decks.length - 1)));
    },
    [decks.length],
  );

  const keyExtractor = useCallback((deck: StoreDeck) => deck.id, []);

  const getItemLayout = useCallback(
    (_: ArrayLike<StoreDeck> | null | undefined, index: number) => ({
      length: ITEM_SIZE,
      offset: ITEM_SIZE * index,
      index,
    }),
    [],
  );

  const renderSeparator = useCallback(
    () => <View style={{ width: CARD_GAP }} />,
    [],
  );

  const renderDeck = useCallback<ListRenderItem<StoreDeck>>(
    ({ item, index }) => (
      <DeckCard
        deck={item}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        index={index}
        itemSize={ITEM_SIZE}
        scrollX={scrollX}
        isActive={index === activeIndex}
        onPlay={() =>
          router.push({
            pathname: "/preparation",
            params: { deckId: item.id, name: displayName },
          })
        }
      />
    ),
    [activeIndex, displayName, router, scrollX],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <SpillrLogo width={70} height={33} />
        <View style={styles.headerRight}>
          <View style={styles.streakChip}>
            <StreakIconSvg size={16} />
            <Text style={styles.streakText}>12 Spill Streak</Text>
          </View>
          <Pressable
            onPress={() => router.push("/profile")}
            style={[styles.avatar, { backgroundColor: Tokens.colors[colorKey][500] }]}
          >
            <Avatar id={avatarId} size={36} />
          </Pressable>
        </View>
      </View>

      {/* ── Greeting ── */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingTitle}>
          {"Hey, "}
          <Text style={styles.greetingName}>{displayName}</Text>
          {"\nReady to Spill?"}
        </Text>
        <Text style={styles.greetingSubtitle}>
          Pick a deck and start the conversation.
        </Text>
      </View>

      {/* ── Deck section ── */}
      <Text style={styles.sectionLabel}>Choose Your Deck</Text>

      {/* ── Carousel ── */}
      <View style={styles.carouselWrapper}>
        <Animated.FlatList
          data={decks}
          keyExtractor={keyExtractor}
          horizontal
          style={styles.carousel}
          showsHorizontalScrollIndicator={false}
          // Smooth snapping with momentum: the carousel decelerates smoothly
          // to the nearest card boundary, then snaps with easing.
          snapToInterval={ITEM_SIZE}
          snapToAlignment="start"
          decelerationRate={0.9}
          // `bounces` gives soft resistance at first/last card edges.
          bounces
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          onMomentumScrollEnd={handleMomentumEnd}
          getItemLayout={getItemLayout}
          contentContainerStyle={[
            styles.carouselContent,
            { paddingHorizontal: SIDE_PAD },
          ]}
          ItemSeparatorComponent={renderSeparator}
          renderItem={renderDeck}
        />

        {/* Page dots */}
        <View style={styles.dotsRow}>
          {decks.map((deck, i) => (
            <DotIndicator key={deck.id} active={i === activeIndex} />
          ))}
        </View>
      </View>

      {/* ── Bottom navigation ── */}
      <BottomNav
        active="play"
        onSelect={(tab) => {
          if (tab === "deck") router.push("/decks");
          if (tab === "profile") router.push("/profile");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Tokens.colors.white,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Tokens.spacing[6],
    paddingTop: Tokens.spacing[4],
    paddingBottom: Tokens.spacing[2],
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing[3],
  },
  streakChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing[1],
    borderWidth: Tokens.effects.borderWidth.default,
    borderColor: Tokens.colors.zinc[200],
    borderRadius: Tokens.layout.borderRadius.full,
    paddingVertical: Tokens.spacing[1],
    paddingHorizontal: Tokens.spacing[3],
  },
  streakText: {
    fontSize: Tokens.typography.fontSize.sm,
    fontWeight: Tokens.typography.fontWeight.semibold,
    color: Tokens.colors.neutral[700],
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  // ── Greeting ──
  greetingSection: {
    paddingHorizontal: Tokens.spacing[6],
    marginTop: Tokens.spacing[6],
    marginBottom: Tokens.spacing[2],
    gap: Tokens.spacing[1],
  },
  greetingTitle: {
    fontSize: Tokens.typography.fontSize["2xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.neutral[700],
    lineHeight: Tokens.typography.lineHeight[5],
  },
  greetingName: {
    color: Tokens.colors.teal[500],
  },
  greetingSubtitle: {
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.normal,
    color: Tokens.colors.neutral[400],
  },

  // ── Deck section ──
  sectionLabel: {
    marginTop: Tokens.spacing[6],
    marginBottom: Tokens.spacing[1],
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
    color: Tokens.colors.neutral[700],
    textAlign: "center",
  },

  // ── Carousel ──
  carouselWrapper: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: Tokens.spacing[2],
  },
  carousel: {
    height: CAROUSEL_HEIGHT,
    flexGrow: 0,
    paddingTop: Tokens.spacing[8],
    paddingBottom: Tokens.spacing[8],
  },
  carouselContent: {
    alignItems: "center",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Tokens.spacing[2],
    marginTop: Tokens.spacing[6],
    marginBottom: Tokens.spacing[8],
  },
});
