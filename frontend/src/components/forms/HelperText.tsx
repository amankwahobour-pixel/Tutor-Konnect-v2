import React from 'react';
import { Text, type TextProps, type StyleProp, type TextStyle, View, type ViewStyle } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export interface HelperTextProps extends Omit<TextProps, 'style'> {
  text: string;
  variant?: 'error' | 'success' | 'warning' | 'info';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const variantColors: Record<NonNullable<HelperTextProps['variant']>, string> = {
  error: colors.danger,
  success: colors.success,
  warning: colors.warning,
  info: colors.textSecondary,
};

const HelperTextComponent = ({ text, variant = 'info', style, textStyle, ...props }: HelperTextProps) => (
  <View style={style}>
    <Text style={[{ color: variantColors[variant], fontSize: typography.caption, marginTop: spacing.xs }, textStyle]} {...props}>
      {text}
    </Text>
  </View>
);

export const HelperText = React.memo(HelperTextComponent);
HelperText.displayName = 'HelperText';
