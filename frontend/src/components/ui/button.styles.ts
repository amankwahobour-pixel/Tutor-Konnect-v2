import { StyleSheet, TextStyle } from 'react-native';
import { spacing, typography, type ColorPalette } from '@/theme';

export function createButtonStyles(colors: ColorPalette) {
  return StyleSheet.create({
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
}
