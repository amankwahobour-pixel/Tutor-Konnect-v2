import { UserProfile } from '@/types';
import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'tutorkonnect_auth_token';
const AUTH_USER_KEY = 'tutorkonnect_auth_user';

export async function saveAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });
}

export async function getAuthToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
}

export async function saveAuthUser(user: UserProfile): Promise<void> {
  await SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(user), {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });
}

export async function getAuthUser(): Promise<UserProfile | null> {
  try {
    const userJson = await SecureStore.getItemAsync(AUTH_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error parsing auth user:', error);
    return null;
  }
}

export async function removeAuthToken(): Promise<void> {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(AUTH_USER_KEY);
}

// Onboarding completion flag helpers
const ONBOARDING_COMPLETE_KEY = 'tutorkonnect_onboarding_complete';

export async function saveOnboardingComplete(): Promise<void> {
  await SecureStore.setItemAsync(ONBOARDING_COMPLETE_KEY, '1', {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });
}

export async function getOnboardingComplete(): Promise<boolean> {
  try {
    const v = await SecureStore.getItemAsync(ONBOARDING_COMPLETE_KEY);
    return v === '1';
  } catch (error) {
    console.error('Error reading onboarding flag:', error);
    return false;
  }
}
