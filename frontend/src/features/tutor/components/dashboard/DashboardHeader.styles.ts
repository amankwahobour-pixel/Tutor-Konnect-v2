import { StyleSheet } from 'react-native';

import {
  colors,
  spacing,
  radii,
  shadows,
  typography,
} from '../../theme';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: colors.primary[500],
    borderBottomLeftRadius: radii['3xl'],
    borderBottomRightRadius: radii['3xl'],
    zIndex: 10,
  },

  wave: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  waveImage: {
    resizeMode: 'cover',
  },

  content: {
    position: 'relative',
    zIndex: 1,
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing['2xl'],
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    width: 152,
    height: 40,
    resizeMode: 'contain',
  },

  notificationButton: {
    width: 44,
    height: 44,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },

  notificationBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error[500],
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    borderWidth: 1.5,
    borderColor: colors.neutral[0],
  },

  badgeText: {
    color: colors.neutral[0],
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },

  greetingContainer: {
    marginTop: spacing.xl + 4,
  },

  greeting: {
    fontSize: 15,
    fontWeight: typography.weights.medium,
    color: 'rgba(255,255,255,0.85)',
  },

  name: {
    marginTop: 2,
    fontSize: 26,
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
    lineHeight: 30,
  },
});
