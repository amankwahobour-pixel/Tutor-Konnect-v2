import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, RefreshControl, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '@/features/auth/context/auth.context';
import {
  getParentNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteParentNotification,
} from '../api/parent.api';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { PrimaryButton } from '@/components/buttons';
import { Screen } from '@/components/layout';
import { StateRenderer, EmptyState } from '@/components/common';
import { colors, radius, spacing } from '@/theme';
import type { ParentNotification, ParentNotificationType } from '../types';

const notificationIcons: Record<ParentNotificationType, string> = {
  lesson_booking: 'calendar-outline',
  lesson_cancellation: 'close-circle-outline',
  tutor_change: 'swap-horizontal-outline',
  homework: 'document-text-outline',
  attendance: 'checkmark-done-outline',
  payment: 'wallet-outline',
  progress_report: 'stats-chart-outline',
  linking_request: 'link-outline',
  linking_approved: 'checkmark-circle-outline',
  linking_rejected: 'close-circle-outline',
};

const notificationColors: Record<ParentNotificationType, string> = {
  lesson_booking: colors.primary,
  lesson_cancellation: colors.danger,
  tutor_change: colors.secondary,
  homework: colors.warning,
  attendance: colors.success,
  payment: colors.success,
  progress_report: colors.primary,
  linking_request: colors.secondary,
  linking_approved: colors.success,
  linking_rejected: colors.danger,
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ParentNotificationsScreen() {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState<ParentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getParentNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    await markAllNotificationsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const handleDelete = async (id: string) => {
    await deleteParentNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Screen style={styles.screen} contentStyle={styles.content}>
      <View style={styles.header}>
        <AppText variant="h2">Notifications</AppText>
        {unreadCount > 0 && (
          <Pressable onPress={handleMarkAllRead} style={styles.markAllBtn}>
            <Ionicons name="checkmark-done-outline" size={20} color={colors.primary} />
            <AppText variant="caption" style={styles.markAllText}>Mark all read</AppText>
          </Pressable>
        )}
      </View>

      <StateRenderer
        status={error ? 'error' : loading ? 'loading' : 'success'}
        error={error}
        onRetry={loadData}
        errorTitle="Failed to load notifications"
        loadingMessage="Loading notifications..."
      >
        {() =>
          notifications.length > 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor={colors.primary} />}
              contentContainerStyle={styles.list}
            >
              {notifications.map((notification) => {
    const icon = notificationIcons[notification.type] ?? 'notifications-outline';
    const iconColor = notificationColors[notification.type] ?? colors.primary;
    return (
      <BaseCard
        key={notification.id}
        style={[styles.notifCard, !notification.is_read && styles.notifCardUnread]}
        elevation="sm"
        pressable
        onPress={() => !notification.is_read && handleMarkRead(notification.id)}
      >
        <View style={styles.notifRow}>
          <View style={[styles.notifIcon, { backgroundColor: `${iconColor}18` }]}>
            <Ionicons name={icon as any} size={20} color={iconColor} />
          </View>
          <View style={styles.notifInfo}>
            <View style={styles.notifHeader}>
              <AppText variant="body" style={[styles.notifTitle, !notification.is_read && styles.notifTitleUnread]}>
                {notification.title}
              </AppText>
              {!notification.is_read && <View style={styles.unreadDot} />}
            </View>
            <AppText variant="caption" color="textSecondary" style={styles.notifBody}>
              {notification.body}
            </AppText>
            <View style={styles.notifMeta}>
              {notification.ward_name && (
                <Badge label={notification.ward_name} variant="neutral" size="small" />
              )}
              <AppText variant="label" color="textTertiary">
                {formatTimeAgo(notification.created_at)}
              </AppText>
            </View>
          </View>
          <Pressable onPress={() => handleDelete(notification.id)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={16} color={colors.textTertiary} />
          </Pressable>
        </View>
      </BaseCard>
    );
  })}
            </ScrollView>
          ) : (
            <EmptyState
              icon="notifications-outline"
              title="No notifications"
              message="You will be notified about lesson bookings, cancellations, homework, attendance, and more."
            />
          )
        }
      </StateRenderer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  markAllText: {
    color: colors.primary,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  notifCard: {
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  notifCardUnread: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  notifRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifInfo: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTitle: {
    fontWeight: '600',
  },
  notifTitleUnread: {
    color: colors.primary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.xs,
  },
  notifBody: {
    marginTop: 2,
    lineHeight: 18,
  },
  notifMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  deleteBtn: {
    padding: spacing.xs,
    alignSelf: 'flex-start',
  },
});
