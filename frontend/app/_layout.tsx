import { Stack } from 'expo-router';
import { AuthProvider } from '@/features/auth/context/auth.context';
import { BookingSyncProvider } from '@/providers';
import { ToastProvider } from '@/components/common';

export default function RootLayout() {
  return (
    <AuthProvider>
      <BookingSyncProvider>
        <ToastProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            {/* Splash Screen */}
            <Stack.Screen name="index" />

            {/* Authentication Flow */}
            <Stack.Screen name="(auth)" />

            {/* Student Flow */}
            <Stack.Screen name="(student)" />

            {/* Tutor Flow */}
            <Stack.Screen name="(tutor)" />

            {/* Parent Flow */}
            <Stack.Screen name="(parent)" />
          </Stack>
        </ToastProvider>
      </BookingSyncProvider>
    </AuthProvider>
  );
}