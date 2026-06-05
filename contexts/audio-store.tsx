// contexts/audio-store.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Audio, type AVPlaybackSource } from "expo-av";
import type { Sound } from "expo-av/build/Audio";

import { useProfileStore } from "./profile-store";

// ─── Types ───────────────────────────────────────────────────────────────────

export type SfxKey =
  | "flipping-card"
  | "card-answered"
  | "card-pass"
  | "confirmation-dialog"
  | "ending-screen";

type AudioStoreValue = {
  onLobbyFocus: () => Promise<void>;
  onLobbyBlur: () => Promise<void>;
  onGameFocus: () => Promise<void>;
  onGameBlur: () => Promise<void>;
  stopIngameBgm: () => Promise<void>;
  playSfx: (key: SfxKey) => void;
};

// ─── Static asset sources (require() must be static in React Native) ────────

const LOBBY_BGM: [AVPlaybackSource, AVPlaybackSource] = [
  require("@/assets/sounds/lobby-bgm (1).m4a") as AVPlaybackSource,
  require("@/assets/sounds/lobby-bgm (2).m4a") as AVPlaybackSource,
];

const INGAME_BGM: [AVPlaybackSource, AVPlaybackSource] = [
  require("@/assets/sounds/in-game-bgm (1).m4a") as AVPlaybackSource,
  require("@/assets/sounds/in-game-bgm (2).m4a") as AVPlaybackSource,
];

const SFX_SOURCES: Record<SfxKey, AVPlaybackSource> = {
  "flipping-card": require("@/assets/sounds/flipping-card.mp3") as AVPlaybackSource,
  "card-answered": require("@/assets/sounds/card-answered.mp3") as AVPlaybackSource,
  "card-pass": require("@/assets/sounds/card-pass.mp3") as AVPlaybackSource,
  "confirmation-dialog": require("@/assets/sounds/confirmation-dialog.mp3") as AVPlaybackSource,
  "ending-screen": require("@/assets/sounds/ending-screen.mp3") as AVPlaybackSource,
};

const LOWERED_FACTOR = 0.25;

// ─── Context ─────────────────────────────────────────────────────────────────

const AudioStoreContext = createContext<AudioStoreValue | null>(null);

export function AudioStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { audio } = useProfileStore();

  // Live ref so callbacks always read current volume settings without stale closures
  const audioRef = useRef(audio);
  audioRef.current = audio; // keep ref current on every render

  // Sound object refs — not state, so updates don't trigger re-renders
  const lobbySoundRef = useRef<Sound | null>(null);
  const ingameSoundRef = useRef<Sound | null>(null);
  const sfxRef = useRef<Partial<Record<SfxKey, Sound>>>({});

  // Guard against concurrent onGameFocus loads
  const ingameLoadingRef = useRef(false);

  // Track whether each BGM is currently at full volume to re-apply correctly
  // when settings change
  const lobbyIsFullRef = useRef(false);
  const ingameIsFullRef = useRef(false);

  // Lobby track is chosen once per app session
  const lobbyTrackRef = useRef<0 | 1>(
    (Math.floor(Math.random() * 2) as 0 | 1),
  );

  // ── Android audio mode ──────────────────────────────────────────────────
  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  // ── Preload all 5 SFX on mount ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    (async () => {
      for (const [key, source] of Object.entries(SFX_SOURCES) as [
        SfxKey,
        AVPlaybackSource,
      ][]) {
        if (cancelled) break;
        try {
          const vol =
            (audioRef.current.master / 100) * (audioRef.current.sfx / 100);
          const { sound } = await Audio.Sound.createAsync(source, {
            volume: vol,
          });
          if (cancelled) {
            sound.unloadAsync();
            break;
          }
          sfxRef.current[key] = sound;
        } catch {
          // Silently skip if a sound file fails to load
        }
      }
    })();

    return () => {
      cancelled = true;
      Object.values(sfxRef.current).forEach((s) => s?.unloadAsync());
      sfxRef.current = {};
    };
  }, []);

  // ── Unload BGM on provider unmount ──────────────────────────────────────
  useEffect(() => {
    return () => {
      lobbySoundRef.current?.unloadAsync();
      ingameSoundRef.current?.unloadAsync();
    };
  }, []);

  // ── Sync all live Sound volumes when settings change ────────────────────
  useEffect(() => {
    const a = audio;
    const fullMusicVol = (a.master / 100) * (a.music / 100);
    const fullSfxVol = (a.master / 100) * (a.sfx / 100);

    lobbySoundRef.current
      ?.setVolumeAsync(
        lobbyIsFullRef.current ? fullMusicVol : fullMusicVol * LOWERED_FACTOR,
      )
      .catch(() => {});
    ingameSoundRef.current
      ?.setVolumeAsync(
        ingameIsFullRef.current ? fullMusicVol : fullMusicVol * LOWERED_FACTOR,
      )
      .catch(() => {});
    Object.values(sfxRef.current).forEach((s) =>
      s?.setVolumeAsync(fullSfxVol).catch(() => {}),
    );
  }, [audio]);

  // ── Volume helpers ───────────────────────────────────────────────────────
  const musicVol = useCallback(
    (full: boolean) => {
      const a = audioRef.current;
      const base = (a.master / 100) * (a.music / 100);
      return full ? base : base * LOWERED_FACTOR;
    },
    [],
  );

  const sfxVol = useCallback(() => {
    const a = audioRef.current;
    return (a.master / 100) * (a.sfx / 100);
  }, []);

  // ── Lobby BGM ────────────────────────────────────────────────────────────
  const onLobbyFocus = useCallback(async () => {
    // Stop any lingering in-game BGM when returning to lobby
    if (ingameSoundRef.current) {
      try {
        await ingameSoundRef.current.stopAsync();
        await ingameSoundRef.current.unloadAsync();
      } catch {}
      ingameSoundRef.current = null;
      ingameIsFullRef.current = false;
    }

    lobbyIsFullRef.current = true;

    if (!lobbySoundRef.current) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          LOBBY_BGM[lobbyTrackRef.current],
          { isLooping: true, volume: musicVol(true) },
        );
        lobbySoundRef.current = sound;
        await sound.playAsync();
      } catch {}
    } else {
      try {
        await lobbySoundRef.current.setVolumeAsync(musicVol(true));
        const status = await lobbySoundRef.current.getStatusAsync();
        if (status.isLoaded && !status.isPlaying) {
          await lobbySoundRef.current.playAsync();
        }
      } catch {}
    }
  }, [musicVol]);

  const onLobbyBlur = useCallback(async () => {
    lobbyIsFullRef.current = false;
    try {
      await lobbySoundRef.current?.setVolumeAsync(musicVol(false));
    } catch {}
  }, [musicVol]);

  // ── In-game BGM ──────────────────────────────────────────────────────────
  const onGameFocus = useCallback(async () => {
    // Lower lobby BGM
    lobbyIsFullRef.current = false;
    try {
      await lobbySoundRef.current?.setVolumeAsync(musicVol(false));
    } catch {}

    // Prevent concurrent loads
    if (ingameLoadingRef.current) return;
    ingameLoadingRef.current = true;

    // Unload previous in-game track if any
    if (ingameSoundRef.current) {
      try {
        await ingameSoundRef.current.stopAsync();
        await ingameSoundRef.current.unloadAsync();
      } catch {}
      ingameSoundRef.current = null;
    }

    ingameIsFullRef.current = true;
    try {
      const trackIndex = Math.floor(Math.random() * 2) as 0 | 1;
      const { sound } = await Audio.Sound.createAsync(INGAME_BGM[trackIndex], {
        isLooping: true,
        volume: musicVol(true),
      });
      ingameSoundRef.current = sound;
      await sound.playAsync();
    } catch {
    } finally {
      ingameLoadingRef.current = false;
    }
  }, [musicVol]);

  const onGameBlur = useCallback(async () => {
    ingameIsFullRef.current = false;
    try {
      await ingameSoundRef.current?.setVolumeAsync(musicVol(false));
    } catch {}
  }, [musicVol]);

  const stopIngameBgm = useCallback(async () => {
    ingameIsFullRef.current = false;
    if (ingameSoundRef.current) {
      try {
        await ingameSoundRef.current.stopAsync();
        await ingameSoundRef.current.unloadAsync();
      } catch {}
      ingameSoundRef.current = null;
    }
  }, []);

  // ── SFX playback ─────────────────────────────────────────────────────────
  const playSfx = useCallback(
    (key: SfxKey) => {
      const sound = sfxRef.current[key];
      if (!sound) return;
      const vol = sfxVol();
      sound
        .setVolumeAsync(vol)
        .then(() => sound.replayAsync())
        .catch(() => {});
    },
    [sfxVol],
  );

  const value = useMemo<AudioStoreValue>(
    () => ({
      onLobbyFocus,
      onLobbyBlur,
      onGameFocus,
      onGameBlur,
      stopIngameBgm,
      playSfx,
    }),
    [onLobbyFocus, onLobbyBlur, onGameFocus, onGameBlur, stopIngameBgm, playSfx],
  );

  return (
    <AudioStoreContext.Provider value={value}>
      {children}
    </AudioStoreContext.Provider>
  );
}

export function useAudioStore(): AudioStoreValue {
  const ctx = useContext(AudioStoreContext);
  if (!ctx) throw new Error("useAudioStore must be used within AudioStoreProvider");
  return ctx;
}
