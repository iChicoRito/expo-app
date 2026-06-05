/**
 * Music & Sound drawer (`music-sound-option.png`) rendered inside the reusable
 * `Sheet`. Three draggable sliders (Master Volume / Background Music / Sound
 * Effects) edit a local draft that is committed on Save. Prototype only — no
 * audio engine is connected yet.
 */
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Sheet } from "@/components/sheet";
import { ValueSlider } from "@/components/value-slider";
import type { AudioLevels } from "@/contexts/profile-store";
import { Tokens } from "@/constants/tokens";

type Props = {
  visible: boolean;
  onClose: () => void;
  audio: AudioLevels;
  onSave: (audio: AudioLevels) => void;
};

export function MusicSoundSheet({ visible, onClose, audio, onSave }: Props) {
  const [draft, setDraft] = useState<AudioLevels>(audio);

  useEffect(() => {
    if (visible) setDraft(audio);
  }, [visible, audio]);

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text style={styles.heading}>Music and Sounds</Text>

      <View style={styles.sliderBlock}>
        <Text style={styles.label}>Master Volume</Text>
        <ValueSlider
          value={draft.master}
          onChange={(master) => setDraft((d) => ({ ...d, master }))}
        />
      </View>

      <View style={styles.sliderBlock}>
        <Text style={styles.label}>Background Music</Text>
        <ValueSlider
          value={draft.music}
          onChange={(music) => setDraft((d) => ({ ...d, music }))}
        />
      </View>

      <View style={styles.sliderBlock}>
        <Text style={styles.label}>Sound Effects</Text>
        <ValueSlider
          value={draft.sfx}
          onChange={(sfx) => setDraft((d) => ({ ...d, sfx }))}
        />
      </View>

      <TouchableOpacity
        style={styles.submit}
        activeOpacity={0.85}
        onPress={() => onSave(draft)}
      >
        <Text style={styles.submitText}>Save</Text>
      </TouchableOpacity>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: Tokens.typography.fontSize["2xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.neutral[900],
    marginBottom: Tokens.spacing[2],
  },
  sliderBlock: {
    marginTop: Tokens.spacing[5],
  },
  label: {
    fontSize: Tokens.typography.fontSize.lg,
    fontWeight: Tokens.typography.fontWeight.semibold,
    color: Tokens.colors.neutral[900],
  },
  submit: {
    marginTop: Tokens.spacing[8],
    backgroundColor: Tokens.colors.teal[500],
    borderRadius: Tokens.layout.borderRadius["2xl"],
    paddingVertical: Tokens.spacing[4],
    alignItems: "center",
  },
  submitText: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
});
