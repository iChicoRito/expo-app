// lib/streak.ts

export type StreakState = {
  count: number;
  lastPlayAt: number; // ms timestamp; 0 = never played
};

export const DEFAULT_STREAK: StreakState = { count: 0, lastPlayAt: 0 };

function sameCalendarDay(a: number, b: number): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

/**
 * Given the stored streak and the current time, returns the updated streak
 * and whether this is the first play of the current calendar day.
 */
export function computeNewStreak(
  stored: StreakState,
  now: number,
): { newStreak: StreakState; isFirstOfDay: boolean } {
  if (stored.lastPlayAt === 0) {
    // First ever game
    return { newStreak: { count: 1, lastPlayAt: now }, isFirstOfDay: true };
  }
  if (sameCalendarDay(stored.lastPlayAt, now)) {
    // Already played today — no increment, just refresh timestamp
    return {
      newStreak: { count: stored.count, lastPlayAt: now },
      isFirstOfDay: false,
    };
  }
  const hoursSinceLast = (now - stored.lastPlayAt) / 3_600_000;
  if (hoursSinceLast > 24) {
    // More than 24 h gap — streak resets to 1
    return { newStreak: { count: 1, lastPlayAt: now }, isFirstOfDay: true };
  }
  // New calendar day within 24-hour window — increment
  return {
    newStreak: { count: stored.count + 1, lastPlayAt: now },
    isFirstOfDay: true,
  };
}

/**
 * Returns the streak count the user currently holds.
 * Returns 0 if more than 24 hours have passed since last play (expired).
 */
export function getEffectiveStreak(stored: StreakState): number {
  if (stored.lastPlayAt === 0) return 0;
  const hoursSinceLast = (Date.now() - stored.lastPlayAt) / 3_600_000;
  return hoursSinceLast > 24 ? 0 : stored.count;
}

/**
 * Maps a streak count to the spec-defined subtitle for the streak screen.
 */
export function getStreakSubtitle(count: number): string {
  if (count <= 3) return "You're just getting started. One card at a time, bestie.";
  if (count <= 7) return "Okay consistency! Your Spill Streak is starting to look serious.";
  return "Main character behavior. Your streak is officially in its iconic era.";
}
