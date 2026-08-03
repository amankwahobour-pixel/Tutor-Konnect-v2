import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/theme';

export default StyleSheet.create({
  cardWrapper: {
    width: '100%',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  avatar: {
    backgroundColor: colors.primaryLight,
  },
  info: {
    flex: 1,
    gap: spacing.sm,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  studentName: {
    flex: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  subjectPill: {
    backgroundColor: colors.primaryLight,
  },
  levelPill: {
    backgroundColor: colors.surfaceVariant,
  },
  pillText: {
    color: colors.primaryDark,
  },
  levelText: {
    color: colors.secondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  metaText: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});