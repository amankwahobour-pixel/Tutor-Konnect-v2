import { router } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { Animated, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getStudentBookings } from '@/api/booking';
import { BaseCard } from '@/components/cards';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { colors, spacing } from '@/theme';
import { styles } from '../styles/my-lessons.styles';
import BookingHeader from '@/features/bookings/components/BookingHeader';
import type { Booking, QueuedBooking, ApiResponse } from '@/types';

export default function MyLessonsScreen() {
  const [lessons, setLessons] = React.useState<Booking[]>([]);
  const [queued, setQueued] = React.useState<QueuedBooking[]>([]);
  const [, setLoading] = React.useState(false);
  const [, setError] = React.useState<Error | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const scrollYRef = React.useRef(new Animated.Value(0));

  const { user } = useAuthContext();

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user) return;
      // server bookings
      try {
        const res = await getStudentBookings(user.id) as ApiResponse<Booking[]>;
        if (res?.data) setLessons(res.data);
      } catch (err) {
        console.debug('Bookings endpoint not available or failed', err);
      }

      // queued bookings (local)
      try {
        const qb = await import('@/services/booking-queue').then((m) => m.getQueuedBookings());
        setQueued(qb);
      } catch (err) {
        console.debug('Failed to load queued bookings', err);
      }
    } catch (err) {
      console.error('Failed to load lessons', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    void (async () => {
      await loadData();
    })();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  const onCancelQueued = async (id: string) => {
    try {
      const { removeQueuedBooking } = await import('@/services/booking-queue');
      await removeQueuedBooking(id);
      setQueued((prev) => prev.filter((q) => q.id !== id));
      const { trackEvent } = await import('@/services/analytics');
      trackEvent('booking.queued.cancel', { id });
    } catch (err) {
      console.error('Failed to cancel queued booking', err);
      alert('Failed to cancel queued booking');
    }
  };

  const onRetrySync = async () => {
    try {
      const { syncQueuedBookings } = await import('@/services/booking-queue');
      const res = await syncQueuedBookings();
      const { trackEvent } = await import('@/services/analytics');
      trackEvent('booking.sync.manual', { synced: res.synced.length, failed: res.failed.length });
      if (res.synced.length > 0) {
        alert(`Synced ${res.synced.length} queued request(s).`);
        await loadData();
      } else {
        alert('No queued requests synced.');
      }
    } catch (err) {
      console.error('Sync failed', err);
      alert('Sync failed');
    }
  };

  const overviewItems = useMemo(
    () => [
      { label: 'Active lessons', value: `${lessons.length}` },
      { label: 'Queued requests', value: `${queued.length}` },
      { label: 'Next step', value: lessons.length > 0 ? 'Continue learning' : 'Book a session' },
    ],
    [lessons.length, queued.length],
  );

  const renderLessonCard = useCallback((lesson: Booking) => {
    const statusKey = String(lesson.status ?? (lesson.confirmed ? 'confirmed' : 'pending')).toLowerCase();
    const statusMeta = {
      pending: { label: 'Pending', variant: 'warning' as const, icon: 'time-outline' },
      accepted: { label: 'Accepted', variant: 'primary' as const, icon: 'checkmark-circle-outline' },
      confirmed: { label: 'Confirmed', variant: 'primary' as const, icon: 'calendar-outline' },
      completed: { label: 'Completed', variant: 'success' as const, icon: 'sparkles-outline' },
      cancelled: { label: 'Cancelled', variant: 'danger' as const, icon: 'close-circle-outline' },
      rejected: { label: 'Rejected', variant: 'danger' as const, icon: 'ban-outline' },
    };
    const meta = statusMeta[statusKey as keyof typeof statusMeta] ?? statusMeta.pending;

    return (
      <BaseCard
        key={lesson.id}
        pressable
        accessibilityLabel={`Lesson ${lesson.subject}`}
        onPress={() => router.push(`/(student)/booking?bookingId=${lesson.id}`)}
        style={styles.lessonCard}
        elevation="md"
      >
        <View style={styles.lessonCardHeader}>
          <View style={styles.lessonIdentity}>
            <Avatar initials={lesson.tutor?.full_name?.slice(0, 2) ?? 'TU'} size={44} accessibilityLabel="Tutor avatar" />
            <View style={{ marginLeft: spacing.sm, flex: 1 }}>
              <AppText variant="subtitle" style={styles.lessonTitle}>{lesson.subject}</AppText>
              <AppText variant="caption" style={styles.lessonTutor}>{lesson.tutorName ?? lesson.tutor?.full_name ?? 'Tutor'}</AppText>
            </View>
          </View>
          <Badge label={meta.label} variant={meta.variant} size="small" />
        </View>

        <View style={styles.lessonMetaRow}>
          <View style={styles.lessonMetaPill}>
            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
            <AppText variant="caption" style={styles.lessonMetaText}>{lesson.time ?? lesson.scheduled_time ?? 'Schedule pending'}</AppText>
          </View>
          <View style={styles.lessonMetaPill}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <AppText variant="caption" style={styles.lessonMetaText}>{lesson.total_amount ? `₵${lesson.total_amount}` : 'Price pending'}</AppText>
          </View>
        </View>

        <View style={styles.lessonDetailsRow}>
          <View style={styles.lessonDetailBox}>
            <Ionicons name={meta.icon as keyof typeof Ionicons.glyphMap} size={16} color={colors.primary} />
            <AppText variant="caption" style={styles.lessonDetailText}>Status: {meta.label}</AppText>
          </View>
          <SecondaryButton title="View details" containerStyle={styles.inlineAction} onPress={() => router.push(`/(student)/booking?bookingId=${lesson.id}`)} />
        </View>
      </BaseCard>
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={styles.containerHeader}>
        <BookingHeader
          title="My Lessons"
          subtitle="Stay close to your upcoming classes, milestones, and lesson progress."
          scrollY={scrollYRef.current}
          rightSlot={<Ionicons name="sparkles-outline" size={24} color={colors.surface} />}
        />
      </Animated.View>

      <Animated.FlatList
        contentContainerStyle={styles.content}
        data={lessons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderLessonCard(item)}
        ListHeaderComponent={() => (
          <>
            <View style={styles.bodyHeader}>
              <BaseCard style={styles.summaryCard} elevation="md">
                <LinearGradient colors={[colors.primaryLight ?? '#E8F9FF', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.summaryGradient}>
                  <View style={styles.summaryHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <AppText variant="caption" color="textSecondary">Lesson overview</AppText>
                      <AppText variant="subtitle" style={styles.summaryTitle}>Your learning plan stays in one place</AppText>
                    </View>
                    <View style={styles.summaryIconWrap}>
                      <Ionicons name="sparkles-outline" size={18} color={colors.primary} />
                    </View>
                  </View>
                  <View style={styles.summaryRow}>
                    {overviewItems.map((item) => (
                      <View key={item.label} style={styles.summaryItem}>
                        <AppText variant="subtitle" style={styles.summaryValue}>{item.value}</AppText>
                        <AppText variant="caption" color="textSecondary">{item.label}</AppText>
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </BaseCard>

              {queued.length > 0 && (
                <View style={styles.sectionBlock}>
                  <View style={styles.sectionHeading}>
                    <AppText variant="subtitle">Queued requests</AppText>
                    <Badge label="Local" variant="warning" size="small" />
                  </View>
                  {queued.map((q) => (
                    <BaseCard key={q.id} style={styles.queuedCard} elevation="sm">
                      <View style={styles.lessonCardHeader}>
                        <View style={{ flex: 1 }}>
                          <AppText variant="subtitle" style={styles.lessonTitle}>{q.payload.subject || 'Lesson request'}</AppText>
                          <AppText variant="caption" style={styles.lessonTutor}>Pending • {new Date(q.created_at).toLocaleString()}</AppText>
                        </View>
                        <Badge label="Pending" variant="warning" size="small" />
                      </View>
                      <View style={styles.lessonMetaRow}>
                        <View style={styles.lessonMetaPill}>
                          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                          <AppText variant="caption" style={styles.lessonMetaText}>{q.payload.scheduled_time || 'Awaiting schedule'}</AppText>
                        </View>
                      </View>
                      <View style={styles.inlineActions}>
                        <PrimaryButton title="Retry" onPress={async () => {
                          try {
                            const { createBooking } = await import('@/api/booking');
                            await createBooking(q.payload);
                            const { removeQueuedBooking } = await import('@/services/booking-queue');
                            await removeQueuedBooking(q.id);
                            setQueued((prev) => prev.filter((x) => x.id !== q.id));
                            alert('Queued request synced');
                          } catch (err) {
                            console.error('Retry failed', err);
                            alert('Retry failed');
                          }
                        }} containerStyle={styles.inlineActionButton} />
                        <SecondaryButton title="Edit" onPress={() => router.push(`/(student)/book-lesson?queuedId=${q.id}&queuedPayload=${encodeURIComponent(JSON.stringify(q.payload))}&tutorId=${q.payload.tutor_id}`)} containerStyle={styles.inlineActionButton} />
                        <SecondaryButton title="Cancel" onPress={() => onCancelQueued(q.id)} containerStyle={styles.inlineActionButton} />
                      </View>
                    </BaseCard>
                  ))}
                  <PrimaryButton title="Retry Sync" onPress={onRetrySync} containerStyle={styles.syncButton} />
                </View>
              )}
            </View>
            <View style={styles.listSeparator} />
          </>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollYRef.current } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        ListEmptyComponent={() => (
          <View style={styles.emptyBlock}>
            {/* Preserve previous empty state rendering via StateRenderer wrapper */}
          </View>
        )}
      />
       
    </SafeAreaView>
  );
}
