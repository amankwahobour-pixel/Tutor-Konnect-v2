import { ReactNode } from 'react';
import { View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { PrimaryButton } from '@/components/buttons';
import { colors, spacing } from '@/theme';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, message, actionLabel, onAction }: EmptyStateProps) {
  const desc = message ?? subtitle;
  return (
    <View
      style={{ width: '100%', padding: spacing.xl, alignItems: 'center', justifyContent: 'center' }}
      accessibilityLabel={title}
      accessibilityRole="text"
    >
      {icon ? <View style={{ marginBottom: spacing.md }}>{icon}</View> : null}
      <AppText variant="title" style={{ textAlign: 'center', marginBottom: spacing.xs }}>{title}</AppText>
      {desc ? (
        <AppText variant="body" color="textSecondary" style={{ textAlign: 'center', lineHeight: 24 }}>
          {desc}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <View style={{ marginTop: spacing.lg, width: '100%' }}>
          <PrimaryButton title={actionLabel} onPress={onAction} containerStyle={{ width: '100%' }} />
        </View>
      ) : null}
    </View>
  );
}
