import { router } from 'expo-router';
import { pushPath } from '@/lib/navigation';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { BaseCard } from '@/components/cards';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useColors, useThemedStyles, useTheme, type ThemeMode } from '@/theme';
import { Image, ScrollView, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { createProfileStyles } from '../styles/profile.styles';

const themeOptions: { mode: ThemeMode; label: string; icon: string }[] = [
  { mode: 'light', label: 'Light', icon: 'sunny-outline' },
  { mode: 'dark', label: 'Dark', icon: 'moon-outline' },
  { mode: 'system', label: 'Auto', icon: 'phone-portrait-outline' },
];

export default function StudentProfileScreen() {
  const { user, logout } = useAuthContext();
  const colors = useColors();
  const { mode, setMode } = useTheme();
  const styles = useThemedStyles(createProfileStyles);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <AppText variant="h3">My profile</AppText>
            <AppText variant="caption" style={styles.subtitle}>Manage your details, lessons, and account settings.</AppText>
          </View>
          <Ionicons name="sparkles-outline" size={28} color={colors.primary} />
        </View>

        <BaseCard style={styles.heroCard} elevation="lg">
          <LinearGradient colors={[colors.primaryLight, colors.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroGradient}>
            <View style={styles.avatarContainer}>
              {user?.profile_photo ? (
                <Image source={{ uri: user.profile_photo }} style={styles.avatar} />
              ) : (
                <Avatar initials={(user?.full_name || 'ST').slice(0, 2).toUpperCase()} size={96} accessibilityLabel="Student avatar" />
              )}
              <AppText variant="h3" style={styles.userName}>{user?.full_name || 'Student'}</AppText>
              <Badge label={(user?.role?.toString() || 'Learner').toUpperCase()} variant="primary" size="small" style={styles.badge} />
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryChip}>
                <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                <AppText variant="caption">Lessons tracked</AppText>
              </View>
              <View style={styles.summaryChip}>
                <Ionicons name="chatbubble-outline" size={16} color={colors.secondary} />
                <AppText variant="caption">Messages ready</AppText>
              </View>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <AppText variant="caption" style={styles.detailLabel}>Email</AppText>
                <AppText variant="body" style={styles.detailValue}>{user?.email || 'Not available'}</AppText>
              </View>
              <View style={styles.detailItem}>
                <AppText variant="caption" style={styles.detailLabel}>Phone</AppText>
                <AppText variant="body" style={styles.detailValue}>{user?.phone_number || 'Not available'}</AppText>
              </View>
            </View>
          </LinearGradient>
        </BaseCard>

        <BaseCard style={styles.actionsCard} elevation="md">
          <AppText variant="subtitle">Appearance</AppText>
          <AppText variant="caption" color="textSecondary">Choose your theme preference</AppText>
          <View style={styles.themeRow}>
            <View style={styles.themeOptions}>
              {themeOptions.map((opt) => {
                const active = mode === opt.mode;
                return (
                  <Pressable
                    key={opt.mode}
                    style={[styles.themeOption, active ? styles.themeOptionActive : styles.themeOptionInactive]}
                    onPress={() => setMode(opt.mode)}
                  >
                    <Ionicons name={opt.icon as any} size={14} color={active ? colors.surface : colors.textSecondary} />
                    <AppText variant="label" style={{ color: active ? colors.surface : colors.textSecondary }}>{opt.label}</AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </BaseCard>

        <BaseCard style={styles.actionsCard} elevation="md">
          <AppText variant="subtitle">Quick actions</AppText>
          <View style={styles.actionRow}>
            <SecondaryButton title="Review history" onPress={() => pushPath('/(student)/review-history')} containerStyle={styles.actionButton} />
            <PrimaryButton title="Logout" onPress={handleLogout} containerStyle={styles.actionButton} />
          </View>
        </BaseCard>
      </ScrollView>
    </SafeAreaView>
  );
}
