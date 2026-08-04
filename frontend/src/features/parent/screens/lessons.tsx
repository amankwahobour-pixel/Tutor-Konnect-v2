import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, RefreshControl, Pressable, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getApprovedWards, getWardLessons, updateLocationConsent } from '../api/parent.api';
import { WardSelector, LessonStatusBadge } from '../components';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/layout';
import { EmptyState, SectionCard } from '@/components/common';
import { colors, radius, spacing } from '@/theme';
import type { Ward, WardLesson, LessonTrackingStatus } from '../types';

const statusFilters: { key: LessonTrackingStatus | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: 'apps-outline' },
  { key: 'scheduled', label: 'Scheduled', icon: 'calendar-outline' },
  { key: 'in_progress', label: 'In Progress', icon: 'time-outline' },
  { key: 'completed', label: 'Completed', icon: 'checkmark-circle-outline' },
  { key: 'cancelled', label: 'Cancelled', icon: 'close-circle-outline' },
  { key: 'rescheduled', label: 'Rescheduled', icon: 'swap-horizontal-outline' },
];

export default function ParentLessonsScreen() {
  const { user } = useAuthContext();
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  const [lessons, setLessons] = useState<WardLesson[]>([]);
  const [activeFilter, setActiveFilter] = useState<LessonTrackingStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadWards = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const wardList = await getApprovedWards(user.id);
      setWards(wardList);
      if (!selectedWardId && wardList.length > 0) {
        setSelectedWardId(wardList[0].id);
      }
    } catch (err) {
      console.error('Failed to load wards', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const loadLessons = useCallback(async () => {
    if (!selectedWardId) {
      setLessons([]);
      return;
    }
    setLessonsLoading(true);
    try {
      const lessonList = await getWardLessons(selectedWardId);
      setLessons(lessonList);
    } catch (err) {
      console.error('Failed to load lessons', err);
    } finally {
      setLessonsLoading(false);
    }
  }, [selectedWardId]);

  useEffect(() => {
    loadWards();
  }, [loadWards]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  const filteredLessons = useMemo(() => {
    if (activeFilter === 'all') return lessons;
    return lessons.filter((l) => l.status === activeFilter);
  }, [lessons, activeFilter]);

  const handleLocationConsent = (lesson: WardLesson) => {
    if (!lesson.is_in_person) return;
    Alert.alert(
      'Location Sharing',
      `Share real-time location for "${lesson.subject}" with ${lesson.tutor_name}?\n\nLocation is only shared during the active session and can be revoked anytime.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Allow',
          onPress: async () => {
            try {
              await updateLocationConsent(lesson.id, true);
              Alert.alert('Consent Granted', 'Location sharing is now active for this session.');
            } catch {
              Alert.alert('Error', 'Could not update location sharing consent.');
            }
          },
        },
      ],
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadWards(), loadLessons()]);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <Screen style={styles.screen}>
        <View style={styles.skeletonHeader} />
        <View style={styles.skeletonBody} />
      </Screen>
    );
  }

  if (wards.length === 0) {
    return (
      <Screen style={styles.screen}>
        <EmptyState
          icon={<Ionicons name="people-outline" size={48} color={colors.primary} />}
          title="No wards linked"
          message="Link your child's account to view their lessons."
          actionLabel="Link a child"
          onAction={() => router.push('/(parent)/link-child')}
        />
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen} contentStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <AppText variant="h2">Lessons</AppText>
          <AppText variant="caption" color="textSecondary">
            Track and monitor lesson progress
          </AppText>
        </View>
        <Pressable onPress={() => router.push('/(parent)/notifications')} style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </Pressable>
      </View>

      <WardSelector
        wards={wards}
        selectedWardId={selectedWardId}
        onSelect={(w) => setSelectedWardId(w.id)}
        onAddWard={() => router.push('/(parent)/link-child')}
      />

      {/* Status Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterContent}
      >
        {statusFilters.map((filter) => (
          <Pressable
            key={filter.key}
            style={[styles.filterChip, activeFilter === filter.key && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter.key)}
          >
            <Ionicons
              name={filter.icon as any}
              size={14}
              color={activeFilter === filter.key ? colors.primary : colors.textTertiary}
            />
            <AppText
              variant="caption"
              style={[styles.filterText, activeFilter === filter.key && styles.filterTextActive]}
            >
              {filter.label}
            </AppText>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.lessonList}
      >
        {filteredLessons.length > 0 ? (
          filteredLessons.map((lesson) => (
            <BaseCard key={lesson.id} style={styles.lessonCard} elevation="sm">
              <View style={styles.lessonHeader}>
                <View style={styles.lessonIcon}>
                  <Ionicons name="book-outline" size={20} color={colors.primary} />
                </View>
                <View style={styles.lessonInfo}>
                  <AppText variant="body" style={styles.lessonSubject}>{lesson.subject}</AppText>
                  <AppText variant="caption" color="textSecondary">
                    {lesson.tutor_name}
                  </AppText>
                </View>
                <LessonStatusBadge status={lesson.status} size="small" />
              </View>

              <View style={styles.lessonMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textTertiary} />
                  <AppText variant="caption" color="textSecondary">
                    {new Date(lesson.scheduled_time).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </AppText>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                  <AppText variant="caption" color="textSecondary">
                    {new Date(lesson.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </AppText>
                </View>
                {lesson.total_amount != null && (
                  <View style={styles.metaItem}>
                    <Ionicons name="cash-outline" size={14} color={colors.textTertiary} />
                    <AppText variant="caption" color="textSecondary">
                      GHS {lesson.total_amount.toFixed(2)}
                    </AppText>
                  </View>
                )}
              </View>

              {lesson.is_in_person && (lesson.status === 'scheduled' || lesson.status === 'in_progress') && (
                <Pressable style={styles.locationBtn} onPress={() => handleLocationConsent(lesson)}>
                  <Ionicons name="location-outline" size={16} color={colors.primary} />
                  <AppText variant="caption" style={styles.locationText}>
                    {lesson.location_sharing_consent ? 'Location sharing active' : 'Share location for this session'}
                  </AppText>
                </Pressable>
              )}

              {lesson.meet_link && lesson.status === 'scheduled' && (
                <Pressable
                  style={styles.meetBtn}
                  onPress={() => {
                    if (lesson.meet_link) {
                      Alert.alert('Meeting Link', lesson.meet_link);
                    }
                  }}
                >
                  <Ionicons name="videocam-outline" size={16} color={colors.secondary} />
                  <AppText variant="caption" style={styles.meetText}>Join online session</AppText>
                </Pressable>
              )}
            </BaseCard>
          ))
        ) : (
          <EmptyState
            icon={<Ionicons name="calendar-outline" size={48} color={colors.textTertiary} />}
            title="No lessons found"
            message={activeFilter === 'all' ? 'No lessons have been booked yet.' : `No ${activeFilter.replace('_', ' ')} lessons.`}
          />
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  skeletonHeader: {
    height: 80,
    backgroundColor: colors.primary,
  },
  skeletonBody: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  bellBtn: {
    padding: spacing.xs,
  },
  filterBar: {
    maxHeight: 44,
    marginBottom: spacing.sm,
  },
  filterContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textTertiary,
  },
  filterTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  lessonList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  lessonCard: {
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  lessonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  lessonMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingLeft: spacing.xl + spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignSelf: 'flex-start',
  },
  locationText: {
    color: colors.primary,
    fontWeight: '600',
  },
  meetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.secondaryLight,
    alignSelf: 'flex-start',
  },
  meetText: {
    color: colors.secondary,
    fontWeight: '600',
  },
});
