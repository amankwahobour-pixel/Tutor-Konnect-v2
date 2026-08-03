import React from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import styles from './DashboardHeader.styles';
import { useDashboardScroll } from './DashboardScrollContext';
import { header as headerLayout } from '../../theme';

interface DashboardHeaderProps {
  greeting: string;
  userName: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
}

export default function DashboardHeader({
  greeting,
  userName,
  notificationCount = 0,
  onNotificationPress,
}: DashboardHeaderProps) {
  const insets = useSafeAreaInsets();
  const ctxScrollY = useDashboardScroll();
  const fallback = useSharedValue(0);
  const scrollY = ctxScrollY ?? fallback;

  const DIST = headerLayout.collapseDistance;

  const headerAnimStyle = useAnimatedStyle(() => {
    const p = Math.max(0, Math.min(scrollY.value, DIST)) / DIST;
    return {
      height: headerLayout.expandedHeight - headerLayout.collapseDistance * p,
    };
  });

  const greetingAnimStyle = useAnimatedStyle(() => {
    const p = Math.max(0, Math.min(scrollY.value, DIST)) / DIST;
    return {
      opacity: 1 - p,
      transform: [{ translateY: -8 * p }],
    };
  });

  const nameAnimStyle = useAnimatedStyle(() => {
    const p = Math.max(0, Math.min(scrollY.value, DIST)) / DIST;
    return {
      transform: [{ translateY: -16 * p }],
    };
  });

  return (
    <Animated.View style={[styles.container, headerAnimStyle]}>
      <ImageBackground
        source={require('@/assets/images/header-wave.png')}
        style={styles.wave}
        imageStyle={styles.waveImage}
      />

      <View style={[styles.content, { paddingTop: insets.top + 14 }]}>
        <View style={styles.topRow}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
          />

          <TouchableOpacity
            style={styles.notificationButton}
            activeOpacity={0.85}
            onPress={onNotificationPress}
            accessibilityRole="button"
            accessibilityLabel="Open notifications"
          >
            <BlurView intensity={25} tint="light" style={styles.notificationBlur}>
              <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
            </BlurView>

            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.greetingContainer, greetingAnimStyle]}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Animated.View style={nameAnimStyle}>
            <Text style={styles.name}>{userName}</Text>
          </Animated.View>
        </Animated.View>
      </View>
    </Animated.View>
  );
}
