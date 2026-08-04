import { StyleSheet } from 'react-native';
import { spacing, type ColorPalette } from '@/theme';

export function createCardStyles(colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: 22,
      padding: spacing.md,
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
  });
}
