import { router } from 'expo-router';
import { useState } from 'react';
import { loginWithEmail, loginWithPhone } from '@/api/auth';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { IconButton, Input, PrimaryButton, SecondaryButton } from '@/components';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { UserProfile } from '@/types';
import { Alert, Image, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/sign-in.styles';
import { colors } from '@/theme';

export default function SigninScreen() {
  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useAuthContext();

  const navigateAfterAuth = (user?: UserProfile | null) => {
    if (user?.role) {
      if (!user.full_name) {
        router.replace('/(auth)/profile-setup');
        return;
      }

      router.replace(user.role === 'tutor' ? '/(tutor)/dashboard' : '/(student)/dashboard');
      return;
    }

    router.replace('/(auth)/role-selection');
  };

  const handlePhoneContinue = async () => {
    if (loading) return;

    let cleanNumber = phoneNumber.replace(/\D/g, '');

    if (cleanNumber.startsWith('0')) {
      cleanNumber = cleanNumber.substring(1);
    }

    if (cleanNumber.length !== 9) {
      Alert.alert('Invalid Phone Number', 'Enter a valid Ghana phone number.');
      return;
    }

    const formattedPhone = `+233${cleanNumber}`;

    try {
      setLoading(true);

      const result = await loginWithPhone({ phone: formattedPhone });

      if (result.token) {
        setToken(result.token);
      }
      if (result.user) {
        setUser(result.user);
      }

      router.push({ pathname: '/(auth)/otp-verification', params: { phone: formattedPhone } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signin failed';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailContinue = async () => {
    if (loading) return;

    if (!email || !password) {
      Alert.alert('Missing credentials', 'Enter your email and password to continue.');
      return;
    }

    try {
      setLoading(true);

      const result = await loginWithEmail({ email, password });

      if (result.token) {
        setToken(result.token);
      }

      if (result.user) {
        setUser(result.user);
      }

      if (!result.token) {
        router.replace({ pathname: '/(auth)/email-verification', params: { email } });
        return;
      }

      navigateAfterAuth(result.user ?? null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signin failed';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDevSkipLogin = () => {
    if (!__DEV__) return;

    const mockUser: UserProfile = {
      id: 'dev-user',
      phone_number: '+233201234567',
      full_name: 'Dev Tester',
      email: 'dev@tutorkonnect.local',
      role: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const fakeToken = 'dev-mock-token';

    setToken(fakeToken);
    setUser(mockUser);

    router.replace('/(auth)/role-selection');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Image source={require('@/assets/images/waves.png')} style={styles.waves} resizeMode="cover" />

      <View style={styles.content}>
        <View style={styles.heroRow}>
          <View style={{ flex: 1 }}>
            <AppText variant="caption" style={styles.eyebrow}>Welcome back</AppText>
            <AppText variant="h2" style={styles.title}>Sign in to continue</AppText>
            <AppText variant="body" style={styles.subtitle}>Choose your preferred sign-in method and pick up where you left off.</AppText>
          </View>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
          </View>
        </View>

        <BaseCard elevation="lg" style={styles.card}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, authMode === 'phone' && styles.toggleButtonActive]}
              onPress={() => setAuthMode('phone')}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Use phone sign in"
              accessibilityState={{ selected: authMode === 'phone' }}
            >
              <AppText variant="label" style={[styles.toggleText, authMode === 'phone' && styles.toggleTextActive]}>Phone</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, authMode === 'email' && styles.toggleButtonActive]}
              onPress={() => setAuthMode('email')}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Use email sign in"
              accessibilityState={{ selected: authMode === 'email' }}
            >
              <AppText variant="label" style={[styles.toggleText, authMode === 'email' && styles.toggleTextActive]}>Email</AppText>
            </TouchableOpacity>
          </View>

          {authMode === 'phone' ? (
            <View style={styles.field}>
              <AppText variant="label" style={styles.fieldLabel}>Phone number</AppText>
              <View style={styles.inputShell}>
                <AppText variant="body" style={styles.prefix}>+233</AppText>
                <Input style={styles.input} placeholder="24 123 4567" keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" value={phoneNumber} editable={!loading} maxLength={10} onChangeText={setPhoneNumber} />
              </View>
            </View>
          ) : (
            <>
              <View style={styles.field}>
                <AppText variant="label" style={styles.fieldLabel}>Email address</AppText>
                <Input style={styles.input} placeholder="you@example.com" keyboardType="email-address" autoComplete="email" textContentType="emailAddress" value={email} editable={!loading} onChangeText={setEmail} />
              </View>

              <View style={styles.field}>
                <AppText variant="label" style={styles.fieldLabel}>Password</AppText>
                <View style={styles.inputShell}>
                  <Input style={styles.input} placeholder="Enter your password" secureTextEntry={!showPassword} autoComplete="password" textContentType="password" value={password} editable={!loading} onChangeText={setPassword} />
                  <IconButton icon={<Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textTertiary} />} containerStyle={styles.iconButton} onPress={() => setShowPassword((value) => !value)} accessibilityLabel="Toggle password visibility" />
                </View>
              </View>

              <TouchableOpacity style={styles.rememberRow} onPress={() => setRememberMe((value) => !value)} accessibilityRole="checkbox" accessibilityState={{ checked: rememberMe }}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                  {rememberMe ? <Ionicons name="checkmark" size={12} color={colors.surface} /> : null}
                </View>
                <AppText variant="bodySmall" style={styles.rememberText}>Remember me</AppText>
              </TouchableOpacity>
            </>
          )}

          <PrimaryButton title={loading ? 'Signing in…' : authMode === 'phone' ? 'Continue' : 'Sign in'} loading={loading} onPress={authMode === 'phone' ? handlePhoneContinue : handleEmailContinue} containerStyle={styles.button} />

          <View style={styles.linksRow}>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')} disabled={loading}>
              <AppText variant="bodySmall" style={styles.linkText}>Forgot password?</AppText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')} disabled={loading}>
              <AppText variant="bodySmall" style={styles.linkText}>Create account</AppText>
            </TouchableOpacity>
          </View>
        </BaseCard>

        {__DEV__ ? <SecondaryButton title="Skip login (development)" onPress={handleDevSkipLogin} containerStyle={styles.devButton} /> : null}

        <AppText variant="caption" style={styles.infoText}>{authMode === 'phone' ? 'We’ll send a one-time verification code to your phone.' : 'Secure sign-in with your registered email and password.'}</AppText>
      </View>
    </KeyboardAvoidingView>
  );
}
