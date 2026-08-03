import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, View, useWindowDimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getOrCreateParentProfile, getApprovedWards, getWardSummary, getPendingLinkingRequests } from '../api/parent.api';
import { WardSelector, ProgressCard } from '../components';
import { LessonStatusBadge } from '../components/LessonStatusBadge';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { Screen } from '@/components/layout';
import { StateRenderer, EmptyState } from '@/components/common';
import { colors, radius, spacing } from '@/theme';
import type { ParentProfile, Ward, WardSummary, LinkingRequest } from '../types';

const AnimatedSection = React.memo(function AnimatedSection({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  useEffect(() => {
    opacity.value = withDelay(index * 90, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(index * 90, withSpring(0, { damping: 16, stiffness: 140 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
});

export default function ParentDashboard() {
  const { user } = useAuthContext();
  const { width } = useWindowDimensions();
  const tabletLayout = width >= 768;

  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  const [wardSummary, setWardSummary] = useState<WardSummary | null>(null);
  const [linkingRequests, setLinkingRequests] = useState<LinkingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [wardLoading, setWardLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    opacity: Math.max(0, 1 - scrollY.value / 120),
    transform: [{ translateY: scrollY.value * 0.3 }],
  }));

  const loadData = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const profile = await getOrCreateParentProfile(user);
      setParentProfile(profile);

      const wardList = await getApprovedWards(user.id);
      setWards(wardList);

      if (wardList.length > 0 && !selectedWardId) {
        setSelectedWardId(wardList[0].id);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  useEffect(() => {
    const loadWardData = async () => {
      if (!selectedWardId) {
        setWardSummary(null);
        return;
      }
      setWardLoading(true);
      try {
        const ward = wards.find((w) => w.id === selectedWardId);
        if (!ward) return;
        const summary = await getWardSummary(ward.id, ward.link_id);
        setWardSummary(summary);
      } catch (err) {
        console.error('Failed to load ward summary', err);
      } finally {
        setWardLoading(false);
      }
    };
    loadWardData();
  }, [selectedWardId, wards]);

  const selectedWard = useMemo(
    () => wards.find((w) => w.id === selectedWardId) ?? null,
    [wards, selectedWardId],
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleRefresh = async () => {
    await loadData();
  };

  const handleSelectWard = (ward: Ward) => {
    setSelectedWardId(ward.id);
  };

  const handleAddWard = () => {
    router.push('/(parent)/link-child');
  };

  if (loading) {
    return (
      <Screen style={styles.screen}>
        <StateRenderer
          status="loading"
          error={null}
          onRetry={handleRefresh}
          loadingMessage="Loading your dashboard..."
        >
          {() => null}
        </StateRenderer>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen style={styles.screen}>
        <StateRenderer
          status="error"
          error={error}
          onRetry={handleRefresh}
          errorTitle="Failed to load dashboard"
        >
          {() => null}
        </StateRenderer>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen} contentStyle={styles.screenContent}>
      {/* Hero Header */}
      <Animated.View style={[styles.heroWrap, headerStyle]}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroRow}>
            <View style={styles.heroInfo}>
              <AppText variant="caption" style={styles.heroGreeting}>
                {getGreeting()}
              </AppText>
              <AppText variant="h2" style={styles.heroName}>
                {parentProfile?.full_name || user?.full_name || 'Parent'}
              </AppText>
              <View style={styles.heroBadges}>
                <View style={styles.heroPill}>
                  <Ionicons name="people-outline" size={14} color={colors.surface} />
                  <AppText variant="caption" style={styles.heroPillText}>
                    {wards.length} {wards.length === 1 ? 'Ward' : 'Wards'}
                  </AppText>
                </View>
                {linkingRequests.length > 0 && (
                  <View style={styles.heroPill}>
                    <Ionicons name="notifications-outline" size={14} color={colors.surface} />
                    <AppText variant="caption" style={styles.heroPillText}>
                      {linkingRequests.length} pending
                    </AppText>
                  </View>
                )}
              </View>
            </View>
            <Pressable onPress={() => router.push('/(parent)/profile')}>
              <Avatar
                source={parentProfile?.avatar_url ? { uri: parentProfile.avatar_url } : undefined}
                initials={(parentProfile?.full_name || 'P').slice(0, 2).toUpperCase()}
                size={52}
              />
            </Pressable>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
      >
        {wards.length === 0 ? (
          <AnimatedSection index={0}>
            <EmptyState
              icon="people-outline"
              title="No wards linked yet"
              message="Link your child's account to monitor their progress, lessons, and stay connected with their tutors."
              actionLabel="Link a child"
              onAction={handleAddWard}
            />
          </AnimatedSection>
        ) : (
          <>
            {/* Ward Selector */}
            <AnimatedSection index={0}>
              <WardSelector
                wards={wards}
                selectedWardId={selectedWardId}
                onSelect={handleSelectWard}
                onAddWard={handleAddWard}
              />
            </AnimatedSection>

            {selectedWard && wardSummary ? (
              <>
                {/* Ward Hero Card */}
                <AnimatedSection index={1}>
                  <BaseCard style={styles.wardCard} elevation="lg">
                    <LinearGradient
                      colors={[colors.surfaceVariant, colors.surface]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.wardGradient}
                    >
                      <View style={styles.wardRow}>
                        <Avatar
                          source={selectedWard.profile_photo ? { uri: selectedWard.profile_photo } : undefined}
                          initials={(selectedWard.full_name || '?').slice(0, 2).toUpperCase()}
                          size={64}
                        />
                        <View style={styles.wardMeta}>
                          <AppText variant="title" numberOfLines={1}>
                            {selectedWard.full_name || 'Student'}
                          </AppText>
                          <AppText variant="caption" color="textSecondary" numberOfLines={1}>
                            {wardSummary.active_subjects.length} subjects • {wardSummary.upcoming_lessons.length} upcoming
                          </AppText>
                          {selectedWard.verification_status && (
                            <Badge
                              label={selectedWard.verification_status === 'approved' ? 'Verified' : 'Pending'}
                              variant={selectedWard.verification_status === 'approved' ? 'success' : 'neutral'}
                              size="small"
                              style={styles.wardBadge}
                            />
                          )}
                        </View>
                        <Pressable
                          style={styles.wardDetailBtn}
                          onPress={() =>
                            router.push({
                              pathname: '/(parent)/ward-detail',
                              params: { wardId: selectedWard.id, linkId: selectedWard.link_id },
                            })
                          }
                        >
                          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
                        </Pressable>
                      </View>
                    </LinearGradient>
                  </BaseCard>
                </AnimatedSection>

                {/* Stats Grid */}
                <AnimatedSection index={2}>
                  <View style={[styles.statsGrid, tabletLayout && styles.statsGridTablet]}>
                    <ProgressCard
                      label="Attendance"
                      value={`${wardSummary.attendance_rate}%`}
                      icon="checkmark-circle-outline"
                      iconColor={colors.success}
                      progressPercent={wardSummary.attendance_rate}
                    />
                    <ProgressCard
                      label="Homework"
                      value={wardSummary.pending_homework}
                      subtitle="pending"
                      icon="document-text-outline"
                      iconColor={colors.warning}
                    />
                    <ProgressCard
                      label="Goals"
                      value={wardSummary.active_goals}
                      subtitle="active"
                      icon="trophy-outline"
                      iconColor={colors.primary}
                    />
                    <ProgressCard
                      label="Alerts"
                      value={wardSummary.unread_notifications}
                      subtitle="unread"
                      icon="notifications-outline"
                      iconColor={colors.danger}
                    />
                  </View>
                </AnimatedSection>

                {/* Upcoming Lessons */}
                <AnimatedSection index={3}>
                  <View style={styles.sectionHeader}>
                    <View>
                      <AppText variant="subtitle">Upcoming Lessons</AppText>
                      <AppText variant="caption" color="textSecondary">
                        Next sessions for {selectedWard.full_name?.split(' ')[0] || 'your ward'}
                      </AppText>
                    </View>
                    <SecondaryButton
                      title="All"
                      onPress={() => router.push('/(parent)/lessons')}
                    />
                  </View>
                  {wardSummary.upcoming_lessons.length > 0 ? (
                    <View style={styles.lessonList}>
                      {wardSummary.upcoming_lessons.slice(0, 3).map((lesson) => (
                        <BaseCard key={lesson.id} style={styles.lessonCard} elevation="sm">
                          <View style={styles.lessonRow}>
                            <View style={styles.lessonIcon}>
                              <Ionicons name="book-outline" size={18} color={colors.primary} />
                            </View>
                            <View style={styles.lessonInfo}>
                              <AppText variant="body" style={styles.lessonSubject}>
                                {lesson.subject}
                              </AppText>
                              <AppText variant="caption" color="textSecondary" numberOfLines={1}>
                                {lesson.tutor_name} • {new Date(lesson.scheduled_time).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </AppText>
                            </View>
                            <LessonStatusBadge status={lesson.status} size="small" />
                          </View>
                        </BaseCard>
                      ))}
                    </View>
                  ) : (
                    <BaseCard style={styles.emptyLessons} elevation="sm">
                      <Ionicons name="calendar-outline" size={28} color={colors.textTertiary} />
                      <AppText variant="bodySmall" color="textSecondary" style={styles.emptyText}>
                        No upcoming lessons scheduled
                      </AppText>
                    </BaseCard>
                  )}
                </AnimatedSection>

                {/* Active Subjects */}
                <AnimatedSection index={4}>
                  <View style={styles.sectionHeader}>
                    <View>
                      <AppText variant="subtitle">Enrolled Subjects</AppText>
                      <AppText variant="caption" color="textSecondary">
                        Current subjects and tutors
                      </AppText>
                    </View>
                  </View>
                  {wardSummary.active_subjects.length > 0 ? (
                    <View style={styles.subjectList}>
                      {wardSummary.active_subjects.map((subject) => (
                        <BaseCard
                          key={subject.id}
                          style={styles.subjectCard}
                          elevation="sm"
                          pressable
                          onPress={() =>
                            router.push({
                              pathname: '/(parent)/tutor-detail',
                              params: { tutorId: subject.tutor_id, wardId: selectedWard.id },
                            })
                          }
                        >
                          <View style={styles.subjectRow}>
                            <View style={styles.subjectIcon}>
                              <Ionicons name="book-outline" size={18} color={colors.secondary} />
                            </View>
                            <View style={styles.subjectInfo}>
                              <AppText variant="body" style={styles.subjectName}>
                                {subject.name}
                              </AppText>
                              <AppText variant="caption" color="textSecondary" numberOfLines={1}>
                                {subject.tutor_name}
                              </AppText>
                            </View>
                            <View style={styles.subjectProgress}>
                              <AppText variant="caption" color="textSecondary">
                                {subject.lessons_completed}/{subject.lessons_total}
                              </AppText>
                              <View style={styles.progressBar}>
                                <View
                                  style={[
                                    styles.progressFill,
                                    { width: `${subject.progress_percent}%` },
                                  ]}
                                />
                              </View>
                            </View>
                          </View>
                        </BaseCard>
                      ))}
                    </View>
                  ) : (
                    <BaseCard style={styles.emptyLessons} elevation="sm">
                      <Ionicons name="book-outline" size={28} color={colors.textTertiary} />
                      <AppText variant="bodySmall" color="textSecondary" style={styles.emptyText}>
                        No subjects enrolled yet
                      </AppText>
                    </BaseCard>
                  )}
                </AnimatedSection>

                {/* Quick Actions */}
                <AnimatedSection index={5}>
                  <View style={styles.quickActions}>
                    <PrimaryButton
                      title="View All Lessons"
                      onPress={() => router.push('/(parent)/lessons')}
                      leftIcon="calendar-outline"
                      containerStyle={styles.quickBtn}
                    />
                    <SecondaryButton
                      title="Notifications"
                      onPress={() => router.push('/(parent)/notifications')}
                      containerStyle={styles.quickBtn}
                    />
                  </View>
                </AnimatedSection>
              </>
            ) : wardLoading ? (
              <StateRenderer
                status="loading"
                error={null}
                onRetry={handleRefresh}
                loadingMessage="Loading ward data..."
              >
                {() => null}
              </StateRenderer>
            ) : null}
          </>
        )}
      </Animated.ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContent: {
    flex: 1,
  },
  heroWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  heroGradient: {
    paddingTop: spacing.xl + 12,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroInfo: {
    flex: 1,
  },
  heroGreeting: {
    color: colors.surface,
    opacity: 0.85,
    marginBottom: spacing.xs,
  },
  heroName: {
    color: colors.surface,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  heroPillText: {
    color: colors.surface,
  },
  scrollContent: {
    paddingTop: 140,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  wardCard: {
    borderRadius: radius.xl,
    marginBottom: spacing.md,
  },
  wardGradient: {
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  wardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  wardMeta: {
    flex: 1,
  },
  wardBadge: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
  },
  wardDetailBtn: {
    padding: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statsGridTablet: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  lessonList: {
    gap: spacing.sm,
  },
  lessonCard: {
    borderRadius: radius.lg,
  padding: spacing.md,
  marginBottom: spacing.xs,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  lessonIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonSubject: {
    fontWeight: '600',
  },
  emptyLessons: {
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: radius.lg,
  },
  emptyText: {
    marginTop: spacing.sm,
  },
  subjectList: {
    gap: spacing.sm,
  },
  subjectCard: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  subjectIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontWeight: '600',
  },
  subjectProgress: {
    width: 80,
    alignItems: 'flex-end',
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  quickActions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  quickBtn: {
    width: '100%',
  },
});
