import React from 'react';
import { View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { WaveHeader } from './WaveHeader';
import { AppText } from '@/components/ui/AppText';
import { colors, spacing } from '@/theme';

export interface MessagesHeaderProps {
  unreadCount?: number;
  searchSlot?: React.ReactNode;
  scrollY?: SharedValue<number>;
}

export const MessagesHeader = React.memo(
  React.forwardRef<View, MessagesHeaderProps>(({ unreadCount = 0, searchSlot, scrollY }, ref) => (
    <WaveHeader
      ref={ref}
      title="Messages"
      subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'No unread messages'}
      scrollY={scrollY as any}
      rightActions={
        unreadCount > 0 ? (
          <View style={{ backgroundColor: colors.danger, borderRadius: spacing.md, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }}>
            <AppText variant="caption" color="surface">{unreadCount}</AppText>
          </View>
        ) : null
      }
    >
      {searchSlot ? <View style={{ marginTop: spacing.md }}>{searchSlot}</View> : null}
    </WaveHeader>
  )),
);
