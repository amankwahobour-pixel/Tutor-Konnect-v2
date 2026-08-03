import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, RefreshControl, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getMessagesForUser } from '@/features/chat/api/messages.api';
import { getUserProfile } from '@/api/profile';
import { StateRenderer } from '@/components/common';
import { SearchBar } from '@/components/forms';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { BaseCard } from '@/components/cards';
import { colors } from '@/theme';
import styles from '../styles/conversations.styles';
import type { Message } from '@/features/chat/types';
import type { UserProfile } from '@/types';
import { useApi } from '@/hooks/use-api';
import { pushPath, buildChatRoute } from '@/lib/navigation';
import { WaveHeader } from '@/components/headers';

interface ConversationItem {
  id: string;
  last: Message;
  unread: number;
  profile?: UserProfile;
}

export default function ConversationsScreen() {
  const { user } = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const scrollY = useSharedValue(0);

  const { data: convData, loading, error, refetch } = useApi(
    async () => {
      if (!user?.id) return Promise.resolve({ data: [] as ConversationItem[] });
      const res = await getMessagesForUser(user.id);
      const messages = (res?.data ?? []) as Message[];
      const convMap: Record<string, ConversationItem> = {};
      for (const message of messages) {
        const other = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        if (!convMap[other]) {
          convMap[other] = { id: other, last: message, unread: 0 };
        }
        if (new Date(message.created_at).getTime() > new Date(convMap[other].last.created_at).getTime()) {
          convMap[other].last = message;
        }
        if (message.receiver_id === user.id && !message.is_read) {
          convMap[other].unread += 1;
        }
      }
      const convList = Object.values(convMap);

      await Promise.all(convList.map(async (conversation) => {
        try {
          const profileResponse = await getUserProfile(conversation.id);
          if (profileResponse?.data) {
            conversation.profile = profileResponse.data;
          }
        } catch {
          // ignore profile lookup failures and keep the conversation visible
        }
      }));

      return { data: convList };
    },
    [user?.id],
  );

  const convos = useMemo(() => convData?.data ?? [], [convData?.data]);

  const filteredConversations = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    return convos.filter((conversation) => {
      const displayName = conversation.profile?.full_name ?? conversation.id;
      const matchesText = !term || displayName.toLowerCase().includes(term) || conversation.last.message.toLowerCase().includes(term);
      const matchesFilter = !showUnreadOnly || conversation.unread > 0;
      return matchesText && matchesFilter;
    });
  }, [convos, searchQuery, showUnreadOnly]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = useCallback(
    ({ item, index }: { item: ConversationItem; index: number }) => {
      const displayName = item.profile?.full_name ?? item.id;
      const initials = displayName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
      const preview = item.last.message || 'Tap to start chatting';
      const timeLabel = new Date(item.last.created_at).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });

      return (
        <Pressable
          key={item.id}
          onPress={() => pushPath(buildChatRoute(item.id))}
          accessibilityRole="button"
          accessibilityLabel={`Open chat with ${displayName}`}
          style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]} 
        >
          <BaseCard style={styles.card} elevation="sm">
            <View style={styles.cardRow}>
              <View style={styles.avatarWrap}>
                <Avatar initials={initials} size={54} style={styles.avatar} />
                <View style={styles.onlineDot} />
              </View>
              <View style={styles.meta}>
                <View style={styles.topRow}>
                  <AppText variant="subtitle" numberOfLines={1} style={styles.name}>{displayName}</AppText>
                  <AppText variant="caption" color="textSecondary">{timeLabel}</AppText>
                </View>
                <View style={styles.bottomRow}>
                  <AppText variant="bodySmall" color="textSecondary" numberOfLines={1} style={styles.preview}>{preview}</AppText>
                  {item.unread > 0 ? <Badge label={`${item.unread}`} variant="primary" size="small" /> : null}
                </View>
              </View>
            </View>
          </BaseCard>
        </Pressable>
      );
    },
    [],
  );

  return (
    <View style={styles.container}>
      <WaveHeader
        title="Messages"
        subtitle="Stay in touch with your students"
        scrollY={scrollY}
      />
      <StateRenderer
        status={loading ? 'loading' : error ? 'error' : filteredConversations.length === 0 ? 'empty' : 'success'}
        error={error}
        onRetry={refetch}
        loadingMessage="Loading conversations..."
        emptyTitle="No conversations yet"
        emptySubtitle="Start a conversation after booking a lesson."
      >
        {() => (
          <Animated.FlatList
            data={filteredConversations}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={scrollHandler}
            contentContainerStyle={styles.scrollContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
            ListHeaderComponent={
              <View style={styles.searchSection}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search conversations"
                  style={styles.searchBar}
                  inputStyle={styles.searchInput}
                  accessibilityLabel="Search conversations"
                />
                <View style={styles.filterRow}>
                  <Pressable
                    onPress={() => setShowUnreadOnly(false)}
                    accessibilityRole="button"
                    accessibilityLabel="Show all conversations"
                    style={[styles.filterChip, !showUnreadOnly && styles.filterChipActive]}
                  >
                    <AppText variant="caption" style={[styles.filterText, !showUnreadOnly && styles.filterTextActive]}>All</AppText>
                  </Pressable>
                  <Pressable
                    onPress={() => setShowUnreadOnly(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Show unread conversations"
                    style={[styles.filterChip, showUnreadOnly && styles.filterChipActive]}
                  >
                    <AppText variant="caption" style={[styles.filterText, showUnreadOnly && styles.filterTextActive]}>Unread</AppText>
                  </Pressable>
                </View>
              </View>
            }
            ListFooterComponent={<View style={styles.bottomSpacing} />}
            removeClippedSubviews
          />
        )}
      </StateRenderer>
    </View>
  );
}
