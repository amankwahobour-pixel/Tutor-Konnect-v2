import React from 'react';
import { ActivityIndicator, Pressable, Text, type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

export interface SecondaryButtonProps extends PressableProps {
  title: string;
  loading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const SecondaryButtonComponent = React.forwardRef<React.ElementRef<typeof Pressable>, SecondaryButtonProps>(
  function SecondaryButtonComponent(
    {
      title,
      loading = false,
      disabled = false,
      style,
      containerStyle,
      textStyle,
      accessibilityLabel,
      ...props
    }: SecondaryButtonProps,
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
              backgroundColor: colors.surface,
              borderWidth: 1.5,
              borderColor: isDisabled ? colors.disabled : pressed ? colors.primary : colors.border,
              borderRadius: radius.lg,
              paddingVertical: spacing.sm + 2,
              paddingHorizontal: spacing.lg,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
              flexDirection: 'row',
            },
            containerStyle,
            resolvedStyle,
          ] as StyleProp<ViewStyle>;
        }}
        {...props}
      >
        {loading && <ActivityIndicator color={colors.primary} size="small" style={{ marginRight: spacing.sm }} />}
        <Text style={[{ color: isDisabled ? colors.textTertiary : colors.text, fontSize: typography.title, fontWeight: typography.weight.bold, lineHeight: typography.lineHeight.title }, textStyle]}>
          {title}
        </Text>
      </Pressable>
    );
  },
);

export const SecondaryButton = React.memo(SecondaryButtonComponent);
SecondaryButton.displayName = 'SecondaryButton';
