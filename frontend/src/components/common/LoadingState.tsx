import { ActivityIndicator, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { colors, spacing } from '@/theme';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg }}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      <AppText variant="body" color="textSecondary" style={{ marginTop: spacing.sm, textAlign: 'center' }}>
        {message}
      </AppText>
    </View>
  );
}
