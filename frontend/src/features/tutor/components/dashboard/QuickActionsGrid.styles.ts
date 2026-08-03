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
    marginTop: spacing['3xl'],
    marginBottom: spacing['4xl'],
  },

  title: {
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold,
    color: colors.neutral[900],
  },

  subtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.xl + 2,
    fontSize: typography.sizes.caption,
    color: colors.neutral[400],
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    backgroundColor: colors.neutral[0],
    borderRadius: radii['2xl'],
    paddingHorizontal: spacing.lg + 2,
    paddingVertical: spacing.xl + 2,
    marginBottom: spacing.lg,
    ...shadows.md,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: radii.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg + 2,
  },

  blueBackground: { backgroundColor: tints.primary },
  greenBackground: { backgroundColor: tints.success },
  orangeBackground: { backgroundColor: tints.orange },
  yellowBackground: { backgroundColor: tints.warning },

  cardTitle: {
    fontSize: typography.sizes.h3,
    fontWeight: typography.weights.bold,
    color: colors.neutral[900],
  },

  cardSubtitle: {
    marginTop: spacing.xs + 2,
    fontSize: typography.sizes.caption,
    lineHeight: 18,
    color: colors.neutral[500],
  },
});
