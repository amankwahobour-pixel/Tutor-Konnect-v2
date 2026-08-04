import { StyleSheet } from 'react-native';
import { radius, spacing, type ColorPalette } from '@/theme';

export const styles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  waves: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 420,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    zIndex: 2,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  eyebrow: {
    color: colors.primary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  title: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  badge: {
    marginLeft: spacing.sm,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  field: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 52,
    fontSize: 16,
    color: colors.text,
  },
  iconButton: {
    marginLeft: spacing.xs,
    padding: spacing.sm,
  },
  helperText: {
    marginTop: spacing.xs,
    color: colors.textTertiary,
  },
  helperSuccess: {
    color: colors.success,
  },
  helperError: {
    marginTop: spacing.xs,
    color: colors.danger,
  },
  button: {
    marginTop: spacing.sm,
    borderRadius: radius.lg,
  },
  secondaryButton: {
    marginTop: spacing.md,
    borderRadius: radius.lg,
  },
});
