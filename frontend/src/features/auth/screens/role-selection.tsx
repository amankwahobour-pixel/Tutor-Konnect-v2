import { router } from 'expo-router';
import { useState } from 'react';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { createProfile, getUserProfile } from '@/features/profile/api/profile.api';
import { UserProfile } from '@/types';
import { PrimaryButton, SecondaryButton } from '@/components';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Alert, Image, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/role-selection.styles';
import { colors } from '@/theme';

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<'student' | 'tutor' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAuthContext();

  const handleContinue = async () => {
    if (!selectedRole) {
      Alert.alert('Select a Role', 'Please choose whether you want to continue as a Student or Tutor.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User data not found. Please try again.');
      return;
    }

    try {
      setIsLoading(true);

      try {
        const existing = await getUserProfile(user.id);
        if (existing?.data) {
          setUser(existing.data);
          router.replace(existing.data.role === 'tutor' ? '/(tutor)/dashboard' : '/(student)/dashboard');
          return;
        }
      } catch {}

      const hasFullName = !!user.full_name;
      const hasPhone = !!user.phone_number;

      if (!hasFullName || !hasPhone) {
        router.replace({ pathname: '/(auth)/profile-setup', params: { nextRole: selectedRole } });
        return;
      }

      const profilePayload: Partial<UserProfile> & { role: 'student' | 'tutor' } = {
        id: user.id,
        full_name: user.full_name,
        phone_number: user.phone_number,
        profile_photo: user.profile_photo,
        role: selectedRole,
      };

      const created = await createProfile(profilePayload);

      if (created?.data) {
        setUser(created.data);

        if (!created.data.full_name) {
          router.replace('/(auth)/profile-setup');
          return;
        }

        router.replace(created.data.role === 'tutor' ? '/(tutor)/dashboard' : '/(student)/dashboard');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save role';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevShortcut = (route: '/(student)/dashboard' | '/(tutor)/dashboard', role: 'student' | 'tutor') => {
    if (!user) {
      Alert.alert('Developer Shortcut', 'No user is signed in. Please sign in first.');
      return;
    }

    setUser({ ...user, role });
    router.replace(route);
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/waves.png')} style={styles.waves} resizeMode="cover" />
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />

      <View style={styles.content}>
        <AppText variant="caption" style={styles.label}>Get started</AppText>
        <AppText variant="h2" style={styles.title}>Who are you?</AppText>
        <AppText variant="body" style={styles.subtitle}>Choose the path that fits your learning or teaching goals.</AppText>

        <BaseCard elevation="md" style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.roleCard, selectedRole === 'student' && styles.selectedCard]}
            onPress={() => setSelectedRole('student')}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Select Student role"
            accessibilityState={{ selected: selectedRole === 'student' }}
          >
            <View style={styles.iconCircle}><Ionicons name="school-outline" size={24} color={colors.primary} /></View>
            <View style={styles.cardText}>
              <AppText variant="subtitle" style={styles.cardTitle}>Student</AppText>
              <AppText variant="bodySmall" style={styles.cardDescription}>Discover tutors, book lessons, and keep growing with every session.</AppText>
            </View>
            {selectedRole === 'student' ? <View style={styles.checkmark}><Ionicons name="checkmark" size={16} color={colors.surface} /></View> : null}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.roleCard, selectedRole === 'tutor' && styles.selectedCard]}
            onPress={() => setSelectedRole('tutor')}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Select Tutor role"
            accessibilityState={{ selected: selectedRole === 'tutor' }}
          >
            <View style={styles.iconCircle}><Ionicons name="person-outline" size={24} color={colors.primary} /></View>
            <View style={styles.cardText}>
              <AppText variant="subtitle" style={styles.cardTitle}>Tutor</AppText>
              <AppText variant="bodySmall" style={styles.cardDescription}>Teach students, manage bookings, and grow your teaching practice.</AppText>
            </View>
            {selectedRole === 'tutor' ? <View style={styles.checkmark}><Ionicons name="checkmark" size={16} color={colors.surface} /></View> : null}
          </TouchableOpacity>
        </BaseCard>

        <PrimaryButton title={isLoading ? 'Saving…' : 'Continue'} onPress={handleContinue} disabled={!selectedRole || isLoading} containerStyle={styles.button} />

        {__DEV__ ? (
          <View style={styles.devCard}>
            <AppText variant="label" style={styles.devTitle}>Developer shortcuts</AppText>
            <View style={styles.devRow}>
              <SecondaryButton title="Student" onPress={() => handleDevShortcut('/(student)/dashboard', 'student')} containerStyle={styles.devButton} />
              <SecondaryButton title="Tutor" onPress={() => handleDevShortcut('/(tutor)/dashboard', 'tutor')} containerStyle={styles.devButton} />
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}
