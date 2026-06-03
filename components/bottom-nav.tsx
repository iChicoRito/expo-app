import {
  Cards02Icon,
  PlayIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Tokens } from "@/constants/tokens";

export type NavTab = "deck" | "play" | "profile";

type Item = { key: NavTab; label: string; icon: IconSvgElement };

const ITEMS: Item[] = [
  { key: "deck", label: "Deck", icon: Cards02Icon },
  { key: "play", label: "Play", icon: PlayIcon },
  { key: "profile", label: "Profile", icon: UserIcon },
];

type Props = {
  active?: NavTab;
  onSelect?: (tab: NavTab) => void;
};

export function BottomNav({ active = "play", onSelect }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom || Tokens.spacing[3] }]}>
      {ITEMS.map((item) => {
        const isActive = item.key === active;
        const color = isActive ? Tokens.colors.teal[500] : Tokens.colors.neutral[400];
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => onSelect?.(item.key)}
          >
            <HugeiconsIcon icon={item.icon} size={26} color={color} />
            <Text style={[styles.label, { color }]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    width: "100%",
    paddingTop: Tokens.spacing[3],
    backgroundColor: Tokens.colors.white,
    borderTopWidth: Tokens.effects.borderWidth.default,
    borderTopColor: Tokens.colors.zinc[200],
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Tokens.spacing[1],
  },
  label: {
    fontSize: Tokens.typography.fontSize.xs,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
});
