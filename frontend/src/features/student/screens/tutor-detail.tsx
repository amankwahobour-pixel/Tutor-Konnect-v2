import { useLocalSearchParams, router } from 'expo-router';
import { useApi } from '@/hooks/use-api';
import { getTutorProfile } from '@/api/tutor';
import { getTutorReviews } from '@/api/booking';
import { useEffect } from 'react';
import { colors, spacing } from '@/theme';
import { ScrollView, View, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StateRenderer } from '@/components/common';
import { ReviewList } from '@/components/common/ReviewList';
import { BaseCard } from '@/components/cards';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { styles } from '../styles/tutor-detail.styles';

export default function TutorDetailScreen() {
  const params = useLocalSearchParams();
  const tutorId = Array.isArray(params.tutorId) ? params.tutorId[0] : params.tutorId;

  const {
    data,
    loading,
    error,
    refetch,
  } = useApi(
    () => {
      if (!tutorId) {
        return Promise.reject(new Error('Tutor ID missing'));
      }
      return getTutorProfile(tutorId);
    },
    [tutorId]
  );

  const {
    data: reviewsData,
    loading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = useApi(
    () => {
      if (!tutorId) {
        return Promise.reject(new Error('Tutor ID missing'));
      }
      return getTutorReviews(tutorId).then((res) => res.data);
    },
    [tutorId]
  );

  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchReviews()]);
  };

  useEffect(() => {
    if (!tutorId) {
      router.replace('/(student)/dashboard');
    }
  }, [tutorId]);

  const tutor = data?.data;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading || reviewsLoading} onRefresh={handleRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={28} color={colors.primary} />
          </Pressable>
          <AppText variant="title" style={styles.title}>Tutor profile</AppText>
        </View>

        <StateRenderer
          status={loading ? 'loading' : error ? 'error' : tutor ? 'success' : 'empty'}
          error={error}
          onRetry={refetch}
          loadingMessage="Loading tutor details..."
          errorTitle="Unable to load tutor"
          emptyTitle="No tutor found"
        >
          {() => tutor ? (
            <>
              <BaseCard style={styles.heroCard} elevation="lg">
                <LinearGradient colors={['#E8F9FF', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroGradient}>
                  <View style={styles.profileHeader}>
                    <Avatar initials={(tutor.user_id || 'TU').slice(0, 2).toUpperCase()} size={72} accessibilityLabel="Tutor avatar" />
                    <View style={styles.profileInfo}>
                      <View style={styles.nameRow}>
                        <AppText variant="h3">{`Tutor ${tutor.user_id || ''}`}</AppText>
                        <Badge label={tutor.verification_status || 'Active'} variant="success" size="small" />
                      </View>
                      <AppText variant="caption" style={styles.role}>{tutor.location ?? 'Available for sessions'}</AppText>
                    </View>
                  </View>

                  <AppText variant="body" style={styles.sectionText}>{tutor.bio || 'No biography available.'}</AppText>

                  <View style={styles.chipsRow}>
                    <Badge label={`${tutor.total_sessions ?? 0} sessions`} variant="primary" size="small" />
                    <Badge label={`${tutor.rating_avg?.toFixed(1) || '0.0'} rating`} variant="secondary" size="small" />
                    <Badge label={tutor.availability_notes || 'Flexible availability'} variant="secondary" size="small" />
                  </View>
                </LinearGradient>
              </BaseCard>

              <BaseCard style={styles.statsCard} elevation="md">
                <View style={styles.sectionRow}>
                  <View style={styles.statCard}>
                    <AppText variant="h3">{tutor.rating_avg?.toFixed(1) || '—'}</AppText>
                    <AppText variant="caption" style={styles.statLabel}>Rating</AppText>
                  </View>
                  <View style={styles.statCard}>
                    <AppText variant="h3">{tutor.rating_count ?? 0}</AppText>
                    <AppText variant="caption" style={styles.statLabel}>Reviews</AppText>
                  </View>
                  <View style={styles.statCard}>
                    <AppText variant="h3">{tutor.total_sessions ?? 0}</AppText>
                    <AppText variant="caption" style={styles.statLabel}>Sessions</AppText>
                  </View>
                </View>
              </BaseCard>

              <BaseCard style={styles.sectionCard} elevation="sm">
                <AppText variant="subtitle">Subjects</AppText>
                <View style={styles.chipsRow}>
                  {tutor.subjects?.length ? tutor.subjects.map((subject) => (
                    <Badge key={subject} label={subject} variant="primary" size="small" style={styles.chip} />
                  )) : <AppText variant="caption" style={styles.sectionText}>No subjects listed.</AppText>}
                </View>
              </BaseCard>

              <BaseCard style={styles.sectionCard} elevation="sm">
                <AppText variant="subtitle">Latest reviews</AppText>
                <View style={{ marginTop: spacing.sm }}>
                  <StateRenderer
                    status={reviewsLoading ? 'loading' : reviewsError ? 'error' : reviewsData?.length ? 'success' : 'empty'}
                    error={reviewsError}
                    onRetry={refetchReviews}
                    loadingMessage="Loading reviews..."
                    errorTitle="Unable to load reviews"
                    emptyTitle="No reviews yet"
                    emptySubtitle="This tutor has not received any reviews yet."
                  >
                    {() => <ReviewList reviews={reviewsData?.slice(0, 3) ?? []} showReviewer />}
                  </StateRenderer>
                </View>
              </BaseCard>

              <View style={styles.actionsRow}>
                <PrimaryButton title="Request booking" onPress={() => router.push({ pathname: '/(student)/book-lesson', params: { tutorId: tutor.id } })} containerStyle={styles.actionButton} />
                <SecondaryButton title="Browse more" onPress={() => router.push('/(student)/dashboard')} containerStyle={styles.actionButton} />
              </View>
            </>
          ) : null}
        </StateRenderer>
      </ScrollView>
    </SafeAreaView>
  );
}