/**
 * Pure helpers for the AI generation rate limit: a rolling 1-hour window that
 * allows up to `MAX_PER_WINDOW` generations. The window starts at the first
 * generation and resets once an hour has elapsed from that start.
 *
 * State is persisted by the deck store; this module holds no state of its own.
 */
export const MAX_PER_WINDOW = 15;
export const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export type AiRateState = {
  /** Epoch ms of the first generation in the current window. */
  windowStart: number;
  /** Generations consumed in the current window. */
  count: number;
};

export type RateLimitInfo = {
  remaining: number;
  /** Epoch ms when the current window resets, or `null` if no window is open. */
  resetAt: number | null;
  blocked: boolean;
};

const EMPTY: AiRateState = { windowStart: 0, count: 0 };

/** Return a state with the window reset if it has fully elapsed. */
export function rollWindow(state: AiRateState | null, now: number = Date.now()): AiRateState {
  const s = state ?? EMPTY;
  if (s.windowStart === 0) return s;
  if (now - s.windowStart >= WINDOW_MS) return { windowStart: 0, count: 0 };
  return s;
}

/** Derive user-facing limit info from a (rolled) state. */
export function getInfo(state: AiRateState | null, now: number = Date.now()): RateLimitInfo {
  const s = rollWindow(state, now);
  const remaining = Math.max(0, MAX_PER_WINDOW - s.count);
  return {
    remaining,
    resetAt: s.windowStart === 0 ? null : s.windowStart + WINDOW_MS,
    blocked: remaining <= 0,
  };
}

/**
 * Consume one generation. Returns the next state, or `null` if the limit is
 * already reached (caller should block).
 */
export function consume(state: AiRateState | null, now: number = Date.now()): AiRateState | null {
  const s = rollWindow(state, now);
  if (s.count >= MAX_PER_WINDOW) return null;
  return {
    windowStart: s.windowStart === 0 ? now : s.windowStart,
    count: s.count + 1,
  };
}
