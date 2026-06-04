/**
 * Gemini API client for generating party-game questions.
 *
 * SECURITY: the API key is embedded client-side per the project requirement
 * (goal-08 §4.6). This is inherently insecure — anyone can extract it from the
 * app bundle — and the key should be moved behind a server/proxy and rotated
 * before any production release. It is isolated here so that move is a one-file
 * change.
 */
const GEMINI_API_KEY = "AQ.Ab8RN6Jk6u61pT8dedM0SDlqDJotxdtwjVGjf4KLYPrPn9l3Dg";
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const MAX_WORDS = 12;

function buildPrompt(deckName: string): string {
  return [
    `You are generating a single conversation-starter question for a party card game.`,
    `The deck is themed "${deckName}". The question MUST be strictly relevant to that theme/category — not random.`,
    `Constraints:`,
    `- Exactly one question.`,
    `- Maximum ${MAX_WORDS} words.`,
    `- Fun, casual, safe-for-everyone tone.`,
    `- Return ONLY the question text, with no quotes, numbering, or extra commentary.`,
  ].join("\n");
}

/** Trim to at most `MAX_WORDS` words and strip wrapping quotes/whitespace. */
function sanitize(text: string): string {
  let t = text
    .trim()
    .replace(/^["'""]+|["'""]+$/g, "")
    .trim();
  const words = t.split(/\s+/);
  if (words.length > MAX_WORDS) {
    t = words.slice(0, MAX_WORDS).join(" ");
    if (!/[?.!]$/.test(t)) t += "?";
  }
  return t;
}

export class GeminiError extends Error {}

/**
 * Generate one question for the given deck theme. Throws `GeminiError` on
 * network/API failure (the caller maps this to a user-facing message).
 */
export async function generateQuestion(deckName: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(deckName) }] }],
        generationConfig: { temperature: 1.0, maxOutputTokens: 60 },
      }),
    });
  } catch (e) {
    console.error("[Gemini] Network error:", e);
    throw new GeminiError("Network request failed.");
  }

  if (!res.ok) {
    let body = "";
    try { body = await res.text(); } catch { /* ignore */ }
    console.error(`[Gemini] HTTP ${res.status}:`, body);
    throw new GeminiError(`Gemini request failed (${res.status}).`);
  }

  try {
    const json = await res.json();
    const text: string | undefined =
      json?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text || !text.trim()) {
      console.error("[Gemini] Empty or missing text in response:", JSON.stringify(json));
      throw new GeminiError("Empty response from Gemini.");
    }

    return sanitize(text);
  } catch (e) {
    if (e instanceof GeminiError) throw e;
    console.error("[Gemini] Response parse error:", e);
    throw new GeminiError("Failed to parse Gemini response.");
  }
}
