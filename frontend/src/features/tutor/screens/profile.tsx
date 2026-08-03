import { router } from 'expo-router';
import React from 'react';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getTutorProfile } from '@/api/tutor';
import { getTutorReviews } from '@/api/booking';
import { Button, StateRenderer } from '@/components';
import { Image, ScrollView, Text, View, RefreshControl } from 'react-native';
import styles from '../styles/profile.styles';
import type { TutorProfile, Review } from '@/types';
import { useApi } from '@/hooks/use-api';
import { ReviewList } from '@/components/common/ReviewList';

export default function TutorProfileScreen() {
  const { user } = useAuthContext();

  const {
    data: profileResponse,
    loading,
    error,
    refetch: refetchProfile,
  } = useApi(
    () => {
      if (!user?.id) return Promise.resolve({ data: null as TutorProfile | null });
      return getTutorProfile(user.id).then((res) => ({ data: res.data ? { ...res.data, subjects: res.data.subjects ?? [] } as TutorProfile : null }));
    },
    [user?.id]
  );

  const {
    data: reviewsResponse,
    loading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = useApi(
    () => {
      if (!user?.id) {
        return Promise.resolve({ data: [] as Review[] });
      }
      return getTutorReviews(user.id).then((res) => ({ data: res.data }));
    },
    [user?.id]
  );

  const profile = profileResponse?.data ?? null;

  const handleRefresh = async () => {
    await Promise.all([refetchProfile(), refetchReviews()]);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading || reviewsLoading} onRefresh={handleRefresh} tintColor="#22C7F0" />}
    >
      {/* Header Wave */}
      <Image
        source={require('@/assets/images/header-wave.png')}
        style={styles.headerWaves}
        resizeMode="cover"
      />

      <StateRenderer
        status={loading ? 'loading' : error ? 'error' : 'success'}
        error={error}
        onRetry={refetchProfile}
        loadingMessage="Loading your profile..."
        errorTitle="Failed to load profile"
      >
        {() => (
          <>
            {/* Profile Section */}
            <View style={styles.profileContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.full_name?.[0] ?? 'T'}</Text>
              </View>

              <Text style={styles.name}>
                {user?.full_name ?? profile?.user_id ?? 'Tutor'}
              </Text>

              <Text style={styles.role}>
                {profile?.subjects?.length ? profile.subjects.join(', ') : 'Tutor'}
              </Text>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {profile?.verification_status === 'approved' ? 'Verified Tutor' : (profile?.verification_status ?? 'Verification Pending')}
                </Text>
              </View>
            </View>

            {/* About */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                About Me
              </Text>

              <Text style={styles.description}>
                {profile?.bio ?? user?.bio ?? 'No bio yet. Add a short description about your teaching approach and experience.'}
              </Text>
            </View>

            {/* Teaching Info */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                Teaching Information
              </Text>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Subjects</Text>
                <Text style={styles.value}>
                {profile?.subjects?.length ? profile.subjects.join(', ') : '—'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Experience</Text>
                <Text style={styles.value}>
                  {profile?.experience_years ? `${profile.experience_years} Years` : '—'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Hourly Rate</Text>
                <Text style={styles.value}>
                  {profile?.hourly_rate ? `₵${profile.hourly_rate}/hr` : '—'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Location</Text>
                <Text style={styles.value}>
                  {profile?.location ?? '—'}
                </Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {profile?.total_sessions ?? '—'}
                </Text>
 
                <Text style={styles.statLabel}>
                  Sessions
                </Text>
              </View>
 
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {profile?.rating_avg ?? '—'}
                </Text>
 
                <Text style={styles.statLabel}>
                  Rating
                </Text>
              </View>
 
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {profile?.rating_count ?? '—'}
                </Text>
 
                <Text style={styles.statLabel}>
                  Reviews
                </Text>
              </View>
            </View>
 
                  <View style={{ marginTop: 20 }}>
              <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 12 }}>Latest Reviews</Text>
              <StateRenderer
                status={reviewsLoading ? 'loading' : reviewsError ? 'error' : reviewsResponse?.data?.length ? 'success' : 'empty'}
                error={reviewsError}
                onRetry={refetchReviews}
                loadingMessage="Loading reviews..."
                errorTitle="Unable to load reviews"
                emptyTitle="No reviews yet"
                emptySubtitle="Students have not left reviews yet."
              >
                {() => <ReviewList reviews={reviewsResponse?.data?.slice(0, 3) ?? []} showReviewer />}
              </StateRenderer>
            </View>
  
            <Button
              title="Edit Profile"
              onPress={() => router.push('/(tutor)/settings')}
              containerStyle={styles.button}
                    accessibilityLabel="Edit profile"
                  />

                  <View style={{ height: 40 }} />
          </>
        )}
      </StateRenderer>
    </ScrollView>
  );
}