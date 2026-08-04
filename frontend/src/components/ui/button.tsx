import React from 'react';
import { Pressable, Text, type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useColors, useThemedStyles } from '@/theme';
import { createButtonStyles } from './button.styles';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps extends PressableProps {
  title: string;
  variant?: ButtonVariant;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title,
  variant = 'primary',
  style,
  containerStyle,
  textStyle,
  disabled,
  ...props
}: ButtonProps) {
  const colors = useColors();
  const styles = useThemedStyles(createButtonStyles);
  const backgroundColor =
    variant === 'secondary' ? colors.surface : variant === 'danger' ? colors.error : colors.primary;
  const textColor = variant === 'secondary' ? colors.text : colors.white;

  return (
    <Pressable
      style={(state) => {
        const s: StyleProp<ViewStyle>[] = [styles.button, { backgroundColor, opacity: state.pressed || disabled ? 0.8 : 1 }];
        if (containerStyle) s.push(containerStyle);

        const resolved = typeof style === 'function' ? (style as (s: { pressed: boolean }) => StyleProp<ViewStyle>)(state) : style;
        if (resolved) s.push(resolved as StyleProp<ViewStyle>);

        return s as StyleProp<ViewStyle>;
      }}
      disabled={disabled}
      {...props}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
    </Pressable>
  );
}
