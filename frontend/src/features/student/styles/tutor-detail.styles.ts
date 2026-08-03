import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    marginRight: spacing.sm,
  },
  title: {
    flex: 1,
    color: colors.text,
  },
  heroCard: {
    borderRadius: 24,
    marginBottom: spacing.md,
  },
  heroGradient: {
    borderRadius: 24,
    padding: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  role: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
  },
  sectionText: {
    color: colors.text,
    lineHeight: 22,
  },
  statsCard: {
    borderRadius: 24,
    marginBottom: spacing.md,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 20,
    padding: spacing.md,
    alignItems: 'center',
  },
  statLabel: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
  },
  sectionCard: {
    borderRadius: 24,
    marginBottom: spacing.md,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chip: {
    marginBottom: spacing.xs,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
