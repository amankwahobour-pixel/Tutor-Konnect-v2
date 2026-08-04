import { Ionicons } from '@expo/vector-icons';
import { pushPath } from '@/lib/navigation';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { useColors, useThemedStyles, useTheme, type ThemeMode } from '@/theme';
import type { SettingItem } from '@/types';
import type { ComponentProps } from 'react';
import { createSettingsStyles } from '../styles/settings.styles';

type SettingItemExtended = Omit<SettingItem, 'label'> & {
  title: string;
  label?: string;
  route?: string;
};

const settingsItems: SettingItemExtended[] = [
  { id: 'profile', label: 'Profile Information', title: 'Profile Information', icon: 'person-outline', route: '/(tutor)/profile' },
  { id: 'notifications', label: 'Notifications', title: 'Notifications', icon: 'notifications-outline', route: '/notifications' },
  { id: 'payments', label: 'Payment & Earnings', title: 'Payment & Earnings', icon: 'wallet-outline', route: '/(tutor)/earnings' },
  { id: 'verification', label: 'Verification Status', title: 'Verification Status', icon: 'shield-checkmark-outline', route: '/(tutor)/verification' },
  { id: 'privacy', label: 'Privacy & Security', title: 'Privacy & Security', icon: 'lock-closed-outline', route: '' },
  { id: 'documents', label: 'Documents', title: 'Documents', icon: 'document-text-outline', route: '/(tutor)/documents' },
  { id: 'help', label: 'Help & Support', title: 'Help & Support', icon: 'help-circle-outline', route: '' },
];

const themeOptions: { mode: ThemeMode; label: string; icon: string }[] = [
  { mode: 'light', label: 'Light', icon: 'sunny-outline' },
  { mode: 'dark', label: 'Dark', icon: 'moon-outline' },
  { mode: 'system', label: 'Auto', icon: 'phone-portrait-outline' },
];

export default function SettingsScreen() {
  const { user } = useAuthContext();
  const colors = useColors();
  const { mode, setMode } = useTheme();
  const styles = useThemedStyles(createSettingsStyles);
  const displayName = user?.full_name || 'Tutor';
  const displayEmail = user?.email || 'No email provided';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
      <View style={styles.hero}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <AppText variant="caption" style={styles.eyebrow}>Account center</AppText>
            <AppText variant="h3">Settings</AppText>
            <AppText variant="body" style={styles.subtitle}>Manage your profile, preferences, and support options.</AppText>
          </View>
          <Badge label="Tutor" variant="primary" size="small" />
        </View>
      </View>

      <View style={styles.body}>
        <BaseCard style={styles.profileCard} elevation="md">
          <View style={styles.avatar}>
            <AppText variant="h3" style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</AppText>
          </View>
          <View style={styles.profileInfo}>
            <AppText variant="subtitle">{displayName}</AppText>
            <AppText variant="bodySmall" style={styles.email}>{displayEmail}</AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </BaseCard>

        <View style={styles.themeRow}>
          <View style={styles.themeIconContainer}>
            <Ionicons name="color-palette-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.themeInfo}>
            <AppText variant="body" style={styles.themeTitle}>Appearance</AppText>
            <AppText variant="caption" style={styles.themeSubtitle}>Choose your theme</AppText>
          </View>
          <View style={styles.themeOptions}>
            {themeOptions.map((opt) => {
              const active = mode === opt.mode;
              return (
                <TouchableOpacity
                  key={opt.mode}
                  style={[
                    styles.themeOption,
                    active ? styles.themeOptionActive : styles.themeOptionInactive,
                  ]}
                  onPress={() => setMode(opt.mode)}
                  accessibilityRole="button"
                  accessibilityLabel={`${opt.label} theme`}
                >
                  <Ionicons name={opt.icon as any} size={14} color={active ? colors.surface : colors.textSecondary} />
                  <AppText variant="label" style={[styles.themeOptionText, active ? styles.themeOptionTextActive : styles.themeOptionTextInactive]}>
                    {opt.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingCard}
              activeOpacity={0.8}
              onPress={() => {
                if (item.route) pushPath(item.route);
              }}
            >
              <View style={styles.leftSide}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon as ComponentProps<typeof Ionicons>['name']} size={20} color={colors.primary} />
                </View>
                <AppText variant="body" style={styles.settingTitle}>{item.title}</AppText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Logout"
          onPress={() => pushPath('/(auth)/welcome')}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.surface} />
          <AppText variant="body" style={styles.logoutText}>Logout</AppText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
