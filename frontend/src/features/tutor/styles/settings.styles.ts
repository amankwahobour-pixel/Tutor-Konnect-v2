import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: spacing.xl,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  body: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.md,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.surface,
  },
  profileInfo: {
    flex: 1,
  },
  email: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.md,
  },
  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingTitle: {
    color: colors.text,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  logoutText: {
    color: colors.surface,
    marginLeft: spacing.sm,
    fontWeight: '700',
  },
});
