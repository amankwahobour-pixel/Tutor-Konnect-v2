import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/theme';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
  },
  card: {
    width: '88%',
    maxWidth: 420,
    alignItems: 'center',
    borderRadius: radius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  logo: {
    width: 120,
    height: 44,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginHorizontal: 8,
  },
});

export default styles;
