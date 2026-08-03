import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '@/theme';

import styles from './ChatHeader.styles';

interface ChatHeaderProps {
  name: string;
  online?: boolean;
}

export default function ChatHeader({
  name,
  online = true,
}: ChatHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons
          name="chevron-back"
          size={22}
          color={colors.text}
        />
      </TouchableOpacity>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {name.charAt(0).toUpperCase()}
        </Text>

        {online && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.info}>
        <Text
          numberOfLines={1}
          style={styles.name}
        >
          {name}
        </Text>

        <Text style={styles.status}>
          {online ? 'Online' : 'Offline'}
        </Text>
      </View>

      <TouchableOpacity style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Start voice call">
        <Ionicons
          name="call-outline"
          size={20}
          color={colors.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} accessibilityRole="button" accessibilityLabel="More options">
        <Ionicons
          name="ellipsis-vertical"
          size={20}
          color={colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
}