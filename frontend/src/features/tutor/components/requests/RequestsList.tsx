import React, { useCallback } from 'react';
import { FlatList, View } from 'react-native';
import type { TutorRequest } from '@/types';
import RequestCard from './RequestCard';
import styles from './RequestsList.styles';

interface RequestListProps {
  requests: TutorRequest[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export default function RequestsList({ requests, onAccept, onDecline }: RequestListProps) {
  const renderItem = useCallback(
    ({ item }: { item: TutorRequest }) => (
      <RequestCard request={item} onAccept={onAccept} onDecline={onDecline} />
    ),
    [onAccept, onDecline],
  );

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListFooterComponent={<View style={styles.bottomSpacing} />}
      removeClippedSubviews
    />
  );
}