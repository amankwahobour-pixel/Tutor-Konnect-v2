import { StyleSheet, TextStyle } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: colors.surfaceElevated,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.heading4,
    color: colors.text,
    fontWeight: '700' as TextStyle['fontWeight'],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default styles;
