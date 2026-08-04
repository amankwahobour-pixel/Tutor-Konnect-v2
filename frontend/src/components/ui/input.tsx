import React from 'react';
import { TextInput, type TextInputProps, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import { useColors, useThemedStyles } from '@/theme';
import { createInputStyles } from './input.styles';

export interface InputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export function Input({ style, inputStyle, placeholderTextColor, ...props }: InputProps) {
  const colors = useColors();
  const styles = useThemedStyles(createInputStyles);
  return (
    <TextInput
      style={[styles.input, style, inputStyle]}
      placeholderTextColor={placeholderTextColor ?? colors.placeholder}
      {...props}
    />
  );
}
