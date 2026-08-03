import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';

import styles from './StatsGrid.styles';

interface StatsGridProps {
  sessions: number;
  earnings: number;
  rating: number;
}

export default function StatsGrid({
  sessions,
  earnings,
  rating,
}: StatsGridProps) {
  return (
    <View style={styles.container}>
      {/* Sessions */}
      <View style={styles.card}>
        <View
          style={[
            styles.iconContainer,
            styles.orangeBackground,
          ]}
        >
          <Ionicons
            name="book-outline"
            size={24}
            color="#F97316"
          />
        </View>

        <Text style={styles.value}>
          {sessions}
        </Text>

        <Text style={styles.label}>
          Sessions
        </Text>
      </View>

      {/* Earnings */}
      <View style={styles.card}>
        <View
          style={[
            styles.iconContainer,
            styles.blueBackground,
          ]}
        >
          <Ionicons
            name="cash-outline"
            size={24}
            color={colors.primary}
          />
        </View>

        <Text style={styles.value}>
          ₵{earnings}
        </Text>

        <Text style={styles.label}>
          Available
        </Text>
      </View>

      {/* Rating */}
      <View style={styles.card}>
        <View
          style={[
            styles.iconContainer,
            styles.yellowBackground,
          ]}
        >
          <Ionicons
            name="star"
            size={24}
            color="#FBBF24"
          />
        </View>

        <Text style={styles.value}>
          {rating}
        </Text>

        <Text style={styles.label}>
          Rating
        </Text>
      </View>
    </View>
  );
}