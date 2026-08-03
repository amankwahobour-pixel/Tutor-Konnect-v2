import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Alert, Animated, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getBooking, acceptBooking, declineBooking, confirmBooking, completeBooking, cancelBooking } from '@/api/booking';
import { BaseCard } from '@/components/cards';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { StateRenderer } from '@/components/common';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { colors, spacing } from '@/theme';
import BookingHeader from './components/BookingHeader';
import styles from './booking.styles';
import type { Booking } from '@/types';

export default function BookingDetailsScreen() {
  const params = useLocalSearchParams();
  const bookingId = Array.isArray(params.bookingId) ? params.bookingId[0] : (params.bookingId || '');
  const { user } = useAuthContext();

  const [booking, setBooking] = React.useState<Booking | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const scrollYRef = React.useRef(new Animated.Value(0));

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!bookingId) throw new Error('Missing booking id');
      const res = await getBooking(bookingId);
      if (res?.data && res.data.length > 0) setBooking(res.data[0]);
      else setBooking(null);
    } catch (err) {
      console.error('Failed to load booking', err);
      setError(err instanceof Error ? err : new Error('Failed to load booking'));
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  React.useEffect(() => {
    // The loader performs async state updates; calling it here is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const isTutor = booking?.tutor_id === user?.id;
  const isStudent = booking?.student_id === user?.id;

  const handleScroll = React.useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollYRef.current.setValue(event.nativeEvent.contentOffset.y);
  }, []);

  const handleAccept = async () => {
    if (!booking) return;
    try {
      await acceptBooking(booking.id);
      Alert.alert('Accepted', 'Booking request accepted.');
      await load();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to accept booking.');
    }
  };

  const handleDecline = async () => {
    if (!booking) return;
    try {
      await declineBooking(booking.id);
      Alert.alert('Declined', 'Booking request declined.');
      await load();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to decline booking.');
    }
  };

  const handleConfirm = async () => {
    if (!booking) return;
    try {
      await confirmBooking(booking.id);
      Alert.alert('Confirmed', 'Booking confirmed.');
      await load();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to confirm booking.');
    }
  };

  const handleComplete = async () => {
    if (!booking) return;
    try {
      await completeBooking(booking.id);
      Alert.alert('Completed', 'Booking marked as completed.');
      await load();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to mark booking as completed.');
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    try {
      await cancelBooking(booking.id);
      Alert.alert('Cancelled', 'Booking has been cancelled.');
      await load();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to cancel booking.');
    }
  };

  const handleLeaveReview = () => {
    if (!booking) return;
    // Navigate to the student review route using query param to satisfy router typing
    router.push(`/(student)/booking-review?bookingId=${booking.id}`);

  };

  const statusKey = String(booking?.status ?? 'pending').toLowerCase();
  const badgeMeta = {
    pending: { label: 'Pending', variant: 'warning' as const },
    pending_tutor_acceptance: { label: 'Pending', variant: 'warning' as const },
    accepted: { label: 'Accepted', variant: 'primary' as const },
    confirmed: { label: 'Confirmed', variant: 'primary' as const },
    completed: { label: 'Completed', variant: 'success' as const },
    cancelled: { label: 'Cancelled', variant: 'danger' as const },
    rejected: { label: 'Rejected', variant: 'danger' as const },
  };
  const badge = badgeMeta[statusKey as keyof typeof badgeMeta] ?? badgeMeta.pending;

  return (
    <View style={styles.container}>
      <BookingHeader title="Booking Details" subtitle="Review your lesson information and next step." scrollY={scrollYRef.current} iconName="calendar-outline" />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <StateRenderer
          status={loading ? 'loading' : error ? 'error' : booking ? 'success' : 'empty'}
          error={error}
          onRetry={load}
          loadingMessage="Loading booking..."
          errorTitle="Failed to load booking"
          emptyTitle="Booking not found"
        >
          {() => (
            booking && (
              <>
                <BaseCard style={styles.heroCard} elevation="lg">
                  <View style={styles.heroTopRow}>
                    <View style={{ flex: 1 }}>
                      <AppText variant="h3">{booking.subject}</AppText>
                      <AppText variant="caption" style={styles.heroSubtitle}>{booking.scheduled_time ?? 'Schedule pending'}</AppText>
                    </View>
                    <Badge label={badge.label} variant={badge.variant} size="small" />
                  </View>

                  <View style={styles.heroProfileRow}>
                    <Avatar initials={(booking.tutor?.full_name ?? booking.tutor_id ?? 'TU').slice(0, 2).toUpperCase()} size={54} accessibilityLabel="Tutor avatar" />
                    <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                      <AppText variant="subtitle">{booking.tutor?.full_name ?? booking.tutorName ?? 'Tutor'}</AppText>
                      <AppText variant="caption" style={styles.heroSubtitle}>Tutor • {booking.student?.full_name ?? booking.student_id}</AppText>
                    </View>
                  </View>

                  {booking.message ? <AppText variant="body" style={styles.heroMessage}>{booking.message}</AppText> : null}
                </BaseCard>

                <BaseCard style={styles.infoCard} elevation="md">
                  <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={18} color={colors.primary} />
                    <AppText variant="body" style={styles.infoText}>Time: {booking.time ?? booking.scheduled_time ?? 'Pending'}</AppText>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="cash-outline" size={18} color={colors.primary} />
                    <AppText variant="body" style={styles.infoText}>Amount: {booking.total_amount ? `₵${booking.total_amount}` : 'Pending'}</AppText>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="create-outline" size={18} color={colors.primary} />
                    <AppText variant="body" style={styles.infoText}>Created: {booking.created_at ? new Date(booking.created_at).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</AppText>
                  </View>
                </BaseCard>

                {booking.payments && booking.payments.length > 0 ? (
                  <BaseCard style={styles.paymentCard} elevation="sm">
                    <AppText variant="subtitle">Payment</AppText>
                    {(() => {
                      const p = booking.payments![booking.payments!.length - 1];
                      return (
                        <View style={{ marginTop: spacing.sm }}>
                          <AppText variant="body" style={styles.infoText}>Amount: ₵{p.amount}</AppText>
                          <AppText variant="body" style={styles.infoText}>Status: {p.payment_status}</AppText>
                        </View>
                      );
                    })()}
                  </BaseCard>
                ) : null}

                <View style={styles.actionSection}>
                  {isTutor && booking.status === 'pending_tutor_acceptance' && (
                    <View style={styles.actionsRow}>
                      <SecondaryButton title="Decline" onPress={handleDecline} containerStyle={styles.actionButton} />
                      <PrimaryButton title="Accept" onPress={handleAccept} containerStyle={styles.actionButton} />
                    </View>
                  )}

                  {isTutor && booking.status === 'accepted' && (
                    <View style={styles.actionsRow}>
                      <SecondaryButton title="Confirm" onPress={handleConfirm} containerStyle={styles.actionButton} />
                      <PrimaryButton title="Mark Completed" onPress={handleComplete} containerStyle={styles.actionButton} />
                    </View>
                  )}

                  {isTutor && booking.status === 'confirmed' && (
                    <PrimaryButton title="Mark Completed" onPress={handleComplete} />
                  )}

                  {isStudent && booking.status === 'pending_payment' && (
                    (() => {
                      const amount = booking.total_amount ?? 0;
                      return <PrimaryButton title="Pay Now" onPress={() => router.push(`/(student)/payment-initiate?bookingId=${booking.id}&amount=${String(amount)}`)} />;
                    })()
                  )}

                  {isStudent && (booking.status === 'pending_tutor_acceptance' || booking.status === 'accepted' || booking.status === 'confirmed') && (
                    <SecondaryButton title="Cancel Request" onPress={handleCancel} />
                  )}

                  {isStudent && booking.status === 'completed' && (
                    <PrimaryButton title="Leave Review" onPress={handleLeaveReview} />
                  )}
                </View>
              </>
            )
          )}
        </StateRenderer>
      </Animated.ScrollView>
    </View>
  );
}
