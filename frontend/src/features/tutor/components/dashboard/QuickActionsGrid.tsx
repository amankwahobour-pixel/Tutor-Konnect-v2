import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/theme';

import styles from './QuickActionsGrid.styles';

export default function QuickActionsGrid() {
  const router = useRouter();

  const actions = [
    {
      title: 'Requests',
      subtitle: 'View incoming lesson requests',
      icon: 'calendar-outline' as const,
      color: colors.primary,
      background: styles.blueBackground,
      route: '/(tutor)/requests',
    },
    {
      title: 'Students',
      subtitle: 'Manage your students',
      icon: 'people-outline' as const,
      color: colors.success,
      background: styles.greenBackground,
      route: '/(tutor)/students',
    },
    {
      title: 'Availability',
      subtitle: 'Update your schedule',
      icon: 'time-outline' as const,
      color: '#F97316',
      background: styles.orangeBackground,
      route: '/(tutor)/availability',
    },
    {
      title: 'Messages',
      subtitle: 'Chat with students',
      icon: 'chatbubble-outline' as const,
      color: '#FBBF24',
      background: styles.yellowBackground,
      route: '/messages',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>

      <Text style={styles.subtitle}>
        Everything you need to manage your tutoring
      </Text>

      <View style={styles.grid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.title}
            activeOpacity={0.85}
            style={styles.card}
            onPress={() => router.push(action.route as any)}
            accessibilityRole="button"
            accessibilityLabel={action.title}
          >
            <View style={[styles.iconContainer, action.background]}>
              <Ionicons
                name={action.icon}
                size={28}
                color={action.color}
              />
            </View>

            <Text style={styles.cardTitle}>
              {action.title}
            </Text>

            <Text style={styles.cardSubtitle}>
              {action.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}