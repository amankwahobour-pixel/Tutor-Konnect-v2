import { StyleSheet } from 'react-native';
import { spacing, type ColorPalette } from '@/theme';

export const styles = (colors: ColorPalette) => StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  background: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.primary,
  },
  wave: {
    position: 'absolute',
    bottom: -30,
    left: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  waveAccent: {
    position: 'absolute',
    bottom: -60,
    right: -20,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.surface,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    marginTop: spacing.xs,
  },
  rightSlot: {
    marginLeft: spacing.sm,
  },
});

export default styles;
