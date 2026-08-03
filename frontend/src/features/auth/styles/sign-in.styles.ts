import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/theme';

export const styles = StyleSheet.create({
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.lg,
    overflow: 'hidden',
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.md,
  },
  toggleButtonActive: {
    backgroundColor: colors.surface,
  },
  toggleText: {
    color: colors.textTertiary,
  },
  toggleTextActive: {
    color: colors.text,
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
  prefix: {
    color: colors.text,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    minHeight: 52,
    fontSize: 16,
    color: colors.text,
  },
  iconButton: {
    marginLeft: spacing.xs,
    backgroundColor: colors.surfaceVariant,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rememberText: {
    color: colors.textSecondary,
  },
  button: {
    marginTop: spacing.sm,
    borderRadius: radius.lg,
  },
  linksRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
  },
  devButton: {
    marginTop: spacing.md,
    borderRadius: radius.lg,
  },
  infoText: {
    textAlign: 'center',
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
});
