import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '@/theme';

import styles from './TutorProfileCard.styles';

interface TutorProfileCardProps {
  fullName: string;
  profilePhoto?: string;
  subjects: string[];
  rating: number;
  ratingCount: number;
  verified: boolean;
}

export default function TutorProfileCard({
  fullName,
  profilePhoto,
  subjects,
  rating,
  ratingCount,
  verified,
}: TutorProfileCardProps) {
  return (
    <View style={styles.card}>
      {/* Avatar */}
      <View style={styles.avatar}>
        {profilePhoto ? (
          <Image
            source={{ uri: profilePhoto }}
            style={styles.avatarImage}
          />
        ) : (
          <Ionicons
            name="person"
            size={42}
            color={colors.primary}
          />
        )}
      </View>

      {/* Profile Information */}
      <View style={styles.profileInfo}>
        <Text
          style={styles.name}
          numberOfLines={1}
        >
          {fullName}
        </Text>

        {subjects.length > 0 && (
          <Text
            style={styles.subjects}
            numberOfLines={1}
          >
            {subjects.join(', ')}
          </Text>
        )}

        <View style={styles.bottomRow}>
          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Ionicons
              name="star"
              size={16}
              color="#FBBF24"
            />

            <Text style={styles.rating}>
              {rating}
            </Text>

            <Text style={styles.ratingCount}>
              ({ratingCount})
            </Text>
          </View>

          {/* Verification Badge */}
          {verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={15}
                color={colors.success}
              />

              <Text style={styles.verifiedText}>
                Verified
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Edit Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.editButton}
        onPress={() => router.push('/(tutor)/profile')}
        accessibilityRole="button"
        accessibilityLabel="Edit profile"
      >
        <Ionicons
          name="pencil"
          size={18}
          color={colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
}