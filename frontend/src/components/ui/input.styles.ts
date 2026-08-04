import { StyleSheet } from 'react-native';
import { spacing, type ColorPalette } from '@/theme';

export function createInputStyles(colors: ColorPalette) {
  return StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.surface,
      color: colors.text,
      fontSize: 16,
    },
  });
}
