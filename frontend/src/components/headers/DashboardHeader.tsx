import React from 'react';
import { type ImageSourcePropType, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { WaveHeader } from './WaveHeader';
import { Avatar } from '@/components/ui/Avatar';
import { useColors, spacing } from '@/theme';

export interface DashboardHeaderProps {
  greeting: string;
  userName: string;
  avatarSource?: ImageSourcePropType;
  avatarInitials?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
  statisticsSlot?: React.ReactNode;
  scrollY?: SharedValue<number>;
}

export const DashboardHeader = React.memo(
  React.forwardRef<View, DashboardHeaderProps>(
    ({
      greeting,
      userName,
      avatarSource,
      avatarInitials,
      notificationCount = 0,
      onNotificationPress,
      onAvatarPress,
      statisticsSlot,
      scrollY,
    },
    ref) => {
      const colors = useColors();
      return (
      <WaveHeader
        ref={ref}
        title={greeting}
        subtitle={userName}
        scrollY={scrollY as any}
        profileAction={{
          onPress: onAvatarPress ?? (() => undefined),
          accessibilityLabel: 'Open profile',
          icon: <Avatar source={avatarSource} initials={avatarInitials} size={spacing.xxxl} />,
        }}
        notificationAction={{
          onPress: onNotificationPress ?? (() => undefined),
          accessibilityLabel: 'Open notifications',
          count: notificationCount,
          icon: <Ionicons name="notifications-outline" size={20} color={colors.surface} />,
        }}
      >
        {statisticsSlot ? (
          <View style={{ marginTop: spacing.md }}>{statisticsSlot}</View>
        ) : null}
      </WaveHeader>
      );
    },
  ),
);
