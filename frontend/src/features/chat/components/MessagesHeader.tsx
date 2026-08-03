import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { SharedValue } from 'react-native-reanimated';
import { WaveHeader } from '@/components/headers';
import { colors } from '@/theme';
import styles from './MessagesHeader.styles';

interface MessagesHeaderProps {
  title: string;
  subtitle: string;
  scrollY?: SharedValue<number>;
}

export default function MessagesHeader({ title, subtitle, scrollY }: MessagesHeaderProps) {
  return (
    <WaveHeader
      title={title}
      subtitle={subtitle}
      scrollY={scrollY}
      backAction={{
        onPress: () => router.back(),
        accessibilityLabel: 'Go back',
        icon: <Ionicons name="chevron-back" size={24} color={colors.text} />,
      }}
      notificationAction={{
        onPress: () => router.push('/notifications'),
        accessibilityLabel: 'Open notifications',
        icon: <Ionicons name="notifications-outline" size={20} color={colors.surface} />,
      }}
      statusBarStyle="light"
    >
      <View style={styles.badgeRow} />
    </WaveHeader>
  );
}