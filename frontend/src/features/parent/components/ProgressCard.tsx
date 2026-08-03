import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { colors, radius, spacing } from '@/theme';

interface ProgressCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  iconColor?: string;
  progressPercent?: number;
}

export function ProgressCard({ label, value, subtitle, icon, iconColor = colors.primary, progressPercent }: ProgressCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: `${iconColor}18` }]}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>
      <AppText variant="h3" style={styles.value}>{value}</AppText>
      <AppText variant="caption" color="textSecondary">{label}</AppText>
      {subtitle ? <AppText variant="label" color="textTertiary" style={styles.subtitle}>{subtitle}</AppText> : null}
      {progressPercent !== undefined && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.min(progressPercent, 100)}%`, backgroundColor: iconColor }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  value: {
    marginBottom: 2,
  },
  subtitle: {
    marginTop: 2,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
