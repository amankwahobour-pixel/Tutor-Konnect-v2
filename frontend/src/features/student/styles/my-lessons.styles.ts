import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  summaryCard: {
    borderRadius: radius.xl,
    marginBottom: spacing.lg,
  },
  summaryGradient: {
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  containerHeader: {
    zIndex: 10,
  },
  bodyHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  listSeparator: {
    height: spacing.lg,
  },
  emptyBlock: {
    minHeight: 220,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  summaryTitle: {
    marginTop: spacing.xs,
  },
  summaryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  summaryItem: {
    flexGrow: 1,
    minWidth: 96,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryValue: {
    color: colors.text,
    marginBottom: 2,
  },
  sectionBlock: {
    marginBottom: spacing.lg,
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  lessonCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
  },
  queuedCard: {
    marginBottom: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceVariant,
  },
  lessonCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  lessonIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lessonTitle: {
    color: colors.text,
    fontWeight: '700',
  },
  lessonTutor: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  lessonMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  lessonMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lessonMetaText: {
    color: colors.textSecondary,
  },
  lessonDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  lessonDetailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  lessonDetailText: {
    color: colors.textSecondary,
  },
  inlineActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  inlineActionButton: {
    flexGrow: 1,
    minWidth: 100,
  },
  inlineAction: {
    minWidth: 112,
  },
  syncButton: {
    marginTop: spacing.sm,
  },
  bottomAction: {
    marginTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
