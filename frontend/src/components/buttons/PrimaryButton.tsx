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
        disabled={isDisabled}
        style={(state) => {
          const pressed = state.pressed || isDisabled;
          const resolvedStyle = typeof style === 'function' ? style(state) : style;

          return [
            {
              minHeight: spacing.xxxl,
              backgroundColor: isDisabled ? colors.disabled : colors.primary,
              borderRadius: radius.md,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.lg,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              opacity: pressed ? 0.8 : 1,
            },
            containerStyle,
            resolvedStyle,
          ] as StyleProp<ViewStyle>;
        }}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={colors.surface} style={{ marginRight: spacing.sm }} />
        ) : (
          leftIcon && <View style={[{ marginRight: spacing.sm }, iconContainerStyle]}>{leftIcon}</View>
        )}

        <Text style={[{ color: colors.surface, fontSize: typography.title, fontWeight: '700' }, textStyle]}>
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
