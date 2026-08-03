import React from 'react';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/layout';
import { colors, radius, spacing } from '@/theme';

const settingGroups = [
  {
    title: 'Account',
    items: [
      { id: 'edit-profile', label: 'Edit profile', icon: 'person-outline' },
      { id: 'notification-prefs', label: 'Notification preferences', icon: 'notifications-outline' },
      { id: 'privacy', label: 'Privacy & security', icon: 'shield-outline' },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'help', label: 'Help center', icon: 'help-circle-outline' },
      { id: 'contact', label: 'Contact support', icon: 'mail-outline' },
      { id: 'about', label: 'About TutorKonnect', icon: 'information-circle-outline' },
    ],
  },
];

export default function ParentSettingsScreen() {
  return (
    <Screen style={styles.screen} contentStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="h3">Settings</AppText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {settingGroups.map((group) => (
          <View key={group.title} style={styles.group}>
            <AppText variant="caption" color="textSecondary" style={styles.groupTitle}>
              {group.title}
            </AppText>
            {group.items.map((item) => (
              <BaseCard key={item.id} style={styles.menuCard} elevation="sm" pressable>
                <View style={styles.menuRow}>
                  <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                  <AppText variant="body">{item.label}</AppText>
                  <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </View>
              </BaseCard>
            ))}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    padding: spacing.xs,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  group: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  groupTitle: {
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuCard: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
