import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/bottom-nav";
import type { ColorScaleKey } from "@/components/deck-card";
import { CreateDeckSheet } from "@/components/create-deck-sheet";
import { DeckListItem } from "@/components/deck-list-item";
import { Snackbar } from "@/components/snackbar";
import { useDeckStore } from "@/contexts/deck-store";
import { Tokens } from "@/constants/tokens";

type Filter = "all" | "builtin" | "mine";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "builtin", label: "Built-in" },
  { key: "mine", label: "My Decks" },
];

export default function DecksScreen() {
  const router = useRouter();
  const { decks, getCardCount, createDeck } = useDeckStore();

  const [filter, setFilter] = useState<Filter>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);

  const visibleDecks = useMemo(() => {
    if (filter === "builtin") return decks.filter((d) => d.isBuiltIn);
    if (filter === "mine") return decks.filter((d) => !d.isBuiltIn);
    return decks;
  }, [decks, filter]);

  const handleCreate = async (input: {
    name: string;
    iconKey: string;
    colorKey: ColorScaleKey;
  }) => {
    await createDeck(input);
    setSheetOpen(false);
    setSnackVisible(true);
    // Reset the one-shot visibility flag after the snackbar's lifetime.
    setTimeout(() => setSnackVisible(false), 3300);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {"Create your "}
          <Text style={styles.titleAccent}>Custom Deck</Text>
        </Text>
      </View>

      {/* Filter chips */}
      <View style={styles.chipsRow}>
        {FILTERS.map((f) => {
          const active = f.key === filter;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Deck list */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {visibleDecks.map((deck) => (
          <DeckListItem
            key={deck.id}
            deck={deck}
            cardCount={getCardCount(deck.id)}
            onPress={() =>
              router.push({ pathname: "/questions", params: { deckId: deck.id } })
            }
          />
        ))}
        {visibleDecks.length === 0 && (
          <Text style={styles.empty}>
            No decks here yet. Tap “Create Deck” to make one.
          </Text>
        )}
      </ScrollView>

      {/* Create Deck button */}
      <View style={styles.fabWrap}>
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => setSheetOpen(true)}
        >
          <HugeiconsIcon
            icon={PlusSignIcon}
            size={18}
            color={Tokens.colors.white}
          />
          <Text style={styles.fabText}>Create Deck</Text>
        </TouchableOpacity>
      </View>

      <BottomNav
        active="deck"
        onSelect={(tab) => {
          if (tab === "play") router.push("/play");
        }}
      />

      <CreateDeckSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onCreate={handleCreate}
      />

      <Snackbar visible={snackVisible} message="Deck created successfully!" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Tokens.colors.white },
  header: {
    paddingHorizontal: Tokens.spacing[6],
    paddingTop: Tokens.spacing[4],
    gap: Tokens.spacing[1],
  },
  title: {
    fontSize: Tokens.typography.fontSize["2xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.neutral[900],
  },
  titleAccent: { color: Tokens.colors.teal[500] },
  chipsRow: {
    flexDirection: "row",
    gap: Tokens.spacing[2],
    paddingHorizontal: Tokens.spacing[6],
    paddingVertical: Tokens.spacing[4],
  },
  chip: {
    paddingHorizontal: Tokens.spacing[4],
    paddingVertical: Tokens.spacing[2],
    borderRadius: Tokens.layout.borderRadius.full,
    borderWidth: Tokens.effects.borderWidth.default,
    borderColor: Tokens.colors.neutral[200],
  },
  chipActive: {
    backgroundColor: Tokens.colors.teal[500],
    borderColor: Tokens.colors.teal[500],
  },
  chipText: {
    fontSize: Tokens.typography.fontSize.sm,
    fontWeight: Tokens.typography.fontWeight.semibold,
    color: Tokens.colors.neutral[500],
  },
  chipTextActive: { color: Tokens.colors.white },
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: Tokens.spacing[6],
    paddingBottom: Tokens.spacing[24],
    gap: Tokens.spacing[3],
  },
  empty: {
    textAlign: "center",
    color: Tokens.colors.neutral[400],
    fontSize: Tokens.typography.fontSize.sm,
    marginTop: Tokens.spacing[10],
  },
  fabWrap: {
    position: "absolute",
    right: Tokens.spacing[6],
    bottom: 90,
  },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing[2],
    backgroundColor: Tokens.colors.teal[500],
    paddingVertical: Tokens.spacing[3],
    paddingHorizontal: Tokens.spacing[5],
    borderRadius: Tokens.layout.borderRadius["2xl"],
  },
  fabText: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
});
