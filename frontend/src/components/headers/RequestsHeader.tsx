import React from 'react';
import { View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { WaveHeader } from './WaveHeader';
import type { HeaderAction } from './WaveHeader';

export interface RequestsHeaderProps {
  title: string;
  subtitle?: string;
  backAction: HeaderAction;
  filterAction?: React.ReactNode;
  scrollY?: SharedValue<number>;
}

export const RequestsHeader = React.memo(
  React.forwardRef<View, RequestsHeaderProps>(({ title, subtitle, backAction, filterAction, scrollY }, ref) => (
    <WaveHeader
      ref={ref}
      title={title}
      subtitle={subtitle}
      backAction={backAction}
      scrollY={scrollY as any}
      rightActions={filterAction}
    />
  )),
);
