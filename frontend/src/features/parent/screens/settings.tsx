import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Pressable, ScrollView, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { getOrCreateParentProfile, updateParentProfile } from '../api/parent.api';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/layout';
import { SectionCard } from '@/components/common';
import { useColors, useTheme, radius, spacing, type ColorPalette } from '@/theme';
import type { ThemeMode } from '@/theme';
import type { ParentProfile, ParentNotificationType } from '../types';

const notificationCategories: { key: ParentNotificationType; label: string; icon: string; iconColorKey: 'primary' | 'danger' | 'secondary' | 'warning' | 'success' }[] = [
  { key: 'lesson_booking', label: 'Lesson Bookings', icon: 'calendar-outline', iconColorKey: 'primary' },
  { key: 'lesson_cancellation', label: 'Lesson Cancellations', icon: 'close-circle-outline', iconColorKey: 'danger' },
  { key: 'tutor_change', label: 'Tutor Changes', icon: 'swap-horizontal-outline', iconColorKey: 'secondary' },
  { key: 'homework', label: 'Homework Updates', icon: 'document-text-outline', iconColorKey: 'warning' },
  { key: 'attendance', label: 'Attendance', icon: 'checkmark-done-outline', iconColorKey: 'success' },
  { key: 'payment', label: 'Payments', icon: 'wallet-outline', iconColorKey: 'success' },
  { key: 'progress_report', label: 'Progress Reports', icon: 'stats-chart-outline', iconColorKey: 'primary' },
  { key: 'linking_request', label: 'Linking Requests', icon: 'link-outline', iconColorKey: 'secondary' },
];

const themeOptions: { mode: ThemeMode; label: string; icon: string }[] = [
  { mode: 'light', label: 'Light', icon: 'sunny-outline' },
  { mode: 'dark', label: 'Dark', icon: 'moon-outline' },
  { mode: 'system', label: 'Auto', icon: 'phone-portrait-outline' },
];

export default function ParentSettingsScreen() {
  const { user, logout } = useAuthContext();
  const colors = useColors();
  const { mode, setMode } = useTheme();
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const p = await getOrCreateParentProfile(user);
      setProfile(p);
      setPrefs(p.notification_prefs ?? {});
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTogglePref = async (key: string, value: boolean) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    if (profile) {
      try {
        await updateParentProfile({ id: profile.id, notification_prefs: newPrefs });
      } catch {
        Alert.alert('Error', 'Could not update notification preferences.');
        setPrefs(prefs);
      }
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const themedStyles = getThemedStyles(colors);

  if (loading) {
    return (
      <Screen style={themedStyles.screen}>
        <View style={themedStyles.skeletonHeader} />
      </Screen>
    );
  }

  return (
    <Screen style={themedStyles.screen} contentStyle={themedStyles.content}>
      <View style={themedStyles.header}>
        <Pressable onPress={() => router.back()} style={themedStyles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="h3">Settings</AppText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={themedStyles.scrollContent}>
        {/* Appearance */}
        <View style={themedStyles.section}>
          <AppText variant="subtitle" style={themedStyles.sectionTitle}>Appearance</AppText>
          <AppText variant="caption" color="textSecondary" style={themedStyles.sectionDesc}>
            Choose your theme preference.
          </AppText>
          <SectionCard noPadding>
            <View style={themedStyles.themeRow}>
              <View style={themedStyles.themeInfo}>
                <AppText variant="body">Theme</AppText>
                <AppText variant="caption" color="textSecondary">Light, dark, or follow system</AppText>
              </View>
              <View style={themedStyles.themeOptions}>
                {themeOptions.map((opt) => {
                  const active = mode === opt.mode;
                  return (
                    <Pressable
                      key={opt.mode}
                      style={[themedStyles.themeOption, active ? themedStyles.themeOptionActive : themedStyles.themeOptionInactive]}
                      onPress={() => setMode(opt.mode)}
                    >
                      <Ionicons name={opt.icon as any} size={14} color={active ? colors.surface : colors.textSecondary} />
                      <AppText variant="label" style={{ color: active ? colors.surface : colors.textSecondary }}>{opt.label}</AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </SectionCard>
        </View>
        {/* Notification Preferences */}
        <View style={themedStyles.section}>
          <AppText variant="subtitle" style={themedStyles.sectionTitle}>Notification Preferences</AppText>
          <AppText variant="caption" color="textSecondary" style={themedStyles.sectionDesc}>
            Choose which notifications you want to receive about your wards.
          </AppText>
          <SectionCard noPadding>
            {notificationCategories.map((cat, index) => (
              <React.Fragment key={cat.key}>
                {index > 0 && <View style={themedStyles.divider} />}
                <View style={themedStyles.prefRow}>
                  <View style={themedStyles.prefInfo}>
                    <View style={[themedStyles.prefIcon, { backgroundColor: `${colors[cat.iconColorKey]}18` }]}>
                      <Ionicons name={cat.icon as any} size={18} color={colors[cat.iconColorKey]} />
                    </View>
                    <AppText variant="body">{cat.label}</AppText>
                  </View>
                  <Switch
                    value={prefs[cat.key] ?? true}
                    onValueChange={(value) => handleTogglePref(cat.key, value)}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.surface}
                  />
                </View>
              </React.Fragment>
            ))}
          </SectionCard>
        </View>

        {/* Account */}
        <View style={themedStyles.section}>
          <AppText variant="subtitle" style={themedStyles.sectionTitle}>Account</AppText>
          <SectionCard noPadding>
            <Pressable style={themedStyles.menuItem} onPress={() => router.push('/(parent)/profile')}>
              <View style={themedStyles.menuRow}>
                <Ionicons name="person-outline" size={20} color={colors.primary} />
                <AppText variant="body">Edit profile</AppText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </Pressable>
            <View style={themedStyles.divider} />
            <Pressable style={themedStyles.menuItem} onPress={() => router.push('/(parent)/link-child')}>
              <View style={themedStyles.menuRow}>
                <Ionicons name="people-outline" size={20} color={colors.secondary} />
                <AppText variant="body">Manage wards</AppText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </Pressable>
          </SectionCard>
        </View>

        {/* Support */}
        <View style={themedStyles.section}>
          <AppText variant="subtitle" style={themedStyles.sectionTitle}>Support</AppText>
          <SectionCard noPadding>
            <Pressable style={themedStyles.menuItem} onPress={() => Alert.alert('Help Center', 'Help center coming soon.')}>
              <View style={themedStyles.menuRow}>
                <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
                <AppText variant="body">Help center</AppText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </Pressable>
            <View style={themedStyles.divider} />
            <Pressable style={themedStyles.menuItem} onPress={() => Alert.alert('Contact Support', 'Email: support@tutorkonnect.com')}>
              <View style={themedStyles.menuRow}>
                <Ionicons name="mail-outline" size={20} color={colors.secondary} />
                <AppText variant="body">Contact support</AppText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </Pressable>
            <View style={themedStyles.divider} />
            <Pressable style={themedStyles.menuItem} onPress={() => Alert.alert('TutorKonnect', 'Version 1.0.0\n\nConnecting students with the best tutors in Ghana.')}>
              <View style={themedStyles.menuRow}>
                <Ionicons name="information-circle-outline" size={20} color={colors.textTertiary} />
                <AppText variant="body">About TutorKonnect</AppText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </Pressable>
          </SectionCard>
        </View>

        {/* Sign out */}
        <View style={themedStyles.logoutSection}>
          <Pressable style={themedStyles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <AppText variant="body" color="danger" style={themedStyles.logoutText}>Sign out</AppText>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

function getThemedStyles(colors: ColorPalette) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    skeletonHeader: {
      height: 80,
      backgroundColor: colors.primary,
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
    section: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    sectionTitle: {
      marginBottom: spacing.xs,
    },
    sectionDesc: {
      marginBottom: spacing.sm,
      lineHeight: 20,
    },
    prefRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    prefInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flex: 1,
    },
    prefIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: spacing.md,
    },
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    menuRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    logoutSection: {
      paddingHorizontal: spacing.lg,
      marginTop: spacing.md,
    },
    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.md,
      borderRadius: radius.lg,
      backgroundColor: colors.dangerLight,
      borderWidth: 1,
      borderColor: colors.danger,
    },
    logoutText: {
      fontWeight: '600',
    },
    themeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    themeInfo: {
      flex: 1,
    },
    themeOptions: {
      flexDirection: 'row',
      gap: spacing.xs,
    },
    themeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs + 2,
      borderRadius: 20,
      borderWidth: 1.5,
    },
    themeOptionActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    themeOptionInactive: {
      backgroundColor: colors.transparent,
      borderColor: colors.border,
    },
  });
}
