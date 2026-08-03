import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: spacing.xl,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  body: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.md,
  },
  cardSection: {
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSubtext: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayText: {
    color: colors.text,
    fontWeight: '600',
  },
  timeText: {
    color: colors.textSecondary,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  optionIconActive: {
    backgroundColor: colors.surface,
  },
  optionText: {
    color: colors.text,
    fontWeight: '600',
  },
  selectedText: {
    color: colors.primary,
  },
  saveButton: {
    marginTop: spacing.sm,
  },
  spacer: {
    height: spacing.lg,
  },
});
