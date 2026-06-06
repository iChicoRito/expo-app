/**
 * Single source of truth for the end-game outcome. Shared by the results screen
 * (title + subtitle) and the Play-History recorder (subtitle + timeline node).
 *
 * - answered 0 && passed === total → "The Tea Got Ghosted"       (outlined)
 * - answered 0                     → "Certified Dodger"          (outlined)
 * - answered > 0 && < total        → "Almost Spilled Everything" (outlined)
 * - answered === total             → "You Spilled Everything"    (filled)
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
  total: number,
  name: string,
): Scenario {
  if (answered === 0 && passed === total) {
    return {
      title: `The Tea Got Ghosted, ${name}`,
      subtitle: "Every card was left on read. Brutal behavior.",
      node: "outlined",
    };
  }
  if (answered === 0) {
    return {
      title: `Certified Dodger, ${name}`,
      subtitle: "You passed every question. Suspicious, but we'll allow it.",
      node: "outlined",
    };
  }
  if (answered < total) {
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
