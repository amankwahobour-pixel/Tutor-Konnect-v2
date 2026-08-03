import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getAllTutors } from '@/api/profile';
import { useApi } from '@/hooks/use-api';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StateRenderer } from '@/components/common';
import { BaseCard } from '@/components/cards';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/forms';
import { colors } from '@/theme';
import { styles } from '../styles/dashboard.styles';

export default function StudentDashboard() {
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all tutors
  const {
    data: tutorsResponse,
    loading,
    error,
    refetch,
  } = useApi(
    () => getAllTutors(),
    []
  );

  const tutors = useMemo(() => tutorsResponse?.data || [], [tutorsResponse?.data]);

  const filteredTutors = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return tutors.filter((tutor) => {
      const name = tutor.full_name?.toLowerCase() || '';
      const bio = tutor.bio?.toLowerCase() || '';
      return name.includes(query) || bio.includes(query);
    });
  }, [searchQuery, tutors]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    { label: 'Book lesson', icon: 'calendar-outline' as const, onPress: () => router.push('/(student)/my-lessons') },
    { label: 'Profile', icon: 'person-outline' as const, onPress: () => router.push('/(student)/profile') },
    { label: 'Messages', icon: 'chatbubble-ellipses-outline' as const, onPress: () => router.push('/messages') },
  ];

  const highlights = useMemo(
    () => [
      { label: 'Available', value: `${filteredTutors.length}` },
      { label: 'Focus', value: 'Live lessons' },
      { label: 'Support', value: '24/7 help' },
    ],
    [filteredTutors.length],
  );

  const listHeaderComponent = (
    <>
      <BaseCard elevation="lg" style={styles.heroCard}>
        <LinearGradient colors={['#E8F9FF', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroGradient}>
          <View style={styles.heroTopRow}>
            <View style={{ flex: 1 }}>
              <AppText variant="caption" color="textSecondary">Student dashboard</AppText>
              <AppText variant="h3" style={styles.heroTitle}>{getGreeting()}, {user?.full_name || 'student'} 👋</AppText>
              <AppText variant="body" color="textSecondary" style={styles.heroSubtitle}>Find the right tutor and keep your lessons moving forward.</AppText>
            </View>
            <Pressable accessibilityLabel="Open profile" onPress={() => router.push('/(student)/profile')} style={styles.profileButton}>
              <Ionicons name="person-circle-outline" size={30} color={colors.primary} />
            </Pressable>
          </View>

          <View style={styles.heroBadgeRow}>
            {highlights.map((item) => (
              <View key={item.label} style={styles.heroBadge}>
                <AppText variant="caption" style={styles.heroBadgeValue}>{item.value}</AppText>
                <AppText variant="caption" color="textSecondary">{item.label}</AppText>
              </View>
            ))}
          </View>

          <View style={styles.quickActionsRow}>
            {quickActions.map((action) => (
              <Pressable
                key={action.label}
                onPress={action.onPress}
                accessibilityRole="button"
                accessibilityLabel={action.label}
                style={styles.quickAction}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name={action.icon} size={18} color={colors.primary} />
                </View>
                <AppText variant="caption" style={styles.quickActionLabel}>{action.label}</AppText>
              </Pressable>
            ))}
          </View>
        </LinearGradient>
      </BaseCard>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search tutors by name or topic"
        style={styles.searchBar}
        inputStyle={styles.searchInput}
      />

      <View style={styles.sectionHeader}>
        <AppText variant="subtitle">Recommended tutors</AppText>
        <Badge label={`${filteredTutors.length} available`} variant="primary" size="small" />
      </View>
    </>
  );

  const renderTutor = useCallback(
    ({ item: tutor }: { item: (typeof tutors)[number] }) => (
      <BaseCard
        pressable
        accessibilityLabel={`Open ${tutor.full_name || 'tutor'} profile`}
        onPress={() => router.push({ pathname: '/(student)/tutor-detail', params: { tutorId: tutor.id } })}
        style={styles.tutorCard}
        elevation="md"
      >
        <View style={styles.tutorHeader}>
          <Avatar initials={(tutor.full_name || 'TU').slice(0, 2).toUpperCase()} size={48} accessibilityLabel="Tutor avatar" />
          <View style={styles.tutorInfo}>
            <View style={styles.tutorNameRow}>
              <AppText variant="subtitle" style={styles.tutorName}>{tutor.full_name || 'Tutor'}</AppText>
              <Badge label="Verified" variant="success" size="small" />
            </View>
            {tutor.bio ? <AppText variant="caption" style={styles.tutorBio}>{tutor.bio}</AppText> : null}
          </View>
        </View>
        <View style={styles.tutorMetaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="star-outline" size={14} color={colors.warning} />
            <AppText variant="caption" style={styles.metaText}>4.8</AppText>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="location-outline" size={14} color={colors.primary} />
            <AppText variant="caption" style={styles.metaText}>{tutor.location || 'Flexible online'}</AppText>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="sparkles-outline" size={14} color={colors.secondary} />
            <AppText variant="caption" style={styles.metaText}>Tailored plans</AppText>
          </View>
        </View>
        <View style={styles.tutorActions}>
          <SecondaryButton title="View profile" onPress={() => router.push({ pathname: '/(student)/tutor-detail', params: { tutorId: tutor.id } })} containerStyle={styles.actionButton} />
          <PrimaryButton title="Book" onPress={() => router.push({ pathname: '/(student)/book-lesson', params: { tutorId: tutor.id } })} containerStyle={styles.actionButton} />
        </View>
      </BaseCard>
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StateRenderer
        status={loading ? 'loading' : error ? 'error' : filteredTutors.length === 0 ? 'empty' : 'success'}
        error={error}
        onRetry={refetch}
        loadingMessage="Finding tutors..."
        errorTitle="Failed to load tutors"
        emptyTitle="No tutors found"
        emptySubtitle={searchQuery ? 'Try a different search' : 'Explore our tutors'}
        emptyIcon={<Ionicons name="search" size={64} color={colors.textSecondary} />}
      >
        {() => (
          <FlatList
            data={filteredTutors}
            keyExtractor={(item) => item.id}
            renderItem={renderTutor}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
            ListHeaderComponent={listHeaderComponent}
            ListFooterComponent={<View style={{ height: 32 }} />}
          />
        )}
      </StateRenderer>
    </SafeAreaView>
  );
}
