import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { StateRenderer } from '@/components';
import { SearchBar } from '@/components/forms';
import { AppText } from '@/components/ui/AppText';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getTutorRequests, acceptBooking, declineBooking } from '@/api/booking';
import type { TutorRequest, ApiResponse } from '@/types';
import { styles as createStyles } from '../styles/requests.styles';
import { useThemedStyles } from '@/theme';
import RequestsHeader from '../components/requests/RequestsHeader';
import RequestCard from '../components/requests/RequestCard';

type FilterStatus = 'all' | 'pending' | 'accepted' | 'declined' | 'completed';

export default function RequestsScreen() {
  const styles = useThemedStyles(createStyles);
  const { user } = useAuthContext();
  const [requests, setRequests] = useState<TutorRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user) return;

      const response = (await getTutorRequests(user.id)) as ApiResponse<TutorRequest[]>;

      if (response?.data) {
        setRequests(response.data);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : new Error('Failed to load requests'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    const init = async () => {
      await loadRequests();
    };

    void init();
  }, [loadRequests]);

  const onAccept = useCallback(async (id: string) => {
    try {
      await acceptBooking(id);
      setRequests((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert('Failed to accept request');
    }
  }, []);

  const onDecline = useCallback(async (id: string) => {
    try {
      await declineBooking(id);
      setRequests((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert('Failed to decline request');
    }
  }, []);

  const filters = useMemo(
    () => [
      { label: 'All', value: 'all' as const },
      { label: 'Pending', value: 'pending' as const },
      { label: 'Accepted', value: 'accepted' as const },
      { label: 'Declined', value: 'declined' as const },
      { label: 'Completed', value: 'completed' as const },
    ],
    [],
  );

  const filteredRequests = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();

    return requests.filter((request) => {
      const studentName = typeof request.student === 'string' ? request.student : request.student?.full_name || 'Student';
      const matchesSearch =
        !term ||
        studentName.toLowerCase().includes(term) ||
        request.subject?.toLowerCase().includes(term) ||
        request.level?.toLowerCase().includes(term);
      const matchesFilter = activeFilter === 'all' || request.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, requests, searchQuery]);

  const renderItem = useCallback(
    ({ item, index }: { item: TutorRequest; index: number }) => (
      <RequestCard request={item} onAccept={onAccept} onDecline={onDecline} />
    ),
    [onAccept, onDecline],
  );

  return (
    <View style={styles.container}>
      <RequestsHeader
        title="Lesson Requests"
        subtitle="Review and respond to student requests"
        requestCount={requests.length}
        scrollY={scrollY}
      />

      <StateRenderer
        status={loading ? 'loading' : error ? 'error' : filteredRequests.length === 0 ? 'empty' : 'success'}
        error={error}
        onRetry={loadRequests}
        loadingMessage="Loading requests..."
        errorTitle="Failed to load requests"
        emptyTitle="No lesson requests yet"
        emptySubtitle="When students request lessons they'll appear here."
      >
        {() => (
          <Animated.FlatList
            data={filteredRequests}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={scrollHandler}
            ListHeaderComponent={
              <View style={styles.searchSection}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search student or subject"
                  style={styles.searchBar}
                  inputStyle={styles.searchInput}
                  accessibilityLabel="Search requests"
                />
                <View style={styles.filterRow}>
                  {filters.map((filter) => {
                    const active = activeFilter === filter.value;
                    return (
                      <Pressable
                        key={filter.value}
                        onPress={() => setActiveFilter(filter.value)}
                        accessibilityRole="button"
                        accessibilityLabel={`Filter ${filter.label}`}
                        style={[styles.filterChip, active && styles.filterChipActive]}
                      >
                        <AppText variant="caption" style={[styles.filterText, active && styles.filterTextActive]}>
                          {filter.label}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            }
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={<View style={styles.bottomSpacing} />}
            removeClippedSubviews
          />
        )}
      </StateRenderer>
    </View>
  );
}