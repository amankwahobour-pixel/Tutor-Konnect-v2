import { StyleSheet } from 'react-native';
import { spacing, type ColorPalette } from '@/theme';

export function createProfileStyles(colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    subtitle: {
      marginTop: spacing.xs,
      color: colors.textSecondary,
    },
    heroCard: {
      borderRadius: 24,
      marginBottom: spacing.md,
    },
    heroGradient: {
      borderRadius: 24,
      padding: spacing.lg,
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      marginBottom: spacing.md,
    },
    userName: {
      marginTop: spacing.sm,
    },
    badge: {
      marginTop: spacing.sm,
    },
    summaryRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    summaryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 999,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    detailsRow: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: spacing.lg,
    },
    detailItem: {
      marginBottom: spacing.md,
    },
    detailLabel: {
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    detailValue: {
      color: colors.text,
      fontWeight: '600',
    },
    actionsCard: {
      borderRadius: 24,
    },
    actionRow: {
      marginTop: spacing.md,
      flexDirection: 'row',
      gap: spacing.sm,
    },
    actionButton: {
      flex: 1,
    },
    themeSection: {
      marginBottom: spacing.md,
    },
    themeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    themeOptions: {
      flexDirection: 'row',
      gap: spacing.xs,
    },
    themeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs + 2,
      borderRadius: 20,
      borderWidth: 1.5,
    },
    themeOptionActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    themeOptionInactive: {
      backgroundColor: colors.transparent,
      borderColor: colors.border,
    },
  });
}
