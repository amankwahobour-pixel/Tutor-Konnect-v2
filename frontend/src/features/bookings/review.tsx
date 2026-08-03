import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, TextInput, Alert } from 'react-native';
import { createReview, getReviewByBooking, updateReview } from '@/api/booking';
import { Button, StateRenderer } from '@/components';
import styles from './booking.styles';

export default function BookingReviewScreen() {
  const params = useLocalSearchParams();
  const bookingId = Array.isArray(params.bookingId) ? params.bookingId[0] : (params.bookingId || '');

  const [rating, setRating] = React.useState('5');
  const [comment, setComment] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loadingReview, setLoadingReview] = React.useState(false);
  const [reviewExists, setReviewExists] = React.useState(false);
  const [loadError, setLoadError] = React.useState<Error | null>(null);

  const loadReview = React.useCallback(async () => {
    if (!bookingId) return;
    setLoadingReview(true);
    setLoadError(null);

    try {
      const response = await getReviewByBooking(bookingId);
      const review = response?.data;
      if (review) {
        setReviewExists(true);
        setRating(String(review.rating));
        setComment(review.review_text ?? '');
      } else {
        setReviewExists(false);
      }
    } catch (err) {
      setReviewExists(false);
      setLoadError(err instanceof Error ? err : new Error('Failed to load review'));
    } finally {
      setLoadingReview(false);
    }
  }, [bookingId]);

  React.useEffect(() => {
    const fetchReview = async () => {
      await loadReview();
    };

    void fetchReview();
  }, [loadReview]);

  const submit = async () => {
    if (!bookingId) return;
    const ratingValue = Math.min(5, Math.max(1, Number(rating) || 1));
    setLoading(true);

    try {
      if (reviewExists) {
        await updateReview(bookingId, { rating: ratingValue, review_text: comment });
        Alert.alert('Updated', 'Your review has been updated.');
      } else {
        await createReview(bookingId, { rating: ratingValue, review_text: comment });
        Alert.alert('Thanks', 'Your review has been submitted.');
      }
      router.back();
    } catch (err) {
      console.error('Failed to submit review', err);
      Alert.alert('Error', 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { padding: 16 }]}> 
      <StateRenderer
        status={loadingReview ? 'loading' : loadError ? 'error' : 'success'}
        error={loadError}
        onRetry={loadReview}
        loadingMessage="Loading review..."
        errorTitle="Unable to load review"
      >
        {() => (
          <>
            <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 8 }}>
              {reviewExists ? 'Update your review' : 'Leave a review'}
            </Text>
            <Text style={{ marginBottom: 6 }}>Rating (1-5)</Text>
            <TextInput
              value={rating}
              onChangeText={(value) => setRating(value.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              editable={!loading}
              style={{ borderWidth: 1, borderColor: '#E6EEF8', padding: 12, borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' }}
            />
            <Text style={{ marginBottom: 6 }}>Comment</Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              multiline
              editable={!loading}
              placeholder="Share what worked well or how the lesson went."
              style={{ borderWidth: 1, borderColor: '#E6EEF8', padding: 12, borderRadius: 8, height: 120, backgroundColor: '#fff' }}
            />

            <View style={{ height: 12 }} />
            <Button
              title={loading ? 'Submitting...' : reviewExists ? 'Update Review' : 'Submit Review'}
              onPress={submit}
              disabled={loadingReview || loading}
            />
          </>
        )}
      </StateRenderer>
    </View>
  );
}
