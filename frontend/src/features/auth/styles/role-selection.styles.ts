import { StyleSheet } from 'react-native';
import { radius, spacing, type ColorPalette } from '@/theme';

export const styles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  logo: {
    position: 'absolute',
    top: 60,
    left: 24,
    width: 110,
    height: 40,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    zIndex: 2,
  },
  label: {
    color: colors.primary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  card: {
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: radius.lg,
  },
  devCard: {
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  devTitle: {
    color: colors.text,
    marginBottom: spacing.sm,
  },
  devRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  devButton: {
    flex: 1,
    borderRadius: radius.lg,
  },
  waves: {
    position: 'absolute',
    bottom: -40,
    width: '100%',
    height: 500,
  },
});
