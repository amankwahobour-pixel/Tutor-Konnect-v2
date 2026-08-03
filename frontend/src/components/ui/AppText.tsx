import React from 'react';
import { Text, type TextProps, type StyleProp, type TextStyle } from 'react-native';
import { colors, typography } from '@/theme';

export interface AppTextProps extends TextProps {
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'title' | 'subtitle' | 'body' | 'bodySmall' | 'caption' | 'label';
  color?: keyof typeof colors;
  style?: StyleProp<TextStyle>;
}

const variantStyles: Record<NonNullable<AppTextProps['variant']>, { fontSize: number; fontWeight: TextStyle['fontWeight']; lineHeight: number }> = {
  display: { fontSize: typography.display, fontWeight: typography.weight.bold, lineHeight: typography.lineHeight.display },
  h1: { fontSize: typography.h1, fontWeight: typography.weight.bold, lineHeight: typography.lineHeight.h1 },
  h2: { fontSize: typography.h2, fontWeight: typography.weight.bold, lineHeight: typography.lineHeight.h2 },
  h3: { fontSize: typography.h3, fontWeight: typography.weight.bold, lineHeight: typography.lineHeight.h3 },
  title: { fontSize: typography.title, fontWeight: typography.weight.bold, lineHeight: typography.lineHeight.title },
  subtitle: { fontSize: typography.subtitle, fontWeight: typography.weight.medium, lineHeight: typography.lineHeight.subtitle },
  body: { fontSize: typography.body, fontWeight: typography.weight.regular, lineHeight: typography.lineHeight.body },
  bodySmall: { fontSize: typography.bodySmall, fontWeight: typography.weight.regular, lineHeight: typography.lineHeight.bodySmall },
  caption: { fontSize: typography.caption, fontWeight: typography.weight.regular, lineHeight: typography.lineHeight.caption },
  label: { fontSize: typography.label, fontWeight: typography.weight.semibold, lineHeight: typography.lineHeight.label },
};

const AppTextComponent = React.forwardRef<React.ElementRef<typeof Text>, AppTextProps>(function AppTextComponent(
  { variant = 'body', color = 'text', style, ...props },
  ref,
) {
  return <Text ref={ref} style={[{ color: colors[color], ...variantStyles[variant] }, style]} {...props} />;
});

export const AppText = React.memo(AppTextComponent);
AppText.displayName = 'AppText';
