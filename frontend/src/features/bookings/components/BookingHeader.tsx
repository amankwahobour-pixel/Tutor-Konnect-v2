import React from 'react';
import { Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme';
import styles from './BookingHeader.styles';

interface BookingHeaderProps {
  title: string;
  subtitle: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  scrollY?: Animated.Value;
  rightSlot?: React.ReactNode;
}

export default function BookingHeader({
  title,
  subtitle,
  iconName = 'calendar-outline',
  scrollY,
  rightSlot,
}: BookingHeaderProps) {
  const translateY = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 120],
        outputRange: [0, -10],
        extrapolate: 'clamp',
      })
    : 0;

  const opacity = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 90],
        outputRange: [1, 0.8],
        extrapolate: 'clamp',
      })
    : 1;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }], opacity }]}>
      <View style={styles.background}>
        <View style={styles.wave} />
        <View style={styles.waveAccent} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleBlock}>
          <View style={styles.iconBadge}>
            <Ionicons name={iconName} size={20} color={colors.surface} />
          </View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <AppText variant="h3" style={styles.title}>
              {title}
            </AppText>
            <AppText variant="caption" style={styles.subtitle}>
              {subtitle}
            </AppText>
          </View>
        </View>

        {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
      </View>
    </Animated.View>
  );
}
