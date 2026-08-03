import { StyleSheet, TextStyle } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.heading4,
    fontWeight: '700' as TextStyle['fontWeight'],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default styles;
