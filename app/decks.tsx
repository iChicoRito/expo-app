import { Delete02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  type ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/bottom-nav";
import type { ColorScaleKey } from "@/components/deck-card";
import { CreateDeckSheet } from "@/components/create-deck-sheet";
import { DeckContextMenu } from "@/components/deck-context-menu";
import { DeckListItem } from "@/components/deck-list-item";
import { Dialog } from "@/components/dialog";
import { Snackbar } from "@/components/snackbar";
import { Tokens } from "@/constants/tokens";
import { useDeckStore, type StoreDeck } from "@/contexts/deck-store";

type Filter = "all" | "builtin" | "mine";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "builtin", label: "Built-in" },
  { key: "mine", label: "My Decks" },
];

type DeckRowProps = {
  item: StoreDeck;
  cardCount: number;
  onPress: () => void;
  onLongPress: (pageY: number) => void;
};

const DeckRow = memo(function DeckRow({
  item,
  cardCount,
  onPress,
  onLongPress,
}: DeckRowProps) {
  const rowRef = useRef<View>(null);
  return (
    <View ref={rowRef} collapsable={false}>
      <DeckListItem
        deck={item}
        cardCount={cardCount}
        onPress={onPress}
        onLongPress={() => {
          rowRef.current?.measure((_x, _y, _w, _h, _px, py) => {
            onLongPress(py);
          });
        }}
      />
    </View>
  );
});

export default function DecksScreen() {
  const router = useRouter();
  const { decks, getCardCount, createDeck, updateDeck, deleteDeck } = useDeckStore();

  const [filter, setFilter] = useState<Filter>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [menuTarget, setMenuTarget] = useState<StoreDeck | null>(null);
  const [menuAnchorY, setMenuAnchorY] = useState(120);
  const [editTarget, setEditTarget] = useState<StoreDeck | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StoreDeck | null>(null);
  const [snackMessage, setSnackMessage] = useState("Deck created successfully!");

  const visibleDecks = useMemo(() => {
    if (filter === "builtin") return decks.filter((d) => d.isBuiltIn);
    if (filter === "mine") return decks.filter((d) => !d.isBuiltIn);
    return decks;
  }, [decks, filter]);

  const handleCreate = useCallback(
    async (input: { name: string; iconKey: string; colorKey: ColorScaleKey }) => {
      await createDeck(input);
      setSheetOpen(false);
      setSnackMessage("Deck created successfully!");
      setSnackVisible(true);
      setTimeout(() => setSnackVisible(false), 3300);
    },
    [createDeck],
  );

  const handleEdit = useCallback(() => {
    setEditTarget(menuTarget);
    setMenuTarget(null);
  }, [menuTarget]);

  const handleSave = useCallback(
    async (input: { name: string; iconKey: string; colorKey: ColorScaleKey }) => {
      if (!editTarget) return;
      await updateDeck(editTarget.id, input);
      setEditTarget(null);
      setSnackMessage("Deck updated successfully!");
      setSnackVisible(true);
      setTimeout(() => setSnackVisible(false), 3300);
    },
    [editTarget, updateDeck],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteDeck(deleteTarget.id);
    setDeleteTarget(null);
  }, [deleteTarget, deleteDeck]);

  const renderDeck = useCallback<ListRenderItem<StoreDeck>>(
    ({ item }) => (
      <DeckRow
        item={item}
        cardCount={getCardCount(item.id)}
        onPress={() =>
          router.push({ pathname: "/questions", params: { deckId: item.id } })
        }
        onLongPress={(pageY) => {
          setMenuTarget(item);
          setMenuAnchorY(pageY);
        }}
      />
    ),
    [getCardCount, router],
  );

  const keyExtractor = useCallback((deck: StoreDeck) => deck.id, []);

  const renderSeparator = useCallback(
    () => <View style={styles.listSeparator} />,
    [],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {"Create your "}
          <Text style={styles.titleAccent}>Custom Deck</Text>
        </Text>
      </View>

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

      <FlatList
        data={visibleDecks}
        keyExtractor={keyExtractor}
        renderItem={renderDeck}
        ItemSeparatorComponent={renderSeparator}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          visibleDecks.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
        ListEmptyComponent={
          <Text style={styles.empty}>
            No decks here yet. Tap Create Deck to make one.
          </Text>
        }
      />

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
          if (tab === "profile") router.push("/profile");
        }}
      />

      <CreateDeckSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onCreate={handleCreate}
      />

      <Snackbar visible={snackVisible} message={snackMessage} />

      <DeckContextMenu
        visible={!!menuTarget}
        onClose={() => setMenuTarget(null)}
        onEdit={handleEdit}
        onDelete={() => {
          setDeleteTarget(menuTarget);
          setMenuTarget(null);
        }}
        canDelete={!(menuTarget?.isBuiltIn ?? true)}
        anchorY={menuAnchorY}
      />

      <CreateDeckSheet
        visible={!!editTarget}
        onClose={() => setEditTarget(null)}
        initialValues={
          editTarget
            ? {
                name: editTarget.title,
                iconKey: editTarget.iconKey ?? "decks-icon-1",
                colorKey: editTarget.colorKey,
              }
            : undefined
        }
        onSave={handleSave}
      />

      <Dialog
        visible={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        icon={Delete02Icon}
        iconColor={Tokens.colors.red[500]}
        iconBg={Tokens.colors.red[100]}
        title="Delete Deck?"
        message={`"${deleteTarget?.title ?? ""}" and all its cards will be permanently removed. This can't be undone.`}
      >
        <View style={styles.dialogActions}>
          <TouchableOpacity
            style={[styles.dialogBtn, styles.dialogCancel]}
            activeOpacity={0.85}
            onPress={() => setDeleteTarget(null)}
          >
            <Text style={styles.dialogCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dialogBtn, styles.dialogConfirm]}
            activeOpacity={0.85}
            onPress={handleDeleteConfirm}
          >
            <Text style={styles.dialogConfirmText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Dialog>
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
  },
  emptyListContent: { flexGrow: 1 },
  listSeparator: { height: Tokens.spacing[3] },
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
