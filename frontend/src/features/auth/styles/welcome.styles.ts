import { StyleSheet } from 'react-native';
import { radius, spacing, type ColorPalette } from '@/theme';

export const styles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  wavesContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 420,
  },
  waves: {
    width: '100%',
    height: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    zIndex: 2,
  },
  eyebrow: {
    color: colors.primary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  skipButton: {
    minWidth: 90,
    borderRadius: radius.full,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  image: {
    width: '84%',
    height: 300,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  pagination: {
    position: 'absolute',
    bottom: 170,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 28,
    backgroundColor: colors.primary,
  },
  actionsRow: {
    position: 'absolute',
    bottom: 90,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 2,
  },
  button: {
    borderRadius: radius.lg,
    width: '100%',
  },
});
