import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.heading2,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 16,
  },
  label: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E6EEF8',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
});
