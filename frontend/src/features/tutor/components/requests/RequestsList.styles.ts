import { StyleSheet } from 'react-native';
import { spacing, type ColorPalette } from '@/theme';

export const styles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    paddingBottom: spacing.xxl,
  },
  separator: {
    height: spacing.md,
  },
  bottomSpacing: {
    height: spacing.xxl,
  },
});

export default styles;