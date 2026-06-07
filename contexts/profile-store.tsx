/**
 * Central store for the user's profile + settings, mirroring DeckStoreProvider:
 * hydrate-on-mount, a `ready` flag, a memoized value, and a single
 * `persistProfile` helper that writes the JSON blob to AsyncStorage.
 *
 * The display name is intentionally NOT part of the persisted blob — it stays in
 * expo-secure-store under USER_NAME_KEY (written by onboarding, read by
 * play/results), so this store reads/writes it there to avoid a second source
 * of truth. Everything else (avatar, background color, prototype toggles, audio
 * slider values, real gameplay stats + session history) lives in the blob.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { ColorScaleKey } from "@/components/deck-card";
import { DEFAULT_AVATAR_ID, type AvatarId } from "@/constants/avatars";
import { PROFILE_KEY, USER_NAME_KEY } from "@/constants/storage";
import type { SessionNode } from "@/lib/scenario";
import { type StreakState, DEFAULT_STREAK, computeNewStreak } from "@/lib/streak";

export type ProfileStats = {
  played: number;
  answered: number;
  passed: number;
};

export type AudioLevels = {
  master: number;
  music: number;
  sfx: number;
};

export type PlaySession = {
  id: string;
  deckId: string;
  deckTitle: string;
  colorKey: ColorScaleKey;
  subtitle: string;
  node: SessionNode;
  at: number;
};

/** Everything persisted to AsyncStorage (the name lives in secure-store). */
type ProfileBlob = {
  avatarId: AvatarId;
  colorKey: ColorScaleKey;
  notifications: boolean;
  darkMode: boolean;
  audio: AudioLevels;
  stats: ProfileStats;
  history: PlaySession[];
  streak: StreakState;
};

const DEFAULT_BLOB: ProfileBlob = {
  avatarId: DEFAULT_AVATAR_ID,
  colorKey: "teal",
  notifications: true,
  darkMode: false,
  audio: { master: 90, music: 50, sfx: 25 },
  stats: { played: 0, answered: 0, passed: 0 },
  history: [],
  streak: DEFAULT_STREAK,
};

export type NewSession = Omit<PlaySession, "id" | "at"> & {
  answered: number;
  passed: number;
};

type ProfileStoreValue = {
  ready: boolean;
  name: string;
  avatarId: AvatarId;
  colorKey: ColorScaleKey;
  notifications: boolean;
  darkMode: boolean;
  audio: AudioLevels;
  stats: ProfileStats;
  history: PlaySession[];
  streak: StreakState;
  updateProfile: (patch: {
    name?: string;
    avatarId?: AvatarId;
    colorKey?: ColorScaleKey;
  }) => Promise<void>;
  setNotifications: (value: boolean) => Promise<void>;
  setDarkMode: (value: boolean) => Promise<void>;
  setAudio: (value: AudioLevels) => Promise<void>;
  recordSession: (session: NewSession) => Promise<void>;
  clearHistory: () => Promise<void>;
};

const ProfileStoreContext = createContext<ProfileStoreValue | null>(null);

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function ProfileStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [name, setNameState] = useState("");
  const [blob, setBlob] = useState<ProfileBlob>(DEFAULT_BLOB);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [storedName, blobRaw] = await Promise.all([
          SecureStore.getItemAsync(USER_NAME_KEY),
          AsyncStorage.getItem(PROFILE_KEY),
        ]);
        if (cancelled) return;
        if (storedName) setNameState(storedName);
        if (blobRaw) {
          // Merge over defaults so older/partial blobs gain new fields.
          setBlob({ ...DEFAULT_BLOB, ...JSON.parse(blobRaw) });
        }
      } catch {
        // Corrupt/missing storage → start from defaults.
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistProfile = useCallback(async (next: ProfileBlob) => {
    setBlob(next);
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  }, []);

  const updateProfile = useCallback<ProfileStoreValue["updateProfile"]>(
    async ({ name: nextName, avatarId, colorKey }) => {
      if (nextName != null) {
        const trimmed = nextName.trim();
        setNameState(trimmed);
        await SecureStore.setItemAsync(USER_NAME_KEY, trimmed).catch(() => {});
      }
      if (avatarId != null || colorKey != null) {
        await persistProfile({
          ...blob,
          ...(avatarId != null ? { avatarId } : {}),
          ...(colorKey != null ? { colorKey } : {}),
        });
      }
    },
    [blob, persistProfile],
  );

  const setNotifications = useCallback<ProfileStoreValue["setNotifications"]>(
    (value) => persistProfile({ ...blob, notifications: value }),
    [blob, persistProfile],
  );

  const setDarkMode = useCallback<ProfileStoreValue["setDarkMode"]>(
    (value) => persistProfile({ ...blob, darkMode: value }),
    [blob, persistProfile],
  );

  const setAudio = useCallback<ProfileStoreValue["setAudio"]>(
    (value) => persistProfile({ ...blob, audio: value }),
    [blob, persistProfile],
  );

  const recordSession = useCallback<ProfileStoreValue["recordSession"]>(
    async ({ answered, passed, ...rest }) => {
      const now = Date.now();
      const { newStreak } = computeNewStreak(blob.streak, now);
      const session: PlaySession = {
        ...rest,
        id: genId(),
        at: now,
      };
      await persistProfile({
        ...blob,
        history: [session, ...blob.history],
        stats: {
          played: blob.stats.played + answered + passed,
          answered: blob.stats.answered + answered,
          passed: blob.stats.passed + passed,
        },
        streak: newStreak,
      });
    },
    [blob, persistProfile],
  );

  const clearHistory = useCallback<ProfileStoreValue["clearHistory"]>(
    () => persistProfile({ ...blob, history: [] }),
    [blob, persistProfile],
  );

  const value = useMemo<ProfileStoreValue>(
    () => ({
      ready,
      name,
      avatarId: blob.avatarId,
      colorKey: blob.colorKey,
      notifications: blob.notifications,
      darkMode: blob.darkMode,
      audio: blob.audio,
      stats: blob.stats,
      history: blob.history,
      streak: blob.streak,
      updateProfile,
      setNotifications,
      setDarkMode,
      setAudio,
      recordSession,
      clearHistory,
    }),
    [
      ready,
      name,
      blob,
      updateProfile,
      setNotifications,
      setDarkMode,
      setAudio,
      recordSession,
      clearHistory,
    ],
  );

  return (
    <ProfileStoreContext.Provider value={value}>
      {children}
    </ProfileStoreContext.Provider>
  );
}

export function useProfileStore(): ProfileStoreValue {
  const ctx = useContext(ProfileStoreContext);
  if (!ctx) {
    throw new Error("useProfileStore must be used within a ProfileStoreProvider");
  }
  return ctx;
}
