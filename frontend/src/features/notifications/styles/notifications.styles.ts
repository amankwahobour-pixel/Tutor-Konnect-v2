import { StyleSheet } from 'react-native';
import { radius, spacing, type ColorPalette } from '@/theme';

export const styles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
  content: {
    marginTop: -spacing.md,
    paddingHorizontal: spacing.lg,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
  },
  toolbarButtonText: {
    marginLeft: spacing.xs,
    color: colors.primary,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    flex: 1,
    color: colors.text,
    fontWeight: '700',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  time: {
    marginTop: spacing.sm,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  spacer: {
    height: spacing.lg,
  },
});

export default styles;
