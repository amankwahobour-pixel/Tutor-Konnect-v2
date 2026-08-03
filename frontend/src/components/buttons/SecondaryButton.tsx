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
        disabled={isDisabled}
        style={(state) => {
          const pressed = state.pressed || isDisabled;
          const resolvedStyle = typeof style === 'function' ? style(state) : style;

          return [
            {
              minHeight: spacing.xxxl,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: isDisabled ? colors.disabled : colors.border,
              borderRadius: radius.md,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.lg,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
              flexDirection: 'row',
            },
            containerStyle,
            resolvedStyle,
          ] as StyleProp<ViewStyle>;
        }}
        {...props}
      >
        {loading && <ActivityIndicator color={colors.primary} style={{ marginRight: spacing.sm }} />}
        <Text style={[{ color: colors.text, fontSize: typography.title, fontWeight: '700' }, textStyle]}>
          {title}
        </Text>
      </Pressable>
    );
  },
);

export const SecondaryButton = React.memo(SecondaryButtonComponent);
SecondaryButton.displayName = 'SecondaryButton';
