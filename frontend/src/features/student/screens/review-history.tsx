import React from 'react';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getStudentReviews } from '@/api/booking';
import { useApi } from '@/hooks/use-api';
import { ReviewList } from '@/components/common/ReviewList';
import { StateRenderer } from '@/components/common';
import { Button } from '@/components';
import { ScrollView, Text, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '@/theme';

export default function ReviewHistoryScreen() {
  const { user } = useAuthContext();

  const {
    data: reviews,
    loading,
    error,
    refetch,
  } = useApi(
    () => {
      if (!user?.id) {
        return Promise.reject(new Error('User ID missing'));
      }
      return getStudentReviews(user.id).then((res) => res.data);
    },
    [user?.id]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>Review History</Text>
          <Text style={{ marginTop: 6, color: colors.textTertiary }}>See all the feedback you have shared with tutors.</Text>
        </View>

        <StateRenderer
          status={loading ? 'loading' : error ? 'error' : reviews?.length ? 'success' : 'empty'}
          error={error}
          onRetry={refetch}
          loadingMessage="Loading your reviews..."
          errorTitle="Unable to load reviews"
          emptyTitle="No reviews yet"
          emptySubtitle="Complete a booking to leave your first review."
        >
          {() => <ReviewList reviews={reviews ?? []} title={undefined} showReviewer />}
        </StateRenderer>

        <View style={{ marginTop: 24 }}>
          <Button title="Back to Profile" onPress={() => router.back()} variant="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
