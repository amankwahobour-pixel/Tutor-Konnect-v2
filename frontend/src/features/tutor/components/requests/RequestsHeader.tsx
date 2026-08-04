import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { SharedValue } from 'react-native-reanimated';
import { WaveHeader } from '@/components/headers';
import { AppText } from '@/components/ui/AppText';
import { colors, useThemedStyles } from '@/theme';
import { styles as createStyles } from './RequestsHeader.styles';

interface RequestHeaderProps {
  title: string;
  subtitle: string;
  requestCount?: number;
  scrollY?: SharedValue<number>;
}

export default function RequestsHeader({ title, subtitle, requestCount = 0, scrollY }: RequestHeaderProps) {
  const styles = useThemedStyles(createStyles);
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
      <View style={styles.badgeRow}>
        <View style={styles.counterBadge}>
          <Ionicons name="mail-open-outline" size={14} color={colors.primary} />
          <AppText variant="caption" style={styles.counterText}>
            {requestCount} requests
          </AppText>
        </View>
      </View>
    </WaveHeader>
  );
}