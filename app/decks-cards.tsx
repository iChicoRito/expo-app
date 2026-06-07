import { Delete02Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useMemo, useState } from "react";
import {
  GestureResponderEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DeckContextMenu } from "@/components/deck-context-menu";
import { Dialog } from "@/components/dialog";
import { Snackbar } from "@/components/snackbar";
import { Tokens } from "@/constants/tokens";
import { useDeckStore } from "@/contexts/deck-store";

export default function DecksCardsScreen() {
  const { decks, getCardCount, getDeckById, deleteDeck } = useDeckStore();

  const [filter, setFilter] = useState<string>("all");
  const [menuDeckId, setMenuDeckId] = useState<string | null>(null);
  const [menuY, setMenuY] = useState(0);
  const [confirmDeckId, setConfirmDeckId] = useState<string | null>(null);
  const [snackVisible, setSnackVisible] = useState(false);

  const visibleDecks = useMemo(
    () => (filter === "all" ? decks : decks.filter((d) => d.id === filter)),
    [decks, filter],
  );

  const openMenu = (deckId: string, e: GestureResponderEvent) => {
    setMenuY(e.nativeEvent.pageY);
    setMenuDeckId(deckId);
  };

  const handleDelete = () => {
    if (!confirmDeckId) return;
    deleteDeck(confirmDeckId);
    setConfirmDeckId(null);
    setSnackVisible(true);
    setTimeout(() => setSnackVisible(false), 3300);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.title}>
        {"List of "}
        <Text style={styles.titleAccent}>Created Decks</Text>
      </Text>

      {/* ── Filter chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsRow}
      >
        {[{ id: "all", title: "All" }, ...decks].map((d) => {
          const active = d.id === filter;
          return (
            <TouchableOpacity
              key={d.id}
              style={[styles.chip, active && styles.chipActive]}
              activeOpacity={0.8}
              onPress={() => setFilter(d.id)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {d.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Deck list ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {visibleDecks.map((deck, index) => {
          const scale = Tokens.colors[deck.colorKey];
          return (
            <View key={deck.id}>
              {index > 0 && <View style={styles.rowDivider} />}
              <View style={styles.row}>
                <View style={styles.rowText}>
                  <Text style={[styles.deckTitle, { color: scale[500] }]}>
                    {deck.title}
                  </Text>
                  <Text style={styles.deckCount}>
                    x{getCardCount(deck.id)} Cards
                  </Text>
                </View>
                {!deck.isBuiltIn && (
                  <TouchableOpacity
                    hitSlop={8}
                    onPress={(e) => openMenu(deck.id, e)}
                  >
                    <HugeiconsIcon
                      icon={MoreVerticalIcon}
                      size={22}
                      color={Tokens.colors.neutral[400]}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <DeckContextMenu
        visible={menuDeckId !== null}
        anchorY={menuY}
        onClose={() => setMenuDeckId(null)}
        onEdit={() => {
          // TODO: implement edit navigation
          setMenuDeckId(null);
        }}
        onDelete={() => setConfirmDeckId(menuDeckId)}
        canDelete={true}
      />

      <Dialog
        visible={confirmDeckId !== null}
        onClose={() => setConfirmDeckId(null)}
        icon={Delete02Icon}
        iconColor={Tokens.colors.red[500]}
        iconBg={Tokens.colors.red[100]}
        title="Delete Deck?"
        message={
          confirmDeckId
            ? `"${getDeckById(confirmDeckId)?.title}" and its cards will be removed.`
            : undefined
        }
      >
        <View style={styles.dialogActions}>
          <TouchableOpacity
            style={[styles.dialogBtn, styles.dialogCancel]}
            activeOpacity={0.85}
            onPress={() => setConfirmDeckId(null)}
          >
            <Text style={styles.dialogCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dialogBtn, styles.dialogConfirm]}
            activeOpacity={0.85}
            onPress={handleDelete}
          >
            <Text style={styles.dialogConfirmText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Dialog>

      <Snackbar visible={snackVisible} message="Deck deleted" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Tokens.colors.white },
  title: {
    fontSize: Tokens.typography.fontSize["3xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.neutral[900],
    paddingHorizontal: Tokens.spacing[6],
    paddingTop: Tokens.spacing[4],
  },
  titleAccent: { color: Tokens.colors.teal[500] },

  // ── Chips ──
  chipsScroll: {
    flexGrow: 0,
    marginTop: Tokens.spacing[4],
  },
  chipsRow: {
    paddingHorizontal: Tokens.spacing[6],
    gap: Tokens.spacing[2],
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

  // ── List ──
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Tokens.spacing[6],
    paddingTop: Tokens.spacing[5],
    paddingBottom: Tokens.spacing[10],
  },
  card: {
    paddingHorizontal: Tokens.spacing[5],
    borderRadius: Tokens.layout.borderRadius["2xl"],
    borderWidth: Tokens.effects.borderWidth.default,
    borderColor: Tokens.colors.neutral[200],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Tokens.spacing[4],
  },
  rowText: { flex: 1, gap: 2 },
  deckTitle: {
    fontSize: Tokens.typography.fontSize.xl,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  deckCount: {
    fontSize: Tokens.typography.fontSize.sm,
    color: Tokens.colors.neutral[400],
  },
  rowDivider: {
    height: Tokens.effects.borderWidth.default,
    backgroundColor: Tokens.colors.neutral[100],
  },

  // ── Dialog actions ──
  dialogActions: {
    flexDirection: "row",
    gap: Tokens.spacing[3],
    marginTop: Tokens.spacing[6],
    width: "100%",
  },
  dialogBtn: {
    flex: 1,
    paddingVertical: Tokens.spacing[3],
    borderRadius: Tokens.layout.borderRadius.xl,
    alignItems: "center",
  },
  dialogCancel: { backgroundColor: Tokens.colors.neutral[100] },
  dialogCancelText: {
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
    color: Tokens.colors.neutral[700],
  },
  dialogConfirm: { backgroundColor: Tokens.colors.red[500] },
  dialogConfirmText: {
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
    color: Tokens.colors.white,
  },
});
