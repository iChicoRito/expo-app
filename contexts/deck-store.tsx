/**
 * Central store for decks + questions, merging the static built-in content with
 * AsyncStorage-backed custom content so every screen (Deck page, Questions page,
 * play carousel, preparation, in-game) reads one unified view.
 *
 * Built-in decks and their questions are read-only; all mutating helpers no-op
 * (or throw) for built-in deck ids. Custom decks support full CRUD + AI.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { ColorScaleKey, DeckData } from "@/components/deck-card";
import { DECKS } from "@/constants/decks";
import { getDeckIcon } from "@/constants/deck-icons";
import { getQuestionsForDeck } from "@/constants/questions";
import {
  AI_RATE_LIMIT_KEY,
  USER_DECKS_KEY,
  USER_QUESTIONS_KEY,
} from "@/constants/storage";
import { Tokens } from "@/constants/tokens";
import { generateQuestion as groqGenerate, GroqError } from "@/lib/groq";
import { isOnline } from "@/lib/network";
import {
  consume,
  getInfo,
  type AiRateState,
  type RateLimitInfo,
} from "@/lib/rate-limit";

export type UserDeck = {
  id: string;
  name: string;
  iconKey: string;
  colorKey: ColorScaleKey;
  createdAt: number;
};

export type Question = { id: string; text: string };
type UserQuestions = Record<string, Question[]>;

export type StoreDeck = DeckData & { isBuiltIn: boolean };

export const MAX_MANUAL_WORDS = 16;

export type GenerateResult =
  | { ok: true; text: string }
  | { ok: false; reason: "offline" | "rate-limited" | "error" };

type DeckStoreValue = {
  ready: boolean;
  decks: StoreDeck[];
  getDeckById: (id: string | undefined) => StoreDeck | undefined;
  getQuestionObjects: (deckId: string | undefined) => Question[];
  getQuestions: (deckId: string | undefined) => string[];
  getCardCount: (deckId: string | undefined) => number;
  createDeck: (input: { name: string; iconKey: string; colorKey: ColorScaleKey }) => Promise<StoreDeck>;
  deleteDeck: (deckId: string) => Promise<void>;
  addQuestion: (deckId: string, text: string) => Promise<void>;
  editQuestion: (deckId: string, questionId: string, text: string) => Promise<void>;
  deleteQuestion: (deckId: string, questionId: string) => Promise<void>;
  rateLimit: RateLimitInfo;
  generate: (deckName: string) => Promise<GenerateResult>;
};

const DeckStoreContext = createContext<DeckStoreValue | null>(null);

const BUILTIN_IDS = new Set(DECKS.map((d) => d.id));
const BUILTIN_QUESTION_TEXTS: Record<string, string[]> = Object.fromEntries(
  DECKS.map((deck) => [deck.id, getQuestionsForDeck(deck.id)]),
);
const BUILTIN_QUESTION_OBJECTS: UserQuestions = Object.fromEntries(
  Object.entries(BUILTIN_QUESTION_TEXTS).map(([deckId, questions]) => [
    deckId,
    questions.map((text, i) => ({
      id: `${deckId}-${i}`,
      text,
    })),
  ]),
);
const BUILTIN_CARD_COUNTS: Record<string, number> = Object.fromEntries(
  Object.entries(BUILTIN_QUESTION_TEXTS).map(([deckId, questions]) => [
    deckId,
    questions.length,
  ]),
);

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Convert a stored custom deck into the shared `DeckData` render shape. */
function userDeckToData(deck: UserDeck): StoreDeck {
  const scale = Tokens.colors[deck.colorKey];
  return {
    id: deck.id,
    title: deck.name,
    bgColor: scale[500],
    bgLight: scale[50],
    icon: getDeckIcon(deck.iconKey),
    iconKey: deck.iconKey,
    colorKey: deck.colorKey,
    isBuiltIn: false,
  };
}

export function DeckStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [userDecks, setUserDecks] = useState<UserDeck[]>([]);
  const [userQuestions, setUserQuestions] = useState<UserQuestions>({});
  const [aiRate, setAiRate] = useState<AiRateState | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [decksRaw, questionsRaw, rateRaw] = await Promise.all([
          AsyncStorage.getItem(USER_DECKS_KEY),
          AsyncStorage.getItem(USER_QUESTIONS_KEY),
          AsyncStorage.getItem(AI_RATE_LIMIT_KEY),
        ]);
        if (cancelled) return;
        if (decksRaw) setUserDecks(JSON.parse(decksRaw));
        if (questionsRaw) setUserQuestions(JSON.parse(questionsRaw));
        if (rateRaw) setAiRate(JSON.parse(rateRaw));
      } catch {
        // Corrupt/missing storage → start empty.
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const decks = useMemo<StoreDeck[]>(() => {
    const builtIn: StoreDeck[] = DECKS.map((d) => ({ ...d, isBuiltIn: true }));
    const custom = userDecks.map(userDeckToData);
    return [...builtIn, ...custom];
  }, [userDecks]);

  const deckById = useMemo(() => {
    return new Map(decks.map((deck) => [deck.id, deck]));
  }, [decks]);

  const customQuestionTexts = useMemo<Record<string, string[]>>(() => {
    return Object.fromEntries(
      Object.entries(userQuestions).map(([deckId, questions]) => [
        deckId,
        questions.map((q) => q.text),
      ]),
    );
  }, [userQuestions]);

  const customCardCounts = useMemo<Record<string, number>>(() => {
    return Object.fromEntries(
      Object.entries(userQuestions).map(([deckId, questions]) => [
        deckId,
        questions.length,
      ]),
    );
  }, [userQuestions]);

  const getDeckById = useCallback(
    (id: string | undefined) => (id ? deckById.get(id) : undefined),
    [deckById],
  );

  const getQuestionObjects = useCallback(
    (deckId: string | undefined): Question[] => {
      if (!deckId) return [];
      if (BUILTIN_IDS.has(deckId)) return BUILTIN_QUESTION_OBJECTS[deckId] ?? [];
      return userQuestions[deckId] ?? [];
    },
    [userQuestions],
  );

  const getQuestions = useCallback(
    (deckId: string | undefined) => {
      if (!deckId) return [];
      if (BUILTIN_IDS.has(deckId)) return BUILTIN_QUESTION_TEXTS[deckId] ?? [];
      return customQuestionTexts[deckId] ?? [];
    },
    [customQuestionTexts],
  );

  const getCardCount = useCallback(
    (deckId: string | undefined) => {
      if (!deckId) return 0;
      if (BUILTIN_IDS.has(deckId)) return BUILTIN_CARD_COUNTS[deckId] ?? 0;
      return customCardCounts[deckId] ?? 0;
    },
    [customCardCounts],
  );

  const persistDecks = useCallback(async (next: UserDeck[]) => {
    setUserDecks(next);
    await AsyncStorage.setItem(USER_DECKS_KEY, JSON.stringify(next));
  }, []);

  const persistQuestions = useCallback(async (next: UserQuestions) => {
    setUserQuestions(next);
    await AsyncStorage.setItem(USER_QUESTIONS_KEY, JSON.stringify(next));
  }, []);

  const createDeck = useCallback<DeckStoreValue["createDeck"]>(
    async ({ name, iconKey, colorKey }) => {
      const deck: UserDeck = {
        id: genId(),
        name: name.trim(),
        iconKey,
        colorKey,
        createdAt: Date.now(),
      };
      await persistDecks([...userDecks, deck]);
      return userDeckToData(deck);
    },
    [userDecks, persistDecks],
  );

  const deleteDeck = useCallback<DeckStoreValue["deleteDeck"]>(
    async (deckId) => {
      if (BUILTIN_IDS.has(deckId)) return; // built-in decks cannot be deleted
      await persistDecks(userDecks.filter((d) => d.id !== deckId));
      if (userQuestions[deckId]) {
        const { [deckId]: _removed, ...rest } = userQuestions;
        await persistQuestions(rest);
      }
    },
    [userDecks, userQuestions, persistDecks, persistQuestions],
  );

  const addQuestion = useCallback<DeckStoreValue["addQuestion"]>(
    async (deckId, text) => {
      if (BUILTIN_IDS.has(deckId)) return; // built-in decks are read-only
      const existing = userQuestions[deckId] ?? [];
      const next = {
        ...userQuestions,
        [deckId]: [...existing, { id: genId(), text: text.trim() }],
      };
      await persistQuestions(next);
    },
    [userQuestions, persistQuestions],
  );

  const editQuestion = useCallback<DeckStoreValue["editQuestion"]>(
    async (deckId, questionId, text) => {
      if (BUILTIN_IDS.has(deckId)) return;
      const existing = userQuestions[deckId] ?? [];
      const next = {
        ...userQuestions,
        [deckId]: existing.map((q) =>
          q.id === questionId ? { ...q, text: text.trim() } : q,
        ),
      };
      await persistQuestions(next);
    },
    [userQuestions, persistQuestions],
  );

  const deleteQuestion = useCallback<DeckStoreValue["deleteQuestion"]>(
    async (deckId, questionId) => {
      if (BUILTIN_IDS.has(deckId)) return;
      const existing = userQuestions[deckId] ?? [];
      const next = {
        ...userQuestions,
        [deckId]: existing.filter((q) => q.id !== questionId),
      };
      await persistQuestions(next);
    },
    [userQuestions, persistQuestions],
  );

  const rateLimit = useMemo<RateLimitInfo>(
    () => getInfo(aiRate),
    [aiRate],
  );

  const generate = useCallback<DeckStoreValue["generate"]>(
    async (deckName) => {
      if (getInfo(aiRate).blocked) return { ok: false, reason: "rate-limited" };
      if (!(await isOnline())) return { ok: false, reason: "offline" };
      try {
        const text = await groqGenerate(deckName);
        const nextRate = consume(aiRate);
        if (nextRate) {
          setAiRate(nextRate);
          await AsyncStorage.setItem(AI_RATE_LIMIT_KEY, JSON.stringify(nextRate));
        }
        return { ok: true, text };
      } catch (err) {
        console.error("[DeckStore.generate]", err);
        return { ok: false, reason: "error" };
      }
    },
    [aiRate],
  );

  const value = useMemo<DeckStoreValue>(
    () => ({
      ready,
      decks,
      getDeckById,
      getQuestionObjects,
      getQuestions,
      getCardCount,
      createDeck,
      deleteDeck,
      addQuestion,
      editQuestion,
      deleteQuestion,
      rateLimit,
      generate,
    }),
    [
      ready,
      decks,
      getDeckById,
      getQuestionObjects,
      getQuestions,
      getCardCount,
      createDeck,
      deleteDeck,
      addQuestion,
      editQuestion,
      deleteQuestion,
      rateLimit,
      generate,
    ],
  );

  return (
    <DeckStoreContext.Provider value={value}>
      {children}
    </DeckStoreContext.Provider>
  );
}

export function useDeckStore(): DeckStoreValue {
  const ctx = useContext(DeckStoreContext);
  if (!ctx) {
    throw new Error("useDeckStore must be used within a DeckStoreProvider");
  }
  return ctx;
}

/** Whether a deck id refers to a protected built-in deck. */
export function isBuiltInDeck(deckId: string | undefined): boolean {
  return !!deckId && BUILTIN_IDS.has(deckId);
}
