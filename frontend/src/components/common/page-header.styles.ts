import { StyleSheet, TextStyle } from 'react-native';
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textBlock: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: typography.heading3,
    fontWeight: '700' as TextStyle['fontWeight'],
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
  },
  actionLabel: {
    color: colors.primary,
    fontSize: typography.bodySmall,
    fontWeight: '700' as TextStyle['fontWeight'],
    marginLeft: 8,
  },
});

export default styles;
