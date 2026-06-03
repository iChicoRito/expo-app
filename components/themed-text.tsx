import { StyleSheet, Text, type TextProps } from 'react-native';

import { Tokens } from '@/constants/tokens';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize:   Tokens.typography.fontSize.base,       // 16
    lineHeight: Tokens.typography.lineHeight[3],        // 24
  },
  defaultSemiBold: {
    fontSize:   Tokens.typography.fontSize.base,       // 16
    lineHeight: Tokens.typography.lineHeight[3],        // 24
    fontWeight: Tokens.typography.fontWeight.semibold, // '600'
  },
  title: {
    fontSize:   Tokens.typography.fontSize['4xl'],     // 36 (nearest token to original 32)
    fontWeight: Tokens.typography.fontWeight.bold,     // '700'
    lineHeight: Tokens.typography.lineHeight[5],        // 32
  },
  subtitle: {
    fontSize:   Tokens.typography.fontSize.xl,         // 20
    fontWeight: Tokens.typography.fontWeight.bold,     // '700'
  },
  link: {
    lineHeight: 30, // intentional: 30px falls between lineHeight[3]=24 and lineHeight[6]=36
    fontSize:   Tokens.typography.fontSize.base,       // 16
    color:      Tokens.colors.cyan[700],               // '#0e7490' — matches Colors.light.tint
  },
});
