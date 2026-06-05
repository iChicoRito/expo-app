export const USER_NAME_KEY = "user_name";

/** AsyncStorage key for the list of user-created decks (JSON `UserDeck[]`). */
export const USER_DECKS_KEY = "user_decks";

/** AsyncStorage key for user-created questions, keyed by deck id (JSON `UserQuestions`). */
export const USER_QUESTIONS_KEY = "user_questions";

/** AsyncStorage key for the AI generation rate-limit window (JSON `AiRateState`). */
export const AI_RATE_LIMIT_KEY = "ai_rate_limit";

/** AsyncStorage key for the persisted profile blob (JSON `ProfileState`, sans name). */
export const PROFILE_KEY = "user_profile";
