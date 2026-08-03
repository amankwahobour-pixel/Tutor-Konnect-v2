import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { HelperText } from './HelperText';
import { spacing } from '@/theme';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  success?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const FormFieldComponent = ({ label, required, helperText, error, success, children, style }: FormFieldProps) => (
  <View style={style}>
    {label ? (
      <AppText variant="bodySmall" color="textSecondary" style={{ marginBottom: spacing.xs }}>
        {label}
        {required ? <AppText variant="bodySmall" color="danger">*</AppText> : null}
      </AppText>
    ) : null}
    {children}
    {error ? <HelperText text={error} variant="error" /> : success ? <HelperText text={success} variant="success" /> : helperText ? <HelperText text={helperText} variant="info" /> : null}
  </View>
);

export const FormField = React.memo(FormFieldComponent);
FormField.displayName = 'FormField';
