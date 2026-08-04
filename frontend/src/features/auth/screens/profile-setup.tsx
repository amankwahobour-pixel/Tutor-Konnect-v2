import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { updateProfile, createProfile } from '@/features/profile/api/profile.api';
import { saveOnboardingComplete } from '@/features/auth/services/auth-storage';
import { Input, PrimaryButton } from '@/components';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Alert, Image, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles as createStyles } from '../styles/profile-setup.styles';
import { colors, useThemedStyles } from '@/theme';

export default function ProfileSetupScreen() {
  const styles = useThemedStyles(createStyles);
  const { user, setUser } = useAuthContext();
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(user?.phone_number ?? '');
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams();

  if (!user) {
    router.replace('/(auth)/sign-in');
    return null;
  }

  const handleSave = async () => {
    if (loading) return;

    if (!fullName.trim()) {
      Alert.alert('Missing information', 'Please enter your full name.');
      return;
    }

    try {
      setLoading(true);

      const rawNextRole = Array.isArray(params.nextRole) ? params.nextRole[0] : params.nextRole;
      const nextRole = rawNextRole === 'student' || rawNextRole === 'tutor' ? (rawNextRole as 'student' | 'tutor') : undefined;

      if (nextRole) {
        const phone = user.phone_number ?? phoneNumber;

        if (!phone || !String(phone).trim()) {
          Alert.alert('Missing information', 'Please enter your phone number before continuing.');
          setLoading(false);
          return;
        }

        const profilePayload: Partial<import('@/types').UserProfile> & { role: 'student' | 'tutor' } = {
          id: user.id,
          full_name: fullName.trim(),
          phone_number: String(phone).trim(),
          profile_photo: user.profile_photo,
          role: nextRole,
          bio: bio.trim() || undefined,
        };

        const created = await createProfile(profilePayload);

        if (created?.data) {
          setUser(created.data);
        }

        await saveOnboardingComplete();
        router.replace(nextRole === 'tutor' ? '/(tutor)/dashboard' : '/(student)/dashboard');
        return;
      }

      const result = await updateProfile(user.id, {
        full_name: fullName.trim(),
        bio: bio.trim() || undefined,
      });

      if (result.data) {
        setUser(result.data);
      }

      await saveOnboardingComplete();
      router.replace(user.role === 'tutor' ? '/(tutor)/dashboard' : '/(student)/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to save profile';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Image source={require('@/assets/images/waves.png')} style={styles.waves} resizeMode="cover" />

      <View style={styles.content}>
        <BaseCard elevation="lg" style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="person-circle-outline" size={34} color={colors.primary} />
          </View>
          <AppText variant="caption" style={styles.eyebrow}>Profile setup</AppText>
          <AppText variant="h2" style={styles.title}>Complete your profile</AppText>
          <AppText variant="body" style={styles.subtitle}>Share a few details so students or tutors can get to know you better.</AppText>

          <View style={styles.field}>
            <AppText variant="label" style={styles.fieldLabel}>Full name</AppText>
            <Input style={styles.input} placeholder="Enter your full name" value={fullName} editable={!loading} onChangeText={setFullName} />
          </View>

          <View style={styles.field}>
            <AppText variant="label" style={styles.fieldLabel}>Phone number</AppText>
            <Input style={styles.input} placeholder="Add your phone number" value={phoneNumber} editable={!loading} onChangeText={setPhoneNumber} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" />
          </View>

          <View style={styles.field}>
            <AppText variant="label" style={styles.fieldLabel}>About you</AppText>
            <Input style={[styles.input, styles.textArea]} placeholder="Tell us a bit about yourself" value={bio} editable={!loading} onChangeText={setBio} multiline numberOfLines={4} />
          </View>

          <PrimaryButton title={loading ? 'Saving…' : 'Continue'} loading={loading} onPress={handleSave} containerStyle={styles.button} />
        </BaseCard>
      </View>
    </KeyboardAvoidingView>
  );
}