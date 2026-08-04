import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { colors, radius, spacing } from '@/theme';

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  headerRight?: React.ReactNode;
  noPadding?: boolean;
}

export function SectionCard({ title, subtitle, children, style, headerRight, noPadding }: SectionCardProps) {
  return (
    <View style={[styles.container, style]}>
      {(title || headerRight) && (
        <View style={styles.header}>
          <View style={styles.headerText}>
            {title && <AppText variant="subtitle">{title}</AppText>}
            {subtitle && (
              <AppText variant="caption" color="textSecondary">
                {subtitle}
              </AppText>
            )}
          </View>
          {headerRight}
        </View>
      )}
      <View style={noPadding ? styles.noPadding : styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  body: {
    padding: spacing.md,
  },
  noPadding: {},
});
