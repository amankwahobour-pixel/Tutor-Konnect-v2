import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { colors, radius, spacing } from '@/theme';
import type { Ward } from '../types';

interface WardSelectorProps {
  wards: Ward[];
  selectedWardId: string | null;
  onSelect: (ward: Ward) => void;
  onAddWard: () => void;
}

export function WardSelector({ wards, selectedWardId, onSelect, onAddWard }: WardSelectorProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {wards.map((ward) => {
          const isSelected = ward.id === selectedWardId;
          return (
            <Pressable
              key={ward.id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(ward)}
            >
              <Avatar
                source={ward.profile_photo ? { uri: ward.profile_photo } : undefined}
                initials={(ward.full_name || '?').slice(0, 2).toUpperCase()}
                size={32}
              />
              <AppText
                variant="bodySmall"
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
                numberOfLines={1}
              >
                {ward.full_name || 'Student'}
              </AppText>
            </Pressable>
          );
        })}
        <Pressable style={styles.addChip} onPress={onAddWard}>
          <Ionicons name="add" size={20} color={colors.primary} />
          <AppText variant="bodySmall" style={styles.addText}>Add</AppText>
        </Pressable>
      </ScrollView>
    </View>
  );
}

import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    maxWidth: 100,
  },
  chipTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
  },
  addText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
