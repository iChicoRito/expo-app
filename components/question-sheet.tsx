/**
 * Add / Edit / View question form rendered inside the reusable `Sheet`.
 * - add  ("Create Question"): textarea + Create + "Generate with AI".
 * - edit ("Edit Question"):  prefilled textarea + Save.
 * - view ("View Question"):  read-only card + Close.
 *
 * The draft text is controlled by the parent so the AI flow can populate it.
 */
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Sheet } from "@/components/sheet";
import { MAX_MANUAL_WORDS } from "@/contexts/deck-store";
import { Tokens } from "@/constants/tokens";

export type QuestionSheetMode = "add" | "edit" | "view";

type Props = {
  visible: boolean;
  mode: QuestionSheetMode;
  onClose: () => void;
  /** 1-based question number, for edit/view headers. */
  index?: number;
  value: string;
  onChangeText: (text: string) => void;
  viewText?: string;
  onSubmit: () => void;
  onGenerateAI?: () => void;
  aiCaption?: string;
  aiDisabled?: boolean;
};

function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

export function QuestionSheet({
  visible,
  mode,
  onClose,
  index,
  value,
  onChangeText,
  viewText,
  onSubmit,
  onGenerateAI,
  aiCaption,
  aiDisabled,
}: Props) {
  if (mode === "view") {
    return (
      <Sheet visible={visible} onClose={onClose}>
        <Text style={styles.heading}>View Question</Text>
        <View style={styles.viewCard}>
          {index != null && (
            <Text style={styles.viewLabel}>Question No. {index}</Text>
          )}
          <Text style={styles.viewText}>{viewText}</Text>
        </View>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={onClose}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryText}>Close</Text>
        </TouchableOpacity>
      </Sheet>
    );
  }

  const count = wordCount(value);
  const overLimit = count > MAX_MANUAL_WORDS;
  const canSubmit = count > 0 && !overLimit;
  const isEdit = mode === "edit";

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text style={styles.heading}>
        {isEdit ? "Edit Question" : "Create Question"}
      </Text>

      <Text style={styles.label}>
        {isEdit && index != null ? `Question no. ${index}` : "Question"}
      </Text>
      <TextInput
        style={styles.textarea}
        placeholder="Drop the questions here...."
        placeholderTextColor={Tokens.colors.neutral[400]}
        value={value}
        onChangeText={onChangeText}
        multiline
        textAlignVertical="top"
      />

      {overLimit ? (
        <Text style={styles.errorText}>
          Question must be {MAX_MANUAL_WORDS} words or fewer ({count}).
        </Text>
      ) : (
        <Text style={styles.helperText}>
          {count}/{MAX_MANUAL_WORDS} words
        </Text>
      )}

      <TouchableOpacity
        style={[styles.primaryBtn, !canSubmit && styles.disabled]}
        onPress={onSubmit}
        activeOpacity={0.85}
        disabled={!canSubmit}
      >
        <Text style={styles.primaryText}>{isEdit ? "Save" : "Create"}</Text>
      </TouchableOpacity>

      {mode === "add" && onGenerateAI && (
        <>
          <TouchableOpacity
            style={[styles.aiBtn, aiDisabled && styles.disabled]}
            onPress={onGenerateAI}
            activeOpacity={0.85}
            disabled={aiDisabled}
          >
            <HugeiconsIcon
              icon={SparklesIcon}
              size={18}
              color={Tokens.colors.teal[500]}
            />
            <Text style={styles.aiText}>Generate with AI</Text>
          </TouchableOpacity>
          {aiCaption ? <Text style={styles.aiCaption}>{aiCaption}</Text> : null}
        </>
      )}
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
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.medium,
    color: Tokens.colors.neutral[900],
    marginBottom: Tokens.spacing[2],
  },
  textarea: {
    borderWidth: Tokens.effects.borderWidth.default,
    borderColor: Tokens.colors.neutral[200],
    borderRadius: Tokens.layout.borderRadius.xl,
    paddingHorizontal: Tokens.spacing[4],
    paddingVertical: Tokens.spacing[3],
    fontSize: Tokens.typography.fontSize.base,
    color: Tokens.colors.neutral[900],
    minHeight: 120,
  },
  helperText: {
    fontSize: Tokens.typography.fontSize.xs,
    color: Tokens.colors.neutral[400],
    marginTop: Tokens.spacing[2],
    textAlign: "right",
  },
  errorText: {
    fontSize: Tokens.typography.fontSize.xs,
    color: Tokens.colors.red[500],
    marginTop: Tokens.spacing[2],
    textAlign: "right",
  },
  primaryBtn: {
    marginTop: Tokens.spacing[4],
    backgroundColor: Tokens.colors.teal[500],
    borderRadius: Tokens.layout.borderRadius["2xl"],
    paddingVertical: Tokens.spacing[4],
    alignItems: "center",
  },
  primaryText: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  aiBtn: {
    marginTop: Tokens.spacing[3],
    backgroundColor: Tokens.colors.teal[50],
    borderRadius: Tokens.layout.borderRadius["2xl"],
    paddingVertical: Tokens.spacing[4],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Tokens.spacing[2],
  },
  aiText: {
    color: Tokens.colors.teal[500],
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  aiCaption: {
    fontSize: Tokens.typography.fontSize.xs,
    color: Tokens.colors.neutral[400],
    textAlign: "center",
    marginTop: Tokens.spacing[3],
  },
  secondaryBtn: {
    marginTop: Tokens.spacing[5],
    backgroundColor: Tokens.colors.neutral[100],
    borderRadius: Tokens.layout.borderRadius["2xl"],
    paddingVertical: Tokens.spacing[4],
    alignItems: "center",
  },
  secondaryText: {
    color: Tokens.colors.neutral[900],
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  disabled: { opacity: 0.5 },
  viewCard: {
    borderWidth: Tokens.effects.borderWidth.default,
    borderColor: Tokens.colors.neutral[200],
    borderRadius: Tokens.layout.borderRadius.xl,
    padding: Tokens.spacing[4],
    gap: Tokens.spacing[2],
  },
  viewLabel: {
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.neutral[900],
  },
  viewText: {
    fontSize: Tokens.typography.fontSize.base,
    color: Tokens.colors.neutral[400],
    lineHeight: Tokens.typography.lineHeight[3],
  },
});
