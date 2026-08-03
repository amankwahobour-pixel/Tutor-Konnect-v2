import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    zIndex: 2,
  },
  backButton: {
    position: 'absolute',
    top: 56,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  card: {
    borderRadius: radius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  eyebrow: {
    color: colors.primary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  title: {
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  otpInput: {
    width: 46,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  button: {
    width: '100%',
    borderRadius: radius.lg,
  },
  helperRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  helperText: {
    color: colors.textSecondary,
    flex: 1,
  },
  secondaryButton: {
    borderRadius: radius.lg,
  },
  successWrap: {
    alignItems: 'center',
  },
  successTitle: {
    marginTop: spacing.sm,
    color: colors.success,
  },
  successText: {
    textAlign: 'center',
    marginTop: spacing.xs,
    color: colors.textSecondary,
  },
  waves: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 420,
  },
});
