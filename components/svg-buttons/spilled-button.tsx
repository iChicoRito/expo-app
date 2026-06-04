import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

import type { DeckColorScale } from "@/constants/decks";
import { Tokens } from "@/constants/tokens";

type Props = {
  colorScale: DeckColorScale;
  onPress: () => void;
  label: string;
};

export function SpilledButton({ colorScale, onPress, label }: Props) {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress} activeOpacity={0.8}>
      <Svg width={88} height={88} viewBox="0 0 244 244" fill="none">
        {/* Layer 1: outer shadow base */}
        <Rect width={244} height={244} rx={68.0478} fill={colorScale.c600} />
        {/* Layer 2: main surface */}
        <Rect x={5.833} width={232.335} height={232.335} rx={68.0478} fill={colorScale.c400} />
        {/* Layer 3: top-left gloss highlight */}
        <Path
          d="M29 52.1149C31.9345 52.0368 34.8234 52.0008 37.67 52.0028C160.413 52.1188 201.677 125.573 212.784 152.911C215.327 159.162 216.289 163 216.289 163C216.289 163 217.066 162.649 218.469 161.989C220.152 156.211 221 150.232 221 144.128V81.9637C221 73.0621 219.195 64.4226 215.633 56.2855C212.195 48.4295 207.273 41.376 201.007 35.3202C194.74 29.2644 187.441 24.5084 179.312 21.1863C170.891 17.7441 161.951 16 152.739 16H89.8911C80.6795 16 71.7392 17.7441 63.3187 21.1863C55.1892 24.5084 47.8901 29.2644 41.6234 35.3202C36.4854 40.2843 32.2524 45.918 29 52.1149Z"
          fill={colorScale.c300}
        />
        {/* Layer 4: inner border stroke (rendered before icon so icon appears on top) */}
        <Rect
          x={22.3577}
          y={16.5247}
          width={199.283}
          height={199.283}
          rx={64.1594}
          stroke={colorScale.c500}
          strokeWidth={7.77689}
        />
        {/* Layer 5: icon foreground — star outline (white) */}
        <Path
          d="M120 45.725L137.881 81.087L140.072 85.2211L184.155 90.895L182.576 92.39L152.584 120.804L158.723 153.134L160.508 162.531L160.42 162.488L161.87 170.471L121.005 149.487L80.5505 171.257L81.8435 163.246L81.7534 163.293L83.4504 153.307L88.8703 121.421L58.3374 93.5911L56.7285 92.124L100.695 85.6011L102.906 81.225L120 45.725ZM120 34C119.962 34 119.924 34 119.886 34.001C115.423 34.044 111.372 36.617 109.435 40.639L92.9375 74.899L55.0053 80.527C50.5263 81.192 46.8305 84.3751 45.5105 88.7061C44.1895 93.0371 45.4804 97.741 48.8264 100.791L50.4353 102.258L76.2343 125.773L71.8884 151.344L70.1914 161.33C70.1084 161.822 70.0564 162.313 70.0354 162.803L68.9724 169.389C68.2614 173.795 70.1125 178.223 73.7485 180.811C75.7735 182.252 78.1563 182.984 80.5493 182.984C82.4533 182.984 84.3635 182.521 86.1045 181.584L121.13 162.735L156.511 180.903C158.2 181.77 160.037 182.198 161.866 182.198C164.336 182.198 166.791 181.419 168.851 179.891C172.436 177.232 174.203 172.768 173.405 168.377L172.207 161.789C172.176 161.308 172.116 160.826 172.025 160.345L170.241 150.948L165.297 124.912L190.639 100.904L192.217 99.4091C195.504 96.2951 196.704 91.5671 195.301 87.2621C193.897 82.9571 190.141 79.845 185.65 79.267L147.624 74.3721L130.463 40.4351C128.467 36.4851 124.419 34 120 34Z"
          fill="white"
        />
        {/* Layer 6: icon inner fill depth */}
        <Path
          d="M160.084 162.763L161.534 170.746L120.668 149.762L80.2139 171.531L81.5071 163.52L83.114 153.582L88.533 121.696L58 93.8661L99.7339 87.39L102.57 81.5L119.665 46L137.545 81.363L140.393 86.9961L182.241 92.665L152.248 121.079L158.387 153.409L160.084 162.763Z"
          fill={colorScale.c400}
        />
        {/* Layer 7: icon depth */}
        <Path
          d="M181.85 91.6652L151.857 120.079L157.996 152.409L159.781 161.806L159.693 161.763L120.213 142.452L81.1162 162.52L81.0261 162.568L82.7231 152.582L88.1421 120.696L57.6091 92.8662L56 91.3992L99.967 84.8762L102.179 80.5001L119.288 46.6572L137.154 80.3632L139.344 84.4962L183.427 90.1702L181.85 91.6652Z"
          fill={colorScale.c500}
        />
      </Svg>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: Tokens.spacing[2],
  },
  label: {
    color: Tokens.colors.white,
    fontSize: Tokens.typography.fontSize.sm,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
});
