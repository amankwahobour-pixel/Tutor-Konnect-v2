import { StyleSheet } from 'react-native';

import {
  colors,
  spacing,
  radii,
  shadows,
  typography,
} from '../../theme';

export default StyleSheet.create({
  card: {
    marginHorizontal: spacing['2xl'],
    marginTop: -110,
    backgroundColor: colors.neutral[0],
    borderRadius: radii['2xl'],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    ...shadows.lg,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.primary[100],
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
  },

  profileInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },

  name: {
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.bold,
    color: colors.neutral[900],
  },

  subjects: {
    marginTop: spacing.xs,
    fontSize: typography.sizes.body,
    color: colors.neutral[500],
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rating: {
    marginLeft: spacing.xs,
    fontSize: typography.sizes.h3,
    fontWeight: typography.weights.bold,
    color: colors.neutral[900],
  },

  ratingCount: {
    marginLeft: spacing.xs,
    fontSize: typography.sizes.caption,
    color: colors.neutral[500],
  },

  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
    backgroundColor: colors.success[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
  },

  verifiedText: {
    marginLeft: spacing.xs,
    fontSize: typography.sizes.micro,
    fontWeight: typography.weights.semibold,
    color: colors.success[600],
  },

  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.neutral[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
    ...shadows.xs,
  },
});
