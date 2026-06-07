/**
 * Small popover menu opened by a deck's three-dot button on the Decks and Cards
 * page. Provides Edit and (conditionally) Delete actions; it is anchored near
 * the tapped row via `anchorY` and dismisses on backdrop tap.
 */
import { Delete02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { Tokens } from "@/constants/tokens";

type Props = {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canDelete: boolean;
  /** Vertical offset (page Y) of the tapped three-dot button. */
  anchorY?: number;
};

export function DeckContextMenu({
  visible,
  onClose,
  onEdit,
  onDelete,
  canDelete,
  anchorY = 120,
}: Props) {
  if (!visible) return null;
  return (
    <Modal transparent visible animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={[styles.card, { top: anchorY }]}>
          <Pressable
            style={styles.item}
            onPress={() => {
              onClose();
              onEdit();
            }}
          >
            <HugeiconsIcon
              icon={PencilEdit02Icon}
              size={18}
              color={Tokens.colors.neutral[700]}
            />
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
          {canDelete && (
            <Pressable
              style={styles.item}
              onPress={() => {
                onClose();
                onDelete();
              }}
            >
              <HugeiconsIcon
                icon={Delete02Icon}
                size={18}
                color={Tokens.colors.red[500]}
              />
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  card: {
    position: "absolute",
    right: Tokens.spacing[8],
    minWidth: 160,
    backgroundColor: Tokens.colors.white,
    borderRadius: Tokens.layout.borderRadius.xl,
    paddingVertical: Tokens.spacing[1],
    borderWidth: Tokens.effects.borderWidth.default,
    borderColor: Tokens.colors.neutral[100],
    // Subtle elevation so it reads as a floating popover.
    elevation: 6,
    shadowColor: Tokens.colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing[3],
    paddingVertical: Tokens.spacing[3],
    paddingHorizontal: Tokens.spacing[4],
  },
  editText: {
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
    color: Tokens.colors.neutral[700],
  },
  deleteText: {
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
    color: Tokens.colors.red[500],
  },
});
