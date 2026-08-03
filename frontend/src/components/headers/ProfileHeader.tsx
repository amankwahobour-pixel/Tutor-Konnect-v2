import React from 'react';
import { View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { WaveHeader, type HeaderAction } from './WaveHeader';


export interface ProfileHeaderProps {
  displayName: string;
  subtitle?: string;
  backAction?: HeaderAction;
  rightActions?: React.ReactNode;
  scrollY?: SharedValue<number>;
}

export const ProfileHeader = React.memo(
  React.forwardRef<View, ProfileHeaderProps>(({ displayName, subtitle, backAction, rightActions, scrollY }, ref) => (
    <WaveHeader
      ref={ref}
      title={displayName}
      subtitle={subtitle ?? 'Manage your profile'}
      backAction={backAction}
      rightActions={rightActions}
      scrollY={scrollY}
    />
  )),
);
