import React, { useEffect, useMemo } from 'react';
import { RefreshControl, StyleSheet, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useApi } from '@/hooks/use-api';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getTutorProfile, getTutorEarnings } from '@/api/tutor';
import { getTutorRequests } from '@/api/booking';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { Screen } from '@/components/layout';
import { StateRenderer, SkeletonCard } from '@/components/common';
import { DashboardHeader } from '@/components/headers';
import type { Earnings, TutorProfile, TutorRequest } from '@/types';
import { colors, radius, spacing } from '@/theme';

interface AnimatedSectionProps {
  children: React.ReactNode;
  index: number;
}

const AnimatedSection = React.memo(function AnimatedSection({ children, index }: AnimatedSectionProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  useEffect(() => {
    opacity.value = withDelay(index * 90, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(index * 90, withSpring(0, { damping: 16, stiffness: 140 }));
  }, [index, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
});

export default function TutorDashboard() {
  const { user } = useAuthContext();
  const { width } = useWindowDimensions();
  const compactLayout = width < 360;
  const tabletLayout = width >= 768;

  const {
    data: tutorProfile,
    loading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useApi(
    () => getTutorProfile(user?.id || '').then((res) => res.data),
    [user?.id],
  ) as { data: TutorProfile | undefined; loading: boolean; error: Error | null; refetch: () => Promise<void> };

  const {
    data: earnings,
    loading: earningsLoading,
    refetch: refetchEarnings,
  } = useApi(
    () => getTutorEarnings(user?.id || '').then((res) => res.data),
    [user?.id],
  ) as { data: Earnings | undefined; loading: boolean; refetch: () => Promise<void> };

  const {
    data: requestsData,
    loading: requestsLoading,
    refetch: refetchRequests,
  } = useApi(
    () => getTutorRequests(user?.id || '').then((res) => (res.data ?? []) as TutorRequest[]),
    [user?.id],
  ) as { data: TutorRequest[] | undefined; loading: boolean; refetch: () => Promise<void> };

  const handleRefresh = async () => {
    await Promise.all([refetchProfile(), refetchEarnings(), refetchRequests()]);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const profileInitials = useMemo(() => {
    const base = user?.full_name || 'Tutor';
    return base
      .split(' ')
      .map((part) => part[0] || '')
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [user?.full_name]);

  const quickActions = useMemo(
    () => [
      {
        title: 'Requests',
        subtitle: 'Review student requests',
        icon: 'mail-unread-outline' as const,
        route: '/(tutor)/requests',
        accent: colors.primary,
      },
      {
        title: 'Messages',
        subtitle: 'Stay in touch',
        icon: 'chatbubble-ellipses-outline' as const,
        route: '/(tutor)/messages',
        accent: colors.secondary,
      },
      {
        title: 'Calendar',
        subtitle: 'Plan your week',
        icon: 'calendar-outline' as const,
        route: '/(tutor)/availability',
        accent: colors.warning,
      },
      {
        title: 'Wallet',
        subtitle: 'Track your income',
        icon: 'wallet-outline' as const,
        route: '/(tutor)/earnings',
        accent: colors.success,
      },
    ],
    [],
  );

  const stats = useMemo(
    () => [
      { label: 'Students', value: `${tutorProfile?.total_sessions ?? 0}`, icon: 'people-outline' as const, accent: colors.primary },
      { label: 'Upcoming', value: `${Math.max(0, (requestsData ?? []).filter((item) => item.status !== 'rejected' && item.status !== 'completed').length)}`, icon: 'calendar-outline' as const, accent: colors.secondary },
      { label: 'Monthly', value: formatCurrency(earnings?.available ?? 0), icon: 'cash-outline' as const, accent: colors.success },
      { label: 'Rating', value: `${(tutorProfile?.rating_avg ?? 0).toFixed(1)}`, icon: 'star-outline' as const, accent: colors.warning },
    ],
    [earnings?.available, requestsData, tutorProfile?.rating_avg, tutorProfile?.total_sessions],
  );

  const previewRequests = useMemo(() => (requestsData ?? []).slice(0, 3), [requestsData]);
  const upcomingLessons = useMemo(
    () => previewRequests.filter((item: TutorRequest) => item.status !== 'rejected' && item.status !== 'completed' && item.scheduled_time),
    [previewRequests],
  );
  const activityItems = useMemo<{ id: string; subject: string; status: string }[]>(() => {
    return (requestsData ?? []).slice(0, 5).map((item: TutorRequest) => ({
      id: item.id,
      subject: item.subject || 'Lesson',
      status: item.status === 'pending_tutor_acceptance' ? 'New request' : item.status === 'accepted' ? 'Accepted' : item.status,
    }));
  }, [requestsData]);

  return (
    <Screen style={styles.screen} contentStyle={styles.screenContent}>
      <StateRenderer
        status={profileError ? 'error' : profileLoading ? 'loading' : 'success'}
        error={profileError}
        onRetry={handleRefresh}
        errorTitle="Failed to load dashboard"
        loadingMessage="Loading dashboard..."
      >
        {() =>
          profileLoading && !tutorProfile ? (
            <View style={{ padding: spacing.lg, gap: spacing.sm }}>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </View>
          ) : tutorProfile ? (
            <View style={styles.shell}>
              <DashboardHeader
                greeting={getGreeting()}
                userName={user?.full_name || 'Tutor'}
                avatarSource={user?.profile_photo ? { uri: user.profile_photo } : undefined}
                avatarInitials={profileInitials}
                notificationCount={0}
                onNotificationPress={() => router.push('/notifications')}
                onAvatarPress={() => router.push('/(tutor)/profile')}
                statisticsSlot={
                  <View style={styles.headerSummaryRow}>
                    <View style={styles.headerPill}>
                      <Ionicons name="mail-open-outline" size={14} color={colors.primary} />
                      <AppText variant="caption" style={styles.headerPillText}>{previewRequests.length} pending</AppText>
                    </View>
                    <View style={styles.headerPill}>
                      <Ionicons name="wallet-outline" size={14} color={colors.success} />
                      <AppText variant="caption" style={styles.headerPillText}>{formatCurrency(earnings?.available ?? 0)}</AppText>
                    </View>
                  </View>
                }
                scrollY={scrollY}
              />

              <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={scrollHandler}
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={profileLoading || earningsLoading || requestsLoading} onRefresh={handleRefresh} tintColor={colors.primary} />}
              >
                <AnimatedSection index={0}>
                  <BaseCard style={styles.profileCard} elevation="lg">
                    <LinearGradient
                      colors={[colors.surfaceVariant, colors.surface]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.profileGradient}
                    >
                      <View style={styles.profileRow}>
                        <Avatar source={user?.profile_photo ? { uri: user.profile_photo } : undefined} initials={profileInitials} size={68} verified={tutorProfile.verification_status === 'approved'} />
                        <View style={styles.profileMeta}>
                          <View style={styles.rowBetween}>
                            <View style={styles.profileNameBlock}>
                              <AppText variant="title" numberOfLines={1}>{user?.full_name || 'Tutor'}</AppText>
                              <AppText variant="caption" color="textSecondary" numberOfLines={1}>
                                {tutorProfile.subjects?.slice(0, 2).join(' • ') || 'Specialist tutor'}
                              </AppText>
                            </View>
                            <Badge label={tutorProfile.verification_status === 'approved' ? 'Verified' : 'Pending'} variant={tutorProfile.verification_status === 'approved' ? 'success' : 'neutral'} />
                          </View>
                          <View style={styles.profileStatsRow}>
                            <View style={styles.profileStatItem}>
                              <Ionicons name="star" size={15} color={colors.warning} />
                              <AppText variant="bodySmall" style={styles.profileStatText}>{(tutorProfile.rating_avg || 0).toFixed(1)} rating</AppText>
                            </View>
                            <View style={styles.profileStatItem}>
                              <Ionicons name="time-outline" size={15} color={colors.primary} />
                              <AppText variant="bodySmall" style={styles.profileStatText}>{tutorProfile.availability_notes || 'Available now'}</AppText>
                            </View>
                          </View>
                          <View style={styles.badgeRow}>
                            {tutorProfile.subjects?.slice(0, 3).map((subject) => (
                              <Badge key={subject} label={subject} variant="secondary" size="small" style={styles.subjectBadge} />
                            ))}
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  </BaseCard>
                </AnimatedSection>

                <AnimatedSection index={1}>
                  <View style={styles.actionsWrap}>
                    <View style={styles.sectionHeader}>
                      <View>
                        <AppText variant="subtitle">Quick actions</AppText>
                        <AppText variant="caption" color="textSecondary">Everything in one place</AppText>
                      </View>
                    </View>
                    <View style={styles.actionsGrid}>
                      {quickActions.map((action) => (
                        <BaseCard
                          key={action.title}
                          style={[styles.actionCard, tabletLayout && styles.actionCardTablet, compactLayout && styles.actionCardCompact]}
                          pressable
                          onPress={() => router.push(action.route as any)}
                          elevation="sm"
                        >
                          <View style={[styles.actionIcon, { backgroundColor: `${action.accent}16` }]}> 
                            <Ionicons name={action.icon} size={20} color={action.accent} />
                          </View>
                          <AppText variant="title" style={styles.actionTitle}>{action.title}</AppText>
                          <AppText variant="caption" color="textSecondary" style={styles.actionSubtitle}>{action.subtitle}</AppText>
                        </BaseCard>
                      ))}
                    </View>
                  </View>
                </AnimatedSection>

                <AnimatedSection index={2}>
                  <View style={styles.statsGrid}>
                    {stats.map((item) => (
                      <BaseCard key={item.label} style={[styles.statCard, tabletLayout && styles.statCardTablet]} elevation="sm">
                        <View style={[styles.statIcon, { backgroundColor: `${item.accent}18` }]}> 
                          <Ionicons name={item.icon} size={18} color={item.accent} />
                        </View>
                        <AppText variant="h3">{item.value}</AppText>
                        <AppText variant="caption" color="textSecondary">{item.label}</AppText>
                      </BaseCard>
                    ))}
                  </View>
                </AnimatedSection>

                <AnimatedSection index={3}>
                  <BaseCard style={styles.sectionCard} elevation="md">
                    <View style={styles.sectionHeader}>
                      <View>
                        <AppText variant="subtitle">Upcoming lessons</AppText>
                        <AppText variant="caption" color="textSecondary">Your next tutoring sessions</AppText>
                      </View>
                      <SecondaryButton title="View all" onPress={() => router.push('/(tutor)/requests')} />
                    </View>
                    {upcomingLessons.length > 0 ? (
                      <View style={styles.listStack}>
                        {upcomingLessons.map((item) => (
                          <View key={item.id} style={styles.listRow}>
                            <View style={styles.listContent}>
                              <AppText variant="body" style={styles.listTitle}>{item.subject || 'Lesson'}</AppText>
                              <AppText variant="caption" color="textSecondary">{item.scheduled_time ? new Date(item.scheduled_time).toLocaleString() : 'Schedule pending'}</AppText>
                            </View>
                            <PrimaryButton title="Open" onPress={() => router.push('/(tutor)/requests')} />
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={styles.emptyStateBox}>
                        <AppText variant="body">No upcoming lessons yet.</AppText>
                      </View>
                    )}
                  </BaseCard>
                </AnimatedSection>

                <AnimatedSection index={4}>
                  <BaseCard style={styles.walletCard} elevation="lg">
                    <View style={styles.sectionHeader}>
                      <View>
                        <AppText variant="subtitle">Wallet summary</AppText>
                        <AppText variant="caption" color="textSecondary">Your tutor balance at a glance</AppText>
                      </View>
                      <SecondaryButton title="Details" onPress={() => router.push('/(tutor)/earnings')} />
                    </View>
                    <AppText variant="display">{formatCurrency(earnings?.available ?? 0)}</AppText>
                    <View style={styles.walletMetrics}>
                      <View style={styles.walletMetric}>
                        <AppText variant="caption" color="textSecondary">Monthly</AppText>
                        <AppText variant="body">{formatCurrency(earnings?.total_earned ?? 0)}</AppText>
                      </View>
                      <View style={styles.walletMetric}>
                        <AppText variant="caption" color="textSecondary">Pending</AppText>
                        <AppText variant="body">{formatCurrency(earnings?.pending ?? 0)}</AppText>
                      </View>
                    </View>
                  </BaseCard>
                </AnimatedSection>

                <AnimatedSection index={5}>
                  <BaseCard style={styles.sectionCard} elevation="md">
                    <View style={styles.sectionHeader}>
                      <View>
                        <AppText variant="subtitle">Pending requests</AppText>
                        <AppText variant="caption" color="textSecondary">Latest student requests</AppText>
                      </View>
                      <SecondaryButton title="View all" onPress={() => router.push('/(tutor)/requests')} />
                    </View>
                    {previewRequests.length > 0 ? (
                      <View style={styles.listStack}>
                        {previewRequests.map((item: TutorRequest) => (
                          <View key={item.id} style={styles.listRow}>
                            <View style={styles.listContent}>
                              <AppText variant="body" style={styles.listTitle}>{item.subject || 'Lesson request'}</AppText>
                              <AppText variant="caption" color="textSecondary">{item.student ? (typeof item.student === 'string' ? item.student : item.student.full_name || 'Student') : 'Student'}</AppText>
                            </View>
                            <Badge label={item.status} variant={item.status === 'pending' ? 'warning' : 'neutral'} />
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={styles.emptyStateBox}>
                        <AppText variant="body">No pending requests right now.</AppText>
                      </View>
                    )}
                  </BaseCard>
                </AnimatedSection>

                <AnimatedSection index={6}>
                  <BaseCard style={styles.sectionCard} elevation="md">
                    <View style={styles.sectionHeader}>
                      <View>
                        <AppText variant="subtitle">Recent activity</AppText>
                        <AppText variant="caption" color="textSecondary">Latest updates from your tutoring workspace</AppText>
                      </View>
                    </View>
                    {activityItems.length > 0 ? (
                      <View style={styles.timeline}>
                        {activityItems.map((item) => (
                          <View key={item.id} style={styles.timelineItem}>
                            <View style={styles.timelineDot} />
                            <View style={styles.timelineContent}>
                              <AppText variant="body">{item.subject}</AppText>
                              <AppText variant="caption" color="textSecondary">{item.status}</AppText>
                            </View>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={styles.emptyStateBox}>
                        <AppText variant="body">There is no recent activity to display right now.</AppText>
                      </View>
                    )}
                  </BaseCard>
                </AnimatedSection>

                <View style={styles.bottomSpacing} />
              </Animated.ScrollView>
            </View>
          ) : null
        }
      </StateRenderer>
    </Screen>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 0,
  }).format(value);
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  screenContent: {
    padding: 0,
  },
  shell: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  headerSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  headerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    opacity: 0.96,
  },
  headerPillText: {
    color: colors.text,
  },
  profileCard: {
    marginTop: -spacing.xl,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  profileGradient: {
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  profileMeta: {
    flex: 1,
    gap: spacing.sm,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  profileNameBlock: {
    flex: 1,
  },
  profileStatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  profileStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  profileStatText: {
    color: colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  subjectBadge: {
    marginRight: spacing.xs,
  },
  actionsWrap: {
    marginBottom: spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  actionCard: {
    width: '47%',
    minHeight: 150,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  actionCardTablet: {
    width: '23%',
    minHeight: 160,
  },
  actionCardCompact: {
    width: '47%',
  },
  actionIcon: {
    borderRadius: radius.full,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionTitle: {
    marginTop: spacing.xs,
  },
  actionSubtitle: {
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.surface,
  },
  statCardTablet: {
    width: '23%',
  },
  statIcon: {
    width: spacing.xxxl,
    height: spacing.xxxl,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  sectionCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  walletCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  listStack: {
    gap: spacing.sm,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    marginBottom: spacing.xs,
  },
  emptyStateBox: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.lg,
  },
  walletMetrics: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  walletMetric: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  timeline: {
    gap: spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  timelineDot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    marginTop: spacing.xs,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: spacing.sm,
  },
  bottomSpacing: {
    height: spacing.xxl * 2,
  },
});
