import { router } from 'expo-router';
import React from 'react';
import { getAuthToken, getAuthUser, getOnboardingComplete, removeAuthToken } from '@/features/auth/services/auth-storage';
declare const Buffer: { from: (s: string, enc: string) => { toString: (enc?: string) => string } } | undefined;

const SPLASH_DURATION = 1200; // min visible time

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');

  if (typeof globalThis.atob === 'function') {
   return globalThis.atob(padded);
  }

  if (typeof Buffer !== 'undefined') {
   return Buffer.from(padded, 'base64').toString('binary');
  }

  throw new Error('Base64 decode unavailable');
}
function isJwtExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return false;
    }

    const decodedPayload = decodeBase64Url(payload);
    const decoded = JSON.parse(decodedPayload);
    const exp = decoded.exp;
    if (typeof exp !== 'number') {
      return false;
    }

    return exp * 1000 < Date.now();
  } catch {
    return false;
  }
}

const DEV_BYPASS_ROLE_SELECTION = __DEV__;
const DEV_BYPASS_ROLE: 'student' | 'tutor' = (process.env.EXPO_PUBLIC_BYPASS_ROLE_SELECTION === 'tutor' ? 'tutor' : 'student');

export async function runAuthGuard() {
  // Ensure splash is visible at least SPLASH_DURATION
  await new Promise(resolve => setTimeout(resolve, SPLASH_DURATION));

  try {
    const hasOnboarded = await getOnboardingComplete();
    const token = await getAuthToken();
    const user = await getAuthUser();

    if (!hasOnboarded) {
      router.replace('/(auth)/welcome');
      return;
    }

    if (!token || !user) {
      router.replace('/(auth)/sign-in');
      return;
    }

    if (isJwtExpired(token)) {
      await removeAuthToken();
      router.replace('/(auth)/sign-in');
      return;
    }

    if (!user.role) {
      if (DEV_BYPASS_ROLE_SELECTION) {
        const targetRoute = DEV_BYPASS_ROLE === 'tutor' ? '/(tutor)/dashboard' : '/(student)/dashboard';
        router.replace(targetRoute);
        return;
      }

      router.replace('/(auth)/role-selection');
      return;
    }

    if (!user.full_name) {
      router.replace('/(auth)/profile-setup');
      return;
    }

    switch (user.role) {
      case 'tutor':
        router.replace('/(tutor)/dashboard');
        break;
      case 'student':
      default:
        router.replace('/(student)/dashboard');
        break;
    }
  } catch (error) {
    console.error('Auth guard error:', error);
    router.replace('/(auth)/welcome');
  }
}

export default function AuthGuardCaller() {
  // For components that want to run guard inside React lifecycle
  React.useEffect(() => {
    runAuthGuard();
  }, []);

  return null;
}