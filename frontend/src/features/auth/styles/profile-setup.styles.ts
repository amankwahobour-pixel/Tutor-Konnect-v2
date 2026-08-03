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
    zIndex: 2,
  },
  card: {
    borderRadius: radius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
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
  },
  subtitle: {
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  field: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: spacing.sm,
    borderRadius: radius.lg,
  },
});
