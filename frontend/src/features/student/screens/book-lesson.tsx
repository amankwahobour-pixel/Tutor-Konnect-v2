import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { ScrollView, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { createBooking } from '@/api/booking';
import { enqueueBooking } from '@/services/booking-queue';
import { Button, Input } from '@/components';
import { styles } from '../styles/book-lesson.styles';
import type { BookingPayload } from '@/types';

export default function BookLessonScreen() {
  const params = useLocalSearchParams();
  const tutorId = Array.isArray(params.tutorId) ? params.tutorId[0] : (params.tutorId || '');
  const queuedIdParam = Array.isArray(params.queuedId) ? params.queuedId[0] : (params.queuedId || undefined);
  const queuedPayloadParam = Array.isArray(params.queuedPayload) ? params.queuedPayload[0] : (params.queuedPayload || undefined);

  const queuedPayload = React.useMemo((): BookingPayload | null => {
    if (!queuedPayloadParam) return null;
    try {
      return typeof queuedPayloadParam === 'string' ? JSON.parse(queuedPayloadParam) : queuedPayloadParam;
    } catch {
      return null;
    }
  }, [queuedPayloadParam]);

  const [subject, setSubject] = React.useState(queuedPayload?.subject ?? '');
  const [level, setLevel] = React.useState(queuedPayload?.level ?? '');
  const [scheduledTime, setScheduledTime] = React.useState(queuedPayload?.scheduled_time ?? '');
  const [message, setMessage] = React.useState(queuedPayload?.message ?? '');
  const [loading, setLoading] = React.useState(false);
  const [editingQueuedId] = React.useState<string | null>(queuedIdParam ? String(queuedIdParam) : null);

  const { user } = useAuthContext();

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (!user) throw new Error('User not authenticated');
      const payload: BookingPayload = {
        tutor_id: tutorId,
        student_id: user.id,
        subject,
        level,
        scheduled_time: scheduledTime,
        message,
      };

      try {
        await createBooking(payload);
        Alert.alert('Request sent', 'Your booking request was submitted.');
        // if we were editing a queued request, remove the old one
        if (editingQueuedId) {
          const { removeQueuedBooking } = await import('@/services/booking-queue');
          await removeQueuedBooking(editingQueuedId);
        }
        router.push('/(student)/my-lessons');
      } catch (err) {
        console.warn('Booking endpoint not available or failed', err);
        try {
          const queued = await enqueueBooking(payload);
          console.debug('Queued booking', queued.id);
          const { trackEvent } = await import('@/services/analytics');
          trackEvent('booking.queued', { id: queued.id });
          // if editing an existing queued item remove the old one
          if (editingQueuedId) {
            const { removeQueuedBooking } = await import('@/services/booking-queue');
            try {
              await removeQueuedBooking(editingQueuedId);
            } catch (e) {
              console.debug('Failed to remove old queued booking after re-queue', e);
            }
          }
          Alert.alert('Request saved locally', 'Your booking request was saved and will be synced when connectivity is available.');
          router.push('/(student)/my-lessons');
        } catch (e) {
          console.error('Failed to queue booking', e);
          Alert.alert('Error', 'Failed to submit or save the booking request.');
        }
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Failed to create booking', error);
      Alert.alert('Error', error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Request a Lesson</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Subject</Text>
          <Input
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            placeholder="e.g. Mathematics"
            label="Subject"
          />

          <Text style={styles.label}>Level</Text>
          <Input
            style={styles.input}
            value={level}
            onChangeText={setLevel}
            placeholder="e.g. SHS 2"
            label="Level"
          />

          <Text style={styles.label}>Preferred Date & Time</Text>
          <Input
            style={styles.input}
            value={scheduledTime}
            onChangeText={setScheduledTime}
            placeholder="e.g. 2026-07-20 16:00"
            label="Preferred date and time"
          />

          <Text style={styles.label}>Message to Tutor (optional)</Text>
          <Input
            style={[styles.input, { height: 100 }]}
            value={message}
            onChangeText={setMessage}
            multiline
            label="Message to tutor"
          />

          <Button
            title={loading ? 'Sending...' : 'Send Request'}
            onPress={onSubmit}
            disabled={loading}
            containerStyle={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
