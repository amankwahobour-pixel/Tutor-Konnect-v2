import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 22,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});

export default styles;
