import { Cards02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Dialog } from "@/components/dialog";
import { TimelineRow } from "@/components/timeline-row";
import { Tokens } from "@/constants/tokens";
import { useDeckStore } from "@/contexts/deck-store";
import { useProfileStore } from "@/contexts/profile-store";

type FilterType = "all" | "spilled" | "passed" | "no-spilled";

export default function PlayHistoryScreen() {
  const { getDeckById } = useDeckStore();
  const { history, clearHistory } = useProfileStore();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  const hasHistory = history.length > 0;

  const filteredHistory = history.filter((session) => {
    switch (filter) {
      case "spilled":
        return session.node === "filled";
      case "passed":
        return session.node === "outlined";
      case "no-spilled":
        return session.node === "outlined";
      default:
        return true;
    }
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.title}>
        {"Your "}
        <Text style={styles.titleAccent}>Play History</Text>
      </Text>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsRow}
      >
        {(["all", "spilled", "passed", "no-spilled"] as const).map((f) => {
          const active = f === filter;
          const labels: Record<FilterType, string> = {
            all: "All",
            spilled: "Spilled",
            passed: "Passed",
            "no-spilled": "No Spilled",
          };
          return (
            <TouchableOpacity
              key={f}
              style={[styles.chip, active && styles.chipActive]}
              activeOpacity={0.8}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {labels[f]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {hasHistory && filteredHistory.length > 0 ? (
          <>
            {filteredHistory.map((session) => (
              <TimelineRow
                key={session.id}
                session={session}
                icon={getDeckById(session.deckId)?.icon ?? Cards02Icon}
              />
            ))}
          </>
        ) : (
          <Text style={styles.empty}>
            No games played yet. Finish a round to see it here.
          </Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.clearButton, !hasHistory && styles.clearDisabled]}
          activeOpacity={0.85}
          disabled={!hasHistory}
          onPress={() => setConfirmOpen(true)}
        >
          <HugeiconsIcon
            icon={Delete02Icon}
            size={20}
            color={Tokens.colors.white}
          />
          <Text style={styles.clearText}>Clear History</Text>
        </TouchableOpacity>
      </View>

      <Dialog
        visible={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        icon={Delete02Icon}
        iconColor={Tokens.colors.red[500]}
        iconBg={Tokens.colors.red[100]}
        title="Clear History?"
        message="This removes all of your play history. This can't be undone."
      >
        <View style={styles.dialogActions}>
          <TouchableOpacity
            style={[styles.dialogBtn, styles.dialogCancel]}
            activeOpacity={0.85}
            onPress={() => setConfirmOpen(false)}
          >
            <Text style={styles.dialogCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dialogBtn, styles.dialogConfirm]}
            activeOpacity={0.85}
            onPress={() => {
              clearHistory();
              setConfirmOpen(false);
            }}
          >
            <Text style={styles.dialogConfirmText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </Dialog>
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
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Tokens.spacing[6],
    paddingTop: Tokens.spacing[5],
    paddingBottom: Tokens.spacing[4],
  },
  card: {
    paddingHorizontal: Tokens.spacing[4],
    paddingVertical: Tokens.spacing[2],
    borderRadius: Tokens.layout.borderRadius["2xl"],
    borderWidth: Tokens.effects.borderWidth.default,
    borderColor: Tokens.colors.neutral[200],
  },
  empty: {
    textAlign: "center",
    color: Tokens.colors.neutral[400],
    fontSize: Tokens.typography.fontSize.base,
    marginTop: Tokens.spacing[16],
  },
  footer: {
    paddingHorizontal: Tokens.spacing[6],
    paddingBottom: Tokens.spacing[6],
    paddingTop: Tokens.spacing[2],
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Tokens.spacing[2],
    backgroundColor: Tokens.colors.teal[500],
    borderRadius: Tokens.layout.borderRadius["2xl"],
    paddingVertical: Tokens.spacing[4],
  },
  clearDisabled: { opacity: 0.5 },
  clearText: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
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
