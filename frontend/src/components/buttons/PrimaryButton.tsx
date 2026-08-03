import React from 'react';
import { ActivityIndicator, Pressable, Text, View, type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

export interface PrimaryButtonProps extends PressableProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
}

const PrimaryButtonComponent = React.forwardRef<React.ElementRef<typeof Pressable>, PrimaryButtonProps>(
  function PrimaryButtonComponent(
    {
      title,
      leftIcon,
      rightIcon,
      loading = false,
      disabled = false,
      style,
      containerStyle,
      textStyle,
      iconContainerStyle,
      accessibilityLabel,
      ...props
    }: PrimaryButtonProps,
    ref,
  ) {
    const isDisabled = disabled || loading;

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ disabled: isDisabled }}
        disabled={isDisabled}
        style={(state) => {
          const pressed = state.pressed;
          const resolvedStyle = typeof style === 'function' ? style(state) : style;

          return [
            {
              minHeight: spacing.xxxl,
              backgroundColor: isDisabled ? colors.disabled : colors.primary,
              borderRadius: radius.lg,
              paddingVertical: spacing.sm + 2,
              paddingHorizontal: spacing.lg,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
            containerStyle,
            resolvedStyle,
          ] as StyleProp<ViewStyle>;
        }}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={colors.surface} size="small" style={{ marginRight: spacing.sm }} />
        ) : (
          leftIcon && <View style={[{ marginRight: spacing.sm }, iconContainerStyle]}>{leftIcon}</View>
        )}

        <Text style={[{ color: colors.surface, fontSize: typography.title, fontWeight: typography.weight.bold, lineHeight: typography.lineHeight.title }, textStyle]}>
          {title}
        </Text>

        {!loading && rightIcon ? (
          <View style={[{ marginLeft: spacing.sm }, iconContainerStyle]}>{rightIcon}</View>
        ) : null}
      </Pressable>
    );
  },
);

export const PrimaryButton = React.memo(PrimaryButtonComponent);
PrimaryButton.displayName = 'PrimaryButton';
