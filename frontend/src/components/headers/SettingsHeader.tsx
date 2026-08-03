import React from 'react';
import { type View } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { WaveHeader, type HeaderAction } from './WaveHeader';


export interface SettingsHeaderProps {
  title?: string;
  subtitle?: string;
  backAction?: HeaderAction;
  rightActions?: React.ReactNode;
  scrollY?: SharedValue<number>;
}

export const SettingsHeader = React.memo(
  React.forwardRef<View, SettingsHeaderProps>(({ title = 'Settings', subtitle, backAction, rightActions, scrollY }, ref) => (
    <WaveHeader
      ref={ref}
      title={title}
      subtitle={subtitle ?? 'Customize your preferences'}
      backAction={backAction}
      rightActions={rightActions}
      scrollY={scrollY}
    />
  )),
);
