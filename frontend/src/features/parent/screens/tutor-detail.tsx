import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, RefreshControl, Pressable, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getWardTutor, getTutorReviews, getTutorLessonHistoryForWard } from '../api/parent.api';
import { LessonStatusBadge } from '../components';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Screen } from '@/components/layout';
import { StateRenderer, EmptyState } from '@/components/common';
import { colors, radius, spacing } from '@/theme';
import type { WardTutor, WardLesson } from '../types';
import type { Review } from '@/types';

export default function ParentTutorDetailScreen() {
  const { tutorId, wardId } = useLocalSearchParams<{ tutorId: string; wardId: string }>();
  const [tutor, setTutor] = useState<WardTutor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [lessonHistory, setLessonHistory] = useState<WardLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    if (!tutorId) return;
    setLoading(true);
    setError(null);
    try {
      const [tutorData, reviewData, lessonData] = await Promise.all([
        getWardTutor(tutorId),
        getTutorReviews(tutorId),
        wardId ? getTutorLessonHistoryForWard(tutorId, wardId) : Promise.resolve([]),
      ]);
      setTutor(tutorData);
      setReviews(reviewData as Review[]);
      setLessonHistory(lessonData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [tutorId, wardId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Screen style={styles.screen} contentStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="h3">Tutor Details</AppText>
      </View>

      <StateRenderer
        status={error ? 'error' : loading ? 'loading' : 'success'}
        error={error}
        onRetry={loadData}
        errorTitle="Failed to load tutor"
        loadingMessage="Loading tutor details..."
      >
        {() =>
          tutor ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor={colors.primary} />}
            >
              {/* Hero */}
              <BaseCard style={styles.heroCard} elevation="lg">
                <LinearGradient
                  colors={[colors.surfaceVariant, colors.surface]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.heroGradient}
                >
                  <View style={styles.heroRow}>
                    <Avatar
                      source={tutor.profile_photo ? { uri: tutor.profile_photo } : undefined}
                      initials={(tutor.full_name || '?').slice(0, 2).toUpperCase()}
                      size={64}
                      verified={tutor.verification_status === 'approved'}
                    />
                    <View style={styles.heroInfo}>
                      <AppText variant="title">{tutor.full_name}</AppText>
                      {tutor.location && (
                        <AppText variant="caption" color="textSecondary">
                          {tutor.location}
                        </AppText>
                      )}
                      <View style={styles.heroBadges}>
                        <Badge
                          label={tutor.verification_status === 'approved' ? 'Verified' : 'Pending'}
                          variant={tutor.verification_status === 'approved' ? 'success' : 'neutral'}
                          size="small"
                        />
                        <View style={styles.ratingPill}>
                          <Ionicons name="star" size={14} color={colors.warning} />
                          <AppText variant="caption" style={styles.ratingText}>
                            {tutor.rating_avg.toFixed(1)} ({tutor.rating_count})
                          </AppText>
                        </View>
                      </View>
                    </View>
                  </View>
                  {tutor.bio && (
                    <AppText variant="bodySmall" color="textSecondary" style={styles.bio}>
                      {tutor.bio}
                    </AppText>
                  )}
                </LinearGradient>
              </BaseCard>

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="star-outline" size={20} color={colors.warning} />
                  <AppText variant="h3" style={styles.statValue}>{tutor.rating_avg.toFixed(1)}</AppText>
                  <AppText variant="caption" color="textSecondary">Rating</AppText>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="people-outline" size={20} color={colors.primary} />
                  <AppText variant="h3" style={styles.statValue}>{tutor.total_sessions}</AppText>
                  <AppText variant="caption" color="textSecondary">Sessions</AppText>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="cash-outline" size={20} color={colors.success} />
                  <AppText variant="h3" style={styles.statValue}>GHS {tutor.hourly_rate}</AppText>
                  <AppText variant="caption" color="textSecondary">Per hour</AppText>
                </View>
              </View>

              {/* Subjects */}
              <View style={styles.section}>
                <AppText variant="subtitle" style={styles.sectionTitle}>Subjects</AppText>
                <View style={styles.subjectBadges}>
                  {tutor.subjects.map((subject) => (
                    <Badge key={subject} label={subject} variant="primary" size="small" style={styles.subjectBadge} />
                  ))}
                </View>
              </View>

              {/* Qualifications */}
              {tutor.qualifications && (
                <View style={styles.section}>
                  <AppText variant="subtitle" style={styles.sectionTitle}>Qualifications</AppText>
                  <BaseCard style={styles.qualCard} elevation="sm">
                    <AppText variant="bodySmall" color="textSecondary">{tutor.qualifications}</AppText>
                  </BaseCard>
                </View>
              )}

              {/* Lesson History with Ward */}
              <View style={styles.section}>
                <AppText variant="subtitle" style={styles.sectionTitle}>Lesson History with Your Ward</AppText>
                {lessonHistory.length > 0 ? (
                  lessonHistory.map((lesson) => (
                    <BaseCard key={lesson.id} style={styles.lessonCard} elevation="sm">
                      <View style={styles.lessonRow}>
                        <View style={styles.lessonIcon}>
                          <Ionicons name="book-outline" size={18} color={colors.primary} />
                        </View>
                        <View style={styles.lessonInfo}>
                          <AppText variant="body" style={styles.lessonSubject}>{lesson.subject}</AppText>
                          <AppText variant="caption" color="textSecondary">
                            {new Date(lesson.scheduled_time).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </AppText>
                        </View>
                        <LessonStatusBadge status={lesson.status} size="small" />
                      </View>
                    </BaseCard>
                  ))
                ) : (
                  <EmptyState icon="calendar-outline" title="No lessons yet" message="No lessons have been conducted with your ward yet." />
                )}
              </View>

              {/* Upcoming Sessions */}
              <View style={styles.section}>
                <AppText variant="subtitle" style={styles.sectionTitle}>Upcoming Sessions</AppText>
                {lessonHistory.filter((l) => l.status === 'scheduled').length > 0 ? (
                  lessonHistory
                    .filter((l) => l.status === 'scheduled')
                    .map((lesson) => (
                      <BaseCard key={lesson.id} style={styles.lessonCard} elevation="sm">
                        <View style={styles.lessonRow}>
                          <View style={styles.lessonIcon}>
                            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                          </View>
                          <View style={styles.lessonInfo}>
                            <AppText variant="body" style={styles.lessonSubject}>{lesson.subject}</AppText>
                            <AppText variant="caption" color="textSecondary">
                              {new Date(lesson.scheduled_time).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </AppText>
                          </View>
                          <LessonStatusBadge status={lesson.status} size="small" />
                        </View>
                      </BaseCard>
                    ))
                ) : (
                  <EmptyState icon="time-outline" title="No upcoming sessions" message="No upcoming sessions scheduled with this tutor." />
                )}
              </View>

              {/* Reviews */}
              <View style={styles.section}>
                <AppText variant="subtitle" style={styles.sectionTitle}>Reviews</AppText>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <BaseCard key={review.id} style={styles.reviewCard} elevation="sm">
                      <View style={styles.reviewHeader}>
                        <Avatar
                          source={review.student?.profile_photo ? { uri: review.student.profile_photo } : undefined}
                          initials={(review.student?.full_name || '?').slice(0, 2).toUpperCase()}
                          size={32}
                        />
                        <View style={styles.reviewInfo}>
                          <AppText variant="body" style={styles.reviewName}>{review.student?.full_name || 'Student'}</AppText>
                          <View style={styles.reviewStars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Ionicons
                                key={star}
                                name={star <= review.rating ? 'star' : 'star-outline'}
                                size={12}
                                color={colors.warning}
                              />
                            ))}
                          </View>
                        </View>
                        <AppText variant="caption" color="textTertiary">
                          {new Date(review.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </AppText>
                      </View>
                      {review.review_text && (
                        <AppText variant="bodySmall" color="textSecondary" style={styles.reviewText}>
                          {review.review_text}
                        </AppText>
                      )}
                    </BaseCard>
                  ))
                ) : (
                  <EmptyState icon="chatbubble-outline" title="No reviews" message="This tutor has not received any reviews yet." />
                )}
              </View>
            </ScrollView>
          ) : (
            <EmptyState icon="person-outline" title="Tutor not found" message="This tutor's profile could not be loaded." />
          )
        }
      </StateRenderer>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    padding: spacing.xs,
  },
  heroCard: {
    borderRadius: radius.xl,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  heroGradient: {
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroInfo: {
    flex: 1,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    color: colors.text,
    fontWeight: '600',
  },
  bio: {
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    marginTop: spacing.xs,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  subjectBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  subjectBadge: {
    marginBottom: spacing.xs,
  },
  qualCard: {
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  lessonCard: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
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
  reviewCard: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontWeight: '600',
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  reviewText: {
    marginTop: spacing.xs,
    lineHeight: 20,
  },
});
