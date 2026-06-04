import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";

import type { DeckColorScale } from "@/constants/decks";

const DEFAULT_SVG = `<svg width="87" height="60" viewBox="0 0 87 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="87" height="60" rx="12" fill="#0D9488"/>
<g filter="url(#filter0_d_697_4641)">
<rect width="87" height="50" rx="12" fill="#0D9488"/>
<rect x="1" y="1" width="85" height="48" rx="11" stroke="url(#paint0_linear_697_4641)" stroke-opacity="0.2" stroke-width="2"/>
</g>
<g filter="url(#filter1_d_697_4641)">
<path d="M19.125 35V17.5455H31.7045V21.3636H23.8636V24.3636H31.0568V28.1818H23.8636V31.1818H31.6705V35H19.125ZM49.637 17.5455V35H45.6824L39.3756 25.8295H39.2733V35H34.5347V17.5455H38.5574L44.762 26.6818H44.8983V17.5455H49.637ZM59.0743 35H52.3584V17.5455H59.0062C60.8016 17.5455 62.3528 17.8949 63.6596 18.5938C64.9721 19.2869 65.9834 20.2869 66.6937 21.5938C67.4096 22.8949 67.7675 24.4545 67.7675 26.2727C67.7675 28.0909 67.4124 29.6534 66.7022 30.9602C65.992 32.2614 64.9863 33.2614 63.6851 33.9602C62.384 34.6534 60.8471 35 59.0743 35ZM57.0971 30.9773H58.9039C59.7675 30.9773 60.5033 30.8381 61.1113 30.5597C61.7249 30.2812 62.1908 29.8011 62.509 29.1193C62.8329 28.4375 62.9948 27.4886 62.9948 26.2727C62.9948 25.0568 62.83 24.108 62.5005 23.4261C62.1766 22.7443 61.6993 22.2642 61.0687 21.9858C60.4437 21.7074 59.6766 21.5682 58.7675 21.5682H57.0971V30.9773Z" fill="white"/>
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
<filter id="filter1_d_697_4641" x="19.125" y="17.5454" width="48.6426" height="19.4546" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
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
<g filter="url(#filter1_d_697_4699)">
<path d="M21.125 45V27.5455H33.7045V31.3636H25.8636V34.3636H33.0568V38.1818H25.8636V41.1818H33.6705V45H21.125ZM51.637 27.5455V45H47.6824L41.3756 35.8295H41.2733V45H36.5347V27.5455H40.5574L46.762 36.6818H46.8983V27.5455H51.637ZM61.0743 45H54.3584V27.5455H61.0062C62.8016 27.5455 64.3528 27.8949 65.6596 28.5938C66.9721 29.2869 67.9834 30.2869 68.6937 31.5938C69.4096 32.8949 69.7675 34.4545 69.7675 36.2727C69.7675 38.0909 69.4124 39.6534 68.7022 40.9602C67.992 42.2614 66.9863 43.2614 65.6851 43.9602C64.384 44.6534 62.8471 45 61.0743 45ZM59.0971 40.9773H60.9039C61.7675 40.9773 62.5033 40.8381 63.1113 40.5597C63.7249 40.2812 64.1908 39.8011 64.509 39.1193C64.8329 38.4375 64.9948 37.4886 64.9948 36.2727C64.9948 35.0568 64.83 34.108 64.5005 33.4261C64.1766 32.7443 63.6993 32.2642 63.0687 31.9858C62.4437 31.7074 61.6766 31.5682 60.7675 31.5682H59.0971V40.9773Z" fill="white"/>
</g>
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
<filter id="filter1_d_697_4699" x="21.125" y="27.5454" width="48.6426" height="19.4546" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_697_4699"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_697_4699" result="shape"/>
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
            <SvgXml xml={xml} />
          </View>
        ) : (
          <SvgXml xml={xml} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { width: 87, height: 60 },
  pressedOffset: { position: "absolute", top: -10, left: -2 },
});
