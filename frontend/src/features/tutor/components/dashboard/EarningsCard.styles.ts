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
  card: {
    marginHorizontal: spacing['2xl'],
    marginTop: spacing['3xl'],
    padding: spacing.xl + 2,
    backgroundColor: colors.neutral[0],
    borderRadius: radii['2xl'],
    ...shadows.lg,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing['2xl'],
  },

  title: {
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold,
    color: colors.neutral[900],
  },

  subtitle: {
    marginTop: spacing.xs,
    fontSize: typography.sizes.caption,
    color: colors.neutral[400],
  },

  viewAll: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.primary[500],
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  stat: {
    flex: 1,
    alignItems: 'center',
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  blueBackground: { backgroundColor: tints.primary },
  greenBackground: { backgroundColor: tints.success },
  orangeBackground: { backgroundColor: tints.warning },

  amount: {
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.bold,
    color: colors.neutral[900],
    textAlign: 'center',
  },

  label: {
    marginTop: spacing.xs + 2,
    fontSize: typography.sizes.caption,
    color: colors.neutral[500],
    textAlign: 'center',
  },
});
