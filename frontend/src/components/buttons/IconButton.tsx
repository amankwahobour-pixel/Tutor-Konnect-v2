import React from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/theme';

export type IconButtonSize = 'sm' | 'md' | 'lg';
export type IconButtonVariant = 'circle' | 'square';

export interface IconButtonProps extends PressableProps {
  icon: React.ReactNode;
  size?: IconButtonSize | number;
  variant?: IconButtonVariant;
  containerStyle?: StyleProp<ViewStyle>;
}

const sizeMap: Record<IconButtonSize, number> = {
  sm: spacing.xl,
  md: spacing.xxl,
  lg: spacing.xxxl,
};

const IconButtonComponent = React.forwardRef<React.ElementRef<typeof Pressable>, IconButtonProps>(
  function IconButtonComponent(
    { icon, size = 'md', variant = 'circle', style, containerStyle, disabled, accessibilityLabel, ...props }: IconButtonProps,
    ref,
  ) {
    const buttonSize = typeof size === 'number' ? size : sizeMap[size];
    const borderRadius = variant === 'circle' ? buttonSize / 2 : radius.md;

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        disabled={disabled}
        style={(state) => {
          const pressed = state.pressed || disabled;
          const resolvedStyle = typeof style === 'function' ? style(state) : style;

          return [
            {
              width: buttonSize,
              height: buttonSize,
              borderRadius,
              backgroundColor: colors.surface,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: pressed ? 0.8 : 1,
            },
            containerStyle,
            resolvedStyle,
          ] as StyleProp<ViewStyle>;
        }}
        {...props}
      >
        {icon}
      </Pressable>
    );
  },
);

export const IconButton = React.memo(IconButtonComponent);
IconButton.displayName = 'IconButton';
