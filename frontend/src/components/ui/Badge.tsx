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
  primary: colors.primaryLight,
  secondary: colors.secondaryLight,
  success: colors.successLight,
  warning: colors.warningLight,
  danger: colors.dangerLight,
  neutral: colors.surfaceVariant,
};

const badgeTextColors: Record<NonNullable<BadgeProps['variant']>, string> = {
  primary: colors.primaryDark,
  secondary: colors.secondaryDark,
  success: colors.success,
  warning: '#B45309',
  danger: colors.danger,
  neutral: colors.textSecondary,
};

const badgeSizes = {
  small: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    fontSize: typography.caption,
  },
  medium: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    fontSize: typography.bodySmall,
  },
  large: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
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
            fontWeight: typography.weight.semibold,
            lineHeight: badgeSize.fontSize * 1.3,
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
