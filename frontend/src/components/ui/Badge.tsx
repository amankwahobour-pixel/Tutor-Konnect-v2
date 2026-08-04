import React from 'react';
import { Text, View, type TextProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useColors, radius, spacing, typography, type ColorPalette } from '@/theme';

export interface BadgeProps extends Omit<TextProps, 'style'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

function getBadgeBackgrounds(colors: ColorPalette): Record<NonNullable<BadgeProps['variant']>, string> {
  return {
    primary: colors.primaryLight,
    secondary: colors.secondaryLight,
    success: colors.successLight,
    warning: colors.warningLight,
    danger: colors.dangerLight,
    neutral: colors.surfaceVariant,
  };
}

function getBadgeTextColors(colors: ColorPalette): Record<NonNullable<BadgeProps['variant']>, string> {
  return {
    primary: colors.primaryDark,
    secondary: colors.secondaryDark,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    neutral: colors.textSecondary,
  };
}

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
  const colors = useColors();
  const badgeSize = badgeSizes[size];
  const bg = getBadgeBackgrounds(colors)[variant];
  const textColor = getBadgeTextColors(colors)[variant];

  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          backgroundColor: bg,
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
            color: textColor,
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
