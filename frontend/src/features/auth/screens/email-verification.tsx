import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { resendEmailVerification } from '@/api/auth';
import { PrimaryButton, SecondaryButton } from '@/components';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Alert, Animated, Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/email-verification.styles';
import { colors } from '@/theme';

export default function EmailVerificationScreen() {
  const params = useLocalSearchParams();
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const pulse = useState(new Animated.Value(0.8))[0];

  useEffect(() => {
    if (!sent) return;
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1.08, duration: 180, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [pulse, sent]);

  if (!email) {
    router.replace('/(auth)/sign-in');
    return null;
  }

  const handleResend = async () => {
    try {
      setSending(true);
      await resendEmailVerification(email);
      setSent(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to resend verification email';
      Alert.alert('Error', errorMessage);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/waves.png')} style={styles.waves} resizeMode="cover" />

      <View style={styles.content}>
        <BaseCard elevation="lg" style={styles.card}>
          <Animated.View style={[styles.iconWrap, { transform: [{ scale: pulse }] }]}>
            <Ionicons name="mail-open-outline" size={32} color={colors.primary} />
          </Animated.View>

          <AppText variant="h2" style={styles.title}>Verify your email</AppText>
          <AppText variant="body" style={styles.subtitle}>A magic link was sent to {email}. Open it to confirm your account and continue setting up your profile.</AppText>

          {sent ? <View style={styles.successPill}><Ionicons name="checkmark-circle" size={16} color={colors.success} /><AppText variant="caption" style={styles.successText}>Verification email sent successfully.</AppText></View> : null}

          <PrimaryButton title={sending ? 'Sending…' : 'Resend email'} loading={sending} onPress={handleResend} containerStyle={styles.button} />
          <SecondaryButton title="Back to sign in" onPress={() => router.replace('/(auth)/sign-in')} containerStyle={styles.secondaryButton} />
        </BaseCard>
      </View>
    </View>
  );
}
