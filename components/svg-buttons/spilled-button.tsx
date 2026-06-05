import { memo, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";

import type { DeckColorScale } from "@/constants/decks";

const DEFAULT_SVG = `<svg width="82" height="77" viewBox="0 0 82 77" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="82" height="76.875" rx="15.375" fill="#0D9488"/>
<g filter="url(#filter0_d_697_4642)">
<rect width="82" height="64.0625" rx="15.375" fill="#0D9488"/>
<rect x="1.28125" y="1.28125" width="79.4375" height="61.5" rx="14.0938" stroke="url(#paint0_linear_697_4642)" stroke-opacity="0.2" stroke-width="2.5625"/>
</g>
<g filter="url(#filter1_d_697_4642)">
<path d="M55.064 29.3553C58.2358 31.0802 58.2358 35.5451 55.064 37.27L35.9127 47.6843C32.8301 49.3607 29.0417 47.1788 29.0417 43.727V22.8983C29.0417 19.4465 32.8301 17.2646 35.9127 18.941L55.064 29.3553Z" fill="white"/>
</g>
<defs>
<filter id="filter0_d_697_4642" x="0" y="0" width="82" height="76.875" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="12.8125"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_697_4642"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_697_4642" result="shape"/>
</filter>
<filter id="filter1_d_697_4642" x="23.0625" y="15.375" width="35.875" height="38.4375" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2.5625"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_697_4642"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_697_4642" result="shape"/>
</filter>
<linearGradient id="paint0_linear_697_4642" x1="41" y1="0" x2="41" y2="64.0625" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.5"/>
<stop offset="0.296666" stop-color="white" stop-opacity="0"/>
<stop offset="0.641666" stop-color="white" stop-opacity="0"/>
<stop offset="0.956666" stop-color="white"/>
</linearGradient>
</defs>
</svg>`;

const PRESSED_SVG = `<svg width="93" height="83" viewBox="0 0 93 83" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_di_697_4700)">
<rect x="2.5625" y="12.9375" width="82" height="64.0625" rx="15.375" fill="#0D9488"/>
<rect x="3.84375" y="14.2188" width="79.4375" height="61.5" rx="14.0938" stroke="url(#paint0_linear_697_4700)" stroke-opacity="0.2" stroke-width="2.5625"/>
<g filter="url(#filter1_d_697_4700)">
<path d="M57.6265 42.1678C60.7983 43.8927 60.7983 48.3576 57.6265 50.0825L38.4752 60.4968C35.3926 62.1732 31.6042 59.9913 31.6042 56.5395V35.7108C31.6042 32.259 35.3926 30.0771 38.4752 31.7535L57.6265 42.1678Z" fill="white"/>
</g>
<g filter="url(#filter2_di_697_4700)">
<rect x="64.0625" y="7.6875" width="25.625" height="25.625" rx="12.8125" fill="#FFA722"/>
<rect x="65.3438" y="8.96875" width="23.0625" height="23.0625" rx="11.5312" stroke="white" stroke-opacity="0.5" stroke-width="2.5625"/>
</g>
</g>
<defs>
<filter id="filter0_di_697_4700" x="0" y="-2.5625" width="92.25" height="84.6875" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2.5625"/>
<feGaussianBlur stdDeviation="1.28125"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_697_4700"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_697_4700" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="-2.5625"/>
<feGaussianBlur stdDeviation="1.28125"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="normal" in2="shape" result="effect2_innerShadow_697_4700"/>
</filter>
<filter id="filter1_d_697_4700" x="25.625" y="28.1875" width="35.875" height="38.4375" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2.5625"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_697_4700"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_697_4700" result="shape"/>
</filter>
<filter id="filter2_di_697_4700" x="64.0625" y="7.6875" width="25.625" height="28.1875" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2.5625"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_697_4700"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_697_4700" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="7.6875"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="shape" result="effect2_innerShadow_697_4700"/>
</filter>
<linearGradient id="paint0_linear_697_4700" x1="43.5625" y1="12.9375" x2="43.5625" y2="77" gradientUnits="userSpaceOnUse">
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

export const SpilledButton = memo(function SpilledButton({
  colorScale,
  onPress,
  label,
}: Props) {
  const [pressed, setPressed] = useState(false);
  const xml = useMemo(
    () => (pressed ? PRESSED_SVG : DEFAULT_SVG).replace(/#0D9488/gi, colorScale.c600),
    [colorScale.c600, pressed],
  );

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityLabel={label}
    >
      <View style={styles.container}>
        {pressed ? (
          <View style={styles.pressedOffset}>
            <SvgXml xml={xml} />
          </View>
        ) : (
          <SvgXml xml={xml} />
        )}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: { width: 82, height: 77 },
  pressedOffset: { position: "absolute", top: -12.9375, left: -2.5625 },
});
