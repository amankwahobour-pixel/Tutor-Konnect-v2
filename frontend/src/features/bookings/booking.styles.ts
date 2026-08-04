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
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  heroCard: {
    borderRadius: radius.xl,
    marginBottom: spacing.md,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  heroSubtitle: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  heroProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroMessage: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  infoCard: {
    borderRadius: radius.xl,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  infoText: {
    color: colors.textSecondary,
  },
  paymentCard: {
    borderRadius: radius.xl,
    marginBottom: spacing.md,
  },
  actionSection: {
    marginTop: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});

export default styles;
