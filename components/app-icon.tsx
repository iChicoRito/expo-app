import IconSvg from '@/assets/svg/icon.svg';

interface AppIconProps {
  size?: number;
}

export function AppIcon({ size = 64 }: AppIconProps) {
  return <IconSvg width={size} height={size} />;
}
