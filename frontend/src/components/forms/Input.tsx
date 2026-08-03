import React from 'react';
import { ActivityIndicator, Pressable, TextInput, View, type KeyboardTypeOptions, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { HelperText } from './HelperText';

export interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  required?: boolean;
  clearable?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ViewStyle>;
}

const iconPadding = spacing.sm;

export const Input = React.memo(
  React.forwardRef<TextInput, InputProps>(
    (
      {
        label,
        helperText,
        error,
        success,
        leftIcon,
        rightIcon,
        loading = false,
        required = false,
        clearable = false,
        keyboardType = 'default',
        secureTextEntry = false,
        editable = true,
        placeholderTextColor = colors.placeholder,
        style,
        containerStyle,
        inputStyle,
        iconStyle,
        value,
        onChangeText,
        onEndEditing,
        onFocus,
        onBlur,
        ...props
      },
      ref,
    ) => {
      const [isFocused, setIsFocused] = React.useState(false);
      const showClear = clearable && !!value && editable && !loading;
      const statusColor = error ? colors.danger : success ? colors.success : isFocused ? colors.primary : colors.border;

      const inputPaddingLeft = leftIcon ? iconPadding * 2 + spacing.sm : spacing.md;
      const inputPaddingRight = rightIcon || loading || showClear ? iconPadding * 2 + spacing.sm : spacing.md;

      const inputContainerStyle: StyleProp<ViewStyle> = [
        {
          backgroundColor: isFocused ? colors.primarySofter : colors.surface,
          borderRadius: radius.lg,
          borderWidth: 1.5,
          borderColor: statusColor,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.sm,
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: spacing.xxxl,
        },
        containerStyle,
      ];

      const textInputStyle: StyleProp<TextStyle> = [
        {
          flex: 1,
          color: colors.text,
          fontSize: typography.body,
          lineHeight: typography.lineHeight.body,
          paddingLeft: inputPaddingLeft,
          paddingRight: inputPaddingRight,
          paddingVertical: spacing.xs,
        },
        inputStyle,
      ];

      const helperContent = error || success || helperText;
      const helperVariant = error ? 'error' : success ? 'success' : 'info';

      const handleFocus = React.useCallback((e: any) => {
        setIsFocused(true);
        onFocus?.(e);
      }, [onFocus]);

      const handleBlur = React.useCallback((e: any) => {
        setIsFocused(false);
        onBlur?.(e);
      }, [onBlur]);

      return (
        <View style={{ width: '100%' }}>
          {label ? (
            <AppText variant="bodySmall" color="textSecondary" style={{ marginBottom: spacing.xs }}>
              {label}
              {required ? <AppText variant="bodySmall" color="danger">*</AppText> : null}
            </AppText>
          ) : null}
          <View style={inputContainerStyle}>
            {leftIcon ? <View style={[{ marginRight: spacing.sm }, iconStyle]}>{leftIcon}</View> : null}
            <TextInput
              ref={ref}
              style={textInputStyle}
              keyboardType={keyboardType as KeyboardTypeOptions}
              secureTextEntry={secureTextEntry}
              editable={editable && !loading}
              placeholderTextColor={placeholderTextColor}
              onChangeText={onChangeText}
              onEndEditing={onEndEditing}
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={value}
              accessibilityLabel={label ?? props.placeholder}
              accessibilityState={{ disabled: !editable || loading }}
              {...props}
            />
            {loading ? (
              <ActivityIndicator color={colors.primary} style={[{ marginLeft: spacing.sm }, iconStyle]} />
            ) : showClear ? (
              <Pressable onPress={() => onChangeText?.('')} style={[{ marginLeft: spacing.sm }, iconStyle]} accessibilityLabel="Clear text">
                {rightIcon ?? <AppText variant="body" color="textSecondary">✕</AppText>}
              </Pressable>
            ) : rightIcon ? (
              <View style={[{ marginLeft: spacing.sm }, iconStyle]}>{rightIcon}</View>
            ) : null}
          </View>
          {helperContent ? <HelperText variant={helperVariant} text={helperContent} /> : null}
        </View>
      );
    },
  ),
);
