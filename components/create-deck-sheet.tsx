/**
 * Create Deck form rendered inside the reusable `Sheet`. Collects a name, an icon
 * (from the custom SVG picker) and a color swatch, then calls `createDeck`.
 */
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";

import type { ColorScaleKey } from "@/components/deck-card";
import { Sheet } from "@/components/sheet";
import { colorKeyToHex, DECK_COLOR_SWATCHES } from "@/constants/deck-colors";
import {
  PICKER_ICON_IDS,
  PICKER_ICON_SVGS,
  tintDeckIcon,
} from "@/constants/cards-icons";
import { Tokens } from "@/constants/tokens";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate?: (input: { name: string; iconKey: string; colorKey: ColorScaleKey }) => void;
  onSave?: (input: { name: string; iconKey: string; colorKey: ColorScaleKey }) => void;
  initialValues?: { name: string; iconKey: string; colorKey: ColorScaleKey };
};

export function CreateDeckSheet({ visible, onClose, onCreate, onSave, initialValues }: Props) {
  const isEditMode = !!initialValues;
  const [name, setName] = useState(initialValues?.name ?? "");
  const [iconKey, setIconKey] = useState<string>(initialValues?.iconKey ?? PICKER_ICON_IDS[0]);
  const [colorKey, setColorKey] = useState<ColorScaleKey>(
    initialValues?.colorKey ?? DECK_COLOR_SWATCHES[2],
  );

  const reset = () => {
    setName(initialValues?.name ?? "");
    setIconKey(initialValues?.iconKey ?? PICKER_ICON_IDS[0]);
    setColorKey(initialValues?.colorKey ?? DECK_COLOR_SWATCHES[2]);
  };

  useEffect(() => {
    if (visible && initialValues) {
      setName(initialValues.name);
      setIconKey(initialValues.iconKey);
      setColorKey(initialValues.colorKey);
    }
  }, [visible, initialValues]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const canSubmit = name.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const input = { name: name.trim(), iconKey, colorKey };
    if (isEditMode) {
      onSave?.(input);
    } else {
      onCreate?.(input);
    }
    reset();
  };

  const accent = colorKeyToHex(colorKey);

  return (
    <Sheet visible={visible} onClose={handleClose}>
      <Text style={styles.heading}>{isEditMode ? "Edit Deck" : "Create Deck"}</Text>

      <Text style={styles.label}>Deck Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g Weird Humor"
        placeholderTextColor={Tokens.colors.neutral[400]}
        value={name}
        onChangeText={setName}
        maxLength={20}
      />

      <Text style={styles.label}>Icon</Text>
      <View style={styles.pickerIconRow}>
        {PICKER_ICON_IDS.map((id, index) => {
          const selected = id === iconKey;
          return (
            <TouchableOpacity
              key={id}
              style={[
                styles.pickerIconCell,
                selected && { borderColor: accent, borderWidth: 2 },
              ]}
              onPress={() => setIconKey(id)}
              activeOpacity={0.7}
            >
              <SvgXml
                xml={tintDeckIcon(PICKER_ICON_SVGS[index], colorKey)}
                width={36}
                height={36}
              />
            </TouchableOpacity>
          );
        })}
      </View>

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
        <Text style={styles.submitText}>{isEditMode ? "Save Changes" : "Create Deck"}</Text>
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
  pickerIconRow: {
    flexDirection: "row",
    gap: Tokens.spacing[3],
    marginTop: Tokens.spacing[2],
    marginBottom: Tokens.spacing[2],
  },
  pickerIconCell: {
    width: 56,
    height: 56,
    borderRadius: Tokens.layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: Tokens.colors.neutral[200],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Tokens.colors.neutral[50],
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
