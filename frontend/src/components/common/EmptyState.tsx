import { ReactNode } from 'react';
import { View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { colors, spacing } from '@/theme';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <View
      style={{ width: '100%', padding: spacing.xl, alignItems: 'center', justifyContent: 'center' }}
      accessibilityLabel={title}
      accessibilityRole="text"
    >
      {icon ? <View style={{ marginBottom: spacing.md }}>{icon}</View> : null}
      <AppText variant="title" style={{ textAlign: 'center', marginBottom: spacing.xs }}>{title}</AppText>
      {subtitle ? (
        <AppText variant="body" color="textSecondary" style={{ textAlign: 'center', lineHeight: 24 }}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}
