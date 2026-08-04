import { StyleSheet } from 'react-native';
import { radius, spacing, type ColorPalette } from '@/theme';

export const styles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl * 2,
  },
  searchSection: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  searchBar: {
    marginBottom: spacing.xs,
  },
  searchInput: {
    fontSize: 15,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  separator: {
    height: spacing.md,
  },
  bottomSpacing: {
    height: spacing.xxl,
  },
});
