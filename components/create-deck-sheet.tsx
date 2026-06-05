/**
 * Create Deck form rendered inside the reusable `Sheet`. Collects a name, an icon
 * (from the HugeIcons registry) and a color swatch, then calls `createDeck`.
 */
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { ColorScaleKey } from "@/components/deck-card";
import { Sheet } from "@/components/sheet";
import { colorKeyToHex, DECK_COLOR_SWATCHES } from "@/constants/deck-colors";
import { DECK_ICON_KEYS, DECK_ICONS } from "@/constants/deck-icons";
import { Tokens } from "@/constants/tokens";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (input: {
    name: string;
    iconKey: string;
    colorKey: ColorScaleKey;
  }) => void;
};

export function CreateDeckSheet({ visible, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [iconKey, setIconKey] = useState(DECK_ICON_KEYS[0]);
  const [colorKey, setColorKey] = useState<ColorScaleKey>(
    DECK_COLOR_SWATCHES[2],
  );

  const reset = () => {
    setName("");
    setIconKey(DECK_ICON_KEYS[0]);
    setColorKey(DECK_COLOR_SWATCHES[2]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const canSubmit = name.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onCreate({ name: name.trim(), iconKey, colorKey });
    reset();
  };

  const accent = colorKeyToHex(colorKey);

  return (
    <Sheet visible={visible} onClose={handleClose}>
      <Text style={styles.heading}>Create Deck</Text>

      <Text style={styles.label}>Deck Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g Weird Humor"
        placeholderTextColor={Tokens.colors.neutral[400]}
        value={name}
        onChangeText={setName}
        maxLength={40}
      />

      <Text style={styles.label}>Icon</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.iconScroll}
        contentContainerStyle={styles.iconRow}
      >
        {DECK_ICON_KEYS.map((key) => {
          const selected = key === iconKey;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.iconCell,
                selected && { backgroundColor: accent, borderColor: accent },
              ]}
              onPress={() => setIconKey(key)}
              activeOpacity={0.7}
            >
              <HugeiconsIcon
                icon={DECK_ICONS[key]}
                size={22}
                color={
                  selected ? Tokens.colors.white : Tokens.colors.neutral[500]
                }
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.label}>Color Selection</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.swatchScroll}
        contentContainerStyle={styles.swatchRow}
      >
        {DECK_COLOR_SWATCHES.map((key) => {
          const selected = key === colorKey;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.swatch, { backgroundColor: colorKeyToHex(key) }]}
              onPress={() => setColorKey(key)}
              activeOpacity={0.8}
            >
              {selected && (
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={18}
                  color={Tokens.colors.white}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={[styles.submit, !canSubmit && styles.submitDisabled]}
        onPress={handleSubmit}
        activeOpacity={0.85}
        disabled={!canSubmit}
      >
        <Text style={styles.submitText}>Create Deck</Text>
      </TouchableOpacity>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: Tokens.typography.fontSize["2xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.neutral[900],
    marginBottom: Tokens.spacing[5],
  },
  label: {
    fontSize: Tokens.typography.fontSize.sm,
    fontWeight: Tokens.typography.fontWeight.semibold,
    color: Tokens.colors.neutral[900],
    marginBottom: Tokens.spacing[2],
    marginTop: Tokens.spacing[4],
  },
  input: {
    borderWidth: Tokens.effects.borderWidth.default,
    borderColor: Tokens.colors.neutral[200],
    borderRadius: Tokens.layout.borderRadius.xl,
    paddingHorizontal: Tokens.spacing[4],
    paddingVertical: Tokens.spacing[3],
    fontSize: Tokens.typography.fontSize.base,
    color: Tokens.colors.neutral[900],
  },
  iconScroll: {
    marginTop: Tokens.spacing[2],
    marginBottom: Tokens.spacing[2],
  },
  iconRow: {
    flexDirection: "row",
    gap: Tokens.spacing[2],
    paddingHorizontal: Tokens.spacing[0],
  },
  iconCell: {
    width: 44,
    height: 44,
    borderRadius: Tokens.layout.borderRadius.lg,
    borderWidth: Tokens.effects.borderWidth.default,
    borderColor: Tokens.colors.neutral[200],
    alignItems: "center",
    justifyContent: "center",
  },
  swatchScroll: {
    marginTop: Tokens.spacing[2],
    marginBottom: Tokens.spacing[2],
  },
  swatchRow: {
    flexDirection: "row",
    gap: Tokens.spacing[3],
    paddingHorizontal: Tokens.spacing[0],
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  submit: {
    marginTop: Tokens.spacing[6],
    backgroundColor: Tokens.colors.teal[500],
    borderRadius: Tokens.layout.borderRadius["2xl"],
    paddingVertical: Tokens.spacing[4],
    alignItems: "center",
  },
  submitDisabled: { opacity: 0.5 },
  submitText: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
});
