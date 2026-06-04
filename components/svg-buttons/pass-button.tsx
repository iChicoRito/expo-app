import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";

import type { DeckColorScale } from "@/constants/decks";

const SCALE = 0.85;
const DEFAULT_W = 102 * SCALE;
const DEFAULT_H = 60 * SCALE;
const PRESSED_W = 110 * SCALE;
const PRESSED_H = 64 * SCALE;

const DEFAULT_SVG = `<svg width="102" height="60" viewBox="0 0 102 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="102" height="60" rx="12" fill="#0D9488"/>
<g filter="url(#filter0_d_697_4643)">
<rect width="102" height="50" rx="12" fill="#0D9488"/>
<rect x="1" y="1" width="100" height="48" rx="11" stroke="url(#paint0_linear_697_4643)" stroke-opacity="0.2" stroke-width="2"/>
</g>
<defs>
<filter id="filter0_d_697_4643" x="0" y="0" width="102" height="60" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="10"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_697_4643"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_697_4643" result="shape"/>
</filter>
<linearGradient id="paint0_linear_697_4643" x1="51" y1="0" x2="51" y2="50" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.5"/>
<stop offset="0.296666" stop-color="white" stop-opacity="0"/>
<stop offset="0.641666" stop-color="white" stop-opacity="0"/>
<stop offset="0.956666" stop-color="white"/>
</linearGradient>
</defs>
</svg>`;

const PRESSED_SVG = `<svg width="110" height="64" viewBox="0 0 110 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_di_697_4701)">
<rect x="2" y="10" width="102" height="50" rx="12" fill="#0D9488"/>
<rect x="3" y="11" width="100" height="48" rx="11" stroke="url(#paint0_linear_697_4701)" stroke-opacity="0.2" stroke-width="2"/>
<g filter="url(#filter2_di_697_4701)">
<rect x="88" y="6" width="20" height="20" rx="10" fill="#FFA722"/>
<rect x="89" y="7" width="18" height="18" rx="9" stroke="white" stroke-opacity="0.5" stroke-width="2"/>
</g>
</g>
<defs>
<filter id="filter0_di_697_4701" x="0" y="-2" width="110" height="66" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_697_4701"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_697_4701" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="-2"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="normal" in2="shape" result="effect2_innerShadow_697_4701"/>
</filter>
<filter id="filter2_di_697_4701" x="88" y="6" width="20" height="22" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_697_4701"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_697_4701" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="6"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="shape" result="effect2_innerShadow_697_4701"/>
</filter>
<linearGradient id="paint0_linear_697_4701" x1="53" y1="10" x2="53" y2="60" gradientUnits="userSpaceOnUse">
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

export function PassButton({ colorScale, onPress }: Props) {
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
          <Text style={styles.label}>PASS</Text>
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
