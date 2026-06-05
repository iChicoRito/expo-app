/**
 * Edit-Profile drawer (`edit-profile.png`) rendered inside the reusable `Sheet`.
 * Edits the display name, selects one of 18 avatars in a 6-column grid, and
 * picks a background color from the shared deck swatches. Mirrors the
 * form-in-Sheet pattern of `create-deck-sheet.tsx`.
 */
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Avatar } from "@/components/avatar";
import type { ColorScaleKey } from "@/components/deck-card";
import { Sheet } from "@/components/sheet";
import { AVATAR_IDS, type AvatarId } from "@/constants/avatars";
import { colorKeyToHex, DECK_COLOR_SWATCHES } from "@/constants/deck-colors";
import { Tokens } from "@/constants/tokens";

type Props = {
  visible: boolean;
  onClose: () => void;
  name: string;
  avatarId: AvatarId;
  colorKey: ColorScaleKey;
  onSave: (input: {
    name: string;
    avatarId: AvatarId;
    colorKey: ColorScaleKey;
  }) => void;
};

const COLUMNS = 6;
const H_PADDING = Tokens.spacing[6];
const GRID_GAP = Tokens.spacing[2];
const CELL_SIZE =
  (Dimensions.get("window").width - H_PADDING * 2 - GRID_GAP * (COLUMNS - 1)) /
  COLUMNS;

export function EditProfileSheet({
  visible,
  onClose,
  name,
  avatarId,
  colorKey,
  onSave,
}: Props) {
  const [draftName, setDraftName] = useState(name);
  const [draftAvatar, setDraftAvatar] = useState<AvatarId>(avatarId);
  const [draftColor, setDraftColor] = useState<ColorScaleKey>(colorKey);

  // Re-sync drafts whenever the sheet (re)opens with the latest saved values.
  useEffect(() => {
    if (visible) {
      setDraftName(name);
      setDraftAvatar(avatarId);
      setDraftColor(colorKey);
    }
  }, [visible, name, avatarId, colorKey]);

  const canSubmit = draftName.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSave({
      name: draftName.trim(),
      avatarId: draftAvatar,
      colorKey: draftColor,
    });
  };

  const avatarBg = Tokens.colors[draftColor][500];

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text style={styles.heading}>Profile</Text>

      {/* ── Avatar preview ── */}
      <View style={styles.previewContainer}>
        <View
          style={[
            styles.previewCircle,
            {
              backgroundColor: avatarBg,
              borderColor: Tokens.colors[draftColor][600],
            },
          ]}
        >
          <Avatar id={draftAvatar} size={100} />
        </View>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={draftName}
        onChangeText={setDraftName}
        placeholder="Your name"
        placeholderTextColor={Tokens.colors.neutral[400]}
        maxLength={24}
        autoCapitalize="words"
        autoCorrect={false}
      />

      <Text style={styles.label}>Avatar</Text>
      <ScrollView
        style={styles.gridScroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {AVATAR_IDS.map((id) => {
          const selected = id === draftAvatar;
          const colorScale = Tokens.colors[draftColor];
          return (
            <TouchableOpacity
              key={id}
              style={[
                styles.cell,
                selected && {
                  borderColor: colorScale[500],
                  backgroundColor: colorScale[50],
                },
              ]}
              activeOpacity={0.8}
              onPress={() => setDraftAvatar(id)}
            >
              <Avatar id={id} size={CELL_SIZE - 12} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.label}>Background Color</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.swatchScroll}
        contentContainerStyle={styles.swatchRow}
      >
        {DECK_COLOR_SWATCHES.map((key) => {
          const selected = key === draftColor;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.swatch, { backgroundColor: colorKeyToHex(key) }]}
              activeOpacity={0.8}
              onPress={() => setDraftColor(key)}
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
        activeOpacity={0.85}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        <Text style={styles.submitText}>Update Profile</Text>
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
  previewContainer: {
    alignItems: "center",
    marginBottom: Tokens.spacing[6],
  },
  previewCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
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
  gridScroll: {
    maxHeight: CELL_SIZE * 3 + GRID_GAP * 2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: Tokens.layout.borderRadius.lg,
    backgroundColor: Tokens.colors.neutral[100],
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  swatchScroll: {
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
