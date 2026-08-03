import React from 'react';
import { Text, type TextProps, type StyleProp, type TextStyle } from 'react-native';
import { colors, typography } from '@/theme';

export interface AppTextProps extends TextProps {
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'title' | 'subtitle' | 'body' | 'bodySmall' | 'caption' | 'label';
  color?: keyof typeof colors;
  style?: StyleProp<TextStyle>;
}

const variantStyles: Record<NonNullable<AppTextProps['variant']>, { fontSize: number; fontWeight?: TextStyle['fontWeight'] }> = {
  display: { fontSize: typography.display, fontWeight: '700' },
  h1: { fontSize: typography.h1, fontWeight: '700' },
  h2: { fontSize: typography.h2, fontWeight: '700' },
  h3: { fontSize: typography.h3, fontWeight: '700' },
  title: { fontSize: typography.title, fontWeight: '700' },
  subtitle: { fontSize: typography.subtitle, fontWeight: '500' },
  body: { fontSize: typography.body, fontWeight: '400' },
  bodySmall: { fontSize: typography.bodySmall, fontWeight: '400' },
  caption: { fontSize: typography.caption, fontWeight: '400' },
  label: { fontSize: typography.label, fontWeight: '600' },
};

const AppTextComponent = React.forwardRef<React.ElementRef<typeof Text>, AppTextProps>(function AppTextComponent(
  { variant = 'body', color = 'text', style, ...props },
  ref,
) {
  return <Text ref={ref} style={[{ color: colors[color], ...variantStyles[variant] }, style]} {...props} />;
});

export const AppText = React.memo(AppTextComponent);
AppText.displayName = 'AppText';
