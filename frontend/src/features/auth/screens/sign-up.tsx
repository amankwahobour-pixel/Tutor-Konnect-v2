import { router } from 'expo-router';
import { useState } from 'react';
import { signUpWithEmail } from '@/api/auth';
import { useAuthContext } from '@/features/auth/context/auth.context';
import { Input, PrimaryButton, SecondaryButton } from '@/components';
import { BaseCard } from '@/components/cards';
import { AppText } from '@/components/ui/AppText';
import { Alert, Image, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/sign-up.styles';
import { colors } from '@/theme';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setToken, setUser } = useAuthContext();

  const passwordStrength = password.length >= 8 ? 'Strong' : password.length >= 6 ? 'Good' : 'Needs 6+ characters';
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSignUp = async () => {
    if (loading) return;

    if (!email || !password || !confirmPassword) {
      Alert.alert('Missing information', 'Please enter all fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords must match', 'Confirm your password to continue.');
      return;
    }

    try {
      setLoading(true);

      const result = await signUpWithEmail({ email, password });

      if (result.token) {
        setToken(result.token);
      }

      if (result.user) {
        setUser(result.user);
      }

      if (result.token && result.user && result.user.role) {
        router.replace(result.user.role === 'tutor' ? '/(tutor)/dashboard' : '/(student)/dashboard');
        return;
      }

      if (result.token && result.user) {
        router.replace('/(auth)/role-selection');
        return;
      }

      router.replace({ pathname: '/(auth)/email-verification', params: { email } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      Alert.alert('Sign Up Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Image source={require('@/assets/images/waves.png')} style={styles.waves} resizeMode="cover" />

      <View style={styles.content}>
        <View style={styles.heroRow}>
          <View style={{ flex: 1 }}>
            <AppText variant="caption" style={styles.eyebrow}>Create account</AppText>
            <AppText variant="h2" style={styles.title}>Start your learning journey</AppText>
            <AppText variant="body" style={styles.subtitle}>Set up your account in a few simple steps and verify your email right away.</AppText>
          </View>
          <View style={styles.badge}>
            <Ionicons name="sparkles-outline" size={24} color={colors.primary} />
          </View>
        </View>

        <BaseCard elevation="lg" style={styles.card}>
          <View style={styles.field}>
            <AppText variant="label" style={styles.fieldLabel}>Email address</AppText>
            <Input style={styles.input} placeholder="you@example.com" keyboardType="email-address" autoComplete="email" textContentType="emailAddress" value={email} editable={!loading} onChangeText={setEmail} />
          </View>

          <View style={styles.field}>
            <AppText variant="label" style={styles.fieldLabel}>Password</AppText>
            <View style={styles.inputShell}>
              <Input style={styles.input} placeholder="Create a secure password" secureTextEntry={!showPassword} autoComplete="password" textContentType="newPassword" value={password} editable={!loading} onChangeText={setPassword} />
                <TouchableOpacity style={styles.iconButton} onPress={() => setShowPassword((value) => !value)} accessibilityRole="button" accessibilityLabel="Toggle password visibility">
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
            <AppText variant="caption" style={[styles.helperText, password.length >= 6 && styles.helperSuccess]}>{passwordStrength}</AppText>
          </View>

          <View style={styles.field}>
            <AppText variant="label" style={styles.fieldLabel}>Confirm password</AppText>
            <View style={styles.inputShell}>
              <Input style={styles.input} placeholder="Confirm your password" secureTextEntry={!showConfirmPassword} autoComplete="password" textContentType="newPassword" value={confirmPassword} editable={!loading} onChangeText={setConfirmPassword} />
                <TouchableOpacity style={styles.iconButton} onPress={() => setShowConfirmPassword((value) => !value)} accessibilityRole="button" accessibilityLabel="Toggle confirm password visibility">
                <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
            {passwordMismatch ? <AppText variant="caption" style={styles.helperError}>Passwords do not match yet.</AppText> : null}
          </View>

          <PrimaryButton title={loading ? 'Creating account…' : 'Create account'} loading={loading} onPress={handleSignUp} containerStyle={styles.button} />
        </BaseCard>

        <SecondaryButton title="Already have an account? Sign in" onPress={() => router.replace('/(auth)/sign-in')} containerStyle={styles.secondaryButton} />
      </View>
    </KeyboardAvoidingView>
  );
}
