import React, { useCallback } from 'react';
import { FlatList, TouchableOpacity, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getNotifications, markNotificationRead, markAllRead, NotificationItem } from '@/features/notifications/api/notifications.api';
import { StateRenderer } from '@/components/common';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { colors } from '@/theme';
import styles from '../styles/notifications.styles';
import { useApi } from '@/hooks/use-api';
import { pushPath } from '@/lib/navigation';

function normalizeRoute(route: string) {
  return route.replace('/(student)', '').replace('/(tutor)', '');
}

export default function NotificationsScreen() {
  const { user } = useAuthContext();
  const [refreshing, setRefreshing] = React.useState(false);

  const { data: notificationsResponse, loading, error, refetch } = useApi(
    () => {
      if (!user?.id) return Promise.resolve({ data: [] as NotificationItem[] });
      return getNotifications(user.id).then((res) => ({ data: res.data ?? [] }));
    },
    [user?.id]
  );

  const notifications = notificationsResponse?.data ?? [];
  const unreadCount = notifications.filter((item) => !item.read).length;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const buildQuery = useCallback((params: Record<string, any> | undefined) => {
    if (!params) return '';
    const parts: string[] = [];
    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v === undefined || v === null) return;
      if (Array.isArray(v)) {
        v.forEach((item) => parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(item))}`));
      } else {
        parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
      }
    });
    return parts.join('&');
  }, []);

  const onOpen = useCallback(
    (notification: NotificationItem) => {
      const route = notification.data?.route;
      const params = notification.data?.params as Record<string, any> | undefined;
      if (typeof route === 'string') {
        try {
          const normalized = normalizeRoute(route);
          const qs = buildQuery(params);
          const dest = qs ? `${normalized}?${qs}` : normalized;
          pushPath(dest);
        } catch (err) {
          console.warn('Navigation failed for notification', err);
        }
      }
    },
    [buildQuery],
  );

  const onMarkRead = useCallback(async (id: string) => {
    try {
      await markNotificationRead(id);
      await refetch();
    } catch (err) {
      console.warn('Failed to mark notification read', err);
    }
  }, [refetch]);

  const renderNotification = useCallback(
    ({ item: notification }: { item: NotificationItem }) => {
      const isUnread = !notification.read;
      return (
        <BaseCard
          pressable
          accessibilityLabel={`Open notification titled ${notification.title}`}
          onPress={() => {
            onOpen(notification);
            if (isUnread) void onMarkRead(notification.id);
          }}
          style={[styles.card, isUnread && styles.unreadCard]}
          elevation="sm"
        >
          <View style={[styles.iconContainer, { backgroundColor: isUnread ? colors.primaryLight : colors.surfaceVariant }]}> 
            <Ionicons name={isUnread ? 'notifications' : 'notifications-outline'} size={20} color={isUnread ? colors.primary : colors.textSecondary} />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.topRow}>
              <AppText variant="body" style={styles.cardTitle}>{notification.title}</AppText>
              {isUnread ? <View style={styles.unreadDot} /> : null}
            </View>

            <AppText variant="bodySmall" style={styles.description}>{notification.message}</AppText>
            <AppText variant="caption" style={styles.time}>{new Date(notification.created_at).toLocaleString()}</AppText>
          </View>
        </BaseCard>
      );
    },
    [onOpen, onMarkRead],
  );

  const onMarkAllRead = useCallback(async () => {
    if (!user) return;
    try {
      await markAllRead(user.id);
      await refetch();
    } catch (err) {
      console.warn('Failed to mark all read', err);
    }
  }, [refetch, user]);

  const status = loading ? 'loading' : error ? 'error' : notifications.length === 0 ? 'empty' : 'success';

  return (
    <SafeAreaView style={styles.container}>
      <StateRenderer
        status={status}
        error={error}
        onRetry={refetch}
        loadingMessage="Loading notifications..."
        emptyTitle="No notifications"
        emptySubtitle="You have no new notifications."
      >
        {() => (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotification}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
            ListHeaderComponent={
              <>
                <LinearGradient colors={['#E8F9FF', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
                  <View style={styles.headerRow}>
                    <View style={{ flex: 1 }}>
                      <AppText variant="caption" style={styles.eyebrow}>Activity center</AppText>
                      <AppText variant="h3">Notifications</AppText>
                      <AppText variant="body" style={styles.subtitle}>Stay on top of lesson updates and account activity.</AppText>
                    </View>
                    <Badge label={`${unreadCount} unread`} variant={unreadCount > 0 ? 'primary' : 'secondary'} size="small" />
                  </View>
                </LinearGradient>

                <View style={styles.content}>
                  <View style={styles.toolbar}>
                    <AppText variant="subtitle">Recent updates</AppText>
                  <TouchableOpacity
                    onPress={onMarkAllRead}
                    accessibilityRole="button"
                    accessibilityLabel="Mark all notifications read"
                    style={styles.toolbarButton}
                  >
                      <Ionicons name="checkmark-done-outline" size={16} color={colors.primary} />
                      <AppText variant="bodySmall" style={styles.toolbarButtonText}>Mark all read</AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            }
            ListFooterComponent={<View style={styles.spacer} />}
            removeClippedSubviews
            initialNumToRender={8}
            maxToRenderPerBatch={12}
          />
        )}
      </StateRenderer>
    </SafeAreaView>
  );
}
