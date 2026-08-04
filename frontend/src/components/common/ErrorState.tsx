import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { PrimaryButton } from '@/components/buttons';
import { useColors, spacing } from '@/theme';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry, retryLabel = 'Try Again' }: ErrorStateProps) {
  const colors = useColors();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
      <View style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.dangerLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
      }}>
        <Ionicons name="alert-circle-outline" size={32} color={colors.danger} />
      </View>
      <AppText variant="title" style={{ textAlign: 'center', marginBottom: spacing.xs }}>{title}</AppText>
      {message ? (
        <AppText variant="body" color="textTertiary" style={{ textAlign: 'center', lineHeight: 24 }}>
          {message}
        </AppText>
      ) : null}
      {onRetry ? (
        <PrimaryButton title={retryLabel} onPress={onRetry} containerStyle={{ marginTop: spacing.lg }} />
      ) : null}
    </View>
  );
}
