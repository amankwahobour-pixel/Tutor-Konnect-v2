import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: typography.body,
    fontWeight: '700',
  },
});

export default styles;
