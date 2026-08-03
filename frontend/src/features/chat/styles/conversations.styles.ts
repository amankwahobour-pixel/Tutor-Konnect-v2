import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
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
  card: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarWrap: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.primaryLight,
  },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  meta: {
    flex: 1,
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  bottomSpacing: {
    height: spacing.xxl,
  },
});

export default styles;