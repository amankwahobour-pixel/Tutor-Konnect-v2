import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { spacing } from '@/theme';

export interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

const FormSectionComponent = ({ title, subtitle, children, style, contentStyle }: FormSectionProps) => (
  <View style={[{ marginBottom: spacing.xl }, style]}>
    <AppText variant="h3" color="text" style={{ marginBottom: spacing.xs }}>
      {title}
    </AppText>
    {subtitle ? <AppText variant="bodySmall" color="textSecondary" style={{ marginBottom: spacing.md }}>{subtitle}</AppText> : null}
    <View style={contentStyle}>{children}</View>
  </View>
);

export const FormSection = React.memo(FormSectionComponent);
FormSection.displayName = 'FormSection';
