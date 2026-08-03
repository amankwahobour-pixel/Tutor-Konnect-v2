import React from 'react';
import { type View } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { WaveHeader, type HeaderAction } from './WaveHeader';


export interface NotificationHeaderProps {
  notificationCount?: number;
  backAction?: HeaderAction;
  rightActions?: React.ReactNode;
  scrollY?: SharedValue<number>;
}

export const NotificationHeader = React.memo(
  React.forwardRef<View, NotificationHeaderProps>(
    ({ notificationCount = 0, backAction, rightActions, scrollY }, ref) => (
      <WaveHeader
        ref={ref}
        title="Notifications"
        subtitle={notificationCount > 0 ? `${notificationCount} new alerts` : 'No new alerts'}
        backAction={backAction}
        rightActions={rightActions}
        scrollY={scrollY}
      />
    ),
  ),
);
