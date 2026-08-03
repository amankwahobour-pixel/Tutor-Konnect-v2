import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  heroCard: {
    borderRadius: radius.xl,
    marginBottom: spacing.md,
  },
  heroGradient: {
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  heroTitle: {
    marginTop: spacing.xs,
  },
  heroSubtitle: {
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  profileButton: {
    padding: spacing.xs,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  heroBadge: {
    flexGrow: 1,
    minWidth: 92,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroBadgeValue: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 2,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceVariant,
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  quickActionLabel: {
    color: colors.textSecondary,
  },
  searchBar: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  searchInput: {
    minHeight: spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  tutorCard: {
    borderRadius: radius.xl,
    marginBottom: spacing.sm,
  },
  tutorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tutorInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  tutorNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tutorName: {
    color: colors.text,
  },
  tutorBio: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
  },
  tutorMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceVariant,
  },
  metaText: {
    color: colors.textSecondary,
  },
  tutorActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
