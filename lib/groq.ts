/**
 * Groq API client for generating party-game questions.
 *
 * SECURITY: the API key is embedded client-side. It should be moved behind a
 * server/proxy and rotated before any production release. Isolated here so
 * that move is a one-file change.
 */
const GROQ_API_KEY =
  "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";
const GROQ_MODEL = "qwen/qwen3-32b";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

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

export class GroqError extends Error {}

/**
 * Generate one question for the given deck theme. Throws `GroqError` on
 * network/API failure (the caller maps this to a user-facing message).
 */
export async function generateQuestion(deckName: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: buildPrompt(deckName) }],
        temperature: 1.0,
        max_tokens: 60,
      }),
    });
  } catch (e) {
    console.error("[Groq] Network error:", e);
    throw new GroqError("Network request failed.");
  }

  if (!res.ok) {
    let body = "";
    try { body = await res.text(); } catch { /* ignore */ }
    console.error(`[Groq] HTTP ${res.status}:`, body);
    throw new GroqError(`Groq request failed (${res.status}).`);
  }

  try {
    const json = await res.json();
    const raw: string | undefined = json?.choices?.[0]?.message?.content;

    if (!raw || !raw.trim()) {
      console.error("[Groq] Empty or missing text in response:", JSON.stringify(json));
      throw new GroqError("Empty response from Groq.");
    }

    // qwen3 reasoning models prefix the answer with a <think>…</think> block
    const text = raw.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    if (!text) {
      console.error("[Groq] No content after stripping <think> block:", raw);
      throw new GroqError("Empty response from Groq.");
    }

    return sanitize(text);
  } catch (e) {
    if (e instanceof GroqError) throw e;
    console.error("[Groq] Response parse error:", e);
    throw new GroqError("Failed to parse Groq response.");
  }
}
