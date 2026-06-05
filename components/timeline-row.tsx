/**
 * One entry in the Play-History timeline (`play-history.png`): a left rail with
 * a node (filled solid dot = spilled everything, outlined ring = incomplete)
 * and a connector line, a colored deck-icon badge, the deck title in its color,
 * the outcome subtitle, and a right-aligned time.
 */
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react-native";
import { StyleSheet, Text, View } from "react-native";

import { Tokens } from "@/constants/tokens";
import type { PlaySession } from "@/contexts/profile-store";

type Props = {
  session: PlaySession;
  icon: IconSvgElement;
};

function formatTime(ms: number): string {
  const d = new Date(ms);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const period = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${m}${period}`;
}

export function TimelineRow({ session, icon }: Props) {
  const scale = Tokens.colors[session.colorKey];
  return (
    <>
      <View style={styles.row}>
        {/* Deck icon badge */}
        <View style={[styles.iconBadge, { backgroundColor: scale[100] }]}>
          <HugeiconsIcon icon={icon} size={20} color={scale[500]} />
        </View>

        {/* Text */}
        <View style={styles.text}>
          <Text style={[styles.title, { color: scale[500] }]}>
            {session.deckTitle}
          </Text>
          <Text style={styles.subtitle}>{session.subtitle}</Text>
        </View>

        {/* Time */}
        <Text style={styles.time}>{formatTime(session.at)}</Text>
      </View>
      <View style={styles.divider} />
    </>
  );
}

const NODE_SIZE = 10;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing[3],
    marginBottom: Tokens.spacing[2],
  },
  rail: {
    width: NODE_SIZE,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
  },
  nodeFilled: {
    backgroundColor: Tokens.colors.teal[500],
  },
  nodeOutlined: {
    borderWidth: 2,
    borderColor: Tokens.colors.teal[500],
    backgroundColor: Tokens.colors.white,
  },
  connectorAbove: {
    flex: 1,
    width: 2,
    backgroundColor: Tokens.colors.teal[500],
    marginBottom: -Tokens.spacing[6],
  },
  connectorBelow: {
    flex: 1,
    width: 2,
    backgroundColor: Tokens.colors.teal[500],
    marginTop: -Tokens.spacing[6],
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Tokens.spacing[0],
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: Tokens.typography.fontSize.lg,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  subtitle: {
    fontSize: Tokens.typography.fontSize.sm,
    color: Tokens.colors.neutral[400],
  },
  time: {
    fontSize: Tokens.typography.fontSize.sm,
    color: Tokens.colors.neutral[400],
  },
  divider: {
    height: 1,
    backgroundColor: Tokens.colors.neutral[100],
    marginVertical: Tokens.spacing[4],
  },
});
