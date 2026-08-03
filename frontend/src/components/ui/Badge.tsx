import React from 'react';
import { Text, View, type TextProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

export interface BadgeProps extends Omit<TextProps, 'style'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const badgeBackgrounds: Record<NonNullable<BadgeProps['variant']>, string> = {
  primary: colors.primary,
  secondary: colors.secondary,
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
  neutral: colors.surface,
};

const badgeTextColors: Record<NonNullable<BadgeProps['variant']>, string> = {
  primary: colors.surface,
  secondary: colors.surface,
  success: colors.surface,
  warning: colors.text,
  danger: colors.surface,
  neutral: colors.text,
};

const badgeSizes = {
  small: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    fontSize: typography.caption,
  },
  medium: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: typography.bodySmall,
  },
  large: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.body,
  },
} as const;

function BadgeComponent({
  label,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  ...props
}: BadgeProps) {
  const badgeSize = badgeSizes[size];

  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          backgroundColor: badgeBackgrounds[variant],
          borderRadius: radius.pill,
          paddingVertical: badgeSize.paddingVertical,
          paddingHorizontal: badgeSize.paddingHorizontal,
        },
        style,
      ]}
    >
      <Text
        style={[
          {
            color: badgeTextColors[variant],
            fontSize: badgeSize.fontSize,
            fontWeight: '600',
          },
          textStyle,
        ]}
        {...props}
      >
        {label}
      </Text>
    </View>
  );
}

export const Badge = React.memo(BadgeComponent);
