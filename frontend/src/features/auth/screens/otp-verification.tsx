import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { verifyPhoneOtp } from '@/api/auth';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { PrimaryButton, SecondaryButton } from '@/components';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Alert, Animated, Image, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles as createStyles } from '../styles/otp-verification.styles';
import { colors, useThemedStyles } from '@/theme';

export default function OTPVerificationScreen() {
  const styles = useThemedStyles(createStyles);
  const params = useLocalSearchParams();
  const { setToken, setUser } = useAuthContext();
  const phone = Array.isArray(params.phone) ? params.phone[0] : params.phone;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [success, setSuccess] = useState(false);
  const inputs = useRef<TextInput[]>([]);
  const successScale = useState(new Animated.Value(0.85))[0];

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (!success) return;
    Animated.sequence([
      Animated.timing(successScale, { toValue: 1.08, duration: 180, useNativeDriver: true }),
      Animated.timing(successScale, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [success, successScale]);

  if (!phone) {
    Alert.alert('Error', 'Phone number not found. Please try again.');
    router.replace('/sign-in');
    return null;
  }

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (!digit && index > 0) {
      inputs.current[index - 1]?.focus();
    }

    const code = newOtp.join('');
    if (code.length === 6) {
      setTimeout(() => handleVerify(code), 150);
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode ?? otp.join('');

    if (code.length !== 6) {
      Alert.alert('Incomplete Code', 'Please enter the complete 6-digit verification code.');
      return;
    }

    try {
      setVerifying(true);
      const result = await verifyPhoneOtp({ phone, otp: code });
      if (result.token) {
        setToken(result.token);
      }
      if (result.user) {
        setUser(result.user);
      }
      setSuccess(true);
      setTimeout(() => router.replace('/(auth)/role-selection'), 900);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Verification failed';
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setCountdown(30);
      Alert.alert('Code Sent', 'A new verification code has been sent.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend code';
      Alert.alert('Error', errorMessage);
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Image source={require('@/assets/images/waves.png')} style={styles.waves} resizeMode="cover" />

      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} disabled={verifying}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
        </TouchableOpacity>

        <BaseCard elevation="lg" style={styles.card}>
          {success ? (
            <Animated.View style={[styles.successWrap, { transform: [{ scale: successScale }] }]}>
              <Ionicons name="checkmark-circle" size={54} color={colors.success} />
              <AppText variant="h3" style={styles.successTitle}>Verified!</AppText>
              <AppText variant="body" style={styles.successText}>Your phone number is confirmed and you’ll be redirected in a moment.</AppText>
            </Animated.View>
          ) : (
            <>
              <AppText variant="caption" style={styles.eyebrow}>Verification</AppText>
              <AppText variant="h2" style={styles.title}>Enter your code</AppText>
              <AppText variant="body" style={styles.subtitle}>We sent a 6-digit code to {phone}. Enter it below to continue.</AppText>

              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      if (ref) {
                        inputs.current[index] = ref;
                      }
                    }}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(value) => handleChange(value.slice(-1), index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    editable={!verifying}
                    textAlign="center"
                    autoComplete="sms-otp"
                    textContentType="oneTimeCode"
                    importantForAutofill="yes"
                    returnKeyType="done"
                  />
                ))}
              </View>

              <PrimaryButton title={verifying ? 'Verifying…' : 'Verify code'} loading={verifying} onPress={() => handleVerify()} containerStyle={styles.button} />

              <View style={styles.helperRow}>
                <AppText variant="bodySmall" style={styles.helperText}>Resend available in {countdown}s</AppText>
                <SecondaryButton title={resending ? 'Sending…' : 'Resend'} loading={resending} onPress={handleResend} containerStyle={styles.secondaryButton} disabled={countdown > 0} />
              </View>
            </>
          )}
        </BaseCard>
      </View>
    </KeyboardAvoidingView>
  );
}
