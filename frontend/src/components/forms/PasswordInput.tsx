import React, { useState } from 'react';
import { Pressable, TextInput, View, type TextInputProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { HelperText } from './HelperText';

export interface PasswordInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  helperText?: string;
  error?: string;
  strength?: string;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export const PasswordInput = React.memo(
  React.forwardRef<TextInput, PasswordInputProps>((
    { label, helperText, error, strength, leftIcon, style, inputStyle, secureTextEntry = true, ...props },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const isSecure = secureTextEntry && !visible;
    const statusColor = error ? colors.danger : colors.border;

    return (
      <View style={style}>
        {label ? <AppText variant="bodySmall" color="textSecondary" style={{ marginBottom: spacing.xs }}>{label}</AppText> : null}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: statusColor,
            paddingHorizontal: spacing.sm,
          }}
        >
          {leftIcon ? <View style={{ marginRight: spacing.sm }}>{leftIcon}</View> : null}
          <TextInput
            ref={ref}
            style={[
              {
                flex: 1,
                color: colors.text,
                fontSize: typography.body,
                minHeight: spacing.xxxl,
              },
              inputStyle,
            ]}
            secureTextEntry={isSecure}
            placeholderTextColor={colors.placeholder}
            accessibilityLabel={label ?? 'Password'}
            {...props}
          />
          <Pressable onPress={() => setVisible((prev) => !prev)} accessibilityLabel={visible ? 'Hide password' : 'Show password'}>
            <AppText variant="body" color="primary">{visible ? 'Hide' : 'Show'}</AppText>
          </Pressable>
        </View>
        {strength ? <HelperText text={strength} variant="info" /> : null}
        {error ? <HelperText text={error} variant="error" /> : helperText ? <HelperText text={helperText} variant="info" /> : null}
      </View>
    );
  }),
);
