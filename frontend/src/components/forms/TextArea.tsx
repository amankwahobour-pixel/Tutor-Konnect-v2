import React from 'react';
import { TextInput, View, type TextInputProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';
import { HelperText } from './HelperText';

export interface TextAreaProps extends TextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  maxLength?: number;
  showCount?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export const TextArea = React.memo(
  React.forwardRef<TextInput, TextAreaProps>(
    ({ label, helperText, error, maxLength, showCount = false, style, containerStyle, inputStyle, value, ...props }, ref) => {
      const statusColor = error ? colors.danger : colors.border;
      const textLength = typeof value === 'string' ? value.length : 0;

      const inputStyleCombined: StyleProp<TextStyle> = [
        {
          minHeight: spacing.xxl,
          color: colors.text,
          fontSize: typography.body,
          padding: spacing.md,
          textAlignVertical: 'top',
        },
        inputStyle,
      ];

      return (
        <View style={containerStyle}>
          {label ? (
            <HelperText text={label} variant="info" />
          ) : null}
          <TextInput
            ref={ref}
            multiline
            style={[
              {
                backgroundColor: colors.surface,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: statusColor,
              },
              inputStyleCombined,
              style,
            ]}
            maxLength={maxLength}
            placeholderTextColor={colors.placeholder}
            value={value}
            accessibilityLabel={label}
            {...props}
          />
          {showCount && typeof maxLength === 'number' ? (
            <HelperText text={`${textLength}/${maxLength}`} variant="info" />
          ) : null}
          {error ? <HelperText text={error} variant="error" /> : helperText ? <HelperText text={helperText} variant="info" /> : null}
        </View>
      );
    },
  ),
);
