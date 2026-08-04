import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { useColors, radius, spacing, type ColorPalette } from '@/theme';

interface StatCardProps {
  icon: string;
  iconColor?: string;
  label: string;
  value: string | number;
  subtitle?: string;
  progressPercent?: number;
  style?: StyleProp<ViewStyle>;
}

export function StatCard({
  icon,
  iconColor,
  label,
  value,
  subtitle,
  progressPercent,
  style,
}: StatCardProps) {
  const colors = useColors();
  const styles = getStyles(colors);
  const accent = iconColor ?? colors.primary;

  return (
    <View style={[styles.card, style]}>
      <View style={[styles.iconCircle, { backgroundColor: `${accent}18` }]}>
        <Ionicons name={icon as any} size={18} color={accent} />
      </View>
      <AppText variant="h3" style={styles.value}>
        {value}
      </AppText>
      <AppText variant="caption" color="textSecondary">
        {label}
      </AppText>
      {subtitle && (
        <AppText variant="label" color="textTertiary" style={styles.subtitle}>
          {subtitle}
        </AppText>
      )}
      {progressPercent !== undefined && (
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(progressPercent, 100)}%`, backgroundColor: accent },
            ]}
          />
        </View>
      )}
    </View>
  );
}

function getStyles(colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: colors.surfaceElevated,
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
}
