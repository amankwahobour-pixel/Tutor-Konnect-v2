import React from 'react';
import { TextInput, type TextInputProps, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import styles from './input.styles';
import { colors } from '@/theme';

export interface InputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export function Input({ style, inputStyle, placeholderTextColor = colors.placeholder, ...props }: InputProps) {
  return <TextInput style={[styles.input, style, inputStyle]} placeholderTextColor={placeholderTextColor} {...props} />;
}

