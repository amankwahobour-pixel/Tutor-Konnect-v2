import React from 'react';
import { View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { WaveHeader } from './WaveHeader';
import type { HeaderAction } from './WaveHeader';

export interface WalletHeaderProps {
  balanceSlot: React.ReactNode;
  title?: string;
  subtitle?: string;
  backAction?: HeaderAction;
  scrollY?: SharedValue<number>;
}

export const WalletHeader = React.memo(
  React.forwardRef<View, WalletHeaderProps>(({ balanceSlot, title = 'Wallet', subtitle, backAction, scrollY }, ref) => (
    <WaveHeader
      ref={ref}
      title={title}
      subtitle={subtitle}
      backAction={backAction}
      scrollY={scrollY as any}
      floatingContent={balanceSlot}
    />
  )),
);
