import { StyleSheet } from 'react-native';

import {
  colors,
  spacing,
  radii,
  shadows,
  typography,
  tints,
} from '../../theme';

export default StyleSheet.create({
  container: {
    marginHorizontal: spacing['2xl'],
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  card: {
    flex: 1,
    marginHorizontal: spacing.xs,
    backgroundColor: colors.neutral[0],
    borderRadius: radii.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  blueBackground: { backgroundColor: tints.primary },
  orangeBackground: { backgroundColor: tints.orange },
  yellowBackground: { backgroundColor: tints.warning },

  value: {
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.bold,
    color: colors.neutral[900],
    textAlign: 'center',
  },

  label: {
    marginTop: spacing.xs,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.neutral[500],
    textAlign: 'center',
  },
});
