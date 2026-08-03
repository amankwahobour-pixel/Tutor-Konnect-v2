import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    color: colors.text,
    fontSize: 16,
  },
});

export default styles;
