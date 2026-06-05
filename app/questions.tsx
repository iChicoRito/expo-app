import {
  Alert02Icon,
  ArrowLeft01Icon,
  PlusSignIcon,
  SparklesIcon,
  WifiDisconnected01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  type ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Dialog } from "@/components/dialog";
import { QuestionListItem } from "@/components/question-list-item";
import { QuestionSheet, type QuestionSheetMode } from "@/components/question-sheet";
import { Tokens } from "@/constants/tokens";
import { useDeckStore, type Question } from "@/contexts/deck-store";

type AiStage = "idle" | "generating" | "result" | "offline" | "error";

export default function QuestionsScreen() {
  const router = useRouter();
  const { deckId } = useLocalSearchParams<{ deckId?: string }>();
  const {
    getDeckById,
    getQuestionObjects,
    addQuestion,
    editQuestion,
    deleteQuestion,
    rateLimit,
    generate,
  } = useDeckStore();

  const deck = getDeckById(deckId);
  const accent = deck?.bgColor ?? Tokens.colors.teal[500];
  const deckTitle = deck?.title ?? "Spillr";
  const isBuiltIn = deck?.isBuiltIn ?? true;
  const questions = getQuestionObjects(deckId);

  const [sheetMode, setSheetMode] = useState<QuestionSheetMode | null>(null);
  const [draft, setDraft] = useState("");
  const [active, setActive] = useState<{ q: Question; index: number } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);
  const [aiStage, setAiStage] = useState<AiStage>("idle");
  const [aiText, setAiText] = useState("");

  const closeSheet = useCallback(() => {
    setSheetMode(null);
    setActive(null);
    setDraft("");
  }, []);

  const openAdd = useCallback(() => {
    setActive(null);
    setDraft("");
    setSheetMode("add");
  }, []);

  const openEdit = useCallback((q: Question, index: number) => {
    setActive({ q, index });
    setDraft(q.text);
    setSheetMode("edit");
  }, []);

  const openView = useCallback((q: Question, index: number) => {
    setActive({ q, index });
    setSheetMode("view");
  }, []);

  const submitSheet = useCallback(async () => {
    if (!deckId) return;
    if (sheetMode === "add") {
      await addQuestion(deckId, draft);
    } else if (sheetMode === "edit" && active) {
      await editQuestion(deckId, active.q.id, draft);
    }
    closeSheet();
  }, [active, addQuestion, closeSheet, deckId, draft, editQuestion, sheetMode]);

  const confirmDelete = useCallback(async () => {
    if (deckId && deleteTarget) {
      await deleteQuestion(deckId, deleteTarget.id);
    }
    setDeleteTarget(null);
  }, [deckId, deleteQuestion, deleteTarget]);

  const runGenerate = useCallback(async () => {
    if (rateLimit.blocked) {
      setAiStage("idle");
      return;
    }

    setAiStage("generating");
    const res = await generate(deckTitle);
    if (res.ok) {
      setAiText(res.text);
      setAiStage("result");
    } else if (res.reason === "offline") {
      setAiStage("offline");
    } else if (res.reason === "rate-limited") {
      setAiStage("idle");
    } else {
      setAiStage("error");
    }
  }, [deckTitle, generate, rateLimit.blocked]);

  const acceptAi = useCallback(() => {
    setDraft(aiText);
    setAiStage("idle");
  }, [aiText]);

  const renderQuestion = useCallback<ListRenderItem<Question>>(
    ({ item, index }) => (
      <QuestionListItem
        index={index + 1}
        text={item.text}
        isBuiltIn={isBuiltIn}
        onView={() => openView(item, index + 1)}
        onEdit={() => openEdit(item, index + 1)}
        onDelete={() => setDeleteTarget(item)}
      />
    ),
    [isBuiltIn, openEdit, openView],
  );

  const keyExtractor = useCallback((q: Question) => q.id, []);

  const aiCaption = rateLimit.blocked
    ? "You've hit the 15-request hourly limit. Please wait until your quota resets."
    : "You can generate up to 15 times per hour";

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={24}
            color={Tokens.colors.neutral[900]}
          />
        </TouchableOpacity>
        <Text style={styles.title}>
          {"Lists of tea's for "}
          <Text style={{ color: accent }}>{deckTitle}</Text>
        </Text>
      </View>

      <FlatList
        data={questions}
        keyExtractor={keyExtractor}
        renderItem={renderQuestion}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          questions.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={
          <Text style={styles.empty}>
            {isBuiltIn
              ? "This deck has no questions."
              : "No questions yet. Tap Add Question to create one."}
          </Text>
        }
      />

      {!isBuiltIn && (
        <View style={styles.fabWrap}>
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: Tokens.colors.teal[500] }]}
            activeOpacity={0.85}
            onPress={openAdd}
          >
            <HugeiconsIcon
              icon={PlusSignIcon}
              size={18}
              color={Tokens.colors.white}
            />
            <Text style={styles.fabText}>Add Question</Text>
          </TouchableOpacity>
        </View>
      )}

      <QuestionSheet
        visible={sheetMode != null}
        mode={sheetMode ?? "view"}
        onClose={closeSheet}
        index={active?.index}
        value={draft}
        onChangeText={setDraft}
        viewText={active?.q.text}
        onSubmit={submitSheet}
        onGenerateAI={runGenerate}
        aiCaption={aiCaption}
        aiDisabled={rateLimit.blocked}
      />

      <Dialog
        visible={deleteTarget != null}
        onClose={() => setDeleteTarget(null)}
        icon={Alert02Icon}
        iconColor={Tokens.colors.red[500]}
        iconBg={Tokens.colors.red[100]}
        title="Delete This Tea?"
        message="This question will leave the deck for good."
      >
        <View style={styles.dialogRow}>
          <TouchableOpacity
            style={[styles.dialogBtn, styles.cancelBtn]}
            onPress={() => setDeleteTarget(null)}
            activeOpacity={0.85}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dialogBtn, styles.deleteBtn]}
            onPress={confirmDelete}
            activeOpacity={0.85}
          >
            <Text style={styles.deleteText}>Yes, Delete</Text>
          </TouchableOpacity>
        </View>
      </Dialog>

      <Dialog
        visible={aiStage === "generating"}
        dismissOnBackdrop={false}
        icon={SparklesIcon}
        title="Question Generating..."
        message={
          <Text style={styles.aiMessage}>
            {"Please be patient while the AI generating the question for "}
            <Text style={{ color: accent, fontWeight: "700" }}>{deckTitle}</Text>
          </Text>
        }
      />

      <Dialog
        visible={aiStage === "result"}
        onClose={() => setAiStage("idle")}
        showClose
        icon={SparklesIcon}
        title="Question Ready!"
        message="New question generated. Let's keep the chat moving."
      >
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Question Generated:</Text>
          <Text style={styles.resultText}>{aiText}</Text>
        </View>
        <TouchableOpacity
          style={styles.takeBtn}
          onPress={acceptAi}
          activeOpacity={0.85}
        >
          <Text style={styles.takeText}>I&apos;ll take it</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.regenBtn, rateLimit.blocked && styles.regenDisabled]}
          onPress={runGenerate}
          activeOpacity={0.85}
          disabled={rateLimit.blocked}
        >
          <Text style={styles.regenText}>Re-Generate</Text>
        </TouchableOpacity>
        {rateLimit.blocked && (
          <Text style={styles.limitNote}>
            You&apos;ve hit the 15-request hourly limit. Please wait until your
            quota resets.
          </Text>
        )}
      </Dialog>

      <Dialog
        visible={aiStage === "offline"}
        onClose={() => setAiStage("idle")}
        icon={WifiDisconnected01Icon}
        iconColor={Tokens.colors.neutral[500]}
        iconBg={Tokens.colors.neutral[100]}
        title="No Internet Connection"
        message="You need an internet connection to generate a question."
      >
        <TouchableOpacity
          style={styles.takeBtn}
          onPress={() => setAiStage("idle")}
          activeOpacity={0.85}
        >
          <Text style={styles.takeText}>Ohh, I see</Text>
        </TouchableOpacity>
      </Dialog>

      <Dialog
        visible={aiStage === "error"}
        onClose={() => setAiStage("idle")}
        icon={Alert02Icon}
        iconColor={Tokens.colors.red[500]}
        iconBg={Tokens.colors.red[100]}
        title="Something went wrong"
        message="We couldn't generate a question right now. Please try again."
      >
        <TouchableOpacity
          style={styles.takeBtn}
          onPress={() => setAiStage("idle")}
          activeOpacity={0.85}
        >
          <Text style={styles.takeText}>Okay</Text>
        </TouchableOpacity>
      </Dialog>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Tokens.colors.white },
  header: {
    paddingHorizontal: Tokens.spacing[6],
    paddingTop: Tokens.spacing[2],
    gap: Tokens.spacing[3],
  },
  backBtn: { width: 32, height: 32, justifyContent: "center" },
  title: {
    fontSize: Tokens.typography.fontSize["2xl"],
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.neutral[900],
  },
  list: { flex: 1, marginTop: Tokens.spacing[4] },
  listContent: {
    paddingHorizontal: Tokens.spacing[6],
    paddingBottom: Tokens.spacing[24],
  },
  emptyListContent: { flexGrow: 1 },
  empty: {
    textAlign: "center",
    color: Tokens.colors.neutral[400],
    fontSize: Tokens.typography.fontSize.sm,
    marginTop: Tokens.spacing[10],
  },
  fabWrap: { position: "absolute", right: Tokens.spacing[6], bottom: Tokens.spacing[8] },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing[2],
    paddingVertical: Tokens.spacing[3],
    paddingHorizontal: Tokens.spacing[5],
    borderRadius: Tokens.layout.borderRadius["2xl"],
  },
  fabText: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  dialogRow: {
    flexDirection: "row",
    gap: Tokens.spacing[3],
    marginTop: Tokens.spacing[5],
    width: "100%",
  },
  dialogBtn: {
    flex: 1,
    paddingVertical: Tokens.spacing[4],
    borderRadius: Tokens.layout.borderRadius["2xl"],
    alignItems: "center",
  },
  cancelBtn: { backgroundColor: Tokens.colors.neutral[100] },
  cancelText: {
    color: Tokens.colors.neutral[900],
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  deleteBtn: { backgroundColor: Tokens.colors.red[500] },
  deleteText: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  aiMessage: {
    fontSize: Tokens.typography.fontSize.base,
    color: Tokens.colors.neutral[400],
    textAlign: "center",
    lineHeight: Tokens.typography.lineHeight[3],
  },
  resultCard: {
    width: "100%",
    borderWidth: Tokens.effects.borderWidth.default,
    borderColor: Tokens.colors.neutral[200],
    borderRadius: Tokens.layout.borderRadius.xl,
    padding: Tokens.spacing[4],
    marginTop: Tokens.spacing[4],
    alignItems: "center",
    gap: Tokens.spacing[2],
  },
  resultLabel: {
    fontSize: Tokens.typography.fontSize.sm,
    color: Tokens.colors.neutral[400],
  },
  resultText: {
    fontSize: Tokens.typography.fontSize.lg,
    fontWeight: Tokens.typography.fontWeight.bold,
    color: Tokens.colors.neutral[900],
    textAlign: "center",
  },
  takeBtn: {
    width: "100%",
    marginTop: Tokens.spacing[4],
    backgroundColor: Tokens.colors.teal[500],
    borderRadius: Tokens.layout.borderRadius["2xl"],
    paddingVertical: Tokens.spacing[4],
    alignItems: "center",
  },
  takeText: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  regenBtn: {
    width: "100%",
    marginTop: Tokens.spacing[3],
    borderWidth: Tokens.effects.borderWidth.default,
    borderColor: Tokens.colors.teal[500],
    borderRadius: Tokens.layout.borderRadius["2xl"],
    paddingVertical: Tokens.spacing[4],
    alignItems: "center",
  },
  regenDisabled: { opacity: 0.4 },
  regenText: {
    color: Tokens.colors.teal[500],
    fontSize: Tokens.typography.fontSize.base,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  limitNote: {
    fontSize: Tokens.typography.fontSize.xs,
    color: Tokens.colors.neutral[400],
    textAlign: "center",
    marginTop: Tokens.spacing[3],
  },
});
