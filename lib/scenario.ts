/**
 * Single source of truth for the end-game outcome derived purely from the
 * answered/passed tallies. Shared by the results screen (title + subtitle) and
 * the Play-History recorder (subtitle + timeline node), so the two stay in sync.
 *
 * - answered 0            → "Certified Dodger"          (outlined: ended without answering)
 * - some answered + a pass → "Almost Spilled Everything" (outlined: tea left unspilled)
 * - answered, zero passes  → "You Spilled Everything"   (filled: complete spill)
 */
export type SessionNode = "filled" | "outlined";

export type Scenario = {
  title: string;
  subtitle: string;
  node: SessionNode;
};

export function resolveScenario(
  answered: number,
  passed: number,
  name: string,
): Scenario {
  if (answered === 0) {
    return {
      title: `Certified Dodger, ${name}`,
      subtitle: "You passed every question. Suspicious, but we'll allow it.",
      node: "outlined",
    };
  }
  if (passed > 0) {
    return {
      title: `Almost Spilled Everything, ${name}`,
      subtitle: "You finished the deck, but some tea stayed unspilled.",
      node: "outlined",
    };
  }
  return {
    title: `You Spilled Everything, ${name}`,
    subtitle: "You survived the questions. Honestly, iconic behavior.",
    node: "filled",
  };
}
