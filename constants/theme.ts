/**
 * Semantic color and font tokens for the app's light/dark themes.
 * All raw values come from constants/tokens.ts — do not hardcode here.
 */

import { Platform } from 'react-native';

import { Tokens } from '@/constants/tokens';

export const Colors = {
  light: {
    text:            Tokens.colors.zinc[900],    // #18181b — was #11181C
    background:      Tokens.colors.white,         // #ffffff
    tint:            Tokens.colors.cyan[700],     // #0e7490 — was #0a7ea4
    icon:            Tokens.colors.slate[500],    // #64748b — was #687076
    tabIconDefault:  Tokens.colors.slate[500],    // #64748b
    tabIconSelected: Tokens.colors.cyan[700],     // #0e7490
  },
  dark: {
    text:            Tokens.colors.zinc[200],     // #e4e4e7 — was #ECEDEE
    background:      Tokens.colors.zinc[900],     // #18181b — was #151718
    tint:            Tokens.colors.white,         // #ffffff
    icon:            Tokens.colors.zinc[400],     // #a1a1aa — was #9BA1A6
    tabIconDefault:  Tokens.colors.zinc[400],     // #a1a1aa
    tabIconSelected: Tokens.colors.white,         // #ffffff
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
