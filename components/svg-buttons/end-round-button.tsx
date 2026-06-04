import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";

import type { DeckColorScale } from "@/constants/decks";

const SCALE = 0.85;
const DEFAULT_W = 87 * SCALE;
const DEFAULT_H = 60 * SCALE;
const PRESSED_W = 95 * SCALE;
const PRESSED_H = 64 * SCALE;

const DEFAULT_SVG = `<svg width="87" height="60" viewBox="0 0 87 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="87" height="60" rx="12" fill="#0D9488"/>
<g filter="url(#filter0_d_697_4641)">
<rect width="87" height="50" rx="12" fill="#0D9488"/>
<rect x="1" y="1" width="85" height="48" rx="11" stroke="url(#paint0_linear_697_4641)" stroke-opacity="0.2" stroke-width="2"/>
</g>
<defs>
<filter id="filter0_d_697_4641" x="0" y="0" width="87" height="60" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="10"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_697_4641"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_697_4641" result="shape"/>
</filter>
<linearGradient id="paint0_linear_697_4641" x1="43.5" y1="0" x2="43.5" y2="50" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.5"/>
<stop offset="0.296666" stop-color="white" stop-opacity="0"/>
<stop offset="0.641666" stop-color="white" stop-opacity="0"/>
<stop offset="0.956666" stop-color="white"/>
</linearGradient>
</defs>
</svg>`;

const PRESSED_SVG = `<svg width="95" height="64" viewBox="0 0 95 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_di_697_4699)">
<rect x="2" y="10" width="87" height="50" rx="12" fill="#0D9488"/>
<rect x="3" y="11" width="85" height="48" rx="11" stroke="url(#paint0_linear_697_4699)" stroke-opacity="0.2" stroke-width="2"/>
<g filter="url(#filter2_di_697_4699)">
<rect x="73" y="6" width="20" height="20" rx="10" fill="#FFA722"/>
<rect x="74" y="7" width="18" height="18" rx="9" stroke="white" stroke-opacity="0.5" stroke-width="2"/>
</g>
</g>
<defs>
<filter id="filter0_di_697_4699" x="0" y="-2" width="95" height="66" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_697_4699"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_697_4699" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="normal" in2="shape" result="effect2_innerShadow_697_4699"/>
</filter>
<filter id="filter2_di_697_4699" x="73" y="6" width="20" height="22" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_697_4699"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_697_4699" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="6"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="shape" result="effect2_innerShadow_697_4699"/>
</filter>
<linearGradient id="paint0_linear_697_4699" x1="45.5" y1="10" x2="45.5" y2="60" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.5"/>
<stop offset="0.296666" stop-color="white" stop-opacity="0"/>
<stop offset="0.641666" stop-color="white" stop-opacity="0"/>
<stop offset="0.956666" stop-color="white"/>
</linearGradient>
</defs>
</svg>`;

type Props = {
  colorScale: DeckColorScale;
  onPress: () => void;
  label: string;
};

export function EndRoundButton({ colorScale, onPress }: Props) {
  const [pressed, setPressed] = useState(false);
  const xml = (pressed ? PRESSED_SVG : DEFAULT_SVG)
    .replace(/#0D9488/gi, colorScale.c600);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <View style={styles.container}>
        {pressed ? (
          <View style={styles.pressedOffset}>
            <SvgXml xml={xml} width={PRESSED_W} height={PRESSED_H} />
          </View>
        ) : (
          <SvgXml xml={xml} width={DEFAULT_W} height={DEFAULT_H} />
        )}
        <View style={styles.labelContainer}>
          <Text style={styles.label}>END</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { width: DEFAULT_W, height: DEFAULT_H },
  pressedOffset: { position: "absolute", top: -10 * SCALE, left: -2 * SCALE },
  labelContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 10 * SCALE,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
