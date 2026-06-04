/**
 * A single question row on the Questions page: "Question No. N" + truncated text
 * + a 3-dot button. The 3-dot opens a small popover anchored to the button.
 *
 * Built-in decks expose only "View"; custom decks expose Edit / View / Delete.
 */
import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Tokens } from "@/constants/tokens";

type Props = {
  index: number;
  text: string;
  isBuiltIn: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function QuestionListItem({
  index,
  text,
  isBuiltIn,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchor, setAnchor] = useState({ top: 0, right: 0 });
  const dotRef = useRef<View>(null);

  const openMenu = () => {
    dotRef.current?.measureInWindow((x, y, width, height) => {
      const screenW = Dimensions.get("window").width;
      setAnchor({ top: y + height + 4, right: screenW - (x + width) });
      setMenuOpen(true);
    });
  };

  const choose = (fn: () => void) => {
    setMenuOpen(false);
    // Defer so the popover unmounts before the sheet/dialog opens.
    setTimeout(fn, 0);
  };

  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.label}>Question No. {index}</Text>
        <Text style={styles.body} numberOfLines={1}>
          {text}
        </Text>
      </View>

      <TouchableOpacity
        ref={dotRef}
        onPress={openMenu}
        hitSlop={10}
        style={styles.dotBtn}
        accessibilityLabel={`Options for question ${index}`}
      >
        <HugeiconsIcon
          icon={MoreVerticalIcon}
          size={20}
          color={Tokens.colors.neutral[400]}
        />
      </TouchableOpacity>

      <Modal
        transparent
        visible={menuOpen}
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuOpen(false)}>
          <View
            style={[styles.menu, { top: anchor.top, right: anchor.right }]}
          >
            {!isBuiltIn && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => choose(onEdit)}
              >
                <Text style={styles.menuText}>Edit</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => choose(onView)}
            >
              <Text style={styles.menuText}>View Question</Text>
            </TouchableOpacity>
            {!isBuiltIn && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => choose(onDelete)}
              >
                <Text style={[styles.menuText, styles.danger]}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Tokens.spacing[3],
    borderBottomWidth: Tokens.effects.borderWidth.default,
    borderBottomColor: Tokens.colors.neutral[200],
    gap: Tokens.spacing[2],
  },
  text: { flex: 1, gap: 2 },
  label: {
    fontSize: Tokens.typography.fontSize.sm,
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.neutral[900],
  },
  body: {
    fontSize: Tokens.typography.fontSize.base,
    color: Tokens.colors.neutral[400],
  },
  dotBtn: { padding: Tokens.spacing[1] },
  menuBackdrop: { flex: 1 },
  menu: {
    position: "absolute",
    minWidth: 150,
    backgroundColor: Tokens.colors.white,
    borderRadius: Tokens.layout.borderRadius.xl,
    paddingVertical: Tokens.spacing[1],
    shadowColor: Tokens.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    paddingVertical: Tokens.spacing[2],
    paddingHorizontal: Tokens.spacing[4],
  },
  menuText: {
    fontSize: Tokens.typography.fontSize.base,
    color: Tokens.colors.neutral[900],
  },
  danger: { color: Tokens.colors.red[500] },
});
