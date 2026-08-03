import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '@/theme';

import styles from './EarningsCard.styles';

interface EarningsCardProps {
  totalEarned: number;
  available: number;
  pending: number;
}

export default function EarningsCard({
  totalEarned,
  available,
  pending,
}: EarningsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Earnings Summary</Text>
          <Text style={styles.subtitle}>
            Your tutoring income at a glance
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/(tutor)/earnings')}
          accessibilityRole="button"
          accessibilityLabel="View earnings"
        >
          <Text style={styles.viewAll}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {/* Total Earned */}
        <View style={styles.stat}>
          <View
            style={[
              styles.iconContainer,
              styles.greenBackground,
            ]}
          >
            <Ionicons
              name="wallet"
              size={24}
              color="#16A34A"
            />
          </View>

          <Text style={styles.amount}>
            ₵{totalEarned}
          </Text>

          <Text style={styles.label}>
            Total Earned
          </Text>
        </View>

        {/* Available */}
        <View style={styles.stat}>
          <View
            style={[
              styles.iconContainer,
              styles.blueBackground,
            ]}
          >
            <Ionicons
              name="cash"
              size={24}
              color={colors.primary}
            />
          </View>

          <Text style={styles.amount}>
            ₵{available}
          </Text>

          <Text style={styles.label}>
            Available
          </Text>
        </View>

        {/* Pending */}
        <View style={styles.stat}>
          <View
            style={[
              styles.iconContainer,
              styles.orangeBackground,
            ]}
          >
            <Ionicons
              name="time"
              size={24}
              color="#F59E0B"
            />
          </View>

          <Text style={styles.amount}>
            ₵{pending}
          </Text>

          <Text style={styles.label}>
            Pending
          </Text>
        </View>
      </View>
    </View>
  );
}