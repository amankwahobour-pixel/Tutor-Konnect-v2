import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  message: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: 'center',
  },
});

export default styles;
